import React from "react";
import ReactMarkdown from "react-markdown";

import Comment from "../components/Comment";

import queries from "../queries";
import { useQuery } from "@apollo/client";

let comment = {
  user: {
    _id: "testuser",
    firstName: "Fuecoco",
    lastName: "FireCroc",
    email: "fuecoco@example.com",
  },
  comment: "Nice project! Great use of GraphQL and TailwindCSS!",
};

function Project({ project }) {
  const markdownContent = `
    # ${project.name}
    by: ${project.creator.firstName} ${project.creator.lastName}
    ---
    ## Technologies Used
    - ${project.technologies.map((technology) => `${technology}`).join(", ")}

    ---

    ## Description
    - ${project.description}

    ---

    ## Number of Favorites
    - ${project.numOfFavorites}

    ---  

    ## Favorited By
    ${
      project.favorites && project.favorites.length > 0
        ? project.favorites
            .map(
              (user) => `- ${user.firstName} ${user.lastName} (${user.email})`
            )
            .join("\n")
        : "No users"
    }
    ---
    ## Comments

    `;

  return (
    <div
      className="justify-items-center"
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
      }}
    >
      <div className="w-1/2">
        <ReactMarkdown className="markdown-content prose lg:prose-lg">
          {markdownContent}
        </ReactMarkdown>
        <style>
          {` h1 { font-size: 2.5rem; font-weight: bold; }
                    h2 { font-size: 2rem; font-weight: bold; }
                    h3 { font-size: 1.75rem; font-weight: bold; }
                    p { font-size: 1rem; }
                    hr { border: none; border-top: 2px solid #ccc;  margin: 1.5rem 0; } `}
        </style>
        {project.images &&
          project.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Project Image ${index}`}
              className="rounded-lg"
            />
          ))}
        <div className="grid grid-cols-2 gap-2 mx-auto">
          {project.comments &&
            project.comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Project;
