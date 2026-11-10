import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  CampaignFieldsFragment,
  CampaignInput,
  CampaignQuery,
  CampaignStatus,
  CampaignsQuery,
  CampaignsQueryVariables,
  CreateCampaignMutation,
  PauseCampaignMutation,
  PublishCampaignMutation,
  UpdateCampaignMutation,
} from "@/gql/graphql";
import { gqlRequest, graphqlBaseQuery } from "./graphqlBaseQuery";
import {
  CampaignDocument,
  CampaignsDocument,
  CreateCampaignDocument,
  PauseCampaignDocument,
  PublishCampaignDocument,
  UpdateCampaignDocument,
} from "./operations";
import { toastShown } from "./uiSlice";

export type Campaign = CampaignFieldsFragment;
export type StatusAction = "publish" | "pause";
type StatusChangeResult =
  | PublishCampaignMutation["publishCampaign"]
  | PauseCampaignMutation["pauseCampaign"];

export const statusAfter: Record<StatusAction, CampaignStatus> = { publish: "LIVE", pause: "PAUSED" };

export const api = createApi({
  reducerPath: "api",
  baseQuery: graphqlBaseQuery({ url: "/api/graphql" }),
  tagTypes: ["Campaign"],
  endpoints: (build) => ({
    campaigns: build.query<Campaign[], CampaignsQueryVariables>({
      query: (variables) => gqlRequest(CampaignsDocument, variables),
      transformResponse: (response: CampaignsQuery) => response.campaigns,
      providesTags: (result = []) => [
        ...result.map((c) => ({ type: "Campaign" as const, id: c.id })),
        { type: "Campaign" as const, id: "LIST" },
      ],
    }),

    campaign: build.query<Campaign | null, string>({
      query: (id) => gqlRequest(CampaignDocument, { id }),
      transformResponse: (response: CampaignQuery) => response.campaign,
      providesTags: (_result, _error, id) => [{ type: "Campaign", id }],
    }),

    createCampaign: build.mutation<CreateCampaignMutation["createCampaign"], CampaignInput>({
      query: (input) => gqlRequest(CreateCampaignDocument, { input }),
      transformResponse: (response: CreateCampaignMutation) => response.createCampaign,
      invalidatesTags: (result) =>
        result?.__typename === "Campaign" ? [{ type: "Campaign", id: "LIST" }] : [],
    }),

    updateCampaign: build.mutation<
      UpdateCampaignMutation["updateCampaign"],
      { id: string; input: CampaignInput }
    >({
      query: (variables) => gqlRequest(UpdateCampaignDocument, variables),
      transformResponse: (response: UpdateCampaignMutation) => response.updateCampaign,
      invalidatesTags: (result, _error, { id }) =>
        result?.__typename === "Campaign"
          ? [
              { type: "Campaign", id },
              { type: "Campaign", id: "LIST" },
            ]
          : [],
    }),

    // Publish and pause share one endpoint so the optimistic logic lives in one place.
    changeStatus: build.mutation<StatusChangeResult, { id: string; action: StatusAction }>({
      query: ({ id, action }) =>
        action === "publish"
          ? gqlRequest(PublishCampaignDocument, { id })
          : gqlRequest(PauseCampaignDocument, { id }),
      transformResponse: (response: PublishCampaignMutation | PauseCampaignMutation) =>
        "publishCampaign" in response ? response.publishCampaign : response.pauseCampaign,

      async onQueryStarted({ id, action }, { dispatch, getState, queryFulfilled }) {
        const status = statusAfter[action];

        // 1. Patch every cached list and the single-campaign cache right away.
        const patches = api.util
          .selectCachedArgsForQuery(getState(), "campaigns")
          .map((args) =>
            dispatch(
              api.util.updateQueryData("campaigns", args, (draft) => {
                const campaign = draft.find((c) => c.id === id);
                if (campaign) campaign.status = status;
              }),
            ),
          );
        patches.push(
          dispatch(
            api.util.updateQueryData("campaign", id, (draft) => {
              if (draft) draft.status = status;
            }),
          ),
        );
        const rollback = () => patches.forEach((patch) => patch.undo());

        // 2. Wait for the server. Undo the patches on a transport/server error or a typed error.
        try {
          const { data } = await queryFulfilled;
          if (data.__typename !== "Campaign") {
            rollback();
            dispatch(toastShown("error", data.message));
            return;
          }
        } catch (error) {
          rollback();
          const message =
            typeof error === "object" && error !== null && "error" in error
              ? (error as { error: { message: string } }).error.message
              : "Request failed.";
          dispatch(toastShown("error", `Couldn't ${action} the campaign. ${message}`));
          return;
        }

        // 3. Refetch so filtered lists drop or pick up the campaign.
        dispatch(api.util.invalidateTags([{ type: "Campaign", id }, { type: "Campaign", id: "LIST" }]));
      },
    }),
  }),
});

export const {
  useCampaignsQuery,
  useCampaignQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useChangeStatusMutation,
} = api;
