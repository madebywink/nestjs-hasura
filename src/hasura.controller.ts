import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { HasuraEventTriggerPayload } from "./dto/hasura-event-trigger-payload.interface";
import { HasuraScheduledEventPayload } from "./dto/hasura-scheduled-event-payload.interface";
import { HasuraEventHandlerHeaderGuard } from "./hasura-event-handler-header.guard";
import { HasuraEventHandlerService } from "./hasura-event-handler.service";
import { isHasuraScheduledEvent, OpName } from "./hasura.types";

@Controller("/hasura")
export class HasuraController {
  constructor(
    private readonly eventHandlerService: HasuraEventHandlerService
  ) {}

  @UseGuards(HasuraEventHandlerHeaderGuard)
  @Post("/events")
  @HttpCode(202)
  async handleEvent<T, U extends OpName>(
    @Body() evt: HasuraEventTriggerPayload<T, U> | HasuraScheduledEventPayload
  ) {
    let result: unknown;
    if (isHasuraScheduledEvent(evt)) {
      result = await this.eventHandlerService.handleScheduledEvent(evt);
    } else {
      result = await this.eventHandlerService.handleEvent(evt);
    }

    if (result === undefined) {
      return { success: true };
    }

    return result;
  }
}
