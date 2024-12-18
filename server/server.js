import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { createClient } from "redis";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import { app as firebase } from "./config/firebaseAuth.js";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379/";

const redisClient = createClient({ url: REDIS_URL });
await redisClient.connect(); 
await redisClient.flushDb();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async() => {
    return {redisClient, firebase};
  }
});

console.log(`🚀  Server ready at: ${url}`);
