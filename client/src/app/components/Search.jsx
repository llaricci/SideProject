"use client";

import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { TextField, Button, MenuItem, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  searchProjectByName,
  searchUserByName,
  GetProjectsbyTechnology,
} from "../queries";
const technologies = [
  "JAVASCRIPT",
  "PYTHON",
  "JAVA",
  "CSHARP",
  "CPLUSPLUS",
  "RUBY",
  "PHP",
  "TYPESCRIPT",
  "SWIFT",
  "KOTLIN",
  "GO",
  "RUST",
  "HTML",
  "CSS",
  "SQL",
  "GRAPHQL",
  "NODE_JS",
  "REACT",
  "ANGULAR",
  "VUE",
  "NEXT_JS",
  "SVELTE",
  "TAILWINDCSS",
  "BOOTSTRAP",
  "AWS",
  "GOOGLE_CLOUD",
  "ORACLE_CLOUD",
  "DOCKER",
  "KUBERNETES",
  "MONGODB",
  "POSTGRESQL",
  "REDIS",
  "FIREBASE",
  "GIT",
  "GITHUB",
  "OTHER",
];
const Search = () => {
  const router = useRouter();
  const [searchType, setSearchType] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [projectsByTechnology, { data: projectsByTechData }] = useLazyQuery(
    GetProjectsbyTechnology
  );
  const [projectByName, { data: projectsData }] =
    useLazyQuery(searchProjectByName);
  const [userByName, { data: usersData }] = useLazyQuery(searchUserByName);
  const [results, setResults] = useState(<></>);
  useEffect(() => {
    if (searchResults.length === 0) {
      setResults(<Typography>{"No results found"}</Typography>);
    } else {
      setResults(renderResults());
    }
    setError("");
  }, [searchResults]);
  const handleSearch = async () => {
    setError("");
    if (!queryInput) {
      setResults(<></>);
      setError("Please enter a search query");
      return;
    }
    if (searchType === "projectsByTechnology") {
      await projectsByTechnology({
        variables: { technology: queryInput.toUpperCase() },
      }).then((res) => {
        setSearchResults(res.data.getProjectsByTechnology);
      });
    } else if (searchType === "projectByName") {
      await projectByName({ variables: { searchTerm: queryInput } }).then(
        (res) => {
          setSearchResults(res.data.searchProjectByName);
        }
      );
    } else if (searchType === "userByName") {
      await userByName({ variables: { searchTerm: queryInput } }).then(
        (res) => {
          setSearchResults(res.data.searchUserByName);
        }
      );
    } else {
      setResults(<></>);
      setError("Plesae select a search type");
    }
  };
  const renderResults = () => {
    if (
      searchType === "projectsByTechnology" &&
      projectsByTechData?.getProjectsByTechnology
    ) {
      return (
        <ul>
          {searchResults.map((project) => (
            <li
              key={project._id}
              onClick={() => router.push(`/projects/${project._id}`)}
            >
              {project.name} - {project.technologies.join(",  ")}
            </li>
          ))}
        </ul>
      );
    }

    if (searchType === "projectByName" && projectsData?.searchProjectByName) {
      return (
        <ul>
          {searchResults.map((project) => (
            <li
              key={project._id}
              onClick={() => router.push(`/projects/${project._id}`)}
            >
              {project.name}
            </li>
          ))}
        </ul>
      );
    }

    if (searchType === "userByName" && usersData?.searchUserByName) {
      return (
        <ul>
          {searchResults.map((user) => (
            <li
              key={user._id}
              onClick={() => router.push(`/users/${user._id}`)}
            >
              {user.firstName}-{user.lastName.substring(0, 1)}
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search
      </Typography>

      <Box sx={{ marginBottom: 2, backgroundColor: "#ffffff" }}>
        <TextField
          select
          label="Search Type"
          value={searchType}
          onChange={(e) => {
            setQueryInput("");
            setSearchType(e.target.value);
            setError("");
          }}
          fullWidth
        >
          <MenuItem value="projectsByTechnology">
            Projects by Technology
          </MenuItem>
          <MenuItem value="projectByName">Projects by Name</MenuItem>
          <MenuItem value="userByName">User by Name</MenuItem>
        </TextField>
      </Box>

      {searchType && searchType != "projectsByTechnology" && (
        <TextField
          label="Search Query"
          value={queryInput}
          onChange={(e) => {
            setQueryInput(e.target.value);
            setError("");
          }}
          fullWidth
          required
          sx={{ marginBottom: 2, backgroundColor: "#ffffff" }}
        />
      )}
      {searchType && searchType === "projectsByTechnology" && (
        <Box sx={{ marginBottom: 2, backgroundColor: "#ffffff" }}>
          <TextField
            select
            label="Search Technology"
            value={queryInput}
            onChange={(e) => {
              setQueryInput(e.target.value);
              setError("");
            }}
            fullWidth
            required
          >
            {technologies.map((tech) => (
              <MenuItem key={tech} value={tech}>
                {tech}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6">Results:</Typography>
        {error && <Typography color="error">{error}</Typography>}
        {results}
      </Box>
    </Box>
  );
};

export default Search;
