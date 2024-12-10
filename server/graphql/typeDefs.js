export const typeDefs = `#graphql
    type Query {
        projects: [Project]
        getProjectById(_id: String!): Project
        users: [User]
        getUserById(_id: String!): User
        comments: [Comment]
        getCommentById(_id: String!): Comment
        getProjectsbyTechnology(technology: Technology!): [Project]
        searchUserByName(searchTerm: String!): [User]
        searchProjectByName(searchTerm: String!): [Project]
    }

    enum Technology {
        JAVASCRIPT
        PYTHON
        JAVA
        CSHARP
        CPLUSPLUS
        RUBY
        PHP
        TYPESCRIPT
        SWIFT
        KOTLIN
        GO
        RUST
        HTML
        CSS
        SQL
        GRAPHQL
        NODE_JS
        REACT
        ANGULAR
        VUE
        NEXT_JS
        SVELTE
        TAILWINDCSS
        BOOTSTRAP
        AWS
        GOOGLE_CLOUD
        ORACLE_CLOUD
        DOCKER
        KUBERNETES
        MONGODB
        POSTGRESQL
        REDIS
        FIREBASE
        GIT
        GITHUB
        OTHER
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
    }

    type User {
        _id: String!
        firstName: String!
        lastName: String!
        email: String!
        bio: String!
        password: String!
        projects: [Project!]!
        favoriteProjects: [Project!]
        profLanguages: [Technology!]!
    }
        
    type Comment {
        _id: String!
        user: User!
        comment: String!
        project: Project!
    }

    type Mutation {
        addUser(
            firstName: String!
            lastName: String!
            email: String!
            bio: String!
            password: String!
            profLanguages: [Technology!]!
        ): User

        addProject(
            name: String!
            technologies: [Technology!]!
            description: String!
            creatorId: String!
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
            name: String! 
            technologies: [Technology!]!
            description: String!
            creatorId: String! 
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
