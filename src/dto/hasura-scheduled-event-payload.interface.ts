export interface HasuraScheduledEventPayload<T = Record<string, unknown>> {
  readonly id: string;

  readonly created_at: Date;

  readonly name: string;

  readonly payload: T;

  readonly scheduled_time: Date;
}
