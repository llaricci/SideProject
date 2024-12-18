import { adminAuth } from "./config/firebaseAdmin.js";

// Recursive function to delete all users in batches
const deleteAllUsers = async (nextPageToken) => {
  try {
    // List users (batch of 1000 max)
    const listUsersResult = await adminAuth.listUsers(1000, nextPageToken);
    const users = listUsersResult.users;

    if (users.length === 0) {
      console.log("No users found. All users have been deleted.");
      return;
    }

    const uids = users.map((user) => user.uid);
    console.log(`Deleting ${uids.length} users...`);

    // Delete users in bulk
    await adminAuth.deleteUsers(uids);
    console.log("Successfully deleted batch of users.");

    // Recursively call the function to delete the next batch
    if (listUsersResult.pageToken) {
      await deleteAllUsers(listUsersResult.pageToken);
    } else {
      console.log("All users have been successfully deleted!");
    }
  } catch (error) {
    console.error("Error deleting users:", error);
  }
};

// Start the cleanup
deleteAllUsers();
