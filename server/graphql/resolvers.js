import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import { Projects, Users, Comments } from "../config/mongoCollections.js";
import validation from "./validation.js";

export const resolvers = {
  Query: {
    users: async (_, __, contextValue) => {
      try {
        const client = contextValue.redisClient;
        const usersCache = await client.json.get(`users`, "$");
        // If users cache is empty then fetch from db
        if (!usersCache || usersCache.length === 0) {
          const allUsers = await Users();
          const users = await allUsers.find({}).toArray();
          console.log(users);
          if (!users) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
          await client.json.set(`users`, "$", users);
          await client.expire(`users`, 3600);
          return users;
        }
        return usersCache;
      } catch (e) {
        throw new GraphQLError(`Error fetching users: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    getUserById: async (_, args) => {
      try {
        const users = await Users();
        const user = await users.findOne({ _id: new ObjectId(args._id) });
        if (!user)
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        return user;
      } catch (e) {}
    },
    projects: async (_, __, contextValue) => {
      try {
        const client = contextValue.redisClient;
        const projectsCache = await client.json.get(`projects`, "$");
        // If projects cache is empty then fetch from db
        if (!projectsCache || projectsCache.length === 0) {
          const allProjects = await Projects();
          const projects = await allProjects.find({}).toArray();
          console.log(projects);
          if (!projects) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
          await client.json.set(`projects`, "$", projects);
          await client.expire(`projects`, 3600);
          return projects;
        }
        return projectsCache;
      } catch (e) {
        throw new GraphQLError(`Error fetching projects: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    getProjectById: async (_, args) => {
      try {
        const projects = await Projects();
        const project = await projects.findOne({ _id: new ObjectId(args._id) });
        if (!project)
          throw new GraphQLError("Project not found", {
            extensions: { code: "NOT_FOUND" },
          });
        return project;
      } catch (e) {}
    },
    comments: async (_, __, contextValue) => {
      try {
        const client = contextValue.redisClient;
        const commentsCache = await client.json.get(`comments`, "$");
        // If projects cache is empty then fetch from db
        if (!commentsCache || commentsCache.length === 0) {
          const allComments = await Comments();
          const comments = await allComments.find({}).toArray();
          console.log(comments);
          if (!comments) {
            throw new GraphQLError(`Internal Server Error`, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
          await client.json.set(`comments`, "$", comments);
          await client.expire(`comments`, 3600);
          return comments;
        }
        return commentsCache;
      } catch (e) {
        throw new GraphQLError(`Error fetching comments: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    getCommentsById: async (_, args) => {
      try {
        const comments = await Comments();
        const comment = await comments.findOne({ _id: new ObjectId(args.id) });
        if (!comment)
          throw new GraphQLError("Comment not found", {
            extensions: { code: "NOT_FOUND" },
          });
        return comment;
      } catch (e) {}
    },
    getProjectsbyTechnology: async (_, args) => {
      try {
        const projects = await Projects();
        const projectsByTechnology = await projects
          .find({ technologies: args.technology })
          .toArray();
        return projectsByTechnology;
      } catch (e) {}
    },
    searchUserByName: async (_, args) => {
      try {
        if (args.searchTerm.trim() === "") {
          throw new GraphQLError(
            `Search Term cannot be empty string or spaces`,
            {
              extensions: { code: "BAD_USER_INPUT" },
            }
          );
        }
        const searchTerm = args.searchTerm.toLowerCase().trim();
        const users = await Users();
        const pattern = new RegExp(searchTerm, "i");
        const searchResults = await users
          .find({ name: { $regex: pattern } })
          .toArray();
        return searchResults;
      } catch (e) {}
    },
    searchProjectByName: async (_, args) => {
      try {
        if (args.searchTerm.trim() === "") {
          throw new GraphQLError(
            `Search Term cannot be empty string or spaces`,
            {
              extensions: { code: "BAD_USER_INPUT" },
            }
          );
        }
        const searchTerm = args.searchTerm.toLowerCase().trim();
        const projects = await Projects();
        const pattern = new RegExp(searchTerm, "i");
        const searchResults = await projects
          .find({ name: { $regex: pattern } })
          .toArray();
        return searchResults;
      } catch (e) {}
    },
  },
  Project: {
    creator: async (parentValue) => {
      try {
        console.log(parentValue);
        const users = await Users();
        const creator = await users.findOne({
          _id: new ObjectId(parentValue.creatorId),
        });
        console.log(creator);
        return creator;
      } catch (e) {}
    },
    favoritedBy: async (parentValue) => {
      try {
        const users = await Users();
        const favoritedby = await users
          .find({ favoriteProjects: { $in: [new ObjectId(parentValue._id)] } })
          .toArray();
        return favoritedby;
      } catch (e) {}
    },
    comments: async (parentValue) => {
      try {
        const comments = await Comments();
        const projectComments = await comments
          .find({ projectId: new ObjectId(parentValue._id) })
          .toArray();
        return projectComments;
      } catch (e) {}
    },
    numOfFavorites: async (parentValue) => {
      try {
        const users = await Users();
        const numOfFavorites = await users
          .count({ favoriteProjects: { $in: [new ObjectId(parentValue._id)] } })
          .count();
        return numOfFavorites;
      } catch (e) {}
    },
  },
  User: {
    projects: async (parentValue) => {
      try {
        const projects = await Projects();
        const usersProjects = await projects
          .find({ creatorId: new ObjectId(parentValue._id) })
          .toArray();
        return usersProjects;
      } catch (e) {}
    },
    favoriteProjects: async (parentValue) => {
      try {
        const projects = await Projects();
        const usersFavoriteProjects = await projects
          .find({ favoritedBy: { $in: [new ObjectId(parentValue._id)] } })
          .toArray();
        return usersFavoriteProjects;
      } catch (e) {}
    },
  },
  Comment: {
    user: async (parentValue) => {
      try {
        const users = await Users();
        const commenter = await users.findOne({
          _id: new ObjectId(parentValue.userId),
        });
        return commenter;
      } catch (e) {}
    },
    project: async (parentValue) => {
      try {
        const projects = await Projects();
        const project = await projects.findOne({
          _id: new ObjectId(parentValue.projectId),
        });
        return project;
      } catch (e) {}
    },
  },
  Mutation: {
    addUser: async (_, args, contextValue) => {
      try {
        args.firstName = validation.checkAlphabet(args.firstName, "firstName");
        if (args.bio !== null && args.bio) {
          args.bio = validation.checkString(args.bio, "bio");
        }

        //TODO: Input validation

        const users = await Users();
        const newUser = {
          _id: new ObjectId(),
          firstName: args.firstName,
          lastName: args.lastName,
          bio: args.bio,
          password: args.password,
          description: args.description,
          favorites: [],
          profLanguages: [],
        };
        let insertedUser = await users.insertOne(newUser);
        if (!insertedUser.acknowledged || !insertedUser.insertedId) {
          throw new GraphQLError(`Could not add User`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        // Add to cache
        const client = contextValue.redisClient;
        await client.del(`authors`, "$");
        await client.json.set(`author_${newUser._id}`, "$", newUser);
        return newUser;
      } catch (e) {}
    },

    addProject: async (_, args, contextValue) => {
      try {
        args.name = validation.checkString(args.name, "name");

        //TODO: Input validation

        const projects = await Projects();
        const newProject = {
          _id: new ObjectId(),
          name: args.name,
          technologies: args.technologies,
          description: args.description,
          creatorId: new ObjectId(args.creatorId),
          comments: [],
          favoritedBy: [],
          numOfFavorites: 0,
        };
        let insertedProject = await projects.insertOne(newProject);
        if (!insertedProject) {
          throw new GraphQLError(`Could not add project`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        //Flush and add to cache
        const client = contextValue.redisClient;
        await client.flushDb();
        await client.json.set(`book_${newProject._id}`, "$", newProject);
        return newProject;
      } catch (e) {
        console.log(e);
      }
    },

    addComment: async (_, args, contextValue) => {
      try {
        //TODO: Input validation

        const comments = await Comments();
        const newComment = {
          _id: new ObjectId(),
          userId: new ObjectId(args.userId),
          comment: args.comment,
          projectId: new ObjectId(args.projectId),
        };
        let insertedComment = await comments.insertOne(newComment);
        if (!insertedComment) {
          throw new GraphQLError(`Could not add project`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        //Flush and add to cache
        const client = contextValue.redisClient;
        await client.flushDb();
        await client.json.set(`book_${newComment._id}`, "$", newComment);
        return newComment;
      } catch (e) {}
    },
  },
};
