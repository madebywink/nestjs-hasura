export interface HasuraEventWebhookResponseHeaders {
  // duration in seconds after which Hasura will retry a failed webhook (non-2xx status)
  "Retry-After"?: number;
}
