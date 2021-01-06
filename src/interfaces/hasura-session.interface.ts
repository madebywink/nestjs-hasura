/**
 * Hasura session data sent in webhooks
 */
export interface HasuraSession {
  "x-hasura-user-id"?: string;
  "x-hasura-role"?: string;
}
