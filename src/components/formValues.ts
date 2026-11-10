import type { Campaign } from "@/client/api";
import type { CampaignInput, CampaignStatus, TriggerType, UrlMatch } from "@/gql/graphql";

/** Form values as the inputs hold them. Numbers stay strings until submit. */
export interface CampaignFormValues {
  name: string;
  headline: string;
  body: string;
  ctaLabel: string;
  triggerType: TriggerType;
  scrollPercent: string;
  delaySeconds: string;
  urlMatch: UrlMatch;
  urlValue: string;
  status: CampaignStatus;
}

export const emptyFormValues: CampaignFormValues = {
  name: "",
  headline: "",
  body: "",
  ctaLabel: "Continue",
  triggerType: "ON_LOAD",
  scrollPercent: "50",
  delaySeconds: "0",
  urlMatch: "STARTS_WITH",
  urlValue: "/",
  status: "DRAFT",
};

export function formValuesFromCampaign(c: Campaign): CampaignFormValues {
  return {
    name: c.name,
    headline: c.headline,
    body: c.body,
    ctaLabel: c.ctaLabel,
    triggerType: c.trigger.type,
    scrollPercent: String(c.trigger.scrollPercent ?? 50),
    delaySeconds: String(c.delaySeconds),
    urlMatch: c.targetUrl.match,
    urlValue: c.targetUrl.value,
    status: c.status,
  };
}

function toNumber(value: string): number {
  return value.trim() === "" ? Number.NaN : Number(value);
}

export function formValuesToInput(v: CampaignFormValues): CampaignInput {
  const percent = toNumber(v.scrollPercent);
  return {
    name: v.name,
    headline: v.headline,
    body: v.body,
    ctaLabel: v.ctaLabel,
    trigger: {
      type: v.triggerType,
      scrollPercent: v.triggerType === "SCROLL" && !Number.isNaN(percent) ? percent : null,
    },
    delaySeconds: toNumber(v.delaySeconds),
    targetUrl: { match: v.urlMatch, value: v.urlValue },
    status: v.status,
  };
}
