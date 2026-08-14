import "reflect-metadata";
import cors from "cors";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { expressMiddleware } from "@as-integrations/express5";
import { buildContext, type GraphqlContext } from "./graphql/context";
import { UserResolver } from "./resolvers/user.resolver";
import { AuthResolver } from "./resolvers/auth.resolver";
import { CategoryResolver } from "./resolvers/category.resolver";

async function main() {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );

  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver, CategoryResolver],
    validate: false,
    emitSchemaFile: "./schema.graphql",
  });

  const server = new ApolloServer<GraphqlContext>({
    schema,
  });

  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: buildContext,
    }),
  );

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at port 4000`);
  });
}

main();
