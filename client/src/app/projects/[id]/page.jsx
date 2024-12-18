"use client";

import Project from "@/app/components/Project";

import { useQuery, useMutation } from "@apollo/client";
import { useParams, redirect } from "next/navigation";

import React from "react";
import ReactMarkdown from "react-markdown";

import queries from "../../queries";

export default function ProjectPage() {
  let { id } = useParams();

  const { loading, error, data } = useQuery(queries.GetProjectById, {
    fetchPolicy: "cache-and-network",
    variables: { id: id },
  });

  const { loading: loading2, error: error2, data: data2 } = useQuery(queries.getUserById, {
    fetchPolicy: "cache-and-network",
    variables: { id: "000000000000000000000000" },
  });

  if (loading || loading2) 
  {
    return <div>Loading...</div>;
  }

  if (error || error2) 
  {
    redirect("/error");
  } 
  
  else if (data && data2) 
  {
    let project = data.getProjectById;
    let user = data2.getUserById;

    return (
      <div>
        <Project project={project} currentUser = {user} />
      </div>
    );
  }
}
