"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCampaignsQuery } from "@/client/api";
import { useAppDispatch, useAppSelector } from "@/client/hooks";
import { searchChanged, statusFilterChanged, type StatusFilter } from "@/client/uiSlice";
import { StatusAction } from "@/components/StatusAction";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, triggerSummary, urlRuleSummary } from "@/shared/format";

const filters: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "LIVE", label: "Live" },
  { value: "DRAFT", label: "Draft" },
  { value: "PAUSED", label: "Paused" },
];

export default function CampaignListPage() {
  const dispatch = useAppDispatch();
  const statusFilter = useAppSelector((state) => state.ui.statusFilter);
  const search = useAppSelector((state) => state.ui.search);
  const [searchInput, setSearchInput] = useState(search);

  // Debounce typing so each keystroke doesn't send a query.
  useEffect(() => {
    const timer = setTimeout(() => dispatch(searchChanged(searchInput.trim())), 250);
    return () => clearTimeout(timer);
  }, [dispatch, searchInput]);

  const { data: campaigns, isLoading, isError, error, isFetching } = useCampaignsQuery({
    filter: { status: statusFilter === "ALL" ? null : statusFilter, search: search || null },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Campaigns</h1>
          <p className="mt-1 text-sm text-slate-600">Popups for the store site. Publish one to make it live.</p>
        </div>
        <Link
          href="/campaigns/new"
          className="rounded-md bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          New campaign
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Filter by status" className="inline-flex rounded-md bg-white ring-1 ring-slate-200">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={statusFilter === f.value}
              onClick={() => dispatch(statusFilterChanged(f.value))}
              className={`px-3 py-1.5 text-sm first:rounded-l-md last:rounded-r-md ${
                statusFilter === f.value ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="flex-1 sm:max-w-xs">
          <span className="sr-only">Search campaigns</span>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name or headline"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
          />
        </label>
        {isFetching && !isLoading && <span className="text-xs text-slate-500">Updating…</span>}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <p className="p-6 text-sm text-slate-500">Loading campaigns…</p>
        ) : isError ? (
          <p className="p-6 text-sm text-red-700">{"Couldn't load campaigns."} {error?.message}</p>
        ) : !campaigns || campaigns.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No campaigns match these filters.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Campaign</th>
                <th className="px-4 py-2.5 font-medium">Shows</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Updated</th>
                <th className="px-4 py-2.5 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((c) => (
                <tr key={c.id} data-testid="campaign-row" className="align-top">
                  <td className="px-4 py-3">
                    <Link href={`/campaigns/${c.id}`} className="font-medium text-slate-900 hover:underline">
                      {c.name}
                    </Link>
                    <p className="mt-0.5 text-slate-500">{c.headline}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <p>{triggerSummary(c.trigger, c.delaySeconds)}</p>
                    <p className="mt-0.5 font-mono text-xs text-slate-500">{urlRuleSummary(c.targetUrl)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatDate(c.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <StatusAction campaign={c} />
                      <Link
                        href={`/campaigns/${c.id}`}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
