import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { Users, Projects, Comments } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();

  const users = await Users();
  const projects = await Projects();
  const comments = await Comments();

  // Predefined list of programming languages
  const languages = [
    "JAVASCRIPT",
    "PYTHON",
    "JAVA",
    "CSHARP",
    "CPLUSPLUS",
    "RUBY",
    "PHP",
    "TYPESCRIPT",
    "SWIFT",
    "KOTLIN",
    "GO",
    "RUST",
    "HTML",
    "CSS",
    "SQL",
    "GRAPHQL",
    "NODE_JS",
    "REACT",
    "ANGULAR",
    "VUE",
    "NEXT_JS",
    "SVELTE",
    "TAILWINDCSS",
    "BOOTSTRAP",
    "AWS",
    "GOOGLE_CLOUD",
    "ORACLE_CLOUD",
    "DOCKER",
    "KUBERNETES",
    "MONGODB",
    "POSTGRESQL",
    "REDIS",
    "FIREBASE",
    "GIT",
    "GITHUB",
    "OTHER",
  ];

  // Create 25 users
  const userList = [];
  for (let i = 0; i < 25; i++) {
    const selectedLanguages = [
      languages[i % languages.length],
      languages[(i + 5) % languages.length],
    ];
    userList.push({
      _id: new ObjectId(),
      firstName: `User${i + 1}`,
      lastName: `LastName${i + 1}`,
      email: `user${i + 1}@example.com`,
      bio: `Bio for User${i + 1}`,
      password: await bcrypt.hash("password", 10),
      projects: [],
      favoriteProjects: [],
      profLanguages: selectedLanguages,
    });
  }

  const insertedUsers = await users.insertMany(userList);
  const userIds = Object.values(insertedUsers.insertedIds);

  // Create 50 projects
  const projectList = [];
  for (let i = 0; i < 50; i++) {
    const creatorIndex = i % 25; // Distribute projects across users
    const projectTechnologies = [
      languages[i % languages.length],
      languages[(i + 3) % languages.length],
    ];
    projectList.push({
      _id: new ObjectId(),
      name: `Project ${i + 1}`,
      technologies: projectTechnologies,
      description: `Description for Project ${i + 1}`,
      creatorId: userIds[creatorIndex],
      comments: [],
      favoritedBy: [],
      numOfFavorites: 0,
    });
  }

  const insertedProjects = await projects.insertMany(projectList);
  const projectIds = Object.values(insertedProjects.insertedIds);

  // Update users with their created projects
  for (let i = 0; i < 50; i++) {
    const creatorIndex = i % 25;
    await users.updateOne(
      { _id: userIds[creatorIndex] },
      { $push: { projects: projectIds[i] } }
    );
  }

  // Create 30 comments
  const commentList = [];
  for (let i = 0; i < 30; i++) {
    const userIndex = i % 25; // Cycle through users for comments
    //const projectIndex = i % 50; // Cycle through projects for comments
    const projectIndex = 49 - (i % 50);
    
    commentList.push({
      _id: new ObjectId(),
      userId: userIds[userIndex],
      comment: `Comment ${i + 1} on Project ${projectIndex + 1}`,
      projectId: projectIds[projectIndex],
    });
  }

  const insertedComments = await comments.insertMany(commentList);
  const commentIds = Object.values(insertedComments.insertedIds);

  // Update projects with comments
  for (let i = 0; i < 30; i++) {
    const projectIndex = i % 50;
    await projects.updateOne(
      { _id: projectIds[projectIndex] },
      { $push: { comments: commentIds[i] } }
    );
  }

  console.log("Done seeding database");
  await closeConnection();
};

main().catch(console.log);
