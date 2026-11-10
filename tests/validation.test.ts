import { describe, expect, it } from "vitest";
import type { CampaignInput } from "@/gql/graphql";
import { normalizeCampaignInput, validateCampaignInput, validateNewCampaign } from "@/shared/validation";

const valid: CampaignInput = {
  name: "Spring sale",
  headline: "20% off this week",
  body: "",
  ctaLabel: "Shop",
  trigger: { type: "ON_LOAD", scrollPercent: null },
  delaySeconds: 5,
  targetUrl: { match: "STARTS_WITH", value: "/shop" },
  status: "DRAFT",
};

const fields = (input: CampaignInput) => validateCampaignInput(input).map((e) => e.field);

describe("normalizeCampaignInput", () => {
  it("trims text fields", () => {
    const out = normalizeCampaignInput({ ...valid, name: "  Sale ", targetUrl: { match: "EXACT", value: " /a " } });
    expect(out.name).toBe("Sale");
    expect(out.targetUrl.value).toBe("/a");
  });

  it("drops scrollPercent when the trigger isn't SCROLL", () => {
    const out = normalizeCampaignInput({ ...valid, trigger: { type: "EXIT_INTENT", scrollPercent: 40 } });
    expect(out.trigger.scrollPercent).toBeNull();
  });
});

describe("validateCampaignInput", () => {
  it("accepts a valid campaign", () => {
    expect(validateCampaignInput(valid)).toEqual([]);
  });

  it("requires name, headline and button label", () => {
    expect(fields({ ...valid, name: "", headline: "", ctaLabel: "" })).toEqual(["name", "headline", "ctaLabel"]);
  });

  it("limits text length", () => {
    expect(fields({ ...valid, headline: "x".repeat(121) })).toEqual(["headline"]);
    expect(fields({ ...valid, body: "x".repeat(281) })).toEqual(["body"]);
  });

  it("requires a scroll percentage from 1 to 100 for SCROLL", () => {
    expect(fields({ ...valid, trigger: { type: "SCROLL", scrollPercent: null } })).toEqual(["trigger.scrollPercent"]);
    expect(fields({ ...valid, trigger: { type: "SCROLL", scrollPercent: 0 } })).toEqual(["trigger.scrollPercent"]);
    expect(fields({ ...valid, trigger: { type: "SCROLL", scrollPercent: 101 } })).toEqual(["trigger.scrollPercent"]);
    expect(fields({ ...valid, trigger: { type: "SCROLL", scrollPercent: 50 } })).toEqual([]);
  });

  it("rejects negative, fractional and too long delays", () => {
    expect(fields({ ...valid, delaySeconds: -1 })).toEqual(["delaySeconds"]);
    expect(fields({ ...valid, delaySeconds: 1.5 })).toEqual(["delaySeconds"]);
    expect(fields({ ...valid, delaySeconds: 601 })).toEqual(["delaySeconds"]);
    expect(fields({ ...valid, delaySeconds: Number.NaN })).toEqual(["delaySeconds"]);
  });

  it("checks the URL rule", () => {
    const url = (match: CampaignInput["targetUrl"]["match"], value: string) =>
      fields({ ...valid, targetUrl: { match, value } });
    expect(url("EXACT", "pricing")).toEqual(["targetUrl.value"]);
    expect(url("STARTS_WITH", "/blog posts")).toEqual(["targetUrl.value"]);
    expect(url("EXACT", "")).toEqual(["targetUrl.value"]);
    expect(url("CONTAINS", "checkout")).toEqual([]);
    expect(url("EXACT", "/pricing")).toEqual([]);
  });
});

describe("validateNewCampaign", () => {
  it("doesn't let a new campaign start paused", () => {
    expect(validateNewCampaign({ ...valid, status: "PAUSED" }).map((e) => e.field)).toEqual(["status"]);
    expect(validateNewCampaign({ ...valid, status: "LIVE" })).toEqual([]);
  });
});
