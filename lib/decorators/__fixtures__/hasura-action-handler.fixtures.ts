import { HasuraActionHandler } from "../hasura-action-handler.decorator";

export class Test {
  @HasuraActionHandler({ action: "action", method: "GET" })
  static handleAction() {}
}
