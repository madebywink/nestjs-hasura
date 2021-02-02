import { ExternalContextCreator } from "@nestjs/core/helpers/external-context-creator";

export interface HasuraHandlerDefinitions {
  [key: string]: ReturnType<ExternalContextCreator["create"]>[];
}
