"use client";

import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { TextField, Button, MenuItem, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  searchProjectByName,
  searchUserByName,
  GetProjectsbyTechnology,
} from "../queries";

const Search = () => {
  const router = useRouter();
  const [searchType, setSearchType] = useState("");
  const [queryInput, setQueryInput] = useState("");

  const [projectsByTechnology, { data: projectsByTechData }] = useLazyQuery(
    GetProjectsbyTechnology
  );
  const [projectByName, { data: projectsData }] =
    useLazyQuery(searchProjectByName);
  const [userByName, { data: usersData }] = useLazyQuery(searchUserByName);

  const handleSearch = () => {
    console.log("searchType: ", searchType);
    console.log("queryInput: ", queryInput);
    if (searchType === "projectsByTechnology") {
      projectsByTechnology({
        variables: { technology: queryInput.toUpperCase() },
      });
    } else if (searchType === "projectByName") {
      projectByName({ variables: { searchTerm: queryInput } });
    } else if (searchType === "userByName") {
      userByName({ variables: { searchTerm: queryInput } });
    } else {
      console.log("Invalid search type.");
    }
  };

  const renderResults = () => {
    if (
      searchType === "projectsByTechnology" &&
      projectsByTechData?.getProjectsByTechnology
    ) {
      console.log(
        "projectsByTechData: ",
        projectsByTechData.getProjectsByTechnology
      );
      return (
        <ul>
          {projectsByTechData.getProjectsByTechnology.map((project) => (
            <li
              key={project._id}
              onClick={() => router.push(`/projects/${project._id}`)}
            >
              {project.name} - {project.technologies}
            </li>
          ))}
        </ul>
      );
    }

    if (searchType === "projectByName" && projectsData?.searchProjectByName) {
      console.log("projectsData: ", projectsData);
      return (
        <ul>
          {projectsData.searchProjectByName.map((project) => (
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
      console.log("usersData: ", usersData);
      return (
        <ul>
          {usersData.searchUserByName.map((user) => (
            <li
              key={user._id}
              onClick={() => router.push(`/users/${user._id}`)}
            >
              {user.firstName} {user.lastName.substring(0, 1)}
            </li>
          ))}
        </ul>
      );
    }

    return <Typography>No results found for {queryInput}</Typography>;
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
          onChange={(e) => setSearchType(e.target.value)}
          fullWidth
        >
          <MenuItem value="projectsByTechnology">
            Projects by technology
          </MenuItem>
          <MenuItem value="projectByName">Projects by Name</MenuItem>
          <MenuItem value="userByName">User by Name</MenuItem>
        </TextField>
      </Box>

      {searchType && (
        <TextField
          label="Search Query"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2, backgroundColor: "#ffffff" }}
        />
      )}

      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6">Results:</Typography>
        {renderResults()}
      </Box>
    </Box>
  );
};

export default Search;
