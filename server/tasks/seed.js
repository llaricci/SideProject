import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { Users, Projects, Comments } from "../config/mongoCollections.js";
import { v4 as uuid } from "uuid";
import { ObjectId, UUID } from "mongodb";

const main = async() => {
    const db = await dbConnection();
    await db.dropDatabase();

    const users = await Users();
    const projects = await Projects();
    const comments = await Comments();

    await users.insertMany([
        {
            _id: new ObjectId(),
            firstName: 'Patrick',
            lastName: 'Hill',
            email: 'patrickhill@gmail.com',
            description: 'User bio',
            password: 'password',
            favorites: [],
            profLanguages: ['JAVA', 'NEXT_JS']
        },
    ]);   

    console.log('Done seeding database');
    await closeConnection();
}

main().catch(console.log);