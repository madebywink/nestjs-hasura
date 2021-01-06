import { Inject } from "@nestjs/common";
import { HASURA_SDK_INJECT, NAMED_HASURA_SDK_INJECT } from "../hasura.tokens";

/**
 * Inject the generated Sdk for Hasura. If multiple instances are being used,
 * the `name` parameter is used to distinguish between them
 *
 * @param name optional name of Hasura instance, if using multiple
 */
export function InjectHasuraSdk(name?: string): () => ParameterDecorator {
  if (!name) {
    return () => Inject(HASURA_SDK_INJECT);
  }

  return () => Inject(NAMED_HASURA_SDK_INJECT(name));
}
