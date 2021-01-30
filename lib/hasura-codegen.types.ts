import { generate } from "@graphql-codegen/cli";

type GraphQLCodegenParameters = Parameters<typeof generate>;

export type GraphQLCodegenInput = GraphQLCodegenParameters[0];
