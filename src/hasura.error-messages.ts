import { WebhookType } from "./hasura.types";

export const PATH_NOT_WEBHOOK = (path: string) =>
  `Path ${path} does not correspond to a supported Hasura webhook type`;

export const NAMED_INSTANCES_MISMATCH =
  "Multiple instances are expected in module configuration when name is provide.";

export const INVALID_WEBHOOK_TYPE = (type: WebhookType) =>
  `Invalid webhook type: ${type}`;

export const INSTANCE_NOT_FOUND = (name: string) =>
  `Could not find instance with name ${name}`;

export const MISSING_INSTANCE_NAME = "Expected an instance name";

export const SYNC_REGISTER_CODEGEN_ENBALED =
  "When registering HasuraModule synchronously, you must bring your own codegen and explicitly configure instance options with codegen.sdkPath to point to a file with the exported SDK";

export const WEBHOOK_HEADER_SECRET_MISMATCH = (type: WebhookType) =>
  `Provided a secret when header is undefined for webhook type: ${type}`;
