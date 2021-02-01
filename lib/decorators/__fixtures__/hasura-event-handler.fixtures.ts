import { HasuraEventHandler } from "../hasura-event-handler.decorator";

export class Test {
  @HasuraEventHandler({ trigger: "action" })
  static handleEvent() {}
}
