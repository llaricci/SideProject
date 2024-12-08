import { GraphQLError } from "graphql";
import { Project, User, Comment } from "../config/mongoCollections.js";

export const resolvers = {
  Query: {
    project: async (_, args) => {
      const project = await Project.findOne({ _id: args.id });
      if (!project)
        throw new GraphQLError("Project not found", {
          extensions: { code: "NOT_FOUND" },
        });
      return project;
    },
  },
};
