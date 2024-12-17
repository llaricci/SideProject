"use client";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import AllProjectsList from "../components/AllProjectsList";

export default function AllProjects() {
  const { loading, error, data } = useQuery(queries.projects, {
    fetchPolicy: "cache-and-network",
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  } else if (data) {
    let projects = data.projects;
    return (
      <div className="bg-white ">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            All Projects
          </h1>
          <AllProjectsList projectList={projects} />
          <div className="flex-auto space-x-4"></div>
        </section>
      </div>
    );
  }
}
