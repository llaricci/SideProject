"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/config/firebaseAuth";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { redirect } from "next/navigation";

function LoginPage() {
  let [formData, setFormData] = useState({ email: "", password: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <div className="justify-center items-center flex bg-white text-black">
      <form
        className="p-10 flex flex-col gap-4 min-h-screen"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("formData", formData);
          // currently creates account instead of signing in, but it works
          signInWithEmailAndPassword(auth, formData.email, formData.password)
            .then((user) => {
              console.log(user);

              // use their firebase ID to access the graphql user, (that needs to be a new field)
              
              // if user matches, redirect to their profile page
              // if no user matches, create one.
            })
            .catch((error) => {
              console.log(error);
            });
          redirect("/");
        }}
      >
        <h1 className="text-2xl font-bold text-center">Login Form</h1>
        <label className="grid grid-cols-3 items-center text-black">
          <span className="text-right pr-4">Email:</span>
          <input
            type="email"
            name="email"
            className=" p-2 border border-gray-300 rounded"
            required
            autoFocus
            onChange={onChange}
          />
        </label>
        <label className="grid grid-cols-3 items-center text-black">
          <span className="text-right pr-4">Password:</span>
          <input
            type="password"
            name="password"
            className=" p-2 border border-gray-300 rounded"
            required
            onChange={onChange}
          />
        </label>
        <label className="grid grid-cols-3 items-center text-black">
          <span className="text-right pr-4"></span>
          <button type="submit" className="p-2 border border-gray-300 bg-blue rounded">
            Log In
          </button>
        </label>
      </form>
    </div>
  );
}

export default LoginPage;
