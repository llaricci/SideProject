// validators.js

import { ObjectId } from "mongodb";

const validation = {
  checkObjectId: (id) => {
    console.log("checking ID");
    if (!id) throw `Error you must provide an id`;
    console.log("first check");
    if (typeof id === "string") id = id.trim();
    else throw `Error: objectId must be of type string`;
    console.log("second check");
    if (id.length === 0) throw `Error: objectId cannot be empty spaces`;
    console.log("third check");
    if (!/^[a-zA-Z0-9\s]+$/.test(id))
      throw `Error objectId must contain only numbers and letters`;
    if (!ObjectId.isValid(id)) throw `Error ${id} is not a valid Object Id`;
    return id;
  },
  checkFirebaseUID: (firebaseUID) => {
    console.log("checking firebase id");
    if (!firebaseUID) throw `Error you must provide a firebaseUID`;
    console.log("first check");
    if (typeof firebaseUID === "string") firebaseUID = firebaseUID.trim();
    else throw `Error: firebaseUID must be of type string`;
    console.log("second check");
    if (firebaseUID.length === 0)
      throw `Error: firebaseUID cannot be empty spaces`;
    console.log("third check");
    if (!/^[a-zA-Z0-9\s]+$/.test(firebaseUID))
      throw `Error firebaseUID must contain only numbers and letters`;
    return firebaseUID;
  },

  checkString: (stringVal) => {
    if (!stringVal) throw `Error you must provide a string value`;
    if (typeof stringVal === "string") stringVal = stringVal.trim();
    else throw `Error: value must be of type string`;
    if (stringVal.length === 0) throw `Error: value cannot be empty spaces`;
    if (!/^[a-zA-Z0-9\s'",.!?;:()\[\]{}-]+$/.test(stringVal)) {
      throw `Error: value must contain only numbers, letters, spaces, or valid punctuation`;
    }
    return stringVal;
  },

  checkAlphabet: (stringVal) => {
    if (!stringVal) throw `Error you must provide a string value`;
    if (typeof stringVal === "string") stringVal = stringVal.trim();
    else throw `Error: value must be of type string`;
    if (stringVal.length === 0) throw `Error: value cannot be empty spaces`;
    if (!/^[a-zA-Z\s,.]+$/.test(stringVal)) {
      throw `Error: value must contain only alphabetical characters`;
    }
    return stringVal;
  },

  checkEmail: (email) => {
    if (!email) throw `Error you must provide an email`;
    if (typeof email !== "string") throw `Error: Email must be of type string`;
    email = email.trim();
    if (email.length === 0) throw `Error: Email cannot be empty spaces`;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw `Error: Invalid email format`;
    }
    return email;
  },

  checkPassword: (password) => {
    if (!password) throw `Error you must provide a password`;
    if (typeof password !== "string")
      throw `Error: Password must be of type string`;
    password = password.trim();
    if (password.length === 0) throw `Error: Password cannot be empty spaces`;
    if (password.length < 6) {
      throw `Error: Password must be at least 6 characters long`;
    }
    return password;
  },

  checkTechnology: (technology) => {
    const allowedTechnologies = [
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

    if (!technology) throw `Error you must provide a Technology`;
    if (typeof technology !== "string")
      throw `Error: Technology must be of type string`;
    technology = technology.trim().toUpperCase();
    if (!allowedTechnologies.includes(technology)) {
      throw `Error: Invalid value for Technology. Allowed values are: ${allowedTechnologies.join(
        ", "
      )}`;
    }
    return technology;
  },

  checkTechnologies: (technologies) => {
    const allowedTechnologies = [
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

    if (!technologies) throw `Error you must provide Technologies`;
    if (!Array.isArray(technologies))
      throw `Error: Technologies must be an array`;
    if (technologies.length === 0)
      throw `Error: Technologies cannot be an empty array`;
    return technologies.map((tech, index) => {
      if (typeof tech !== "string")
        throw `Error: Technology at index ${index} must be of type string`;
      tech = tech.trim().toUpperCase();
      if (!allowedTechnologies.includes(tech)) {
        throw `Error: Invalid value for Technology at index ${index}. Allowed values are: ${allowedTechnologies.join(
          ", "
        )}`;
      }
      return tech;
    });
  },
};

export default validation;
