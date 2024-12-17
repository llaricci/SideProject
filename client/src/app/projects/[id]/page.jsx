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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    redirect("/error");
  } else if (data) {
    let project = data.getProjectById;

    return (
      <div>
        <Project project={project} />
      </div>
    );
  }
}
