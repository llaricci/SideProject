"use client";

import Profile from "../../components/Profile";
import ProjectList from "../../components/ProjectList";

export default function ProfilePage() {
    const testUser = {
        _id: "TestID123",
        name: "Fuecoco FireCroc",
        email: "fuecoco@example.com",
        bio: "A fire croc looking for a job! Have 5+ years of experience with React and 2 years with NextJS!",
        profLanguages: ["C++", "Javascript", "Python", "NextJS", "TailwindCSS", "Svelte", "PostGreSQL"],
        image: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/909.png",
    };

    const projectList = [
        {
            _id: "1",
            name: "Roommate Roulette",
            technologies: ["HTML", "CSS", "Javascript"],
            description: "Roommate Roulette is a full-stack web application designed to help other people find roommate groups with people living in the same area.",
            creator: "Fuecoco Firecroc",
            favorites: ["Quaxly Waterduck", "Sprigatito GrassCat"],
            numOfFavorites: 2,
            comments: [
                {
                    user: "Reshiram",
                    comment: "Very helpful application"
                },
                {
                    user: "Zekrom",
                    comment: "Useful and innovative application"
                }
            ]
        },
        {
            _id: "2",
            name: "TaskMaster",
            technologies: ["React", "Node.js", "MongoDB"],
            description: "TaskMaster is a productivity web application that helps users organize and prioritize their tasks and projects.",
            creator: "Arcanine Firehound",
            favorites: ["Togekiss ", "Lucario Fighter"],
            numOfFavorites: 2,
            comments: [
                {
                    user: "Pikachu",
                    comment: "Great tool for managing my tasks"
                },
                {
                    user: "Eevee",
                    comment: "Love the clean interface and user-friendly design"
                }
            ]
        },
        {
            _id: "3",
            name: "BookHub",
            technologies: ["Vue.js", "Express", "MySQL"],
            description: "BookHub is a platform where users can discover and discuss books, share reviews, and build reading lists.",
            creator: "Charizard Dragon",
            favorites: ["Snorlax Sleepyhead", "Gengar Ghostly"],
            numOfFavorites: 2,
            comments: [
                {
                    user: "Bulbasaur",
                    comment: "A fantastic platform for book lovers!"
                },
                {
                    user: "Squirtle",
                    comment: "Great recommendations and easy to use"
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen flex">
            <div className="w-1/3 h-screen bg-blue-200 overflow-hidden flex flex-col">
                <Profile user={testUser} />
            </div>

            <div className="w-2/3 h-screen bg-blue-500 overflow-y-auto flex flex-col">
                <ProjectList projectList={projectList} />
            </div>
        </div>
    );
}
