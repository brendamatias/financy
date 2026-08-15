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
import { TransactionResolver } from "./resolvers/transaction.resolver";
import { DashboardResolver } from "./resolvers/dashboard.resolver";

const port = Number(process.env.PORT ?? 4000);

const corsOrigin = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

async function main() {
  const app = express();

  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    }),
  );

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  const schema = await buildSchema({
    resolvers: [
      AuthResolver,
      UserResolver,
      CategoryResolver,
      TransactionResolver,
      DashboardResolver,
    ],
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

  app.listen({ port, host: "0.0.0.0" }, () => {
    console.log(`🚀 Server ready at port ${port}`);
  });
}

main();
