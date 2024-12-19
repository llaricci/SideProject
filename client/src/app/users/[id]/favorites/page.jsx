"use client";

import Favorites from "@/app/components/Favorites";
import { useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/config/firebaseAuth";

import queries from "../../../queries";

export default function FavoritesList() {
  const { id } = useParams(); // Firebase UID from URL
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        if (user.uid !== id) {
          console.warn("Unauthorized access attempt!");
          router.push("/login"); // Redirect to an unauthorized page or login
        }
      } else {
        router.push("/login"); // Redirect to login if not logged in
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [id, router]);

  const { loading, error, data } = useQuery(queries.GetUserByFirebaseUID, {
    fetchPolicy: "cache-and-network",
    variables: { firebaseUID: id },
    skip: !currentUser || currentUser.uid !== id, // Skip query if unauthorized
  });

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("GraphQL Error:", error);
    router.push("/error");
    return null;
  }

  if (data) {
    const user = data.getUserByFirebaseUID;
    const projects = user.favoriteProjects;

    console.log("User data:", user);
    console.log("Favorite projects:", projects);

    return (
      <div className="flex justify-center min-h-screen bg-white">
        <Favorites favorites={projects} user={user} />
      </div>
    );
  }

  return null;
}
