"use client";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import AllProjectsList from "../components/AllProjectsList";

export default function AllProjects() {
  const { loading, error, data } = useQuery(queries.projects, {
    fetchPolicy: "cache-and-network",
  });

  const { loading: loading2, error: error2, data: data2 } = useQuery(queries.getUserById, {
    fetchPolicy: "cache-and-network",
    variables: { id: "000000000000000000000000" },
  });


  if (loading || loading2) 
  {
    return <div>Loading...</div>;
  }

  if (error || error2) 
  {
    return <div>Error! {error.message}</div>;
  } 
  
  else if (data && data2) {
    let projects = data.projects;

    let user = data2.getUserById;

    return (
      <div className="bg-white ">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            All Projects
          </h1>
          <AllProjectsList projectList={projects} currentUser ={user} />
          <div className="flex-auto space-x-4"></div>
        </section>
      </div>
    );
  }
}
