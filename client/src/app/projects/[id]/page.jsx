"use client";

import Project from "@/app/components/Project";

import { useQuery, useMutation } from "@apollo/client";
import { useParams, redirect } from "next/navigation";

import React from "react";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import queries from "../../queries";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/config/firebaseAuth";
export default function ProjectPage() {
  let { id } = useParams();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("onAuthStateChanged fired, currentUser:", currentUser);
      if (currentUser) {
        setUser({ uid: currentUser.uid }); // Use Firebase UID
      } else {
        setUser(null);
      }
      setAuthLoading(false); // Finish loading auth state
    });

    return () => unsubscribe(); // Clean up subscription
  }, []);

  const { loading, error, data } = useQuery(queries.GetProjectById, {
    fetchPolicy: "cache-and-network",
    variables: { id: id },
  });

  const {
    loading: loading2,
    error: error2,
    data: data2,
  } = useQuery(queries.GetUserByFirebaseUID, {
    fetchPolicy: "cache-and-network",
    variables: user?.uid ? { firebaseUID: user.uid } : undefined,
    skip: !user?.uid, // Skip if user.uid is not available
  });

  if (authLoading || loading || loading2) {
    return <div>Loading...</div>;
  }
  if (!user?.uid) {
    return <div>Please log in to view a users Profile.</div>;
  }
  if (error || error2) {
    redirect("/error");
  } else if (data && data2) {
    let project = data.getProjectById;
    let user = data2.getUserByFirebaseUID;

    return (
      <div>
        <Project project={project} currentUser={user} />
      </div>
    );
  }
}
