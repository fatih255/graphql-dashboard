import type { GraphQLResolveInfo } from 'graphql';
import type { GraphQLContext } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Campaign = {
  __typename?: 'Campaign';
  body: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  ctaLabel: Scalars['String']['output'];
  /** Seconds to wait after the trigger fires before the popup shows. */
  delaySeconds: Scalars['Int']['output'];
  headline: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  status: CampaignStatus;
  targetUrl: UrlRule;
  trigger: Trigger;
  updatedAt: Scalars['String']['output'];
};

export type CampaignFilter = {
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CampaignStatus>;
};

export type CampaignInput = {
  body: Scalars['String']['input'];
  ctaLabel: Scalars['String']['input'];
  delaySeconds: Scalars['Int']['input'];
  headline: Scalars['String']['input'];
  name: Scalars['String']['input'];
  status: CampaignStatus;
  targetUrl: UrlRuleInput;
  trigger: TriggerInput;
};

export type CampaignStatus =
  | 'DRAFT'
  | 'LIVE'
  | 'PAUSED';

export type CreateCampaignResult = Campaign | ValidationError;

export type FieldError = {
  __typename?: 'FieldError';
  /** Dotted path of the input field, for example trigger.scrollPercent. */
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type InvalidTransitionError = UserError & {
  __typename?: 'InvalidTransitionError';
  from: CampaignStatus;
  message: Scalars['String']['output'];
  to: CampaignStatus;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCampaign: CreateCampaignResult;
  /** Moves a LIVE campaign to PAUSED. */
  pauseCampaign: StatusChangeResult;
  /** Moves a DRAFT or PAUSED campaign to LIVE. */
  publishCampaign: StatusChangeResult;
  updateCampaign: UpdateCampaignResult;
};


export type MutationCreateCampaignArgs = {
  input: CampaignInput;
};


export type MutationPauseCampaignArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPublishCampaignArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCampaignArgs = {
  id: Scalars['ID']['input'];
  input: CampaignInput;
};

export type NotFoundError = UserError & {
  __typename?: 'NotFoundError';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  campaign?: Maybe<Campaign>;
  /** Campaigns sorted by last update, newest first. */
  campaigns: Array<Campaign>;
};


export type QueryCampaignArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCampaignsArgs = {
  filter?: InputMaybe<CampaignFilter>;
};

export type StatusChangeResult = Campaign | InvalidTransitionError | NotFoundError;

export type Trigger = {
  __typename?: 'Trigger';
  /** Only set when type is SCROLL. Percentage of the page height, 1 to 100. */
  scrollPercent?: Maybe<Scalars['Int']['output']>;
  type: TriggerType;
};

export type TriggerInput = {
  scrollPercent?: InputMaybe<Scalars['Int']['input']>;
  type: TriggerType;
};

export type TriggerType =
  | 'EXIT_INTENT'
  | 'ON_LOAD'
  | 'SCROLL';

export type UpdateCampaignResult = Campaign | NotFoundError | ValidationError;

export type UrlMatch =
  | 'CONTAINS'
  | 'EXACT'
  | 'STARTS_WITH';

export type UrlRule = {
  __typename?: 'UrlRule';
  match: UrlMatch;
  value: Scalars['String']['output'];
};

export type UrlRuleInput = {
  match: UrlMatch;
  value: Scalars['String']['input'];
};

export type UserError = {
  message: Scalars['String']['output'];
};

export type ValidationError = UserError & {
  __typename?: 'ValidationError';
  fieldErrors: Array<FieldError>;
  message: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  CreateCampaignResult:
    | ( Campaign & { __typename: 'Campaign' } )
    | ( ValidationError & { __typename: 'ValidationError' } )
  ;
  StatusChangeResult:
    | ( Campaign & { __typename: 'Campaign' } )
    | ( InvalidTransitionError & { __typename: 'InvalidTransitionError' } )
    | ( NotFoundError & { __typename: 'NotFoundError' } )
  ;
  UpdateCampaignResult:
    | ( Campaign & { __typename: 'Campaign' } )
    | ( NotFoundError & { __typename: 'NotFoundError' } )
    | ( ValidationError & { __typename: 'ValidationError' } )
  ;
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  UserError:
    | ( InvalidTransitionError & { __typename: 'InvalidTransitionError' } )
    | ( NotFoundError & { __typename: 'NotFoundError' } )
    | ( ValidationError & { __typename: 'ValidationError' } )
  ;
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Campaign: ResolverTypeWrapper<Campaign>;
  CampaignFilter: CampaignFilter;
  CampaignInput: CampaignInput;
  CampaignStatus: CampaignStatus;
  CreateCampaignResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateCampaignResult']>;
  FieldError: ResolverTypeWrapper<FieldError>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  InvalidTransitionError: ResolverTypeWrapper<InvalidTransitionError>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  NotFoundError: ResolverTypeWrapper<NotFoundError>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  StatusChangeResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['StatusChangeResult']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Trigger: ResolverTypeWrapper<Trigger>;
  TriggerInput: TriggerInput;
  TriggerType: TriggerType;
  UpdateCampaignResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateCampaignResult']>;
  UrlMatch: UrlMatch;
  UrlRule: ResolverTypeWrapper<UrlRule>;
  UrlRuleInput: UrlRuleInput;
  UserError: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['UserError']>;
  ValidationError: ResolverTypeWrapper<ValidationError>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Campaign: Campaign;
  CampaignFilter: CampaignFilter;
  CampaignInput: CampaignInput;
  CreateCampaignResult: ResolversUnionTypes<ResolversParentTypes>['CreateCampaignResult'];
  FieldError: FieldError;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  InvalidTransitionError: InvalidTransitionError;
  Mutation: Record<PropertyKey, never>;
  NotFoundError: NotFoundError;
  Query: Record<PropertyKey, never>;
  StatusChangeResult: ResolversUnionTypes<ResolversParentTypes>['StatusChangeResult'];
  String: Scalars['String']['output'];
  Trigger: Trigger;
  TriggerInput: TriggerInput;
  UpdateCampaignResult: ResolversUnionTypes<ResolversParentTypes>['UpdateCampaignResult'];
  UrlRule: UrlRule;
  UrlRuleInput: UrlRuleInput;
  UserError: ResolversInterfaceTypes<ResolversParentTypes>['UserError'];
  ValidationError: ValidationError;
};

export type CampaignResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Campaign'] = ResolversParentTypes['Campaign']> = {
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ctaLabel?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  delaySeconds?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  headline?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['CampaignStatus'], ParentType, ContextType>;
  targetUrl?: Resolver<ResolversTypes['UrlRule'], ParentType, ContextType>;
  trigger?: Resolver<ResolversTypes['Trigger'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCampaignResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CreateCampaignResult'] = ResolversParentTypes['CreateCampaignResult']> = {
  __resolveType: TypeResolveFn<'Campaign' | 'ValidationError', ParentType, ContextType>;
};

export type FieldErrorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['FieldError'] = ResolversParentTypes['FieldError']> = {
  field?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type InvalidTransitionErrorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['InvalidTransitionError'] = ResolversParentTypes['InvalidTransitionError']> = {
  from?: Resolver<ResolversTypes['CampaignStatus'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['CampaignStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createCampaign?: Resolver<ResolversTypes['CreateCampaignResult'], ParentType, ContextType, RequireFields<MutationCreateCampaignArgs, 'input'>>;
  pauseCampaign?: Resolver<ResolversTypes['StatusChangeResult'], ParentType, ContextType, RequireFields<MutationPauseCampaignArgs, 'id'>>;
  publishCampaign?: Resolver<ResolversTypes['StatusChangeResult'], ParentType, ContextType, RequireFields<MutationPublishCampaignArgs, 'id'>>;
  updateCampaign?: Resolver<ResolversTypes['UpdateCampaignResult'], ParentType, ContextType, RequireFields<MutationUpdateCampaignArgs, 'id' | 'input'>>;
};

export type NotFoundErrorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['NotFoundError'] = ResolversParentTypes['NotFoundError']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  campaign?: Resolver<Maybe<ResolversTypes['Campaign']>, ParentType, ContextType, RequireFields<QueryCampaignArgs, 'id'>>;
  campaigns?: Resolver<Array<ResolversTypes['Campaign']>, ParentType, ContextType, Partial<QueryCampaignsArgs>>;
};

export type StatusChangeResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['StatusChangeResult'] = ResolversParentTypes['StatusChangeResult']> = {
  __resolveType: TypeResolveFn<'Campaign' | 'InvalidTransitionError' | 'NotFoundError', ParentType, ContextType>;
};

export type TriggerResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Trigger'] = ResolversParentTypes['Trigger']> = {
  scrollPercent?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TriggerType'], ParentType, ContextType>;
};

export type UpdateCampaignResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UpdateCampaignResult'] = ResolversParentTypes['UpdateCampaignResult']> = {
  __resolveType: TypeResolveFn<'Campaign' | 'NotFoundError' | 'ValidationError', ParentType, ContextType>;
};

export type UrlRuleResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UrlRule'] = ResolversParentTypes['UrlRule']> = {
  match?: Resolver<ResolversTypes['UrlMatch'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type UserErrorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserError'] = ResolversParentTypes['UserError']> = {
  __resolveType: TypeResolveFn<'InvalidTransitionError' | 'NotFoundError' | 'ValidationError', ParentType, ContextType>;
};

export type ValidationErrorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ValidationError'] = ResolversParentTypes['ValidationError']> = {
  fieldErrors?: Resolver<Array<ResolversTypes['FieldError']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  Campaign?: CampaignResolvers<ContextType>;
  CreateCampaignResult?: CreateCampaignResultResolvers<ContextType>;
  FieldError?: FieldErrorResolvers<ContextType>;
  InvalidTransitionError?: InvalidTransitionErrorResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NotFoundError?: NotFoundErrorResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  StatusChangeResult?: StatusChangeResultResolvers<ContextType>;
  Trigger?: TriggerResolvers<ContextType>;
  UpdateCampaignResult?: UpdateCampaignResultResolvers<ContextType>;
  UrlRule?: UrlRuleResolvers<ContextType>;
  UserError?: UserErrorResolvers<ContextType>;
  ValidationError?: ValidationErrorResolvers<ContextType>;
};

