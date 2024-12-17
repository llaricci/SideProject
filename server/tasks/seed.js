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
  "Other"
  ];

  const numberToWord = [
    "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
    "Eighteen", "Nineteen", "Twenty", "TwentyOne", "TwentyTwo", "TwentyThree", 
    "TwentyFour", "TwentyFive"
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
      firstName: `FirstName${numberToWord[i]}`,
      lastName: `LastName${numberToWord[i]}`,
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
      images: [], // Added empty images array
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

  // Create comments and favorites for users
  const commentList = [];
  for (let i = 0; i < 25; i++) {
    const userIndex = i; // Current user
    const firstProjectIndex = 50 - i; // User i comments on project 50-i
    const secondProjectIndex = 25 - i; // User i comments on project 25-i
    
    // Comment and favorite project 50-i
    commentList.push({
      _id: new ObjectId(),
      userId: userIds[userIndex],
      comment: `Comment by User${i + 1} on Project ${firstProjectIndex}`,
      projectId: projectIds[firstProjectIndex - 1], // Project indices are 0-based
    });
    await users.updateOne(
      { _id: userIds[userIndex] },
      { $addToSet: { favoriteProjects: projectIds[firstProjectIndex - 1] } }
    );
    await projects.updateOne(
      { _id: projectIds[firstProjectIndex - 1] },
      { $inc: { numOfFavorites: 1 } }
    );
  
    // Comment and favorite project 25-i
    commentList.push({
      _id: new ObjectId(),
      userId: userIds[userIndex],
      comment: `Comment by User${i + 1} on Project ${secondProjectIndex}`,
      projectId: projectIds[secondProjectIndex - 1], // Project indices are 0-based
    });
    await users.updateOne(
      { _id: userIds[userIndex] },
      { $addToSet: { favoriteProjects: projectIds[secondProjectIndex - 1] } }
    );
    await projects.updateOne(
      { _id: projectIds[secondProjectIndex - 1] }, // Corrected to use secondProjectIndex
      { 
        $inc: { numOfFavorites: 1 },
        $push: { favoritedBy: userIds[userIndex] } // Add user to favoritedBy array
      }
    );
  }
  

  const insertedComments = await comments.insertMany(commentList);
  const commentIds = Object.values(insertedComments.insertedIds);

  // Update projects with comments
  for (let i = 0; i < 50; i++) {
    await projects.updateOne(
      { _id: projectIds[i] },
      { $push: { comments: commentIds[i] } }
    );
  }

  console.log("Done seeding database");
  await closeConnection();
};

main().catch(console.log);
