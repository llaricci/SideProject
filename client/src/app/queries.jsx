import { gql } from "@apollo/client";

const projects = gql`
  query Projects {
    projects {
      _id
      name
      technologies
      bio
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
      bio
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
      bio
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
      bio
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
      description
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

const getUserById = gql`
  query GetUserById($id: String!) {
    getUserById(_id: $id) {
      _id
      firstName
      lastName
      email
      description
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

const searchUserByName = gql`
  query SearchUserByName($searchTerm: String!) {
    searchUserByName(searchTerm: $searchTerm) {
      _id
      firstName
      lastName
      email
      description
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
