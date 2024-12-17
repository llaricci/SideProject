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

  const projectNames = [
    "CodeCanvas", "PixelCraft", "BugTrackerPro", "TaskForge", "AutoLinter", "DevDashboard", 
    "CodeSnipShare", "BugHunt", "LogicBuilder", "AlgoVisualize", "TestifyJS", "GitHelperBot",
    "AuthGenie", "SyntaxWizard", "DeployNinja", "GraphQLStudio", "MongoMaster", "SchemaSculptor",
    "StreamSync", "DataMapperX", "TaskMind", "ProjectPulse", "ReactPlanner", "TypeItFast",
    "IDEPlus", "APIExplorer", "NodeFleet", "CodeTimeLog", "JsonOrganizer", "MarkdownXpress",
    "CodeRefactorer", "DesignBoard", "PortfolioCraft", "HackSimulator", "CompilerPro",
    "CodeCompare", "PerfMonit", "DebuggerX", "BugFixRace", "ApiMocker", "FrontendForge",
    "BacklogTracker", "AI-CodeMate", "ScriptRunner", "TechBlogGen", "CodeVocab", "SQLSketcher",
    "UIFlowDesigner", "CloudDeployMate", "ErrorFixHub", "AIRefactorBot"
  ];

  const projectDescriptions = [
    "An interactive platform to collaborate on coding projects with real-time drawing tools.",
    "A tool to create pixel art projects, with advanced color palette management.",
    "Track and resolve software bugs efficiently with real-time team collaboration.",
    "An advanced task management tool for developers with project timelines and reporting.",
    "Automated code linting tool supporting multiple languages for clean and standardized code.",
    "A customizable dashboard to monitor project status, code metrics, and team productivity.",
    "Share code snippets securely with version history and syntax highlighting.",
    "Gamified bug tracking system for developers to find and fix issues quickly.",
    "Drag-and-drop platform to build complex logical workflows visually for programming projects.",
    "Visualize complex algorithms with interactive animations for learning and debugging.",
    "A unit testing automation framework with detailed logging and performance analysis.",
    "A bot that simplifies Git operations by automating branching, merging, and pull requests.",
    "Generate secure authentication flows with tokens, JWTs, and social login integrations.",
    "A code syntax highlighter that integrates into editors and custom websites seamlessly.",
    "Simplify cloud-based app deployments with streamlined setup and CI/CD pipelines.",
    "A visual studio for designing, testing, and debugging GraphQL queries and schemas.",
    "Master MongoDB operations with intuitive querying tools and performance optimization.",
    "Build and validate database schemas with visual design and export tools.",
    "Sync live streams of data and events in real time across multiple client applications.",
    "A mapping tool to efficiently transform and synchronize structured and unstructured data.",
    "Organize and prioritize your tasks with a developer-centric productivity planner.",
    "Monitor project health, progress, and resource utilization with analytics dashboards.",
    "A task planner that integrates React components for developers and UI designers.",
    "Gamified typing tool for programmers with real-world coding snippets and timers.",
    "A lightweight integrated development environment with advanced debugging tools.",
    "Explore, test, and debug APIs interactively using a clean, developer-friendly UI.",
    "Node.js-based task manager for running and scheduling background scripts efficiently.",
    "Log development time spent on coding projects with task categorization and reports.",
    "Organize and beautify JSON data with validation, formatting, and export options.",
    "Markdown editor with live previews, versioning, and easy export formats like PDF.",
    "Automate and optimize repetitive code refactoring tasks across large projects.",
    "A collaborative whiteboard to design and review software architecture visually.",
    "Build and deploy custom developer portfolios with dynamic project showcases.",
    "Simulate real-world hacking challenges with practice tools for ethical hackers.",
    "Lightweight compiler with real-time error checking and code performance metrics.",
    "Compare code side-by-side with syntax highlighting and version history diffing.",
    "Monitor code performance and identify bottlenecks in large-scale applications.",
    "Advanced debugging tool with logs, breakpoints, and performance snapshots.",
    "Compete in time-limited challenges to fix bugs and earn developer rankings.",
    "Mock REST APIs quickly for frontend testing and faster local development cycles.",
    "A tool to scaffold frontend codebases with templates and UI component previews.",
    "Track and organize your project backlog with task boards and sprint planning tools.",
    "AI-powered coding assistant that suggests, autocompletes, and optimizes your code.",
    "Run, schedule, and monitor JavaScript scripts with logging and error handling.",
    "Generate a fully-functional tech blog with Markdown support and themes.",
    "Learn programming terminology and concepts with an interactive coding vocabulary app.",
    "Visualize SQL queries and table relationships for designing and debugging databases.",
    "Drag-and-drop UI tool for designing smooth application flows and wireframes.",
    "Automate cloud deployment processes with seamless integration and rollback features.",
    "A centralized hub to manage and fix recurring programming errors in any language.",
    "AI-driven refactoring tool that analyzes code and suggests best practice improvements."
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
      name: projectNames[i],
      technologies: projectTechnologies,
      description: projectDescriptions[i],
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
