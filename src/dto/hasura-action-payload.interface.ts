import { HasuraSession } from "../interfaces/hasura-session.interface";

export interface HasuraActionPayload<T> {
  readonly action: {
    name: string;
  };

  readonly input: T;

  readonly session_variables: (Record<string, string> & HasuraSession) | null;
}
