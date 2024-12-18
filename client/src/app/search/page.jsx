"use client";

import Search from "../components/Search";

import { useQuery } from "@apollo/client";

import queries from "../queries.jsx"


const SearchBarPage = () => 
{
    const { loading, error, data } = useQuery(queries.getUserById, {
        fetchPolicy: "cache-and-network",
        variables: { id: "000000000000000000000000" },
      });

      if (loading) 
        {
          return <div>Loading...</div>;
        }
      
        if (error) 
        {
          return <div>Error! {error.message}</div>;
        } 

       else if (data)
        {
            let user = data.getUserById;
            
            return (
                <div className = "bg-white text-black">
                    <Search currentUser = {user}  />
                </div>
                );
        }
};


export default SearchBarPage;
