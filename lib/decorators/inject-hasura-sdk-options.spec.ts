import "reflect-metadata";
import { Test } from "./__fixtures__/inject-hasura-sdk-options.fixtures";
import { SELF_DECLARED_DEPS_METADATA } from "@nestjs/common/constants";
import { HASURA_SDK_OPTIONS_INJECT } from "../hasura.tokens";

describe("@InjectHasuraSdkOptions", () => {
  it("should enhance class with expected constructor params metadata", () => {
    const metadata = Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, Test);

    expect(metadata).toEqual([{ index: 0, param: HASURA_SDK_OPTIONS_INJECT }]);
  });
});
