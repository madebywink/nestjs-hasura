import { HasuraScheduledEventHandler } from "../hasura-scheduled-event-handler.decorator";

export class Test {
  @HasuraScheduledEventHandler({ trigger: "s" })
  static handleEvent() {}
}
