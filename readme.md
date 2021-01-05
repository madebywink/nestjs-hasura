# WIP: NestJS Hasura

A NestJS module for interacting with Hasura GraphQL Engine. Includes:

- HTTP requests with `graphql-request` [graphql-request](https://github.com/prisma-labs/graphql-request)
- Built-in, generated type safety provided by [graphql-code-generator](https://github.com/dotansimha/graphql-code-generator)
  - Either manage Sdk generation on your own, or let the module do the work for you
- Decorators to process events and actions sent by Hasura directly in your services (skipping controllers)
- Practical configuration options with sensible defaults
  - Enforces independent event and action secrets in headers
  - Expects instances to be configured with admin secrets

## Module Options

## Sdk Options

### Codegen

- For single instance configurations all operations are attached to a single Sdk. Default matching pattern is `*.graphql`
- For multi instance configurations, default matching pattern is `*.$INSTANCE_NAME.graphql`, where `$INSTANCE_NAME` is the case-sensitve provided name for the Hasura instance
  - A query `ListA` from `queries.A.graphql`, will then be used as `SdkA.ListA`
  - A query `ListB` from `queries.B.graphql`, will then be used as `SdkB.ListB`

## Upcoming features

- Integration reporting

  - Will check that the events and actions being processed by your decorators exist
  - Will check that action payloads from Hasura match your code

- Health checks
  - Logging or termination on application boot if expected Hasura instances cannot be reached or fail to meet a minimum standard of viability for operation
