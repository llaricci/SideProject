"use client";

import Profile from "../../components/Profile";
import ProjectList from "../../components/ProjectList";

import { useQuery, useMutation } from "@apollo/client";
import { useParams, redirect } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/config/firebaseAuth";
import { useState, useEffect } from "react";

import queries from "../../queries";

export default function ProfilePage() {
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

  let [owner, setOwner] = useState(false);
  const projects = useQuery(queries.projects);
  const { loading, error, data } = useQuery(queries.GetUserByFirebaseUID, {
    fetchPolicy: "cache-and-network",
    variables: { firebaseUID: id },
  });

  // Mimic being logged in as "Fuecoco FireCroc"
  const {
    loading: loading2,
    error: error2,
    data: data2,
  } = useQuery(queries.GetUserByFirebaseUID, {
    fetchPolicy: "cache-and-network",
    variables: user?.uid ? { firebaseUID: user.uid } : undefined,
    skip: !user?.uid, // Skip if user.uid is not available
  });

  useEffect(() => {
    if (data && data2) {
      const currentUser = data2.getUserByFirebaseUID;
      const user = data.getUserByFirebaseUID;

      if (currentUser?._id === user._id) {
        setOwner(true);
      }
    }
  }, [data, data2]);

  if (authLoading || loading || loading2) {
    return <div>Loading...</div>;
  }
  if (!user?.uid) {
    return <div>Please log in to view a users Profile.</div>;
  }

  if (error || error2) {
    redirect("/error");
  } else if (data && data2) {
    let user = data.getUserByFirebaseUID;
    let projects = user?.projects;

    let favoritedProjects = data2.getUserByFirebaseUID?.favoriteProjects || [];
    let currentUser = data2.getUserByFirebaseUID;

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
