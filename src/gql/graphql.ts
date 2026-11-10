/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type CampaignFilter = {
  search?: string | null | undefined;
  status?: CampaignStatus | null | undefined;
};

export type CampaignInput = {
  body: string;
  ctaLabel: string;
  delaySeconds: number;
  headline: string;
  name: string;
  status: CampaignStatus;
  targetUrl: UrlRuleInput;
  trigger: TriggerInput;
};

export type CampaignStatus =
  | 'DRAFT'
  | 'LIVE'
  | 'PAUSED';

export type TriggerInput = {
  scrollPercent?: number | null | undefined;
  type: TriggerType;
};

export type TriggerType =
  | 'EXIT_INTENT'
  | 'ON_LOAD'
  | 'SCROLL';

export type UrlMatch =
  | 'CONTAINS'
  | 'EXACT'
  | 'STARTS_WITH';

export type UrlRuleInput = {
  match: UrlMatch;
  value: string;
};

export type CampaignFieldsFragment = { id: string, name: string, headline: string, body: string, ctaLabel: string, delaySeconds: number, status: CampaignStatus, createdAt: string, updatedAt: string, trigger: { type: TriggerType, scrollPercent: number | null }, targetUrl: { match: UrlMatch, value: string } };

export type CampaignsQueryVariables = Exact<{
  filter?: CampaignFilter | null | undefined;
}>;


export type CampaignsQuery = { campaigns: Array<{ id: string, name: string, headline: string, body: string, ctaLabel: string, delaySeconds: number, status: CampaignStatus, createdAt: string, updatedAt: string, trigger: { type: TriggerType, scrollPercent: number | null }, targetUrl: { match: UrlMatch, value: string } }> };

export type CampaignQueryVariables = Exact<{
  id: string | number;
}>;


export type CampaignQuery = { campaign: { id: string, name: string, headline: string, body: string, ctaLabel: string, delaySeconds: number, status: CampaignStatus, createdAt: string, updatedAt: string, trigger: { type: TriggerType, scrollPercent: number | null }, targetUrl: { match: UrlMatch, value: string } } | null };

export type CreateCampaignMutationVariables = Exact<{
  input: CampaignInput;
}>;


export type CreateCampaignMutation = { createCampaign:
    | { __typename: 'Campaign', id: string, name: string, headline: string, body: string, ctaLabel: string, delaySeconds: number, status: CampaignStatus, createdAt: string, updatedAt: string, trigger: { type: TriggerType, scrollPercent: number | null }, targetUrl: { match: UrlMatch, value: string } }
    | { __typename: 'ValidationError', message: string, fieldErrors: Array<{ field: string, message: string }> }
   };

export type UpdateCampaignMutationVariables = Exact<{
  id: string | number;
  input: CampaignInput;
}>;


export type UpdateCampaignMutation = { updateCampaign:
    | { __typename: 'Campaign', id: string, name: string, headline: string, body: string, ctaLabel: string, delaySeconds: number, status: CampaignStatus, createdAt: string, updatedAt: string, trigger: { type: TriggerType, scrollPercent: number | null }, targetUrl: { match: UrlMatch, value: string } }
    | { __typename: 'NotFoundError', message: string }
    | { __typename: 'ValidationError', message: string, fieldErrors: Array<{ field: string, message: string }> }
   };

export type PublishCampaignMutationVariables = Exact<{
  id: string | number;
}>;


export type PublishCampaignMutation = { publishCampaign:
    | { __typename: 'Campaign', id: string, name: string, headline: string, body: string, ctaLabel: string, delaySeconds: number, status: CampaignStatus, createdAt: string, updatedAt: string, trigger: { type: TriggerType, scrollPercent: number | null }, targetUrl: { match: UrlMatch, value: string } }
    | { __typename: 'InvalidTransitionError', message: string }
    | { __typename: 'NotFoundError', message: string }
   };

export type PauseCampaignMutationVariables = Exact<{
  id: string | number;
}>;


export type PauseCampaignMutation = { pauseCampaign:
    | { __typename: 'Campaign', id: string, name: string, headline: string, body: string, ctaLabel: string, delaySeconds: number, status: CampaignStatus, createdAt: string, updatedAt: string, trigger: { type: TriggerType, scrollPercent: number | null }, targetUrl: { match: UrlMatch, value: string } }
    | { __typename: 'InvalidTransitionError', message: string }
    | { __typename: 'NotFoundError', message: string }
   };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const CampaignFieldsFragmentDoc = new TypedDocumentString(`
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
    `, {"fragmentName":"CampaignFields"}) as unknown as TypedDocumentString<CampaignFieldsFragment, unknown>;
export const CampaignsDocument = new TypedDocumentString(`
    query Campaigns($filter: CampaignFilter) {
  campaigns(filter: $filter) {
    ...CampaignFields
  }
}
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
}`) as unknown as TypedDocumentString<CampaignsQuery, CampaignsQueryVariables>;
export const CampaignDocument = new TypedDocumentString(`
    query Campaign($id: ID!) {
  campaign(id: $id) {
    ...CampaignFields
  }
}
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
}`) as unknown as TypedDocumentString<CampaignQuery, CampaignQueryVariables>;
export const CreateCampaignDocument = new TypedDocumentString(`
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
}`) as unknown as TypedDocumentString<CreateCampaignMutation, CreateCampaignMutationVariables>;
export const UpdateCampaignDocument = new TypedDocumentString(`
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
}`) as unknown as TypedDocumentString<UpdateCampaignMutation, UpdateCampaignMutationVariables>;
export const PublishCampaignDocument = new TypedDocumentString(`
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
}`) as unknown as TypedDocumentString<PublishCampaignMutation, PublishCampaignMutationVariables>;
export const PauseCampaignDocument = new TypedDocumentString(`
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
}`) as unknown as TypedDocumentString<PauseCampaignMutation, PauseCampaignMutationVariables>;