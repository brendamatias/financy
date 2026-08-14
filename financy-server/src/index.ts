import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `
  type Query {
    helloWorld: String
  }
`;

async function main() {
  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query: {
        helloWorld: () => "Hello world!",
      },
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at ${url}`);
}

main();
