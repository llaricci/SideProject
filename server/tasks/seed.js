import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { Users, Projects, Comments } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();

  const users = await Users();
  const projects = await Projects();
  const comments = await Comments();

  const user1 = {
    _id: new ObjectId(),
    firstName: "Patrick",
    lastName: "Hill",
    email: "patrickhill@gmail.com",
    bio: "User bio",
    password: await bcrypt.hash('password', 10), // Hash the password
    projects: [],
    favoriteProjects: [], // Use favoriteProjects as per schema
    profLanguages: ["JAVA", "NEXT_JS"],
  };

  const user2 = {
    _id: new ObjectId(),
    firstName: "Pink",
    lastName: "Man",
    email: "email@gmail.com",
    bio: "User bio",
    password: await bcrypt.hash('password', 10), // Hash the password
    projects: [],
    favoriteProjects: [], // Use favoriteProjects as per schema
    profLanguages: ["CPLUSPLUS", "REACT"],
  };

  const insertedUsers = await users.insertMany([user1, user2]);
  const user1Id = user1._id;
  const user2Id = user2._id;

  let insertedProjects = await projects.insertMany([
    {
      _id: new ObjectId(),
      name: "First Project",
      technologies: ["JAVA", "NEXT_JS"],
      description: "A cool project using modern technologies",
      creatorId: user1Id,
      comments: [],
      favoritedBy: [],
      numOfFavorites: 0, // Include numOfFavorites
    },
    {
      _id: new ObjectId(),
      name: "Second Project",
      technologies: ["CPLUSPLUS", "REACT"],
      description: "An innovative project for frontend and backend",
      creatorId: user1Id,
      comments: [],
      favoritedBy: [],
      numOfFavorites: 0, // Include numOfFavorites
    },
    {
      _id: new ObjectId(),
      name: "Third Project",
      technologies: ["CPLUSPLUS", "REACT"],
      description: "An innovative project for frontend and backend",
      creatorId: user2Id,
      comments: [],
      favoritedBy: [],
      numOfFavorites: 0, // Include numOfFavorites
    },
    {
      _id: new ObjectId(),
      name: "Fourth Project",
      technologies: ["CPLUSPLUS", "REACT"],
      description: "An innovative project for frontend and backend",
      creatorId: user2Id,
      comments: [],
      favoritedBy: [],
      numOfFavorites: 0, // Include numOfFavorites
    },
  ]);

  const project1Id = insertedProjects.insertedIds[0];
  const project2Id = insertedProjects.insertedIds[1];
  const project3Id = insertedProjects.insertedIds[2];
  const project4Id = insertedProjects.insertedIds[3];

  await users.updateMany(
    { _id: user1Id },
    { $push: { projects: { $each: [project1Id, project2Id] } } }
  );
  await users.updateMany(
    { _id: user2Id },
    { $push: { projects: { $each: [project3Id, project4Id] } } }
  );

  // Add comments
  const insertedComments = await comments.insertMany([
    {
      _id: new ObjectId(),
      userId: user1Id,
      comment: "Damn this project sucks!",
      projectId: project1Id,
    },
    {
      _id: new ObjectId(),
      userId: user2Id,
      comment: "This is a really cool project!",
      projectId: project2Id,
    },
  ]);

  console.log("Done seeding database");
  await closeConnection();
};

main().catch(console.log);