import { normalizeCampaignInput, validateCampaignInput, validateNewCampaign } from "@/shared/validation";
import type {
  CampaignInput,
  CampaignStatus,
  Resolvers,
  ResolversUnionTypes,
  ResolversTypes,
} from "./generated/resolvers-types";
import type { CampaignRecord, CampaignStore } from "./store";

type StatusChangeResult = ResolversUnionTypes<ResolversTypes>["StatusChangeResult"];

const asCampaign = (record: CampaignRecord) => ({ __typename: "Campaign" as const, ...record });

const notFound = (id: string) => ({
  __typename: "NotFoundError" as const,
  message: `No campaign with id ${id}.`,
  id,
});

const validationError = (fieldErrors: { field: string; message: string }[]) => ({
  __typename: "ValidationError" as const,
  message: "Some fields need attention.",
  fieldErrors,
});

function toFields(input: CampaignInput) {
  return {
    name: input.name,
    headline: input.headline,
    body: input.body,
    ctaLabel: input.ctaLabel,
    trigger: { type: input.trigger.type, scrollPercent: input.trigger.scrollPercent ?? null },
    delaySeconds: input.delaySeconds,
    targetUrl: { match: input.targetUrl.match, value: input.targetUrl.value },
    status: input.status,
  };
}

// Allowed moves for the publish and pause actions. The edit form can still set
// any status directly.
const transitions: Record<"publish" | "pause", { from: CampaignStatus[]; to: CampaignStatus }> = {
  publish: { from: ["DRAFT", "PAUSED"], to: "LIVE" },
  pause: { from: ["LIVE"], to: "PAUSED" },
};

function changeStatus(store: CampaignStore, id: string, action: "publish" | "pause"): StatusChangeResult {
  const existing = store.get(id);
  if (!existing) return notFound(id);
  const { from, to } = transitions[action];
  if (!from.includes(existing.status)) {
    return {
      __typename: "InvalidTransitionError",
      message: `Can't ${action} a campaign that is ${existing.status.toLowerCase()}.`,
      from: existing.status,
      to,
    };
  }
  const updated = store.setStatus(id, to);
  return updated ? asCampaign(updated) : notFound(id);
}

export const resolvers: Resolvers = {
  Query: {
    campaigns: (_parent, { filter }, { store }) =>
      store.list({ status: filter?.status, search: filter?.search }),
    campaign: (_parent, { id }, { store }) => store.get(id) ?? null,
  },
  Mutation: {
    createCampaign: (_parent, args, { store }) => {
      const input = normalizeCampaignInput(args.input);
      const errors = validateNewCampaign(input);
      if (errors.length > 0) return validationError(errors);
      return asCampaign(store.create(toFields(input)));
    },
    updateCampaign: (_parent, args, { store }) => {
      if (!store.get(args.id)) return notFound(args.id);
      const input = normalizeCampaignInput(args.input);
      const errors = validateCampaignInput(input);
      if (errors.length > 0) return validationError(errors);
      const updated = store.update(args.id, toFields(input));
      return updated ? asCampaign(updated) : notFound(args.id);
    },
    publishCampaign: (_parent, { id }, { store }) => changeStatus(store, id, "publish"),
    pauseCampaign: (_parent, { id }, { store }) => changeStatus(store, id, "pause"),
  },
};
