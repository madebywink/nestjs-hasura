import { Inject } from "@nestjs/common";
import { HASURA_SDK_INJECT } from "../hasura.tokens";

/**
 * Inject the generated Sdk for Hasura.
 */
export function InjectHasuraSdk(): ParameterDecorator {
  return Inject(HASURA_SDK_INJECT);
}
