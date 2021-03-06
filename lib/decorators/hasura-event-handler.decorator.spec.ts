import "reflect-metadata";
import { Test } from "./__fixtures__/hasura-event-handler.fixtures";
import { HasuraInjectionToken } from "../hasura.tokens";

describe("@HasuraEventHandler", () => {
  it("decorates class methods as event handlers", () => {
    const metadata = Reflect.getMetadata(
      HasuraInjectionToken.EventHandler,
      Test.handleEvent
    );

    expect(metadata).toEqual({ trigger: "action" });
  });
});
