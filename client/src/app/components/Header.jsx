"use client";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import AllProjectsList from "../components/AllProjectsList";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/config/firebaseAuth";

export default function AllProjects() {
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

  const { loading, error, data } = useQuery(queries.projects, {
    fetchPolicy: "cache-and-network",
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
    return <div>Please log in to view projects.</div>;
  }

  if (error || error2) {
    return <div>Error! {error?.message || error2?.message}</div>;
  }

  if (data && data2) {
    const projects = data.projects;
    const currentUser = data2.getUserByFirebaseUID;

    return (
      <div className="bg-white">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            All Projects
          </h1>
          <AllProjectsList projectList={projects} currentUser={currentUser} />
          <div className="flex-auto space-x-4"></div>
        </section>
      </div>
    );
  }

  return <div>No data available.</div>;
}
