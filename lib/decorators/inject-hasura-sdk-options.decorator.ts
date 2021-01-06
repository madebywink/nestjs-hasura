import { Inject } from "@nestjs/common";
import { HASURA_SDK_OPTIONS_INJECT } from "../hasura.tokens";

/**
 * Inject the Hasura Sdk instance options. If multiple instances are being used,
 * the `name` parameter is used to distinguish between them
 *
 * @param name optional name of Hasura instance, if using multiple
 */
export function InjectHasuraSdkOptions(): () => ParameterDecorator {
  return () => Inject(HASURA_SDK_OPTIONS_INJECT);
}
