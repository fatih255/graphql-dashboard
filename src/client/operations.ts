import { graphql } from "@/gql";

export const CampaignFieldsFragment = graphql(`
  fragment CampaignFields on Campaign {
    id
    name
    headline
    body
    ctaLabel
    trigger {
      type
      scrollPercent
    }
    delaySeconds
    targetUrl {
      match
      value
    }
    status
    createdAt
    updatedAt
  }
`);

export const CampaignsDocument = graphql(`
  query Campaigns($filter: CampaignFilter) {
    campaigns(filter: $filter) {
      ...CampaignFields
    }
  }
`);

export const CampaignDocument = graphql(`
  query Campaign($id: ID!) {
    campaign(id: $id) {
      ...CampaignFields
    }
  }
`);

export const CreateCampaignDocument = graphql(`
  mutation CreateCampaign($input: CampaignInput!) {
    createCampaign(input: $input) {
      __typename
      ... on Campaign {
        ...CampaignFields
      }
      ... on ValidationError {
        message
        fieldErrors {
          field
          message
        }
      }
    }
  }
`);

export const UpdateCampaignDocument = graphql(`
  mutation UpdateCampaign($id: ID!, $input: CampaignInput!) {
    updateCampaign(id: $id, input: $input) {
      __typename
      ... on Campaign {
        ...CampaignFields
      }
      ... on ValidationError {
        message
        fieldErrors {
          field
          message
        }
      }
      ... on NotFoundError {
        message
      }
    }
  }
`);

export const PublishCampaignDocument = graphql(`
  mutation PublishCampaign($id: ID!) {
    publishCampaign(id: $id) {
      __typename
      ... on Campaign {
        ...CampaignFields
      }
      ... on UserError {
        message
      }
    }
  }
`);

export const PauseCampaignDocument = graphql(`
  mutation PauseCampaign($id: ID!) {
    pauseCampaign(id: $id) {
      __typename
      ... on Campaign {
        ...CampaignFields
      }
      ... on UserError {
        message
      }
    }
  }
`);
