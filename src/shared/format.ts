import type { CampaignStatus, TriggerType, UrlMatch } from "@/gql/graphql";

export const statusLabels: Record<CampaignStatus, string> = {
  DRAFT: "Draft",
  LIVE: "Live",
  PAUSED: "Paused",
};

export const triggerLabels: Record<TriggerType, string> = {
  ON_LOAD: "On page load",
  EXIT_INTENT: "Exit intent",
  SCROLL: "Scroll depth",
};

export const matchLabels: Record<UrlMatch, string> = {
  EXACT: "is exactly",
  STARTS_WITH: "starts with",
  CONTAINS: "contains",
};

export function triggerSummary(
  trigger: { type: TriggerType; scrollPercent?: number | null },
  delaySeconds: number,
): string {
  const delay = delaySeconds > 0 ? `, then waits ${delaySeconds} s` : "";
  switch (trigger.type) {
    case "ON_LOAD":
      return delaySeconds > 0 ? `${delaySeconds} s after page load` : "As soon as the page loads";
    case "EXIT_INTENT":
      return `When the cursor heads out of the window${delay}`;
    case "SCROLL":
      return `After ${trigger.scrollPercent ?? "?"}% scroll${delay}`;
  }
}

export function urlRuleSummary(rule: { match: UrlMatch; value: string }): string {
  return `URL ${matchLabels[rule.match]} ${rule.value || "…"}`;
}

/** Path shown in the preview's address bar for a given rule. */
export function previewPath(rule: { match: UrlMatch; value: string }): string {
  const value = rule.value.trim();
  if (value === "") return "/";
  const path = value.startsWith("/") ? value : `/${value}`;
  if (rule.match === "EXACT") return path;
  return path.endsWith("/") ? `${path}example` : `${path}/example`;
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}
