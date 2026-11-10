"use client";

import { useChangeStatusMutation, type Campaign } from "@/client/api";

/** Publish for draft and paused campaigns, Pause for live ones. */
export function StatusAction({ campaign, size = "sm" }: { campaign: Pick<Campaign, "id" | "name" | "status">; size?: "sm" | "md" }) {
  const [changeStatus, { isLoading }] = useChangeStatusMutation();
  const action = campaign.status === "LIVE" ? "pause" : "publish";
  const padding = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-2 text-sm";
  const look =
    action === "publish"
      ? "bg-slate-900 text-white hover:bg-slate-700"
      : "bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50";

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={() => void changeStatus({ id: campaign.id, action })}
      aria-label={`${action === "publish" ? "Publish" : "Pause"} ${campaign.name}`}
      className={`rounded-md font-medium disabled:opacity-60 ${padding} ${look}`}
    >
      {action === "publish" ? "Publish" : "Pause"}
    </button>
  );
}
