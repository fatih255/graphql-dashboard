/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment CampaignFields on Campaign {\n    id\n    name\n    headline\n    body\n    ctaLabel\n    trigger {\n      type\n      scrollPercent\n    }\n    delaySeconds\n    targetUrl {\n      match\n      value\n    }\n    status\n    createdAt\n    updatedAt\n  }\n": typeof types.CampaignFieldsFragmentDoc,
    "\n  query Campaigns($filter: CampaignFilter) {\n    campaigns(filter: $filter) {\n      ...CampaignFields\n    }\n  }\n": typeof types.CampaignsDocument,
    "\n  query Campaign($id: ID!) {\n    campaign(id: $id) {\n      ...CampaignFields\n    }\n  }\n": typeof types.CampaignDocument,
    "\n  mutation CreateCampaign($input: CampaignInput!) {\n    createCampaign(input: $input) {\n      __typename\n      ... on Campaign {\n        ...CampaignFields\n      }\n      ... on ValidationError {\n        message\n        fieldErrors {\n          field\n          message\n        }\n      }\n    }\n  }\n": typeof types.CreateCampaignDocument,
    "\n  mutation UpdateCampaign($id: ID!, $input: CampaignInput!) {\n    updateCampaign(id: $id, input: $input) {\n      __typename\n      ... on Campaign {\n        ...CampaignFields\n      }\n      ... on ValidationError {\n        message\n        fieldErrors {\n          field\n          message\n        }\n      }\n      ... on NotFoundError {\n        message\n      }\n    }\n  }\n": typeof types.UpdateCampaignDocument,
    "\n  mutation PublishCampaign($id: ID!) {\n    publishCampaign(id: $id) {\n      __typename\n      ... on Campaign {\n        ...CampaignFields\n      }\n      ... on UserError {\n        message\n      }\n    }\n  }\n": typeof types.PublishCampaignDocument,
    "\n  mutation PauseCampaign($id: ID!) {\n    pauseCampaign(id: $id) {\n      __typename\n      ... on Campaign {\n        ...CampaignFields\n      }\n      ... on UserError {\n        message\n      }\n    }\n  }\n": typeof types.PauseCampaignDocument,
};
const documents: Documents = {
    "\n  fragment CampaignFields on Campaign {\n    id\n    name\n    headline\n    body\n    ctaLabel\n    trigger {\n      type\n      scrollPercent\n    }\n    delaySeconds\n    targetUrl {\n      match\n      value\n    }\n    status\n    createdAt\n    updatedAt\n  }\n": types.CampaignFieldsFragmentDoc,
    "\n  query Campaigns($filter: CampaignFilter) {\n    campaigns(filter: $filter) {\n      ...CampaignFields\n    }\n  }\n": types.CampaignsDocument,
    "\n  query Campaign($id: ID!) {\n    campaign(id: $id) {\n      ...CampaignFields\n    }\n  }\n": types.CampaignDocument,
    "\n  mutation CreateCampaign($input: CampaignInput!) {\n    createCampaign(input: $input) {\n      __typename\n      ... on Campaign {\n        ...CampaignFields\n      }\n      ... on ValidationError {\n        message\n        fieldErrors {\n          field\n          message\n        }\n      }\n    }\n  }\n": types.CreateCampaignDocument,
    "\n  mutation UpdateCampaign($id: ID!, $input: CampaignInput!) {\n    updateCampaign(id: $id, input: $input) {\n      __typename\n      ... on Campaign {\n        ...CampaignFields\n      }\n      ... on ValidationError {\n        message\n        fieldErrors {\n          field\n          message\n        }\n      }\n      ... on NotFoundError {\n        message\n      }\n    }\n  }\n": types.UpdateCampaignDocument,
    "\n  mutation PublishCampaign($id: ID!) {\n    publishCampaign(id: $id) {\n      __typename\n      ... on Campaign {\n        ...CampaignFields\n      }\n      ... on UserError {\n        message\n      }\n    }\n  }\n": types.PublishCampaignDocument,
    "\n  mutation PauseCampaign($id: ID!) {\n    pauseCampaign(id: $id) {\n      __typename\n      ... on Campaign {\n        ...CampaignFields\n      }\n      ... on UserError {\n        message\n      }\n    }\n  }\n": types.PauseCampaignDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CampaignFields on Campaign {\n    id\n    name\n    headline\n    body\n    ctaLabel\n    trigger {\n      type\n      scrollPercent\n    }\n    delaySeconds\n    targetUrl {\n      match\n      value\n    }\n    status\n    createdAt\n    updatedAt\n  }\n"): typeof import('./graphql').CampaignFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Campaigns($filter: CampaignFilter) {\n    campaigns(filter: $filter) {\n      ...CampaignFields\n    }\n  }\n"): typeof import('./graphql').CampaignsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Campaign($id: ID!) {\n    campaign(id: $id) {\n      ...CampaignFields\n    }\n  }\n"): typeof import('./graphql').CampaignDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCampaign($input: CampaignInput!) {\n    createCampaign(input: $input) {\n      __typename\n      ... on Campaign {\n        ...CampaignFields\n      }\n      ... on ValidationError {\n        message\n        fieldErrors {\n          field\n          message\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').CreateCampaignDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCampaign($id: ID!, $input: CampaignInput!) {\n    updateCampaign(id: $id, input: $input) {\n      __typename\n      ... on Campaign {\n        ...CampaignFields\n      }\n      ... on ValidationError {\n        message\n        fieldErrors {\n          field\n          message\n        }\n      }\n      ... on NotFoundError {\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').UpdateCampaignDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PublishCampaign($id: ID!) {\n    publishCampaign(id: $id) {\n      __typename\n      ... on Campaign {\n        ...CampaignFields\n      }\n      ... on UserError {\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').PublishCampaignDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PauseCampaign($id: ID!) {\n    pauseCampaign(id: $id) {\n      __typename\n      ... on Campaign {\n        ...CampaignFields\n      }\n      ... on UserError {\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').PauseCampaignDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
