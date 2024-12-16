"use client"

import Favorites from "@/app/components/Favorites";
import { useQuery } from "@apollo/client";
import { useParams, redirect } from "next/navigation";

import queries from "../../../queries";


export default function FavoritesList()
{

    let { id } = useParams();
    const { loading, error, data } = useQuery(queries.getUserById, 
    {
        fetchPolicy: "cache-and-network",
        variables: { id: id },
    });


    if (loading) 
    {
        return <div>Loading...</div>;
    }

    if (error) 
    {
        redirect("/error");
    } 
    
    else if (data) 
    {
        let user = data.getUserById;

        console.log(user);
        let projects = user.favoriteProjects;
        console.log(projects);
        
        return (
            <div>
            <Favorites favorites = {projects} user = {user} />
            </div>
        )
    }
}

