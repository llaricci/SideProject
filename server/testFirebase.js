// Import the Firebase Admin SDK
import { adminAuth } from "./config/firebaseAdmin.js";

// Test listing users
adminAuth
  .listUsers(10)
  .then((listUsersResult) => {
    console.log('Users:', listUsersResult.users);
  })
  .catch((error) => {
    console.error('Error listing users:', error);
  });
