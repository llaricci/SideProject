import { gql } from "@apollo/client";

const projects = gql`
  query Projects {
    projects {
      _id
      name
      technologies
      description
      creator {
        _id
      }
      comments {
        _id
      }
      favoritedBy {
        _id
      }
      numOfFavorites
    }
  }
`;

const GetProjectById = gql`
  query GetProjectById($id: String!) {
    getProjectById(_id: $id) {
      _id
      name
      technologies
      description
      creator {
        _id
      }
      comments {
        _id
      }
      favoritedBy {
        _id
      }
      numOfFavorites
    }
  }
`;
const GetProjectsbyTechnology = gql`
  query GetProjectsbyTechnology($technology: Technology!) {
    getProjectsbyTechnology(technology: $technology) {
      _id
      name
      technologies
      description
      creator {
        _id
      }
      comments {
        _id
      }
      favoritedBy {
        _id
      }
      numOfFavorites
    }
  }
`;
const searchProjectByName = gql`
  query SearchProjectByName($searchTerm: String!) {
    searchProjectByName(searchTerm: $searchTerm) {
      _id
      name
      technologies
      description
      creator {
        _id
      }
      comments {
        _id
      }
      favoritedBy {
        _id
      }
      numOfFavorites
    }
  }
`;

const users = gql`
  query Users {
    users {
      _id
      firstName
      lastName
      email
      bio
      password
      projects {
        _id
        creatorId
      }
      favoriteProjects {
        _id
      }
      profLanguages
    }
  }
`;

const getUserById = gql`
  query GetUserById($id: String!) {
    getUserById(_id: $id) {
      _id
      firstName
      lastName
      email
      bio
      password
      projects {
        _id
        name
        technologies
        description
      }
      favoriteProjects {
        _id
      }
      profLanguages
    }
  }
`;

const searchUserByName = gql`
  query SearchUserByName($searchTerm: String!) {
    searchUserByName(searchTerm: $searchTerm) {
      _id
      firstName
      lastName
      email
      bio
      password
      projects {
        _id
      }
      favoriteProjects {
        _id
      }
      profLanguages
    }
  }
`;

const comments = gql`
  query Comments {
    comments {
      _id
      user {
        _id
      }
      comment
      project {
        _id
      }
    }
  }
`;

const getCommentsById = gql`
  query GetCommentsById($id: String!) {
    getCommentsById(_id: $id) {
      _id
      user {
        _id
      }
      comment
      project {
        _id
      }
    }
  }
`;

// Mutations

const addComment = gql`
  mutation AddComment(
    $userId: String!
    $comment: String!
    $projectId: String!
  ) {
    addComment(userId: $userId, comment: $comment, projectId: $projectId) {
      _id
      user {
        _id
      }
      comment
      project {
        _id
      }
    }
  }
`;

const addFavoritedProject = gql`
  mutation AddFavoritedProject($userId: String!, $projectId: String!) {
    addFavoritedProject(userId: $userId, projectId: $projectId) {
      _id
      name
      technologies
      description
      creator {
        _id
      }
      comments {
        _id
      }
      favoritedBy {
        _id
      }
      numOfFavorites
    }
  }
`;

const addProject = gql`
  mutation AddProject(
    $name: String!
    $technologies: [Technology!]!
    $description: String!
    $creatorId: String!
  ) {
    addProject(
      name: $name
      technologies: $technologies
      description: $description
      creatorId: $creatorId
    ) {
      _id
      name
      technologies
      description
      creator {
        _id
      }
      comments {
        _id
      }
      favoritedBy {
        _id
      }
      numOfFavorites
    }
  }
`;

const addUser = gql`
  mutation AddUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $bio: String!
    $password: String!
    $profLanguages: [Technology!]!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      bio: $bio
      password: $password
      profLanguages: $profLanguages
    ) {
      _id
      firstName
      lastName
      email
      bio
      password
      projects {
        _id
      }
      favoriteProjects {
        _id
      }
      profLanguages
    }
  }
`;

const deleteComment = gql`
  mutation DeleteComment($id: String!) {
    deleteComment(_id: $id) {
      _id
      user {
        _id
      }
      comment
      project {
        _id
      }
    }
  }
`;

const deleteProject = gql`
  mutation DeleteProject($id: String!) {
    deleteProject(_id: $id) {
      _id
      name
      technologies
      description
      creator {
        _id
      }
      comments {
        _id
      }
      favoritedBy {
        _id
      }
      numOfFavorites
    }
  }
`;

const deleteUser = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(_id: $id) {
      _id
      firstName
      lastName
      email
      bio
      password
      projects {
        _id
      }
      favoriteProjects {
        _id
      }
      profLanguages
    }
  }
`;

const editProject = gql`
  mutation EditProject(
    $id: String!
    $name: String!
    $technologies: [Technology!]!
    $description: String!
    $creatorId: String!
  ) {
    editProject(
      _id: $id
      name: $name
      technologies: $technologies
      description: $description
      creatorId: $creatorId
    ) {
      _id
      name
      technologies
      description
      creator {
        _id
      }
      comments {
        _id
      }
      favoritedBy {
        _id
      }
      numOfFavorites
    }
  }
`;

const editUser = gql`
  mutation EditUser(
    $id: String!
    $firstName: String
    $lastName: String
    $email: String
    $bio: String
    $password: String
    $profLanguages: [Technology!]
  ) {
    editUser(
      _id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      bio: $bio
      password: $password
      profLanguages: $profLanguages
    ) {
      _id
      firstName
      lastName
      email
      bio
      password
      projects {
        _id
      }
      favoriteProjects {
        _id
      }
      profLanguages
    }
  }
`;

const removeFavoritedProject = gql`
  mutation RemoveFavoritedProject($userId: String!, $projectId: String!) {
    removeFavoritedProject(userId: $userId, projectId: $projectId) {
      _id
      name
      technologies
      description
      creator {
        _id
      }
      comments {
        _id
      }
      favoritedBy {
        _id
      }
      numOfFavorites
    }
  }
`;

let exported = {
  projects,
  GetProjectById,
  GetProjectsbyTechnology,
  searchProjectByName,
  users,
  getUserById,
  searchUserByName,
  comments,
  getCommentsById,
  addComment,
  addFavoritedProject,
  addProject,
  addUser,
  deleteComment,
  deleteProject,
  deleteUser,
  editProject,
  editUser,
  removeFavoritedProject,
};

export default exported;
