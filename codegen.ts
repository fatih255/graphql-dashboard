import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "src/server/typeDefs.ts",
  documents: ["src/client/**/*.ts"],
  generates: {
    // Typed documents and operation types for the client.
    "src/gql/": {
      preset: "client",
      presetConfig: { fragmentMasking: false },
      config: {
        documentMode: "string",
        enumsAsTypes: true,
        useTypeImports: true,
      },
    },
    // Resolver signatures for the server.
    "src/server/generated/resolvers-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../context#GraphQLContext",
        enumsAsTypes: true,
        useTypeImports: true,
        resolversNonOptionalTypename: true,
      },
    },
  },
};

export default config;
