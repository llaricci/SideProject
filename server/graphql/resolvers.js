import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import { Projects, Users, Comments } from "../config/mongoCollections.js";

export const resolvers = {
  Query: {
    users: async () => {
      const users = await Users();
      const allUsers = await users.find({}).toArray();
      if (!allUsers) {
        throw new GraphQLError("Internal Server Error", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return allUsers;
    },
    getUserById: async (_, args) => {
      const users = await Users();
      const user = await users.findOne({ _id: new ObjectId(args._id) });
      if (!user)
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      return user;
    },
    projects: async () => {
      const projects = await Projects();
      const allProjects = await projects.find({}).toArray();
      if (!allProjects) {
        throw new GraphQLError("Internal Server Error", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return allProjects;
    },
    getProjectById: async (_, args) => {
      const projects = await Projects();
      const project = await projects.findOne({ _id: new ObjectId(args._id) });
      if (!project)
        throw new GraphQLError("Project not found", {
          extensions: { code: "NOT_FOUND" },
        });
      return project;
    },
    comments: async () => {
      const comments = await Comments();
      const allComments = await comments.find({}).toArray();
      if (!allComments) {
        throw new GraphQLError("Internal Server Error", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return allComments;
    },
    getCommentsById: async (_, args) => {
      const comments = await Comments();
      const comment = await comments.findOne({ _id: new ObjectId(args.id) });
      if (!comment)
        throw new GraphQLError("Comment not found", {
          extensions: { code: "NOT_FOUND" },
        });
      return comment;
    },
    getProjectsbyTechnology: async (_, args) => {
      const projects = await Projects();
      const projectsByTechnology = await projects
        .find({ technologies: args.technology })
        .toArray();
      return projectsByTechnology;
    },
    searchUserByName: async (_, args) => {
      if (args.searchTerm.trim() === "") {
        throw new GraphQLError(`Search Term cannot be empty string or spaces`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const searchTerm = args.searchTerm.toLowerCase().trim();
      const users = await Users();
      const pattern = new RegExp(searchTerm, "i");
      const searchResults = await users
        .find({ name: { $regex: pattern } })
        .toArray();
      return searchResults;
    },
    searchProjectByName: async (_, args) => {
      if (args.searchTerm.trim() === "") {
        throw new GraphQLError(`Search Term cannot be empty string or spaces`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const searchTerm = args.searchTerm.toLowerCase().trim();
      const projects = await Projects();
      const pattern = new RegExp(searchTerm, "i");
      const searchResults = await projects
        .find({ name: { $regex: pattern } })
        .toArray();
      return searchResults;
    },
  },
  Project: {
    creator: async (parentValue) => {
      console.log(parentValue);
      const users = await Users();
      const creator = await users.find({
        projects: { $in: [new ObjectId(parentValue._id)] },
      });
      return creator;
    },
    favoritedBy: async (parentValue) => {
      const users = await Users();
      const favoritedby = await users
        .find({ favoriteProjects: { $in: [new ObjectId(parentValue._id)] } })
        .toArray();
      return favoritedby;
    },
    comments: async (parentValue) => {
      const comments = await Comments();
      const projectComments = await comments
        .find({ project: new ObjectId(parentValue._id) })
        .toArray();
      return projectComments;
    },
    numOfFavorites: async (parentValue) => {
      const users = await Users();
      const numOfFavorites = await users
        .count({ favoriteProjects: { $in: [new ObjectId(parentValue._id)] } })
        .count();
      return numOfFavorites;
    },
  },
  User: {
    projects: async (parentValue) => {
      const projects = await Projects();
      const usersProjects = await projects
        .find({ creator: new ObjectId(parentValue._id) })
        .toArray();
      return usersProjects;
    },
    favoriteProjects: async (parentValue) => {
      const projects = await Projects();
      const usersFavoriteProjects = await projects
        .find({ favoritedBy: { $in: [new ObjectId(parentValue._id)] } })
        .toArray();
    },
  },
  Comment: {
    user: async (parentValue) => {
      const users = await Users();
      const commenter = await users.findOne({
        _id: new ObjectId(parentValue.user),
      });
      return commenter;
    },
    project: async (parentValue) => {
      const projects = await Projects();
      const project = await projects.findOne({
        id_: new ObjectId(parentValue.project),
      });
      return project;
    },
  },
  Mutation: {},
};
