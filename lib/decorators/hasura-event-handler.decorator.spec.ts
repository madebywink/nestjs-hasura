import "reflect-metadata";
import { Test } from "./__fixtures__/hasura-event-handler.fixtures";
import { HASURA_EVENT_HANDLER } from "../hasura.tokens";

describe("@HasuraEventHandler", () => {
  it("decorates class methods as event handlers", () => {
    const metadata = Reflect.getMetadata(
      HASURA_EVENT_HANDLER,
      Test.handleEvent
    );

    expect(metadata).toEqual({ trigger: "action" });
  });
});
