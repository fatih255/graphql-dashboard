import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { TypedDocumentString } from "@/gql/graphql";

export interface GraphQLRequest {
  query: string;
  variables?: unknown;
}

export interface GraphQLRequestError {
  /** HTTP status, or "FETCH_ERROR" when the request never got a response. */
  status: number | "FETCH_ERROR";
  message: string;
}

/** Pairs a typed document with variables of the matching type. */
export function gqlRequest<TResult, TVariables>(
  document: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
): GraphQLRequest {
  return { query: document.toString(), variables };
}

interface GraphQLResponseBody {
  data?: unknown;
  errors?: { message: string }[];
}

/**
 * RTK Query base query that posts a GraphQL operation. Top-level GraphQL errors
 * and non-2xx responses become RTK Query errors. Typed domain errors (the union
 * members such as ValidationError) are part of `data` and handled by callers.
 */
export function graphqlBaseQuery({
  url,
}: {
  url: string;
}): BaseQueryFn<GraphQLRequest, unknown, GraphQLRequestError> {
  return async ({ query, variables }, { signal }) => {
    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ query, variables }),
        signal,
      });
    } catch (error) {
      return {
        error: {
          status: "FETCH_ERROR",
          message: error instanceof Error ? error.message : "Network request failed.",
        },
      };
    }

    let body: GraphQLResponseBody;
    try {
      body = (await response.json()) as GraphQLResponseBody;
    } catch {
      return { error: { status: response.status, message: `Server responded with ${response.status}.` } };
    }

    if (body.errors && body.errors.length > 0) {
      return {
        error: { status: response.status, message: body.errors.map((e) => e.message).join(" ") },
      };
    }
    if (!response.ok || body.data === undefined) {
      return { error: { status: response.status, message: `Server responded with ${response.status}.` } };
    }
    return { data: body.data };
  };
}
