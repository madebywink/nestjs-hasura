import { Inject } from "@nestjs/common";
import { HasuraInjectionToken } from "../hasura.tokens";

/**
 * Inject the Hasura module options
 */
export function InjectHasuraModuleOptions(): ParameterDecorator {
  return Inject(HasuraInjectionToken.ModuleOptions);
}
