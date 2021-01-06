import { Inject } from "@nestjs/common";
import { HASURA_MODULE_OPTIONS_INJECT } from "../hasura.tokens";

/**
 * Inject the Hasura module options
 */
export function InjectHasuraModuleOptions(): ParameterDecorator {
  return Inject(HASURA_MODULE_OPTIONS_INJECT);
}
