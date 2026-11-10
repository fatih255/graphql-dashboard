import type { TriggerType, UrlMatch } from "@/gql/graphql";
import { previewPath, triggerSummary, urlRuleSummary } from "@/shared/format";

export interface PopupPreviewProps {
  headline: string;
  body: string;
  ctaLabel: string;
  trigger: { type: TriggerType; scrollPercent: number | null };
  delaySeconds: number;
  targetUrl: { match: UrlMatch; value: string };
}

/** Renders the popup the way a visitor would see it, inside a plain page frame. */
export function PopupPreview({ headline, body, ctaLabel, trigger, delaySeconds, targetUrl }: PopupPreviewProps) {
  return (
    <figure data-testid="popup-preview" className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2">
        <div aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="size-2.5 rounded-full bg-slate-300" />
          <span className="size-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="flex-1 truncate rounded bg-white px-2 py-1 font-mono text-xs text-slate-500 ring-1 ring-slate-200">
          https://example.com{previewPath(targetUrl)}
        </div>
      </div>

      <div className="relative h-[400px] overflow-hidden">
        <div aria-hidden className="space-y-3 p-6">
          <div className="h-6 w-1/3 rounded bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-3 w-5/6 rounded bg-slate-100" />
          <div className="h-3 w-4/6 rounded bg-slate-100" />
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="h-24 rounded bg-slate-100" />
            <div className="h-24 rounded bg-slate-100" />
            <div className="h-24 rounded bg-slate-100" />
          </div>
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-3 w-3/4 rounded bg-slate-100" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 p-6">
          <div role="dialog" aria-label="Popup preview" className="relative w-full max-w-xs rounded-lg bg-white p-6 shadow-xl">
            <span aria-hidden className="absolute top-3 right-3 text-sm leading-none text-slate-400">
              ✕
            </span>
            <h3 className="pr-4 text-lg leading-snug font-semibold text-slate-900 break-words">
              {headline || "Your headline"}
            </h3>
            {body && <p className="mt-2 text-sm text-slate-600 break-words">{body}</p>}
            <span className="mt-5 block rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white">
              {ctaLabel || "Button"}
            </span>
          </div>
        </div>
      </div>

      <figcaption className="space-y-0.5 border-t border-slate-200 px-4 py-3 text-xs text-slate-600">
        <p>
          <span className="font-medium text-slate-700">When:</span> {triggerSummary(trigger, delaySeconds)}
        </p>
        <p>
          <span className="font-medium text-slate-700">Where:</span> {urlRuleSummary(targetUrl)}
        </p>
      </figcaption>
    </figure>
  );
}
