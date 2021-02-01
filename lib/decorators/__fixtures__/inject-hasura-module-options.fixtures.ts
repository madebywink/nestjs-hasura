import { HasuraModuleOptions } from "../../hasura.module-options";
import { InjectHasuraModuleOptions } from "../inject-hasura-module-options.decorator";

export class Test {
  constructor(@InjectHasuraModuleOptions() opts: HasuraModuleOptions) {}
}
