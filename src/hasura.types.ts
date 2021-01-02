import { HasuraEventTriggerPayload } from "./dto/hasura-event-trigger-payload.interface";
import { HasuraScheduledEventPayload } from "./dto/hasura-scheduled-event-payload.interface";

export type OpName = "INSERT" | "UPDATE" | "DELETE" | "MANUAL";

export enum HasuraApi {
  GraphQL = "/v1/graphql",
  Relay = "/v1beta1/relay	",
  LegacyGraphQL = "/v1alpha1/graphql",
  SchemaMetadata = "/v1/query",
  Version = "/v1/version",
  Health = "/healthz",
  PGDump = "/v1alpha1/pg_dump",
  Config = "/v1alpha1/config",
  Explain = "/v1/graphql/explain",
}

export type SchemaMetadataReportingLevel = "THOW" | "WARN";

export function isHasuraScheduledEvent<T, U extends OpName>(
  evt: HasuraEventTriggerPayload<T, U> | HasuraScheduledEventPayload
): evt is HasuraScheduledEventPayload {
  return "scheduled_time" in evt;
}
