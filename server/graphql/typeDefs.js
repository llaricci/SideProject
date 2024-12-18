export const typeDefs = `#graphql
    type Query {
        projects: [Project]
        getProjectById(_id: String!): Project
        users: [User]
        getUserById(_id: String!): User
        getUserByFirebaseUID(firebaseUID: String!): User
        comments: [Comment]
        getCommentById(_id: String!): Comment
        getProjectsByTechnology(technology: Technology!): [Project]
        searchUserByName(searchTerm: String!): [User]
        searchProjectByName(searchTerm: String!): [Project]
    }

    enum Technology {
    JavaScript
    Python
    Java
    CSharp
    CPlusPlus
    Ruby
    PHP
    TypeScript
    Swift
    Kotlin
    Go
    Rust
    HTML
    CSS
    SQL
    GraphQL
    NodeJS
    React
    Angular
    Vue
    NextJS
    Svelte
    TailwindCSS
    Bootstrap
    AWS
    GoogleCloud
    OracleCloud
    Docker
    Kubernetes
    MongoDB
    PostgreSQL
    Redis
    Firebase
    Git
    GitHub
    Other
    }

    
    type Project {
        _id: String!
        name: String! 
        technologies: [Technology!]!
        description: String!
        creator: User!
        comments: [Comment!]!
        favoritedBy: [User!]!
        numOfFavorites: Int
        images: [String]!
    }

    type User {
        _id: String!
        firebaseUID: String!
        firstName: String!
        lastName: String!
        email: String!
        bio: String!
        password: String!
        projects: [Project!]!
        favoriteProjects: [Project!]
        profLanguages: [Technology!]!
        token: String!
    }
        
    type Comment {
        _id: String!
        user: User!
        comment: String!
        project: Project!
    }

    type Mutation {
        addUser(
            firebaseUID: String!
            firstName: String!
            lastName: String!
            email: String!
            bio: String!
            password: String!
            profLanguages: [Technology!]!
            token: String!
        ): User

        addProject(
            name: String!
            technologies: [Technology!]!
            description: String!
            creatorId: String!
            images: [String!]
        ): Project
        
        addComment(
            userId: String!
            comment: String!
            projectId: String!
        ): Comment

        addFavoritedProject(
            userId: String!
            projectId: String!
        ): Project

        removeFavoritedProject(
            userId: String!
            projectId: String!
        ): Project

        editUser(
            _id: String!
            firstName: String
            lastName: String
            email: String
            bio: String
            password: String
            profLanguages: [Technology!]
        ): User

        editProject(
            _id: String!
            name: String 
            technologies: [Technology!]
            description: String
            creatorId: String
            images: [String] 
        ): Project

        deleteUser(
            _id: String!
        ): User

        deleteProject(
            _id: String!
        ): Project

        deleteComment(
            _id: String!
        ): Comment
    }
    
    
    `;
