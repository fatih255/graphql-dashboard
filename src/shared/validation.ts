import type { CampaignInput } from "@/gql/graphql";

// Shared by the GraphQL resolvers and the form, so the form can show the same
// messages before a request is sent. The server always validates again.

export interface FieldError {
  field: string;
  message: string;
}

export const LIMITS = {
  name: 80,
  headline: 120,
  body: 280,
  ctaLabel: 30,
  urlValue: 200,
  maxDelaySeconds: 600,
} as const;

/** Trims strings and drops scrollPercent unless the trigger uses it. */
export function normalizeCampaignInput(input: CampaignInput): CampaignInput {
  return {
    ...input,
    name: input.name.trim(),
    headline: input.headline.trim(),
    body: input.body.trim(),
    ctaLabel: input.ctaLabel.trim(),
    trigger: {
      type: input.trigger.type,
      scrollPercent: input.trigger.type === "SCROLL" ? (input.trigger.scrollPercent ?? null) : null,
    },
    targetUrl: { match: input.targetUrl.match, value: input.targetUrl.value.trim() },
  };
}

function checkLength(
  errors: FieldError[],
  field: string,
  value: string,
  max: number,
  required: boolean,
): void {
  if (required && value.length === 0) {
    errors.push({ field, message: "Required." });
  } else if (value.length > max) {
    errors.push({ field, message: `Keep it under ${max + 1} characters.` });
  }
}

/** Expects normalized input. Returns an empty array when the input is valid. */
export function validateCampaignInput(input: CampaignInput): FieldError[] {
  const errors: FieldError[] = [];

  checkLength(errors, "name", input.name, LIMITS.name, true);
  checkLength(errors, "headline", input.headline, LIMITS.headline, true);
  checkLength(errors, "body", input.body, LIMITS.body, false);
  checkLength(errors, "ctaLabel", input.ctaLabel, LIMITS.ctaLabel, true);

  if (input.trigger.type === "SCROLL") {
    const percent = input.trigger.scrollPercent;
    if (percent === null || percent === undefined) {
      errors.push({ field: "trigger.scrollPercent", message: "Set how far the visitor scrolls." });
    } else if (!Number.isInteger(percent) || percent < 1 || percent > 100) {
      errors.push({ field: "trigger.scrollPercent", message: "Use a whole number from 1 to 100." });
    }
  }

  const delay = input.delaySeconds;
  if (!Number.isInteger(delay) || delay < 0 || delay > LIMITS.maxDelaySeconds) {
    errors.push({
      field: "delaySeconds",
      message: `Use a whole number from 0 to ${LIMITS.maxDelaySeconds}.`,
    });
  }

  const url = input.targetUrl.value;
  if (url.length === 0) {
    errors.push({ field: "targetUrl.value", message: "Required." });
  } else if (url.length > LIMITS.urlValue) {
    errors.push({ field: "targetUrl.value", message: `Keep it under ${LIMITS.urlValue + 1} characters.` });
  } else if (/\s/.test(url)) {
    errors.push({ field: "targetUrl.value", message: "A URL path can't contain spaces." });
  } else if (input.targetUrl.match !== "CONTAINS" && !url.startsWith("/")) {
    errors.push({ field: "targetUrl.value", message: "Start the path with a slash, like /pricing." });
  }

  return errors;
}

/** Extra rule for new campaigns: they start as a draft or go straight live. */
export function validateNewCampaign(input: CampaignInput): FieldError[] {
  const errors = validateCampaignInput(input);
  if (input.status === "PAUSED") {
    errors.push({ field: "status", message: "A new campaign can't start paused." });
  }
  return errors;
}
