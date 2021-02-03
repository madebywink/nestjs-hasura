import { HasuraSession } from "../interfaces/hasura-session.interface";

export function isHasuraActionPayload<T>(v: any): v is HasuraActionPayload<T> {
  return "action" in v && "input" in v;
}
export interface HasuraActionPayload<T> {
  readonly action: {
    name: string;
  };

  readonly input: T;

  readonly session_variables: (Record<string, string> & HasuraSession) | null;
}
