import { Injectable } from "@nestjs/common";
import { HasuraActionPayload } from "./dto/hasura-action-payload.interface";

@Injectable()
export class HasuraActionHandlerService {
  /**
   * Overridden by containing module
   * @param evt
   */
  public handleAction<T>(evt: HasuraActionPayload<T>) {
    return;
  }
}
