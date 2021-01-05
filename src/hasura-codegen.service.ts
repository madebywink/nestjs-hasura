import { generate } from "@graphql-codegen/cli";
import { Injectable } from "@nestjs/common";
import {
  HasuraInstanceOptions,
  NamedHasuraInstanceOptions,
} from "./hasura.module-options";
import { HasuraService } from "./hasura.service";

@Injectable()
export class HasuraCodegenService {
  constructor(
    private readonly hasuraInstanceOptions:
      | HasuraInstanceOptions
      | NamedHasuraInstanceOptions
  ) {}

  async graphqlCodegen(): Promise<void> {
    await generate({
      schema: {
        [HasuraService.hasuraGraphqlUrl(this.hasuraInstanceOptions)]: {
          headers: {
            [HasuraService.hasuraAdminSecretHeader(
              this.hasuraInstanceOptions
            )]: this.hasuraInstanceOptions.adminSecret,
          },
        },
      },
      documents: this.buildDocumentsGlob(),
      overwrite: true,
      generates: {
        [this.generatedFile()]: {
          plugins: [
            "typescript",
            "typescript-operations",
            "typescript-graphql-request",
          ],
        },
      },
    });
  }

  generatedFile(): string {
    let path = `src/${
      this.hasuraInstanceOptions.sdkOptions?.codegen?.outputDir ??
      HasuraCodegenService.DEFAULT_OUTPUT_ROOT
    }`;
    if ("name" in this.hasuraInstanceOptions) {
      path = `${path}/${this.hasuraInstanceOptions.name}`;
    }

    return `${path}/graphql.ts`;
  }

  buildDocumentsGlob(): string {
    let base = "src/**/";
    if ("name" in this.hasuraInstanceOptions) {
      return base + `*.${this.hasuraInstanceOptions.name}.graphql`;
    }

    return base + "*.graphql";
  }

  static DEFAULT_OUTPUT_ROOT = "hasura-codegen";
}
