import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection, onStart) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
      onStart?.(_col);
    }

    return _col;
  };
};

export const Projects = getCollectionFn("projects");
export const Users = getCollectionFn("users", users => {
  users.createIndex({firebaseUID: 1}, {unique: true});
});
export const Comments = getCollectionFn("comments");
