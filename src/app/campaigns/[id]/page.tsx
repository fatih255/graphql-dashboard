"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCampaignQuery, useUpdateCampaignMutation } from "@/client/api";
import { useAppDispatch } from "@/client/hooks";
import { toastShown } from "@/client/uiSlice";
import { CampaignForm } from "@/components/CampaignForm";
import { formValuesFromCampaign } from "@/components/formValues";
import { StatusAction } from "@/components/StatusAction";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/shared/format";

export default function EditCampaignPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { data: campaign, isLoading, isError } = useCampaignQuery(id);
  const [updateCampaign, { isLoading: saving }] = useUpdateCampaignMutation();

  const back = (
    <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
      ← Campaigns
    </Link>
  );

  if (isLoading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (isError || !campaign) {
    return (
      <div className="space-y-2">
        {back}
        <p className="text-sm text-slate-700">{isError ? "Couldn't load this campaign." : "This campaign doesn't exist."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {back}
          <h1 className="mt-2 flex items-center gap-3 text-xl font-semibold">
            {campaign.name}
            <StatusBadge status={campaign.status} />
          </h1>
          <p className="mt-1 text-xs text-slate-500">Last updated {formatDate(campaign.updatedAt)}</p>
        </div>
        <StatusAction campaign={campaign} size="md" />
      </div>
      <CampaignForm
        key={campaign.id}
        mode="edit"
        initialValues={formValuesFromCampaign(campaign)}
        serverStatus={campaign.status}
        submitting={saving}
        onSubmit={async (input) => {
          const result = await updateCampaign({ id, input });
          if ("error" in result) {
            dispatch(toastShown("error", "Couldn't save the campaign. Try again."));
            return [];
          }
          if (result.data.__typename === "ValidationError") return result.data.fieldErrors;
          if (result.data.__typename === "NotFoundError") {
            dispatch(toastShown("error", result.data.message));
            return [];
          }
          dispatch(toastShown("success", "Changes saved."));
          return [];
        }}
      />
    </div>
  );
}
