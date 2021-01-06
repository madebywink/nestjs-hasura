import { Inject } from "@nestjs/common";
import {
  HASURA_GRAPHQL_CLIENT_INJECT,
  NAMED_HASURA_GRAPHQL_CLIENT_INJECT,
} from "../hasura.tokens";

/**
 * Inject the GraphQL Request Client instance. If multiple instances are being used,
 * the `name` parameter is used to distinguish between them
 *
 * @param name optional name of Hasura instance, if using multiple
 */
export function InjectHasuraGraphQLClient(
  name?: string
): () => ParameterDecorator {
  if (!name) {
    return () => Inject(HASURA_GRAPHQL_CLIENT_INJECT);
  }

  return () => Inject(NAMED_HASURA_GRAPHQL_CLIENT_INJECT(name));
}
