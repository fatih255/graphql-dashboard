import { createSchema, createYoga } from "graphql-yoga";
import type { GraphQLContext } from "./context";
import { resolvers } from "./resolvers";
import type { CampaignStore } from "./store";
import { typeDefs } from "./typeDefs";

export const schema = createSchema<GraphQLContext>({ typeDefs, resolvers });

/**
 * Builds the GraphQL handler. Tests pass their own in-memory store; the route
 * handler passes the file-backed one. Unexpected errors are masked by Yoga and
 * reach the client as "Unexpected error.".
 */
export function createGraphQLHandler(getStore: () => CampaignStore) {
  return createYoga<object, GraphQLContext>({
    schema,
    graphqlEndpoint: "/api/graphql",
    context: () => ({ store: getStore() }),
    fetchAPI: { Response },
  });
}
