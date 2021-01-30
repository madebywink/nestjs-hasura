import * as fs from "fs";
import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql, GraphQLSchema } from "graphql";
import { IntrospectionResultData } from "./type";
import * as path from "path";

/**
 * Builds a graphql schema from dummy schema definition for testing
 */
export async function buildMockedGraphQLSchema(): Promise<GraphQLSchema> {
  const schemaString = fs.readFileSync(
    path.resolve("lib", "__fixtures__", "demo-schema.graphql"),
    "utf-8"
  );
  const schema = makeExecutableSchema({ typeDefs: schemaString });
  const schemaWithMocks = addMocksToSchema({ schema });

  return schemaWithMocks;
}

/**
 * Should match introspection query from graphql-gcode-generator
 */
export const introspectionQuery = /* GraphQL */ `
  query IntrospectionQuery {
    __schema {
      queryType {
        name
      }
      mutationType {
        name
      }
      subscriptionType {
        name
      }
      types {
        ...FullType
      }
      directives {
        name
        description
        locations
        args {
          ...InputValue
        }
      }
    }
  }

  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }

  fragment InputValue on __InputValue {
    name
    description
    type {
      ...TypeRef
    }
    defaultValue
  }

  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Mock the introspection result expected in the codegen process
 */
export async function mockIntrospectionQuery(): Promise<IntrospectionResultData> {
  const server = await buildMockedGraphQLSchema();
  const result = (await graphql(server, introspectionQuery)) as {
    data: IntrospectionResultData;
  };

  if (!("__schema" in result.data)) {
    console.log("Mock result:", result);
    throw new Error("Expected a properly mocked introspection.");
  }

  return result.data;
}
