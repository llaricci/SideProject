import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { createClient } from "redis";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import { adminAuth as firebaseAdmin } from "./config/firebaseAdmin.js"; // Import Firebase Admin SDK
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379/";

const startServer = async () => {
  // Initialize Redis client
  const redisClient = createClient({ url: REDIS_URL });

  try {
    console.log("Connecting to Redis...");
    await redisClient.connect();
    console.log("Connected to Redis.");

    // Flush the database (optional, if needed for seeding or cleaning)
    await redisClient.flushDb();
    console.log("Redis database flushed.");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    process.exit(1);
  }

  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start standalone server
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => {
      return { redisClient, firebaseAdmin }; // Provide Redis and Firebase Admin SDK in context
    },
  });

  console.log(`🚀 Server ready at: ${url}`);
};

startServer().catch((error) => {
  console.error("Failed to start the server:", error);
});
