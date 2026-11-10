import { seedCampaigns } from "@/server/seed-data";
import { createMemoryStore, type CampaignStore } from "@/server/store";
import { createGraphQLHandler } from "@/server/yoga";

export function makeServer(store: CampaignStore = createMemoryStore(seedCampaigns())) {
  const yoga = createGraphQLHandler(() => store);

  async function execute<T>(query: string, variables?: Record<string, unknown>) {
    const response = await yoga.fetch("http://test/api/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    return (await response.json()) as { data?: T; errors?: { message: string }[] };
  }

  return { store, yoga, execute };
}
