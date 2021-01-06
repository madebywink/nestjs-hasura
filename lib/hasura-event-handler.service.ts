import { Injectable } from "@nestjs/common";
import { HasuraEventTriggerPayload } from "./dto/hasura-event-trigger-payload.interface";
import { HasuraScheduledEventPayload } from "./dto/hasura-scheduled-event-payload.interface";
import { OpName } from "./hasura.types";

@Injectable()
export class HasuraEventHandlerService {
  /**
   * Overridden by containing module
   * @param evt
   */
  public async handleEvent<T, U extends OpName>(
    evt: HasuraEventTriggerPayload<T, U>
  ) {
    return;
  }

  /**
   * Overridden by containing module
   * @param evt
   */
  public async handleScheduledEvent(evt: HasuraScheduledEventPayload) {
    return;
  }
}
