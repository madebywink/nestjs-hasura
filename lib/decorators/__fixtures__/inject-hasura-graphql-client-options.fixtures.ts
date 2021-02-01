import { HasuraSdkOptions } from "../../hasura.module-options";
import { InjectHasuraGraphQLClientOptions } from "../inject-hasura-graphql-client-options.decorator";

export class Test {
  constructor(@InjectHasuraGraphQLClientOptions() opts: HasuraSdkOptions) {}
}
