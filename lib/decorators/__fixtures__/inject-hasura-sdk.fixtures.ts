import { InjectHasuraSdk } from "../inject-hasura-sdk.decorator";

export class Test {
  constructor(@InjectHasuraSdk() sdk: unknown) {}
}
