import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { Users, Projects, Comments } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import { randomBytes } from "crypto"; // Import randomBytes for UID generation
import { adminAuth } from "../config/firebaseAdmin.js"; // Firebase Admin SDK


const deleteAllFirebaseUsers = async () => {
  let nextPageToken;
  do {
    const listUsersResult = await adminAuth.listUsers(1000, nextPageToken);
    const uids = listUsersResult.users.map((user) => user.uid);

    if (uids.length > 0) {
      console.log(`Deleting ${uids.length} users...`);
      await adminAuth.deleteUsers(uids);
    }

    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);
};

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

  console.log("Deleting existing Firebase users...");
  await deleteAllFirebaseUsers(); 
  console.log("Firebase users cleared.");

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

  const projectNames = [
    "DevTracker", "AlgoMaster", "CloudForge", "CodeBeacons", "TechRadar",
    "TaskFlowPro", "ScriptLab", "BugFixer", "DevConnect", "ErrorHunter",
    "QuickDeploy", "ByteCraft", "CodeQuest", "StackLab", "RepoGuard",
    "TestPilot", "StackStream", "CodeForgeX", "BugSquasher", "DataDrive",
    "CodePulsePro", "StreamCoder", "BuildBot", "TestBoost", "ErrorFixer",
    "CodeWhiz", "SyncMaster", "DevZen", "SnapBuild", "DataFlowX",
    "ByteVerse", "TechFlow", "CloudRover", "ProjectSync", "CodePilot",
    "PatchCraft", "TestForge", "RefactorBot", "MetaFlow", "AutoCode",
    "CodeFusion", "DataBlast", "DeployHub", "ErrorTrak", "CloudMatrix",
    "DevCraft", "CodeHubX", "DeployFlow", "ByteLink", "TechNinja",
    "DataSnap", "RefactorForge", "BuildGrid", "CodeRocket", "BugTrackerX"
  ];
  
  const projectDescriptions = [
    "A real-time developer activity tracker that provides insights on coding productivity.",
    "An AI-powered algorithm testing platform for performance benchmarking.",
    "A cloud infrastructure tool for seamless DevOps management and deployment.",
    "A platform for organizing and navigating code repositories with visual mapping.",
    "A tool for tracking and analyzing technology trends and developments.",
    "A task management system built for agile development teams with enhanced features.",
    "A testing suite for executing and analyzing scripts in various languages.",
    "A bug resolution system that integrates with multiple bug-tracking tools.",
    "A collaborative platform for developers to connect, share, and solve coding challenges.",
    "An error detection tool that scans code for potential bugs and performance bottlenecks.",
    "A deployment automation tool that simplifies the process of launching new versions.",
    "A platform for building and sharing custom software solutions and frameworks.",
    "An interactive coding adventure game for learning algorithms and data structures.",
    "A comprehensive tool for managing and testing development stacks and environments.",
    "A repository management tool with enhanced security and compliance features.",
    "A test-driven development framework designed to streamline unit testing and validation.",
    "A live-streaming coding environment that lets you share development progress with peers.",
    "A fully featured cloud-based IDE for quick and easy coding without any setup.",
    "An advanced bug detection system for analyzing and fixing issues in real-time.",
    "An integrated development environment tailored for full-stack developers.",
    "A data-driven project tracker that integrates with GitHub to monitor progress.",
    "A platform for streamlining build pipelines and continuous integration processes.",
    "A tool for automating the deployment and management of development pipelines.",
    "An AI-powered code quality checker that provides instant feedback and suggestions.",
    "A repository and collaboration platform for open-source projects with improved governance.",
    "A bug-reporting and tracking tool with AI-driven automated issue resolution.",
    "A tool designed to optimize and improve cloud-based application deployments.",
    "A system for syncing, refactoring, and optimizing code across multiple repositories.",
    "A platform for quickly running tests across multiple environments and platforms.",
    "A developer-centric collaboration tool for remote and hybrid teams.",
    "An IDE plugin that enhances code navigation and debugging with AI-driven features.",
    "A cloud-native application design and development platform for microservices.",
    "A machine learning-powered test automation framework for faster quality assurance.",
    "A security-focused platform for scanning code for vulnerabilities and breaches.",
    "A set of tools for organizing, optimizing, and automating development workflows.",
    "A platform for building decentralized applications with blockchain integration.",
    "A fully customizable coding assistant for improving productivity in development.",
    "A system for analyzing and visualizing code quality and refactoring opportunities.",
    "A code delivery pipeline that automates deployment to various environments.",
    "A virtualized development environment that runs code in isolated containers.",
    "A project management tool that integrates with GitHub for detailed project insights.",
    "A platform for monitoring, debugging, and analyzing application logs in real-time.",
    "A tool that integrates with cloud infrastructure to optimize app performance.",
    "A real-time collaborative debugging tool that helps multiple developers solve issues together.",
    "A platform for creating and testing AI-driven software solutions for developers.",
    "An automated code deployment tool designed for faster delivery with zero downtime.",
    "A continuous testing framework designed for integrating test suites into the CI/CD pipeline.",
    "A cloud-based platform for managing and scaling software projects across multiple teams.",
    "A machine learning tool that automates the code review process for accuracy and efficiency.",
    "A fully integrated development environment that supports live coding, testing, and debugging.",
    "A platform for managing and tracking dependencies across projects with detailed insights.",
    "A code refactoring tool that automates the process of improving and optimizing code quality."
  ];

  const firstNames = [
    "Olivia", "Liam", "Emma", "Noah", "Ava", "Elijah", "Isabella", "Lucas", "Mia", "James",
    "Amelia", "Benjamin", "Harper", "Mason", "Evelyn", "Jackson", "Abigail", "Ethan", "Emily", "Alexander", "Sofia",
    "Henry", "Charlotte", "Sebastian", "Ella", "Matthew", "Scarlett", "Aiden", "Grace", "Jack", "Zoey",
    "Michael", "Aria", "Daniel", "Chloe", "Logan", "Penelope", "Jackson", "Layla", "David", "Nora",
    "Owen", "Lily", "Samuel", "Victoria", "Carter", "Riley", "Isaac", "Eleanor", "Wyatt", "Mila"
  ];

  const lastNames = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
    "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Roberts",
    "Gonzalez", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Young", "Hall", "Allen", "King",
    "Wright", "Scott", "Green", "Adams", "Baker", "Nelson", "Carter", "Mitchell", "Perez", "Robinson",
    "Hernandez", "Gomez", "Sanchez", "Morris", "Murphy", "Cameron", "Collins", "Reed", "Stewart", "Mason"
  ];
  
  
  
  

// Create Users in Firebase Authentication & MongoDB
  const userList = [];
  for (let i = 0; i < 25; i++) {
    const selectedLanguages = [
      languages[i % languages.length],
      languages[(i + 5) % languages.length],
    ];

  const email = `user${i + 1}@example.com`;
  const password = "Test123$";

  // Create user in Firebase Authentication
  const firebaseUser = await adminAuth.createUser({
    email,
    password,
    displayName: `${firstNames[i]} ${lastNames[i]}`,
  });

  const token = await adminAuth.createCustomToken(firebaseUser.uid);

  // Push user to MongoDB
  userList.push({
    _id: new ObjectId(),
    firebaseUID: firebaseUser.uid, // Firebase UID
    firstName: firstNames[i],
    lastName: lastNames[i],
    email: firebaseUser.email,
    bio: `Bio for User${i + 1}`,
    password: await bcrypt.hash(password, 10), // Hashed password (for MongoDB if needed)
    projects: [],
    favoriteProjects: [],
    profLanguages: selectedLanguages,
    token
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
      name: projectNames[i],
      technologies: projectTechnologies,
      description: projectDescriptions[i],
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
      comment: `${firstNames[i]} commented on Project ${projectIndex1 + 1}`,
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

  // const testUserToken = await adminAuth.createCustomToken(testUserFirebase.uid);


  // // Add a Test User
  // const testUser = {
  //   _id: new ObjectId("000000000000000000000000"),
  //   firebaseUID: generateFirebaseUID(),
  //   firstName: "Fuecoco",
  //   lastName: "FireCroc",
  //   email: "fuecoco@example.com",
  //   password: await bcrypt.hash("Test123$", 10),
  //   bio: "A fire croc looking for a job! Have 5+ years of experience with React and 2 years with NextJS!",
  //   profLanguages: ["CPlusPlus", "JavaScript", "Python", "NextJS", "TailwindCSS", "Svelte"],
  //   projects: [],
  //   favoriteProjects: [],
  //   token: testUserToken
  // };

  // await users.insertOne(testUser);

  console.log("Done seeding database");
  await closeConnection();
};

main().catch(console.log);
