import GraphContext from "coral-server/graph/context";
import { Tenant } from "coral-server/models/tenant";
import {
  createAnnouncement,
  createWebhookEndpoint,
  deleteAnnouncement,
  deleteWebhookEndpoint,
  disableFeatureFlag,
  disableWebhookEndpoint,
  enableFeatureFlag,
  enableWebhookEndpoint,
  regenerateSSOKey,
  rotateWebhookEndpointSecret,
  update,
  updateWebhookEndpoint,
} from "coral-server/services/tenant";

import {
  GQLCreateAnnouncementInput,
  GQLCreateWebhookEndpointInput,
  GQLDeleteWebhookEndpointInput,
  GQLDisableWebhookEndpointInput,
  GQLEnableWebhookEndpointInput,
  GQLFEATURE_FLAG,
  GQLRotateWebhookEndpointSecretInput,
  GQLUpdateSettingsInput,
  GQLUpdateWebhookEndpointInput,
} from "coral-server/graph/schema/__generated__/types";

import { WithoutMutationID } from "./util";

export const Settings = ({
  mongo,
  redis,
  tenantCache,
  tenant,
  config,
  now,
}: GraphContext) => ({
  update: (
    input: WithoutMutationID<GQLUpdateSettingsInput>
  ): Promise<Tenant | null> =>
    update(mongo, redis, tenantCache, config, tenant, input.settings),
  regenerateSSOKey: (): Promise<Tenant | null> =>
    regenerateSSOKey(mongo, redis, tenantCache, tenant, now),
  enableFeatureFlag: (flag: GQLFEATURE_FLAG) =>
    enableFeatureFlag(mongo, redis, tenantCache, tenant, flag),
  disableFeatureFlag: (flag: GQLFEATURE_FLAG) =>
    disableFeatureFlag(mongo, redis, tenantCache, tenant, flag),
  createAnnouncement: (input: GQLCreateAnnouncementInput) =>
    createAnnouncement(mongo, redis, tenantCache, tenant, input, now),
  deleteAnnouncement: () =>
    deleteAnnouncement(mongo, redis, tenantCache, tenant),
  createWebhookEndpoint: (
    input: WithoutMutationID<GQLCreateWebhookEndpointInput>
  ) =>
    createWebhookEndpoint(
      mongo,
      redis,
      config,
      tenantCache,
      tenant,
      input,
      now
    ),
  enableWebhookEndpoint: (
    input: WithoutMutationID<GQLEnableWebhookEndpointInput>
  ) => enableWebhookEndpoint(mongo, redis, tenantCache, tenant, input.id),
  disableWebhookEndpoint: (
    input: WithoutMutationID<GQLDisableWebhookEndpointInput>
  ) => disableWebhookEndpoint(mongo, redis, tenantCache, tenant, input.id),
  updateWebhookEndpoint: ({
    id,
    ...input
  }: WithoutMutationID<GQLUpdateWebhookEndpointInput>) =>
    updateWebhookEndpoint(mongo, redis, config, tenantCache, tenant, id, input),
  deleteWebhookEndpoint: (
    input: WithoutMutationID<GQLDeleteWebhookEndpointInput>
  ) => deleteWebhookEndpoint(mongo, redis, tenantCache, tenant, input.id),
  rotateWebhookEndpointSecret: (
    input: WithoutMutationID<GQLRotateWebhookEndpointSecretInput>
  ) =>
    rotateWebhookEndpointSecret(
      mongo,
      redis,
      tenantCache,
      tenant,
      input.id,
      input.inactiveIn,
      now
    ),
});
