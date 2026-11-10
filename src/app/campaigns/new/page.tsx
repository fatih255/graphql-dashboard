"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateCampaignMutation } from "@/client/api";
import { useAppDispatch } from "@/client/hooks";
import { toastShown } from "@/client/uiSlice";
import { CampaignForm } from "@/components/CampaignForm";
import { emptyFormValues } from "@/components/formValues";

export default function NewCampaignPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [createCampaign, { isLoading }] = useCreateCampaignMutation();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
          ← Campaigns
        </Link>
        <h1 className="mt-2 text-xl font-semibold">New campaign</h1>
      </div>
      <CampaignForm
        mode="create"
        initialValues={emptyFormValues}
        submitting={isLoading}
        onSubmit={async (input) => {
          const result = await createCampaign(input);
          if ("error" in result) {
            dispatch(toastShown("error", "Couldn't create the campaign. Try again."));
            return [];
          }
          if (result.data.__typename === "ValidationError") return result.data.fieldErrors;
          dispatch(toastShown("success", "Campaign created."));
          router.push(`/campaigns/${result.data.id}`);
          return [];
        }}
      />
    </div>
  );
}
