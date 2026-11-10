import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/client/api";
import { makeStore, type AppStore } from "@/client/store";
import { makeServer } from "./helpers";

const listArgs = { filter: { status: null, search: null } };
const ID = "cmp_seed_webinar"; // seeded as DRAFT

function deferred() {
  let release!: () => void;
  const promise = new Promise<void>((resolve) => (release = resolve));
  return { promise, release };
}

function statusInCache(store: AppStore) {
  const state = store.getState();
  return {
    list: api.endpoints.campaigns.select(listArgs)(state).data?.find((c) => c.id === ID)?.status,
    single: api.endpoints.campaign.select(ID)(state).data?.status,
  };
}

describe("changeStatus optimistic update", () => {
  let server: ReturnType<typeof makeServer>;
  let gate: ReturnType<typeof deferred>;
  let respond: ((request: Request) => Promise<Response>) | undefined;
  let store: AppStore;

  beforeEach(async () => {
    server = makeServer();
    gate = deferred();
    respond = undefined;
    // Route the client's fetch to the real GraphQL handler. Mutations wait for
    // the gate so the test can look at the cache while the request is in flight.
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
      const request = new Request(`http://test${url}`, init);
      if (String(init.body).includes("mutation")) {
        await gate.promise;
        if (respond) return respond(request);
      }
      return server.yoga.fetch(request);
    });

    store = makeStore();
    await store.dispatch(api.endpoints.campaigns.initiate(listArgs));
    await store.dispatch(api.endpoints.campaign.initiate(ID));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the new status before the server answers and keeps it on success", async () => {
    const pending = store.dispatch(api.endpoints.changeStatus.initiate({ id: ID, action: "publish" }));
    expect(statusInCache(store)).toEqual({ list: "LIVE", single: "LIVE" });

    gate.release();
    await pending;
    expect(statusInCache(store)).toEqual({ list: "LIVE", single: "LIVE" });
    expect(server.store.get(ID)?.status).toBe("LIVE");
    expect(store.getState().ui.toasts).toEqual([]);
  });

  it("rolls back when the server throws", async () => {
    server.store.setStatus = () => {
      throw new Error("database unavailable");
    };
    const pending = store.dispatch(api.endpoints.changeStatus.initiate({ id: ID, action: "publish" }));
    expect(statusInCache(store)).toEqual({ list: "LIVE", single: "LIVE" });

    gate.release();
    await pending;
    expect(statusInCache(store)).toEqual({ list: "DRAFT", single: "DRAFT" });
    expect(store.getState().ui.toasts[0]).toMatchObject({
      tone: "error",
      message: "Couldn't publish the campaign. Unexpected error.",
    });
  });

  it("rolls back on an HTTP 500 without a GraphQL body", async () => {
    respond = async () => new Response("Internal Server Error", { status: 500 });
    const pending = store.dispatch(api.endpoints.changeStatus.initiate({ id: ID, action: "publish" }));
    gate.release();
    await pending;
    expect(statusInCache(store)).toEqual({ list: "DRAFT", single: "DRAFT" });
    expect(store.getState().ui.toasts[0]?.message).toBe("Couldn't publish the campaign. Server responded with 500.");
  });

  it("rolls back on a typed InvalidTransitionError", async () => {
    const pending = store.dispatch(api.endpoints.changeStatus.initiate({ id: ID, action: "pause" }));
    expect(statusInCache(store)).toEqual({ list: "PAUSED", single: "PAUSED" });

    gate.release();
    await pending;
    expect(statusInCache(store)).toEqual({ list: "DRAFT", single: "DRAFT" });
    expect(store.getState().ui.toasts[0]?.message).toBe("Can't pause a campaign that is draft.");
  });
});
