import { HasuraSession } from "../interfaces/hasura-session.interface";
import { OpName } from "../hasura.types";

export function isHasuraEventTriggerPayload<T, U extends OpName>(
  v: any
): v is HasuraEventTriggerPayload<T, U> {
  return "event" in v && "trigger" in v && "payload" in v;
}

export interface HasuraEventTriggerPayload<T, O extends OpName> {
  readonly event: {
    session_variables: (Record<string, string> & HasuraSession) | null;
    op: OpName;
    data: {
      old: O extends "INSERT" ? null : O extends "MANUAL" ? null : T;
      new: O extends "DELETE" ? null : T;
    };
  };

  readonly created_at: Date;

  readonly id: string;

  readonly trigger: {
    name: string;
  };

  readonly table: {
    schema: string;
    name: string;
  };
}
