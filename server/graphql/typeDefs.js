export const typeDefs = `#graphql
    type Query {
        projects: [Project]
        project(id: ID!): Project
        users: [User]
        user(id: ID!): User
        comments: [Comment]
        comment(id: ID!): Comment
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
        _id: String
        name: String 
        Technologies: [Technology]
        Bio: String
        Creator: User
        comments: [Comment]
        Favorites: [User]
        numOfFavorites: Int
    }
    type User {
        _id: String
        firstName: String
        lastName: String
        email: String
        description: String
        password: String
        projects: [Project]
        FavoriteProjects: [Project]
        ProfLanguages: [Technology]
    }
    type Comment {
        _id: String
        user: User
        comment: String
        project: Project
    }`;
