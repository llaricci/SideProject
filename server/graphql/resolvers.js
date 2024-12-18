import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import { Projects, Users, Comments } from "../config/mongoCollections.js";
import validation from "./validation.js";
import validator from "validator";
import bcrypt from "bcrypt";

const saltRounds = 10;

const Technologies = [
  "JavaScript",
  "Python",
  "Java",
  "CSharp",
  "CPlusPlus",
  "Ruby",
  "PHP",
  "TypeScript",
  "Swift",
  "Kotlin",
  "Go",
  "Rust",
  "HTML",
  "CSS",
  "SQL",
  "GraphQL",
  "NodeJS",
  "React",
  "Angular",
  "Vue",
  "NextJS",
  "Svelte",
  "TailwindCSS",
  "Bootstrap",
  "AWS",
  "GoogleCloud",
  "OracleCloud",
  "Docker",
  "Kubernetes",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Firebase",
  "Git",
  "GitHub",
  "Other",
];

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
    getUserByFirebaseUID: async (_, args, contextValue) => {
      try {
        const client = contextValue.redisClient;
        const cacheKey = `user_${args.firebaseUID}`;

        // Validate ObjectId
        validation.checkFirebaseUID(args.firebaseUID);

        // Check if the user is cached
        const cachedUser = await client.json.get(cacheKey, "$");
        if (cachedUser) {
          return cachedUser;
        }
        // If not cached, fetch from the database
        const users = await Users();
        const user = await users.findOne({ firebaseUID: args.firebaseUID });
        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        // Cache the user in Redis
        await client.json.set(cacheKey, "$", user);
        await client.expire(cacheKey, 3600);

        return user;
      } catch (e) {
        if (e instanceof GraphQLError) {
          throw e;
        }
        throw new GraphQLError(`Error fetching user: ${e}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    getUserById: async (_, args, contextValue) => {
      try {
        const client = contextValue.redisClient;
        const cacheKey = `user_${args._id}`;

        // Validate ObjectId
        validation.checkObjectId(args._id);

        // Check if the user is cached
        const cachedUser = await client.json.get(cacheKey, "$");
        if (cachedUser) {
          return cachedUser;
        }
        // If not cached, fetch from the database
        const users = await Users();
        const user = await users.findOne({ _id: new ObjectId(args._id) });
        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        // Cache the user in Redis
        await client.json.set(cacheKey, "$", user);
        await client.expire(cacheKey, 3600);

        return user;
      } catch (e) {
        if (e instanceof GraphQLError) {
          throw e;
        }
        throw new GraphQLError(`Error fetching user: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
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
    getProjectById: async (_, args, contextValue) => {
      try {
        // Validate ObjectId
        validation.checkObjectId(args._id);

        const projects = await Projects();
        const project = await projects.findOne({ _id: new ObjectId(args._id) });
        if (!project)
          throw new GraphQLError("Project not found", {
            extensions: { code: "NOT_FOUND" },
          });
        return project;
      } catch (e) {
        if (e instanceof GraphQLError) {
          throw e;
        }
        throw new GraphQLError(`Error fetching project: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    comments: async (_, __, contextValue) => {
      try {
        const client = contextValue.redisClient;
        const commentsCache = await client.json.get(`comments`, "$");
        // If comments cache is empty then fetch from db
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
    getCommentById: async (_, args, contextValue) => {
      try {
        // Validate ObjectId
        validation.checkObjectId(args._id);

        const client = contextValue.redisClient;
        const cacheKey = `comment_${args._id}`;

        const cachedComment = await client.json.get(cacheKey, "$");
        if (cachedComment) return cachedComment;

        const comments = await Comments();
        const comment = await comments.findOne({ _id: new ObjectId(args._id) });
        if (!comment)
          throw new GraphQLError("Comment not found", {
            extensions: { code: "NOT_FOUND" },
          });

        await client.json.set(cacheKey, "$", comment);
        await client.expire(cacheKey, 3600);

        return comment;
      } catch (e) {
        if (e instanceof GraphQLError) {
          throw e;
        }
        throw new GraphQLError(`Error fetching comment: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    getProjectsByTechnology: async (_, args, contextValue) => {
      try {
        // Validate technology enum
        if (!Technologies.includes(args.technology)) {
          throw new GraphQLError(`Invalid Technology`, {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const client = contextValue.redisClient;
        const cacheKey = `projects_technology_${args.technology}`;

        const cachedProjects = await client.json.get(cacheKey, "$");
        if (cachedProjects) return cachedProjects;

        const projects = await Projects();
        const projectsByTechnology = await projects
          .find({ technologies: args.technology })
          .toArray();

        await client.json.set(cacheKey, "$", projectsByTechnology);
        await client.expire(cacheKey, 3600);

        return projectsByTechnology;
      } catch (e) {
        if (e instanceof GraphQLError) {
          throw e;
        }
        throw new GraphQLError(`Error fetching projects: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    searchUserByName: async (_, args, contextValue) => {
      try {
        const searchTerm = args.searchTerm.trim().toLowerCase();
        // Validate search term
        validation.checkString(searchTerm);

        const client = contextValue.redisClient;
        const cacheKey = `search_user_${searchTerm}`;

        const cachedResults = await client.json.get(cacheKey, "$");
        if (cachedResults) return cachedResults;

        const terms = searchTerm.split(" ").filter((term) => term.length > 0); // Split by spaces and remove empty parts

        const users = await Users();

        let query;
        if (terms.length === 1) {
          // If there's only one term, search in either firstName or lastName
          query = {
            $or: [
              { firstName: { $regex: new RegExp(terms[0], "i") } },
              { lastName: { $regex: new RegExp(terms[0], "i") } },
            ],
          };
        } else {
          // If there are multiple terms, use the first for firstName and the second for lastName
          query = {
            $and: [
              { firstName: { $regex: new RegExp(terms[0], "i") } },
              { lastName: { $regex: new RegExp(terms[1], "i") } },
            ],
          };
        }
        const searchResults = await users.find(query).toArray();

        await client.json.set(cacheKey, "$", searchResults);
        await client.expire(cacheKey, 3600);

        return searchResults;
      } catch (e) {
        throw new GraphQLError(`Error searching users: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    searchProjectByName: async (_, args, contextValue) => {
      try {
        const searchTerm = args.searchTerm.trim().toLowerCase();
        // Validate search term
        validation.checkString(searchTerm);

        const client = contextValue.redisClient;
        const cacheKey = `search_project_${searchTerm}`;

        const cachedResults = await client.json.get(cacheKey, "$");
        if (cachedResults) return cachedResults;

        const projects = await Projects();
        const pattern = new RegExp(searchTerm, "i");
        const searchResults = await projects
          .find({ name: { $regex: pattern } })
          .toArray();

        await client.json.set(cacheKey, "$", searchResults);
        await client.expire(cacheKey, 3600);

        return searchResults;
      } catch (e) {
        throw new GraphQLError(`Error searching projects: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
  Project: {
    creator: async (parentValue) => {
      try {
        const users = await Users();
        const creator = await users.findOne({
          _id: new ObjectId(parentValue.creatorId),
        });
        return creator;
      } catch (e) {
        throw new GraphQLError(`Error fetching creator: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    favoritedBy: async (parentValue) => {
      try {
        const users = await Users();
        const favoritedby = await users
          .find({ favoriteProjects: { $in: [new ObjectId(parentValue._id)] } })
          .toArray();
        return favoritedby;
      } catch (e) {
        throw new GraphQLError(`Error fetching favoritedBy: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    comments: async (parentValue) => {
      try {
        const comments = await Comments();
        const projectComments = await comments
          .find({ projectId: new ObjectId(parentValue._id) })
          .toArray();
        return projectComments;
      } catch (e) {
        throw new GraphQLError(`Error fetching comments: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    numOfFavorites: async (parentValue) => {
      try {
        const users = await Users();
        const numOfFavorites = await users.countDocuments({
          favoriteProjects: { $in: [new ObjectId(parentValue._id)] },
        });
        return numOfFavorites;
      } catch (e) {
        throw new GraphQLError(`Error counting favorites: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
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
      } catch (e) {
        throw new GraphQLError(`Error fetching user's projects: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
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
        throw new GraphQLError(
          `Error fetching favorite projects: ${e.message}`,
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          }
        );
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
      } catch (e) {
        throw new GraphQLError(`Error fetching commenter: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    project: async (parentValue) => {
      try {
        const projects = await Projects();
        const project = await projects.findOne({
          _id: new ObjectId(parentValue.projectId),
        });
        return project;
      } catch (e) {
        throw new GraphQLError(`Error fetching project: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
  Mutation: {
    addUser: async (_, args, contextValue) => {
      try {
        const users = await Users();
        const client = contextValue.redisClient;

        // Validate inputs
        args.firstName = validation.checkAlphabet(args.firstName);
        args.lastName = validation.checkAlphabet(args.lastName);

        if (validator.isEmail(args.email)) {
          args.email = validator.normalizeEmail(args.email);
          const emailExists = await users.findOne({ email: args.email });
          if (emailExists) {
            throw new GraphQLError(`Email already in use`, {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }
        } else {
          throw new GraphQLError(`Invalid email`, {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        if (args.bio !== null && args.bio) {
          args.bio = validation.checkString(args.bio);
        }

        args.password = validation.checkPassword(args.password);

        // Validate profLanguages
        args.profLanguages.forEach((element) => {
          if (!Technologies.includes(element)) {
            throw new GraphQLError(`Invalid Technology`, {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }
        });

        const salt = bcrypt.genSaltSync(saltRounds);
        const password = bcrypt.hashSync(args.password, salt);

        const newUser = {
          _id: new ObjectId(),
          firebaseUID: args.firebaseUID,
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          bio: args.bio,
          password: password,
          projects: [],
          favoriteProjects: [],
          profLanguages: args.profLanguages,
          token: args.token
        };
        let insertedUser = await users.insertOne(newUser);
        if (!insertedUser.acknowledged || !insertedUser.insertedId) {
          throw new GraphQLError(`Could not add User`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        // Add to cache
        await client.del(`users`, "$");
        await client.json.set(`user_${newUser._id}`, "$", newUser);
        return newUser;
      } catch (e) {
        if (e instanceof GraphQLError) {
          throw e;
        }
        throw new GraphQLError(`Error adding user: ${e}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    addProject: async (_, args, contextValue) => {
      try {
        // Validate inputs
        args.name = validation.checkString(args.name);
        args.description = validation.checkString(args.description);

        // Validate technologies
        args.technologies.forEach((tech) => {
          if (!Technologies.includes(tech)) {
            throw new GraphQLError(`Invalid Technology: ${tech}`, {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }
        });

        // Validate creatorId
        validation.checkObjectId(args.creatorId);

        const projects = await Projects();
        const users = await Users();
        const client = contextValue.redisClient;

        const creator = await users.findOne({
          _id: new ObjectId(args.creatorId),
        });
        if (!creator) {
          throw new GraphQLError(`User not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        if (args.images) {
          args.images.forEach((image) => {
            if (typeof image !== "string" || !image.startsWith("data:image/")) {
              throw new GraphQLError(`Invalid image format`, {
                extensions: { code: "BAD_USER_INPUT" },
              });
            }
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
          images: args.images || [],
        };
        let insertedProject = await projects.insertOne(newProject);
        if (!insertedProject.acknowledged || !insertedProject.insertedId) {
          throw new GraphQLError(`Could not add project`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        let updatedUser = await users.updateOne(
          { _id: new ObjectId(args.creatorId) },
          { $push: { projects: newProject._id } }
        );
        if (!updatedUser.modifiedCount) {
          throw new GraphQLError(`Could not add project to user`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        // Flush and add to cache
        await client.del(`projects`, "$");
        await client.json.set(`project_${newProject._id}`, "$", newProject);
        return newProject;
      } catch (e) {
        if (e instanceof GraphQLError) {
          throw e;
        }
        throw new GraphQLError(`Error adding project: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    addComment: async (_, args, contextValue) => {
      try {
        // Validate inputs
        validation.checkObjectId(args.userId);
        validation.checkObjectId(args.projectId);
        args.comment = validation.checkString(args.comment);

        const comments = await Comments();
        const users = await Users();
        const projects = await Projects();
        const client = contextValue.redisClient;

        // Check if user exists
        const user = await users.findOne({ _id: new ObjectId(args.userId) });
        if (!user) {
          throw new GraphQLError(`User not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        // Check if project exists
        const project = await projects.findOne({
          _id: new ObjectId(args.projectId),
        });
        if (!project) {
          throw new GraphQLError(`Project not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        // Check that project is not user's own project
        if (project.creatorId.toString() === user._id.toString()) {
          throw new GraphQLError(`Cannot comment on own project`, {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        const newComment = {
          _id: new ObjectId(),
          userId: new ObjectId(args.userId),
          comment: args.comment,
          projectId: new ObjectId(args.projectId),
        };
        let insertedComment = await comments.insertOne(newComment);
        if (!insertedComment.acknowledged || !insertedComment.insertedId) {
          throw new GraphQLError(`Could not add comment`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        let updatedProject = await projects.updateOne(
          { _id: new ObjectId(args.projectId) },
          { $push: { comments: newComment._id } }
        );
        if (!updatedProject.modifiedCount) {
          throw new GraphQLError(`Could not add comment to project`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        // Flush and add to cache
        await client.del(`comments`, "$");
        await client.json.set(`comment_${newComment._id}`, "$", newComment);
        return newComment;
      } catch (e) {
        if (e instanceof GraphQLError) {
          throw e;
        }
        throw new GraphQLError(`Error adding comment: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    addFavoritedProject: async (_, args, contextValue) => {
      try {
        // Validate inputs
        validation.checkObjectId(args.userId);
        validation.checkObjectId(args.projectId);

        const users = await Users();
        const projects = await Projects();
        const client = contextValue.redisClient;

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
        if (project.creatorId.toString() === user._id.toString()) {
          throw new GraphQLError(`Cannot favorite own project`, {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        const favoriteProjects = user.favoriteProjects || [];
        if (
          favoriteProjects.some((proj) => proj.toString() === args.projectId)
        ) {
          throw new GraphQLError(`Project already favorited`, {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        await users.updateOne(
          { _id: new ObjectId(args.userId) },
          { $push: { favoriteProjects: new ObjectId(args.projectId) } }
        );

        await projects.updateOne(
          { _id: new ObjectId(args.projectId) },
          {
            $push: { favoritedBy: new ObjectId(args.userId) },
            $inc: { numOfFavorites: 1 },
          }
        );

        // Update Redis cache
        const updatedUser = await users.findOne({
          _id: new ObjectId(args.userId),
        });
        const updatedProject = await projects.findOne({
          _id: new ObjectId(args.projectId),
        });

        await client.del(`user_${args.userId}`, "$");
        await client.del(`project_${args.projectId}`, "$");
        await client.json.set(`user_${args.userId}`, "$", updatedUser);
        await client.json.set(`project_${args.projectId}`, "$", updatedProject);

        return updatedProject;
      } catch (e) {
        if (e instanceof GraphQLError) {
          throw e;
        }
        throw new GraphQLError(`Error adding favorited project: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    editProject: async (_, args, contextValue) => {
      try {
        // Validate ObjectId
        validation.checkObjectId(args._id);

        const projects = await Projects();
        const client = contextValue.redisClient;

        const project = await projects.findOne({ _id: new ObjectId(args._id) });
        if (!project) {
          throw new GraphQLError(`Project not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }

        const updateFields = {};

        if (args.name) {
          // Project Name between 2 - 50 characters (Not only special characters / only numbers)
          validation.checkString(args.name);
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
          updateFields.name = args.name.trim();
        }

        if (args.technologies) {
          // Technologies must be an array of valid strings
          if (
            !Array.isArray(args.technologies) ||
            args.technologies.length === 0
          ) {
            throw new GraphQLError(`Technologies must be an array of strings`, {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }
          args.technologies.forEach((tech) => {
            if (!Technologies.includes(tech)) {
              throw new GraphQLError(`Invalid Technology: ${tech}`, {
                extensions: { code: "BAD_USER_INPUT" },
              });
            }
          });
          updateFields.technologies = args.technologies;
        }

        if (args.description) {
          // Description must be a string between 1 - 200 characters
          validation.checkString(args.description);
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
          updateFields.description = args.description.trim();
        }

        if (args.images) {
          args.images.forEach((image) => {
            if (typeof image !== "string" || !image.startsWith("data:image/")) {
              throw new GraphQLError(`Invalid image format`, {
                extensions: { code: "BAD_USER_INPUT" },
              });
            }
          });
          updateFields.images = args.images;
        }

        const updatedProject = await projects.updateOne(
          { _id: new ObjectId(args._id) },
          { $set: updateFields }
        );
        if (!updatedProject.modifiedCount) {
          throw new GraphQLError(`Could not update project`, {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // Fetch the updated project
        const projectAfterUpdate = await projects.findOne({
          _id: new ObjectId(args._id),
        });

        // Update Redis cache
        await client.del(`project_${args._id}`, "$");
        await client.flushAll();
        await client.json.set(`project_${args._id}`, "$", projectAfterUpdate);

        return projectAfterUpdate;
      } catch (e) {
        if (e instanceof GraphQLError) {
          throw e;
        }
        throw new GraphQLError(`Error editing project: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    editUser: async (_, args, contextValue) => {
      try {
        // Validate ObjectId
        validation.checkObjectId(args._id);

        const userCollection = await Users();
        const client = contextValue.redisClient;
        const cacheKey = `user_${args._id}`;

        const userToUpdate = await userCollection.findOne({
          _id: new ObjectId(args._id),
        });
        if (!userToUpdate) {
          throw new GraphQLError(`User not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }

        const updateFields = {};

        if (args.firstName) {
          updateFields.firstName = validation.checkAlphabet(args.firstName);
        }

        if (args.lastName) {
          updateFields.lastName = validation.checkAlphabet(args.lastName);
        }

        if (args.bio) {
          updateFields.bio = validation.checkString(args.bio);
        }

        if (args.email) {
          if (validator.isEmail(args.email)) {
            args.email = validator.normalizeEmail(args.email);
          } else {
            throw new GraphQLError(`Invalid email`, {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }
          const emailExists = await userCollection.findOne({
            email: args.email,
          });
          if (emailExists && emailExists._id.toString() !== args._id) {
            throw new GraphQLError(`Email already in use`, {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }
          updateFields.email = args.email;
        }

        if (args.password) {
          const newPassword = validation.checkPassword(args.password);
          if (bcrypt.compareSync(args.password, userToUpdate.password)) {
            throw new GraphQLError(
              `Password cannot be the same as the current password`,
              {
                extensions: { code: "BAD_USER_INPUT" },
              }
            );
          }
          const salt = bcrypt.genSaltSync(saltRounds);
          const hashedPassword = bcrypt.hashSync(newPassword, salt);
          updateFields.password = hashedPassword;
        }

        if (args.profLanguages) {
          args.profLanguages.forEach((element) => {
            if (!Technologies.includes(element)) {
              throw new GraphQLError(`Invalid Technology: ${element}`, {
                extensions: { code: "BAD_USER_INPUT" },
              });
            }
          });
          updateFields.profLanguages = args.profLanguages;
        }

        const newUser = {
          ...userToUpdate,
          ...updateFields,
        };

        const updatedUser = await userCollection.updateOne(
          { _id: new ObjectId(args._id) },
          { $set: updateFields }
        );

        /*if (!updatedUser.modifiedCount) {
          throw new GraphQLError(`Could not update User`, {
            extensions: { code: "NOT_FOUND" },
          });
        }*/

        // Update Redis cache
        await client.del(cacheKey, "$");
        await client.flushAll();
        await client.json.set(cacheKey, "$", newUser);
        await client.expire(cacheKey, 3600);

        return newUser;
      } catch (e) {
        if (e instanceof GraphQLError) {
          throw e;
        }
        throw new GraphQLError(`Error updating user: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    deleteUser: async (_, args, contextValue) => {
      try {
        // Validate ObjectId
        validation.checkObjectId(args._id);

        const users = await Users();
        const projects = await Projects();
        const comments = await Comments();
        const client = contextValue.redisClient;

        const userToDelete = await users.findOne({
          _id: new ObjectId(args._id),
        });
        if (!userToDelete) {
          throw new GraphQLError(`User not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const deletedUser = await users.deleteOne({
          _id: new ObjectId(args._id),
        });
        if (!deletedUser.deletedCount) {
          throw new GraphQLError(`Could not delete user`, {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // Remove user from favoritedBy in projects
        await projects.updateMany(
          { favoritedBy: new ObjectId(args._id) },
          {
            $pull: { favoritedBy: new ObjectId(args._id) },
            $inc: { numOfFavorites: -1 },
          }
        );

        // Delete user's projects
        const userProjects = await projects
          .find({ creatorId: new ObjectId(args._id) })
          .toArray();
        for (const project of userProjects) {
          await projects.deleteOne({ _id: project._id });
          // Delete comments related to the project
          await comments.deleteMany({ projectId: project._id });
        }

        // Delete user's comments
        await comments.deleteMany({ userId: new ObjectId(args._id) });

        // Clear Redis cache
        await client.del(`user_${args._id}`, "$");
        await client.del("users", "$");
        await client.del(`projects`, "$");
        await client.del(`comments`, "$");

        return userToDelete;
      } catch (e) {
        if (e instanceof GraphQLError) {
          throw e;
        }
        throw new GraphQLError(`Error deleting user: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    deleteProject: async (_, args, contextValue) => {
      try {
        // Validate ObjectId
        validation.checkObjectId(args._id);

        const projects = await Projects();
        const users = await Users();
        const comments = await Comments();
        const client = contextValue.redisClient;

        const projectToDelete = await projects.findOne({
          _id: new ObjectId(args._id),
        });
        if (!projectToDelete) {
          throw new GraphQLError(`Project not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        // Delete the project
        const deletedProject = await projects.deleteOne({
          _id: new ObjectId(args._id),
        });
        if (!deletedProject.deletedCount) {
          throw new GraphQLError(`Could not delete project`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        // Remove project from creator's project list
        await users.updateOne(
          { _id: new ObjectId(projectToDelete.creatorId) },
          { $pull: { projects: new ObjectId(projectToDelete._id) } }
        );
        // Remove project from favoriteProjects of users who favorited it
        await users.updateMany(
          { favoriteProjects: { $in: [new ObjectId(projectToDelete._id)] } },
          { $pull: { favoriteProjects: new ObjectId(projectToDelete._id) } }
        );
        // Delete all comments associated with the project
        await comments.deleteMany({
          projectId: new ObjectId(projectToDelete._id),
        });

        // Clear Redis cache
        await client.del(`project_${args._id}`, "$");
        await client.json.del(`user_${projectToDelete.creatorId}`, "$");
        await client.flushAll();
        return projectToDelete;
      } catch (e) {
        throw new GraphQLError(`Error deleting project: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    deleteComment: async (_, args, contextValue) => {
      try {
        // Validate ObjectId
        validation.checkObjectId(args._id);

        const comments = await Comments();
        const projects = await Projects();
        const client = contextValue.redisClient;

        const commentToDelete = await comments.findOne({
          _id: new ObjectId(args._id),
        });
        if (!commentToDelete) {
          throw new GraphQLError(`Comment not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const deletedComment = await comments.deleteOne({
          _id: new ObjectId(args._id),
        });
        if (!deletedComment.deletedCount) {
          throw new GraphQLError(`Could not delete comment`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const updatedProject = await projects.updateOne(
          { _id: new ObjectId(commentToDelete.projectId) },
          { $pull: { comments: new ObjectId(commentToDelete._id) } }
        );
        if (!updatedProject.modifiedCount) {
          throw new GraphQLError(`Could not remove comment from project`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        // Handle Redis cache
        await client.del(`project_${commentToDelete.projectId}`, "$");
        await client.del(`comment_${args._id}`, "$");

        return commentToDelete;
      } catch (e) {
        throw new GraphQLError(`Error deleting comment: ${e.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    removeFavoritedProject: async (_, args, contextValue) => {
      try {
        // Validate ObjectIds
        validation.checkObjectId(args.userId);
        validation.checkObjectId(args.projectId);

        const users = await Users();
        const projects = await Projects();
        const client = contextValue.redisClient;

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
        if (project.creatorId.toString() === user._id.toString()) {
          throw new GraphQLError(`Cannot un-favorite own project`, {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        const favoriteProjects = user.favoriteProjects || [];
        if (
          !favoriteProjects.some((proj) => proj.toString() === args.projectId)
        ) {
          throw new GraphQLError(`Project not favorited`, {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        // Remove project from user's favorites
        await users.updateOne(
          { _id: new ObjectId(args.userId) },
          { $pull: { favoriteProjects: new ObjectId(args.projectId) } }
        );
        // Remove user from project's favoritedBy
        await projects.updateOne(
          { _id: new ObjectId(args.projectId) },
          {
            $pull: { favoritedBy: new ObjectId(args.userId) },
            $inc: { numOfFavorites: -1 },
          }
        );

        // Update Redis cache
        const updatedUser = await users.findOne({
          _id: new ObjectId(args.userId),
        });
        const updatedProject = await projects.findOne({
          _id: new ObjectId(args.projectId),
        });
        await client.del(`user_${args.userId}`, "$");
        await client.del(`project_${args.projectId}`, "$");
        await client.json.set(`user_${args.userId}`, "$", updatedUser);
        await client.json.set(`project_${args.projectId}`, "$", updatedProject);

        return updatedProject;
      } catch (e) {
        if (e instanceof GraphQLError) {
          throw e;
        }
        throw new GraphQLError(
          `Error removing favorited project: ${e.message}`,
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          }
        );
      }
    },
  },
};
