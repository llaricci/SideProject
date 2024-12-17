"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/config/firebaseAuth";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import { useParams, redirect } from "next/navigation";

function SignupPage() {
  const [error, setError] = useState("");
  const [technologies, setTechnologies] = useState([
    "JavaScript",
  "Python",
  "Java",
  "CSharp",
  "CPlusPlus",
  "Ruby",
  "PHP",
  "TypeScript",
  "Swift",
  "Kotlin",
  "Go",
  "Rust",
  "HTML",
  "CSS",
  "SQL",
  "GraphQL",
  "NodeJS",
  "React",
  "Angular",
  "Vue",
  "NextJS",
  "Svelte",
  "TailwindCSS",
  "Bootstrap",
  "AWS",
  "GoogleCloud",
  "OracleCloud",
  "Docker",
  "Kubernetes",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Firebase",
  "Git",
  "GitHub",
  "Other"
  ]);
  const [addUser] = useMutation(queries.addUser);
  let [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    bio: "",
    technologies: [],
  });
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
          const selectedTechnologies = new FormData(e.target).getAll(
            "technologies"
          );

          if (selectedTechnologies.length <= 0) {
            setError("At least one technology must be checked!");
            return;
          }
          // currently creates account instead of signing in, but it works
          createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          )
            .then((user) => {
              console.log(user);
              addUser({
                variables: {
                  email: formData.email,
                  password: formData.password,
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  bio: formData.bio,
                  profLanguages: selectedTechnologies,
                },
              });
              setError("");
              redirect("/users");
            })
            .catch((error) => {
              console.log(error.message);
              if (
                error.message === "Firebase: Error (auth/email-already-in-use)."
              ) {
                signInWithEmailAndPassword(
                  auth,
                  formData.email,
                  formData.password
                ).then((user) => {
                  console.log(user);
                  // fix this to go to user profile
                  redirect("/users");
                });
              }
              setError(error.message);
              // check if it's an "already exists error", they try to sign them in instead
            });
        }}
      >
        {error && <div className="text-red-500">{error}</div>}
        <label className="grid grid-cols-3 items-center">
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
        <label className="grid grid-cols-3 items-center">
          <span className="text-right pr-4">Password:</span>
          <input
            type="password"
            name="password"
            className=" p-2 border border-gray-300 rounded"
            required
            onChange={onChange}
          />
        </label>
        <label className="grid grid-cols-3 items-center">
          <span className="text-right pr-4">First Name:</span>
          <input
            type="text"
            name="firstName"
            className=" p-2 border border-gray-300 rounded"
            required
            onChange={onChange}
          />
        </label>
        <label className="grid grid-cols-3 items-center">
          <span className="text-right pr-4">Last Name:</span>
          <input
            type="text"
            name="lastName"
            className=" p-2 border border-gray-300 rounded"
            required
            onChange={onChange}
          />
        </label>
        <label className="grid grid-cols-3 items-center">
          <span className="text-right pr-4">Bio:</span>
          <input
            type="text"
            name="bio"
            className=" p-2 border border-gray-300 rounded"
            required
            onChange={onChange}
          />
        </label>
        <label className="text-xl font- mb-1"> Technologies Used: </label>
        <div className="grid grid-cols-6 gap-1">
          {technologies.map((tech) => (
            <div key={tech} className="mb-2">
              <input
                type="checkbox"
                id={tech.toLowerCase()}
                name="technologies"
                value={tech}
                className="mr-2"
              />
              <label htmlFor={tech.toLowerCase()}>{tech}</label>
            </div>
          ))}
        </div>
        <label className="grid grid-cols-3 items-center">
          <span className="text-right pr-4"></span>
          <button type="submit" className="p-2 border border-gray-300 rounded">
            Sign Up
          </button>
        </label>
      </form>
    </div>
  );
}

export default SignupPage;
