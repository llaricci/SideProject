import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { Users, Projects, Comments } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    const users = await Users();
    const projects = await Projects();
    const comments = await Comments();

    const user1 = {
        _id: new ObjectId(),
        firstName: 'Patrick',
        lastName: 'Hill',
        email: 'patrickhill@gmail.com',
        bio: 'User bio',
        password: 'password',
        favorites: [],
        profLanguages: ['JAVA', 'NEXT_JS']
    };

    const user2 = {
        _id: new ObjectId(),
        firstName: 'Pink',
        lastName: 'Man',
        email: 'email@gmail.com',
        bio: 'User bio',
        password: 'password',
        favorites: [],
        profLanguages: ['CPLUSPLUS', 'REACT']
    };

    const insertedUsers = await users.insertMany([user1, user2]);
    const user1Id = user1._id;
    const user2Id = user2._id;

    await projects.insertMany([
        {
            _id: new ObjectId(),
            name: "First Project",
            technologies: ["JAVA", "NEXT_JS"],
            description: "A cool project using modern technologies",
            creatorId: user1Id, // Associate with user1
            comments: [],
            favoritedBy: [],
            numOfFavorites: 0
        },
        {
            _id: new ObjectId(),
            name: "Second Project",
            technologies: ["CPLUSPLUS", "REACT"],
            description: "An innovative project for frontend and backend",
            creatorId: user2Id, // Associate with user2
            comments: [],
            favoritedBy: [],
            numOfFavorites: 0
        }
    ]);

    console.log('Done seeding database');
    await closeConnection();
};

main().catch(console.log);
