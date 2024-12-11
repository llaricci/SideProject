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
      //TODO: Input validation
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
    getCommentById: async (_, args) => {
      try {
        const comments = await Comments();
        const comment = await comments.findOne({ _id: new ObjectId(args._id) });
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
        const projectsCollection = await Projects();
        if (
          !parentValue.favoriteProjects ||
          parentValue.favoriteProjects.length === 0
        ) {
          return [];
        }
        const usersFavoriteProjects = await projectsCollection
          .find({
            _id: {
              $in: parentValue.favoriteProjects.map((id) => new ObjectId(id)),
            },
          })
          .toArray();
        return usersFavoriteProjects;
      } catch (e) {
        console.error(e);
        throw new GraphQLError(`Failed to fetch favorite projects`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
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
          projects: [],
          favoriteProjects: [],
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
        await client.del(`users`, "$");
        await client.json.set(`user_${newUser._id}`, "$", newUser);
        return newUser;
      } catch (e) {}
    },
    addProject: async (_, args, contextValue) => {
      try {
        args.name = validation.checkString(args.name, "name");

        //TODO: Input validation

        const projects = await Projects();
        const users = await Users();
        const creator = await users.findOne({
          _id: new ObjectId(args.creatorId),
        });
        if (!creator) {
          throw new GraphQLError(`User not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const newProject = {
          _id: new ObjectId(),
          name: args.name,
          technologies: args.technologies,
          description: args.description,
          creatorId: new ObjectId(creator._id),
          comments: [],
          favoritedBy: [],
          numOfFavorites: 0,
        };
        let insertedProject = await projects.insertOne(newProject);
        let updatedUser = await users.updateOne(
          { _id: new ObjectId(args.creatorId) },
          { $push: { projects: newProject._id } }
        );
        if (!updatedUser) {
          throw new GraphQLError(`Could not add project to user`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        if (!insertedProject) {
          throw new GraphQLError(`Could not add project`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        //Flush and add to cache
        const client = contextValue.redisClient;
        await client.flushDb();
        await client.json.set(`project_${newProject._id}`, "$", newProject);
        return newProject;
      } catch (e) {
        console.log(e);
      }
    },
    addComment: async (_, args, contextValue) => {
      try {
        //TODO: Input validation

        const comments = await Comments();
        //Check if user exists
        const users = await Users();
        const user = await users.findOne({ _id: new ObjectId(args.userId) });
        if (!user) {
          throw new GraphQLError(`User not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        //Check if project exists
        const projects = await Projects();
        const project = await projects.findOne({
          _id: new ObjectId(args.projectId),
        });
        if (!project) {
          throw new GraphQLError(`Project not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }

        const newComment = {
          _id: new ObjectId(),
          userId: new ObjectId(args.userId),
          comment: args.comment,
          projectId: new ObjectId(args.projectId),
        };
        let insertedComment = await comments.insertOne(newComment);
        let updatedProject = await projects.updateOne(
          { _id: new ObjectId(args.projectId) },
          { $push: { comments: newComment._id } }
        );
        if (!insertedComment) {
          throw new GraphQLError(`Could not add project`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        if (!updatedProject) {
          throw new GraphQLError(`Could not add comment to project`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        //Flush and add to cache
        const client = contextValue.redisClient;
        await client.flushDb();
        await client.json.set(`comment_${newComment._id}`, "$", newComment);
        return newComment;
      } catch (e) {}
    },

    addFavoritedProject: async (_, args, contextValue) => {
      try {
        const users = await Users();
        const projects = await Projects();
        const user = await users.findOne({ _id: new ObjectId(args.userId) });
        if (!user) {
          throw new GraphQLError(`User not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const project = await projects.findOne({
          _id: new ObjectId(args.projectId),
        });
        if (!project) {
          throw new GraphQLError(`Project not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        //Check if project is already favorited

        if (
          user.favoriteProjects &&
          user.favoriteProjects.includes(args.projectId)
        ) {
          throw new GraphQLError(`Project already favorited`, {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        //check that project is not users own project
        if (project.creatorId.toString() === user._id.toString()) {
          throw new GraphQLError(`Cannot favorite own project`, {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        //Add project to user's favorites
        let updatedUser = await users.updateOne(
          { _id: new ObjectId(args.userId) },
          { $push: { favoriteProjects: new ObjectId(args.projectId) } }
        );
        if (!updatedUser) {
          throw new GraphQLError(`Could not add project to favorites`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        //Add user to project's favoritedBy
        let updatedProject = await projects.updateOne(
          { _id: new ObjectId(args.projectId) },
          { $push: { favoritedBy: new ObjectId(args.userId) } }
        );
        if (!updatedProject) {
          throw new GraphQLError(
            `Could not add user to project's favoritedBy`,
            {
              extensions: { code: "NOT_FOUND" },
            }
          );
        }
        // TODO : HANDLE CACHE
        return project;
      } catch (e) {
        console.error(e);
        throw new GraphQLError(`Failed to add project to favorites`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    editProject: async (_, args, contextValue) => {
      const projects = await Projects();
      const project = await projects.findOne({ _id: new ObjectId(args._id) });
      if (!project) {
        throw new GraphQLError(`Project not found`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if (args.name) {
        //Project Name between 2 - 50 characters (Not only special characters / only numbers)
        if (
          args.name.trim() === "" ||
          !/^(?![\s\d\W]*$)(?![\s\W]*$)[\w\W]{2,50}$/.test(args.name)
        ) {
          throw new GraphQLError(
            `Project Name must be between 2 - 50 characters (Not only special characters / only numbers)`,
            {
              extensions: { code: "BAD_USER_INPUT" },
            }
          );
        }
        args.name = args.name.trim();
      }
      if (args.technologies) {
        //Technologies must be an array of strings
        if (
          !Array.isArray(args.technologies) ||
          args.technologies.length === 0
        ) {
          throw new GraphQLError(`Technologies must be an array of strings`, {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        args.technologies = args.technologies.map((tech) => tech.trim());
      }
      if (args.description) {
        //Description must be a string
        if (
          args.description.trim() === "" ||
          !/^(?![\s\d\W]*$)(?![\s\W]*$)[\w\W]{1,200}$/.test(args.description)
        ) {
          throw new GraphQLError(
            `Description must be between 1 - 200 characters (Not only special characters / only numbers)`,
            {
              extensions: { code: "BAD_USER_INPUT" },
            }
          );
        }
        args.description = args.description.trim();
      }
      const newProject = {
        _id: new ObjectId(args._id),
        name: args.name || project.name,
        technologies: args.technologies || project.technologies,
        description: args.description || project.description,
        creatorId: new ObjectId(project.creatorId),
        comments: project.comments,
        favoritedBy: project.favoritedBy,
        numOfFavorites: project.numOfFavorites,
      };

      const updatedProject = await projects.updateOne(
        { _id: new ObjectId(args._id) },
        { $set: newProject }
      );
      if (!updatedProject) {
        throw new GraphQLError(`Could not update project`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      //Flush and add to cache
      const client = contextValue.redisClient;
      await client.flushDb();
      await client.json.set(`project_${args._id}`, "$", args);
      return newProject;
    },

    editUser: async (_, args, contextValue) => {
      try {
      } catch (e) {}
    },

    deleteUser: async (_, args, contextValue) => {
      try {
      } catch (e) {}
    },

    deleteProject: async (_, args, contextValue) => {
      try {
        const projects = await Projects();
        const projectToDelete = await projects.findOne({
          _id: new ObjectId(args._id),
        });
        if (!projectToDelete) {
          throw new GraphQLError(`Project not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const deletedProject = await projects.deleteOne({
          _id: new ObjectId(args._id),
        });
        //remove project from user's projects list
        const users = await Users();
        const user = await users.findOne({
          _id: new ObjectId(projectToDelete.creatorId),
        });
        if (!user) {
          throw new GraphQLError(`User not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const updatedUser = await users.updateOne(
          { _id: new ObjectId(user._id) },
          { $pull: { projects: new ObjectId(projectToDelete._id) } }
        );
        if (!updatedUser) {
          throw new GraphQLError(`Could not remove project from user`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        //remove project from favorites list of users who favorited the project
        const usersWhoFavorited = await users
          .find({
            favoriteProjects: { $in: [new ObjectId(projectToDelete._id)] },
          })
          .toArray();
        for (let user of usersWhoFavorited) {
          const updatedUser = await users.updateOne(
            { _id: new ObjectId(user._id) },
            { $pull: { favoriteProjects: new ObjectId(projectToDelete._id) } }
          );
          if (!updatedUser) {
            throw new GraphQLError(`Could not remove project from user`, {
              extensions: { code: "NOT_FOUND" },
            });
          }
        }
        //remove comments that have the project id
        const comments = await Comments();
        const deletedComments = await comments.deleteMany({
          projectId: new ObjectId(projectToDelete._id),
        });
        if (!deletedComments) {
          throw new GraphQLError(`Could not delete comments`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const client = contextValue.redisClient;
        await client.flushDb();
        return projectToDelete;
      } catch (e) {}
    },

    deleteComment: async (_, args, contextValue) => {
      try {
      } catch (e) {}
    },

    removeFavoritedProject: async (_, args, contextValue) => {
      try {
      } catch (e) {}
    },
  },
};
