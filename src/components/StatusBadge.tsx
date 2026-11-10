import type { CampaignStatus } from "@/gql/graphql";
import { statusLabels } from "@/shared/format";

const styles: Record<CampaignStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-200",
  LIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PAUSED: "bg-amber-50 text-amber-800 ring-amber-200",
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  return (
    <span
      data-testid="status-badge"
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      <span
        aria-hidden
        className={`size-1.5 rounded-full ${status === "LIVE" ? "bg-emerald-500" : status === "PAUSED" ? "bg-amber-500" : "bg-slate-400"}`}
      />
      {statusLabels[status]}
    </span>
  );
}
