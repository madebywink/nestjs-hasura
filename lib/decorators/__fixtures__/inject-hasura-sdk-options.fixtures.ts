import { HasuraSdkOptions } from "../../hasura.module-options";
import { InjectHasuraSdkOptions } from "../inject-hasura-sdk-options.decorator";

export class Test {
  constructor(@InjectHasuraSdkOptions() opts: HasuraSdkOptions) {}
}
