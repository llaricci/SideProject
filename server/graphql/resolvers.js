import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import { Projects, Users, Comments } from "../config/mongoCollections.js";

export const resolvers = {
  Query: {
    users: async (_, __, contextValue) => {
      try{
        const client = contextValue.redisClient;
        const usersCache = await client.json.get(`users`, '$')
        // If users cache is empty then fetch from db
        if(!usersCache || usersCache.length === 0) {
          const allUsers = await Users();
          const users = await allUsers.find({}).toArray();
          console.log(users)
          if(!users){
            throw new GraphQLError(`Internal Server Error`, {
              extensions: {code: 'INTERNAL_SERVER_ERROR'}
          });
          }
          await client.json.set(`users`, '$', users);
          await client.expire(`users`, 3600);
          return users;
        }
        return usersCache;
      }
      catch(e){
        throw new GraphQLError(`Error fetching users: ${e.message}`,{
          extensions: {code: 'INTERNAL_SERVER_ERROR'}
        });
      }
    },
    getUserById: async (_, args) => {
      try{
        
      }
      catch(e){
        
      }
      const users = await Users();
      const user = await users.findOne({ _id: new ObjectId(args._id) });
      if (!user)
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      return user;
    },
    projects: async () => {
      try{
        const projects = await Projects();
        const allProjects = await projects.find({}).toArray();
        if (!allProjects) {
          throw new GraphQLError("Internal Server Error", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return allProjects;
      }
      catch(e){
        
      }
    },
    getProjectById: async (_, args) => {
      try{
        const projects = await Projects();
        const project = await projects.findOne({ _id: new ObjectId(args._id) });
        if (!project)
          throw new GraphQLError("Project not found", {
            extensions: { code: "NOT_FOUND" },
          });
        return project;
      }
      catch(e){
        
      }

    },
    comments: async () => {
      try{
        const comments = await Comments();
        const allComments = await comments.find({}).toArray();
        if (!allComments) {
          throw new GraphQLError("Internal Server Error", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return allComments;
      }
      catch(e){
        
      }
      
    },
    getCommentsById: async (_, args) => {
      try{
        const comments = await Comments();
        const comment = await comments.findOne({ _id: new ObjectId(args.id) });
        if (!comment)
          throw new GraphQLError("Comment not found", {
            extensions: { code: "NOT_FOUND" },
          });
        return comment;
      }
      catch(e){
        
      }
  
    },
    getProjectsbyTechnology: async (_, args) => {
      try{
        const projects = await Projects();
        const projectsByTechnology = await projects
          .find({ technologies: args.technology })
          .toArray();
        return projectsByTechnology;
      }
      catch(e){
        
      }

    },
    searchUserByName: async (_, args) => {
      try{
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
      }
      catch(e){
        
      }
    },
    searchProjectByName: async (_, args) => {
      try{
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
      }
      catch(e){
        
      }
    },
  },
  Project: {
    creator: async (parentValue) => {
      try{
        console.log(parentValue);
        const users = await Users();
        const creator = await users.find({
          projects: { $in: [new ObjectId(parentValue._id)] },
        });
        return creator;
      }
      catch(e){
        
      }

    },
    favoritedBy: async (parentValue) => {
      try{
        
      }
      catch(e){
        
      }
      const users = await Users();
      const favoritedby = await users
        .find({ favoriteProjects: { $in: [new ObjectId(parentValue._id)] } })
        .toArray();
      return favoritedby;
    },
    comments: async (parentValue) => {
      try{
        
      }
      catch(e){
        
      }
      const comments = await Comments();
      const projectComments = await comments
        .find({ project: new ObjectId(parentValue._id) })
        .toArray();
      return projectComments;
    },
    numOfFavorites: async (parentValue) => {
      try{
        
      }
      catch(e){
        
      }
      const users = await Users();
      const numOfFavorites = await users
        .count({ favoriteProjects: { $in: [new ObjectId(parentValue._id)] } })
        .count();
      return numOfFavorites;
    },
  },
  User: {
    projects: async (parentValue) => {
      try{
        
      }
      catch(e){
        
      }
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
      try{
        
      }
      catch(e){
        
      }
      const users = await Users();
      const commenter = await users.findOne({
        _id: new ObjectId(parentValue.user),
      });
      return commenter;
    },
    project: async (parentValue) => {
      try{
        
      }
      catch(e){
        
      }
      const projects = await Projects();
      const project = await projects.findOne({
        id_: new ObjectId(parentValue.project),
      });
      return project;
    },
  },
  Mutation: {},
};
