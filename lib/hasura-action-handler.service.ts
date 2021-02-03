import { Injectable } from "@nestjs/common";
import { HasuraActionPayload } from "./dto/hasura-action-payload.interface";

@Injectable()
export class HasuraActionHandlerService {
  /**
   * Overridden by containing module
   * @param action
   */
  async handleAction<T>(action: HasuraActionPayload<T>) {
    return;
  }
}
