import { WebhookType } from "./hasura.types";

export const PATH_NOT_WEBHOOK = (path: string) =>
  `Path ${path} does not correspond to a supported Hasura webhook type`;

export const NAMED_INSTANCES_MISMATCH =
  "Multiple instances are expected in module configuration when name is provided";

export const INVALID_WEBHOOK_TYPE = (type: WebhookType) =>
  `Invalid webhook type: ${type}`;

export const INSTANCE_NOT_FOUND = (name: string) =>
  `Could not find instance with name ${name}`;
