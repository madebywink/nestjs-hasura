import { Inject } from "@nestjs/common";
import { HasuraInjectionToken } from "../hasura.tokens";

/**
 * Inject the generated Sdk for Hasura.
 */
export function InjectHasuraSdk(): ParameterDecorator {
  return Inject(HasuraInjectionToken.Sdk);
}
