import "reflect-metadata";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { expressMiddleware } from "@as-integrations/express5";
import { UserResolver } from "./resolvers/user.resolver";
import { AuthResolver } from "./resolvers/auth.resolver";

async function main() {
  const app = express();

  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver],
    validate: false,
    emitSchemaFile: "./schema.graphql",
  });

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  app.use("/graphql", express.json(), expressMiddleware(server));

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at port 4000`);
  });
}

main();
