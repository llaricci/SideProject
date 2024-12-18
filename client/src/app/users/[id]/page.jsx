"use client";

import Profile from "../../components/Profile";
import ProjectList from "../../components/ProjectList";

import { useQuery, useMutation } from "@apollo/client";
import { useParams, redirect } from "next/navigation";

import { useState, useEffect } from "react";

import queries from "../../queries";

export default function ProfilePage() {
  let { id } = useParams();

  let [owner, setOwner] = useState(false);
  const projects = useQuery(queries.projects);
  const { loading, error, data } = useQuery(queries.getUserById, {
    fetchPolicy: "cache-and-network",
    variables: { id: id },
  });

  // Mimic being logged in as "Fuecoco FireCroc"
  const {
    loading: loading2,
    error: error2,
    data: data2,
  } = useQuery(queries.getUserById, {
    fetchPolicy: "cache-and-network",
    variables: { id: "000000000000000000000000" },
  });

  useEffect(() => {
    if (data && data2) {
      const currentUser = data2.getUserById;
      const user = data.getUserById;

      if (currentUser._id === user._id) {
        setOwner(true);
      }
    }
  }, [data, data2]);

  if (loading || loading2) {
    return <div>Loading...</div>;
  }

  if (error || error2) {
    redirect("/error");
  } else if (data && data2) {
    let user = data.getUserById;
    let projects = user.projects;

    let favoritedProjects = data2.getUserById.favoriteProjects;
    let currentUser = data2.getUserById;

    console.log(projects);

    console.log(user);

    return (
      <div className="min-h-screen flex">
        <div className="w-1/3 h-screen bg-blue-200 overflow-hidden flex flex-col">
          <Profile user={user} isOwner={owner} />
        </div>

        <div className="w-2/3 h-screen bg-blue-500 overflow-y-auto flex flex-col">
          <ProjectList
            user={user}
            projectList={projects}
            isOwner={owner}
            currentUser={currentUser}
            favorites={favoritedProjects}
          />
        </div>
      </div>
    );
  }
}
