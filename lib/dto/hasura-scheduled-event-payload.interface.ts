export function isHasuraScheduledEventTriggerPayload<T>(
  v: any
): v is HasuraScheduledEventPayload<T> {
  return "event" in v && "scheduled_time" in v && "payload" in v;
}
export interface HasuraScheduledEventPayload<T = Record<string, unknown>> {
  readonly id: string;

  readonly created_at: Date;

  readonly name: string;

  readonly payload: T;

  readonly scheduled_time: Date;
}
