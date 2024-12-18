import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { Users, Projects, Comments } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import { randomBytes } from "crypto"; // Import randomBytes for UID generation

// Helper function to generate random Firebase UIDs
const generateFirebaseUID = () => {
  return randomBytes(21).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 28);
};

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();

  const users = await Users();
  const projects = await Projects();
  const comments = await Comments();

  // Predefined list of programming languages
  const languages = [
    "JavaScript", "Python", "Java", "CSharp", "CPlusPlus", "Ruby", "PHP", "TypeScript",
    "Swift", "Kotlin", "Go", "Rust", "HTML", "CSS", "SQL", "GraphQL", "NodeJS", "React",
    "Angular", "Vue", "NextJS", "Svelte", "TailwindCSS", "Bootstrap", "AWS", "GoogleCloud",
    "OracleCloud", "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "Redis", "Firebase",
    "Git", "GitHub", "Other"
  ];

  const numberToWord = [
    "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
    "Eighteen", "Nineteen", "Twenty", "TwentyOne", "TwentyTwo", "TwentyThree",
    "TwentyFour", "TwentyFive"
  ];

  const projectNames = ["CodeCanvas", "PixelCraft", "BugTrackerPro", "TaskForge", "AutoLinter"];
  const projectDescriptions = ["An interactive platform", "A bug tracking system", "Task management for developers"];

  // Create Users
  const userList = [];
  for (let i = 0; i < 25; i++) {
    const selectedLanguages = [
      languages[i % languages.length],
      languages[(i + 5) % languages.length],
    ];

    userList.push({
      _id: new ObjectId(),
      firebaseUID: generateFirebaseUID(), // Random Firebase UID
      firstName: `FirstName${numberToWord[i]}`,
      lastName: `LastName${numberToWord[i]}`,
      email: `user${i + 1}@example.com`,
      bio: `Bio for User${i + 1}`,
      password: await bcrypt.hash("Test123$", 10),
      projects: [],
      favoriteProjects: [],
      profLanguages: selectedLanguages,
    });
  }
  const insertedUsers = await users.insertMany(userList);
  const userIds = Object.values(insertedUsers.insertedIds);

  // Create Projects
  const projectList = [];
  for (let i = 0; i < 50; i++) {
    const creatorIndex = i % 25;
    const projectTechnologies = [
      languages[i % languages.length],
      languages[(i + 3) % languages.length],
    ];

    projectList.push({
      _id: new ObjectId(),
      name: projectNames[i % projectNames.length],
      technologies: projectTechnologies,
      description: projectDescriptions[i % projectDescriptions.length],
      creatorId: userIds[creatorIndex],
      comments: [],
      favoritedBy: [],
      numOfFavorites: 0,
      images: [],
    });
  }
  const insertedProjects = await projects.insertMany(projectList);
  const projectIds = Object.values(insertedProjects.insertedIds);

  // Add Projects to Users
  for (let i = 0; i < 50; i++) {
    const creatorIndex = i % 25;
    await users.updateOne(
      { _id: userIds[creatorIndex] },
      { $push: { projects: projectIds[i] } }
    );
  }

  // Create Comments and Favorites
  const commentList = [];
  for (let i = 0; i < 25; i++) {
    const userIndex = i;
    const projectIndex1 = 50 - i - 1;
    const projectIndex2 = 25 - i - 1;

    // Comment and favorite project 1
    commentList.push({
      _id: new ObjectId(),
      userId: userIds[userIndex],
      comment: `Comment by User${i + 1} on Project ${projectIndex1 + 1}`,
      projectId: projectIds[projectIndex1],
    });
    await projects.updateOne(
      { _id: projectIds[projectIndex1] },
      { $inc: { numOfFavorites: 1 }, $push: { favoritedBy: userIds[userIndex] } }
    );

    // Comment and favorite project 2
    commentList.push({
      _id: new ObjectId(),
      userId: userIds[userIndex],
      comment: `Comment by User${i + 1} on Project ${projectIndex2 + 1}`,
      projectId: projectIds[projectIndex2],
    });
    await projects.updateOne(
      { _id: projectIds[projectIndex2] },
      { $inc: { numOfFavorites: 1 }, $push: { favoritedBy: userIds[userIndex] } }
    );
  }

  await comments.insertMany(commentList);

  // Add a Test User
  const testUser = {
    _id: new ObjectId("000000000000000000000000"),
    firebaseUID: generateFirebaseUID(),
    firstName: "Fuecoco",
    lastName: "FireCroc",
    email: "fuecoco@example.com",
    password: await bcrypt.hash("Test123$", 10),
    bio: "A fire croc looking for a job! Have 5+ years of experience with React and 2 years with NextJS!",
    profLanguages: ["CPlusPlus", "JavaScript", "Python", "NextJS", "TailwindCSS", "Svelte"],
    projects: [],
    favoriteProjects: [],
  };

  await users.insertOne(testUser);

  console.log("Done seeding database");
  await closeConnection();
};

main().catch(console.log);
