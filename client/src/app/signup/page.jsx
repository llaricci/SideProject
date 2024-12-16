"use client";
import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/config/firebaseAuth";
import { createUserWithEmailAndPassword } from "@firebase/auth";

function SignupPage() {
  let [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    bio: '',
  });
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <div className="justify-center items-center flex">
      <form className="p-10 flex flex-col gap-4 min-h-screen" onSubmit={(e) => {
        e.preventDefault();
        console.log('formData', formData);
        // currently creates account instead of signing in, but it works
        createUserWithEmailAndPassword(auth, formData.email, formData.password).then((user) => {
          console.log(user);
          // create the graphql user
        }).catch((error) => {
          console.log(error);
          // check if it's an "already exists error", they try to sign them in instead
        });
      }}>
        <label className="grid grid-cols-3 items-center">
          <span className="text-right pr-4">Email:</span>
          <input type="email" name="email" className=" p-2 border border-gray-300 rounded" required autoFocus
                 onChange={onChange}/>
        </label>
        <label className="grid grid-cols-3 items-center">
          <span className="text-right pr-4">Password:</span>
          <input type="password" name="password" className=" p-2 border border-gray-300 rounded" required
                 onChange={onChange}/>
        </label>
        <label className="grid grid-cols-3 items-center">
          <span className="text-right pr-4">First Name:</span>
          <input type="text" name="firstName" className=" p-2 border border-gray-300 rounded" required
                 onChange={onChange}/>
        </label>
        <label className="grid grid-cols-3 items-center">
          <span className="text-right pr-4">Last Name:</span>
          <input type="text" name="lastName" className=" p-2 border border-gray-300 rounded" required
                 onChange={onChange}/>
        </label>
        <label className="grid grid-cols-3 items-center">
          <span className="text-right pr-4">Bio:</span>
          <input type="text" name="bio" className=" p-2 border border-gray-300 rounded" required
                 onChange={onChange}/>
        </label>
        <label className="grid grid-cols-3 items-center">
          <span className="text-right pr-4"></span>
          <button type="submit" className="p-2 border border-gray-300 rounded">Log In</button>
        </label>
      </form>
    </div>
  );
}

export default SignupPage;