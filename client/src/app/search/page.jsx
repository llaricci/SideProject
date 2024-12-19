"use client";

import Search from "../components/Search";

import { useQuery } from "@apollo/client";

import queries from "../queries.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/config/firebaseAuth";
import { useState, useEffect } from "react";
const SearchBarPage = () => {
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
  const { loading, error, data } = useQuery(queries.GetUserByFirebaseUID, {
    fetchPolicy: "cache-and-network",
    variables: user?.uid ? { firebaseUID: user.uid } : undefined,
    skip: !user?.uid, // Skip if user.uid is not available
  });

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }
  if (!user?.uid) {
    return <div>Please log in to view a users Profile.</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  } else if (data) {
    let user = data.getUserByFirebaseUID;

    return (
      <div className="bg-white text-black">
        <Search currentUser={user} />
      </div>
    );
  }
};

export default SearchBarPage;
