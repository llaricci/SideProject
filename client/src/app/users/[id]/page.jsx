"use client"

import Profile from "../../components/Profile";
import ProjectList from "../../components/ProjectList";

import {useQuery, useMutation} from '@apollo/client';
import { useParams, redirect  } from 'next/navigation'



import queries from '../../queries';

export default function ProfilePage() 
{
  let {id} = useParams();

  const {loading, error, data} = useQuery(queries.getUserById,
    {
        fetchPolicy: 'cache-and-network',
        variables: {id: id},
    });

    if (loading)
    {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if (error) {
        redirect('/error');
      }

    else if (data)
    {
        let user = data.getUserById;
        let projects = user.projects;

        console.log(user);
        return (
            <div className="min-h-screen flex">
            <div className="w-1/3 h-screen bg-blue-200 overflow-hidden flex flex-col">
                <Profile user={user} />
            </div>

            <div className="w-2/3 h-screen bg-blue-500 overflow-y-auto flex flex-col">
                <ProjectList projectList={projects} />
            </div>
            </div>
        );
    }
}
