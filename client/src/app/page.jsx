import Image from "next/image";
import logo from "./logo.png";

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Image src={logo} width={100} height={100} alt="Project Logo" />

      <br />

      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to SideProject
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The portfolio app for programmers!
        </p>
        <div className="flex-auto space-x-4">
          <a
            href="/signup"
            className="px-6 py-3 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Register
          </a>
          <a
            href="/login"
            className="px-6 py-3 text-blue-500 bg-white border border-blue-500 rounded-md shadow-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Login
          </a>
        </div>
      </section>
    </div>
  );
}
