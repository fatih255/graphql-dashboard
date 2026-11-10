// The schema lives in a tagged template so GraphQL Code Generator can read it
// (graphql-tag-pluck) and the server can use the same string at runtime.
export const typeDefs = /* GraphQL */ `
  enum CampaignStatus {
    DRAFT
    LIVE
    PAUSED
  }

  enum TriggerType {
    ON_LOAD
    EXIT_INTENT
    SCROLL
  }

  enum UrlMatch {
    EXACT
    STARTS_WITH
    CONTAINS
  }

  type Trigger {
    type: TriggerType!
    "Only set when type is SCROLL. Percentage of the page height, 1 to 100."
    scrollPercent: Int
  }

  type UrlRule {
    match: UrlMatch!
    value: String!
  }

  type Campaign {
    id: ID!
    name: String!
    headline: String!
    body: String!
    ctaLabel: String!
    trigger: Trigger!
    "Seconds to wait after the trigger fires before the popup shows."
    delaySeconds: Int!
    targetUrl: UrlRule!
    status: CampaignStatus!
    createdAt: String!
    updatedAt: String!
  }

  interface UserError {
    message: String!
  }

  type FieldError {
    "Dotted path of the input field, for example trigger.scrollPercent."
    field: String!
    message: String!
  }

  type ValidationError implements UserError {
    message: String!
    fieldErrors: [FieldError!]!
  }

  type NotFoundError implements UserError {
    message: String!
    id: ID!
  }

  type InvalidTransitionError implements UserError {
    message: String!
    from: CampaignStatus!
    to: CampaignStatus!
  }

  union CreateCampaignResult = Campaign | ValidationError
  union UpdateCampaignResult = Campaign | ValidationError | NotFoundError
  union StatusChangeResult = Campaign | NotFoundError | InvalidTransitionError

  input CampaignFilter {
    status: CampaignStatus
    search: String
  }

  input TriggerInput {
    type: TriggerType!
    scrollPercent: Int
  }

  input UrlRuleInput {
    match: UrlMatch!
    value: String!
  }

  input CampaignInput {
    name: String!
    headline: String!
    body: String!
    ctaLabel: String!
    trigger: TriggerInput!
    delaySeconds: Int!
    targetUrl: UrlRuleInput!
    status: CampaignStatus!
  }

  type Query {
    "Campaigns sorted by last update, newest first."
    campaigns(filter: CampaignFilter): [Campaign!]!
    campaign(id: ID!): Campaign
  }

  type Mutation {
    createCampaign(input: CampaignInput!): CreateCampaignResult!
    updateCampaign(id: ID!, input: CampaignInput!): UpdateCampaignResult!
    "Moves a DRAFT or PAUSED campaign to LIVE."
    publishCampaign(id: ID!): StatusChangeResult!
    "Moves a LIVE campaign to PAUSED."
    pauseCampaign(id: ID!): StatusChangeResult!
  }
`;
