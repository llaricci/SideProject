"use client";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import AllUsersList from "../components/AllUsersList";

export default function AllUsers() {
  const { loading, error, data } = useQuery(queries.users, {
    fetchPolicy: "cache-and-network",
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  } else if (data) {
    let users = data.users;
    return (
      <div className="bg-white ">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">All Users</h1>
          <AllUsersList userList={users} />
          <div className="flex-auto space-x-4"></div>
        </section>
      </div>
    );
  }
}
