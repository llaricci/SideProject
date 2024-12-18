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
import AllUsersList from "./AllUsersList";
import AllProjectsList from "./AllProjectsList";

const technologies = [
  "JavaScript",
  "Python",
  "Java",
  "CSharp",
  "CPlusPlus",
  "Ruby",
  "PHP",
  "TypeScript",
  "Swift",
  "Kotlin",
  "Go",
  "Rust",
  "HTML",
  "CSS",
  "SQL",
  "GraphQL",
  "NodeJS",
  "React",
  "Angular",
  "Vue",
  "NextJS",
  "Svelte",
  "TailwindCSS",
  "Bootstrap",
  "AWS",
  "GoogleCloud",
  "OracleCloud",
  "Docker",
  "Kubernetes",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Firebase",
  "Git",
  "GitHub",
  "Other"
];


const Search = ({currentUser}) => {
  const router = useRouter();
  const [searchType, setSearchType] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [projectsByTechnology, { data: projectsByTechData }] = useLazyQuery(GetProjectsbyTechnology);
  const [projectByName, { data: projectsData }] = useLazyQuery(searchProjectByName);
  const [userByName, { data: usersData }] = useLazyQuery(searchUserByName);
  const [results, setResults] = useState(<></>);

  const handleSearch = async () => {
    setError("");
    setSearchResults([]); // Clear previous results
  
    if (!queryInput) {
      setResults(<></>);
      setError("Please enter a search query");
      return;
    }
    try {
      if (searchType === "projectsByTechnology") {
        const { data } = await projectsByTechnology({
          variables: { technology: queryInput },
        });
        setSearchResults(data?.getProjectsByTechnology || []);
      } else if (searchType === "projectByName") {
        const { data } = await projectByName({
          variables: { searchTerm: queryInput },
        });
        setSearchResults(data?.searchProjectByName || []);
      } else if (searchType === "userByName") {
        const { data } = await userByName({
          variables: { searchTerm: queryInput },
        });
        setSearchResults(data?.searchUserByName || []);
      } else {
        setResults(<></>);
        setError("Please select a search type");
      }
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("An error occurred while fetching results.");
    }
  };
  

  const renderResults = () => {
    if (
      searchType === "projectsByTechnology" &&
      projectsByTechData?.getProjectsByTechnology
    ) {
      return (
        <AllProjectsList projectList={searchResults} currentUser = {currentUser}/>
      );
    }

    if (searchType === "projectByName" && projectsData?.searchProjectByName) {

      //console.log(projectsData);
      //console.log(user);


      return (
        <AllProjectsList projectList={searchResults} currentUser = {currentUser}/>
      );
    }

    if (searchType === "userByName" && usersData?.searchUserByName) {
      return (
        <AllUsersList userList={searchResults}></AllUsersList>
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

        {searchResults.length === 0 ? (
          <Typography>No results found</Typography>
        ) : (
          renderResults()
        )}
      </Box>

    </Box>
  );
};

export default Search;
