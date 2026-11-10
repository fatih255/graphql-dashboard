import { describe, expect, it } from "vitest";
import {
  CampaignDocument,
  CampaignsDocument,
  CreateCampaignDocument,
  PauseCampaignDocument,
  PublishCampaignDocument,
  UpdateCampaignDocument,
  type CampaignInput,
  type CampaignQuery,
  type CampaignsQuery,
  type CreateCampaignMutation,
  type PauseCampaignMutation,
  type PublishCampaignMutation,
  type UpdateCampaignMutation,
} from "@/gql/graphql";
import { makeServer } from "./helpers";

const input: CampaignInput = {
  name: "  Welcome offer ",
  headline: "10% off your first order",
  body: "Use the code at checkout.",
  ctaLabel: "Get the code",
  trigger: { type: "SCROLL", scrollPercent: 30 },
  delaySeconds: 2,
  targetUrl: { match: "STARTS_WITH", value: "/shop" },
  status: "DRAFT",
};

describe("Query.campaigns", () => {
  it("returns seeded campaigns, newest update first", async () => {
    const { execute } = makeServer();
    const { data } = await execute<CampaignsQuery>(CampaignsDocument.toString());
    const dates = data!.campaigns.map((c) => c.updatedAt);
    expect(data!.campaigns).toHaveLength(7);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("filters by status and searches name and headline", async () => {
    const { execute } = makeServer();
    const live = await execute<CampaignsQuery>(CampaignsDocument.toString(), { filter: { status: "LIVE" } });
    expect(live.data!.campaigns.every((c) => c.status === "LIVE")).toBe(true);
    expect(live.data!.campaigns).toHaveLength(3);

    const search = await execute<CampaignsQuery>(CampaignsDocument.toString(), { filter: { search: "SHIPPING" } });
    expect(search.data!.campaigns.map((c) => c.name)).toEqual(["Free shipping notice"]);

    const both = await execute<CampaignsQuery>(CampaignsDocument.toString(), {
      filter: { status: "DRAFT", search: "email" },
    });
    expect(both.data!.campaigns).toEqual([]);
  });

  it("returns null for an unknown id", async () => {
    const { execute } = makeServer();
    const { data } = await execute<CampaignQuery>(CampaignDocument.toString(), { id: "nope" });
    expect(data!.campaign).toBeNull();
  });
});

describe("Mutation.createCampaign", () => {
  it("creates a normalized campaign", async () => {
    const { execute, store } = makeServer();
    const { data } = await execute<CreateCampaignMutation>(CreateCampaignDocument.toString(), { input });
    const result = data!.createCampaign;
    expect(result.__typename).toBe("Campaign");
    if (result.__typename !== "Campaign") return;
    expect(result.name).toBe("Welcome offer");
    expect(result.trigger).toEqual({ type: "SCROLL", scrollPercent: 30 });
    expect(store.get(result.id)?.name).toBe("Welcome offer");
  });

  it("returns a typed ValidationError with field paths", async () => {
    const { execute, store } = makeServer();
    const bad = { ...input, headline: " ", trigger: { type: "SCROLL", scrollPercent: 0 }, status: "PAUSED" };
    const { data } = await execute<CreateCampaignMutation>(CreateCampaignDocument.toString(), { input: bad });
    const result = data!.createCampaign;
    expect(result.__typename).toBe("ValidationError");
    if (result.__typename !== "ValidationError") return;
    expect(result.fieldErrors.map((e) => e.field)).toEqual(["headline", "trigger.scrollPercent", "status"]);
    expect(store.list()).toHaveLength(7);
  });

  it("rejects input that breaks the schema before resolvers run", async () => {
    const { execute } = makeServer();
    const { errors } = await execute(CreateCampaignDocument.toString(), {
      input: { ...input, trigger: { type: "HOVER" } },
    });
    expect(errors?.[0]?.message).toMatch(/TriggerType/);
  });
});

describe("Mutation.updateCampaign", () => {
  it("updates fields and bumps updatedAt", async () => {
    const { execute, store } = makeServer();
    const before = store.get("cmp_seed_webinar")!;
    const { data } = await execute<UpdateCampaignMutation>(UpdateCampaignDocument.toString(), {
      id: before.id,
      input: { ...input, name: "Webinar v2" },
    });
    const result = data!.updateCampaign;
    if (result.__typename !== "Campaign") throw new Error(`Expected Campaign, got ${result.__typename}`);
    expect(result.name).toBe("Webinar v2");
    expect(result.createdAt).toBe(before.createdAt);
    expect(result.updatedAt > before.updatedAt).toBe(true);
  });

  it("returns NotFoundError for an unknown id", async () => {
    const { execute } = makeServer();
    const { data } = await execute<UpdateCampaignMutation>(UpdateCampaignDocument.toString(), { id: "x", input });
    expect(data!.updateCampaign.__typename).toBe("NotFoundError");
  });
});

describe("publish and pause", () => {
  it("publishes a draft and pauses a live campaign", async () => {
    const { execute } = makeServer();
    const published = await execute<PublishCampaignMutation>(PublishCampaignDocument.toString(), {
      id: "cmp_seed_webinar",
    });
    expect(published.data!.publishCampaign).toMatchObject({ __typename: "Campaign", status: "LIVE" });

    const paused = await execute<PauseCampaignMutation>(PauseCampaignDocument.toString(), {
      id: "cmp_seed_webinar",
    });
    expect(paused.data!.pauseCampaign).toMatchObject({ __typename: "Campaign", status: "PAUSED" });
  });

  it("returns InvalidTransitionError for a move that isn't allowed", async () => {
    const { execute, store } = makeServer();
    const { data } = await execute<PauseCampaignMutation>(PauseCampaignDocument.toString(), {
      id: "cmp_seed_webinar",
    });
    expect(data!.pauseCampaign).toEqual({
      __typename: "InvalidTransitionError",
      message: "Can't pause a campaign that is draft.",
    });
    expect(store.get("cmp_seed_webinar")?.status).toBe("DRAFT");
  });

  it("returns NotFoundError for an unknown id", async () => {
    const { execute } = makeServer();
    const { data } = await execute<PublishCampaignMutation>(PublishCampaignDocument.toString(), { id: "x" });
    expect(data!.publishCampaign.__typename).toBe("NotFoundError");
  });

  it("masks unexpected store failures", async () => {
    const { execute, store } = makeServer();
    store.setStatus = () => {
      throw new Error("disk full at /var/secret");
    };
    const { data, errors } = await execute(PublishCampaignDocument.toString(), { id: "cmp_seed_webinar" });
    expect(data).toBeNull();
    expect(errors?.[0]?.message).toBe("Unexpected error.");
  });
});
