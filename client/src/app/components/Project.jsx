import React from "react";
import ReactMarkdown from "react-markdown";

import Comment from "../components/Comment";
import AddCommentModal from "./modals/AddCommentModal";

import queries from "../queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";

function Project({ project }) 
{

  const [isModalOpen, setModalOpen] = useState(false);
  const [comments, setComments] = useState(project.comments || []);

  const handleAddComment = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const currentUser = {
    _id: "000000000000000000000000", // Replace this with actual authenticated user ID
  };
  
    let projectTechnologies = 
        project.technologies
            ? `${project.technologies.join(", ")}`
            : "No technologies listed.";

    let projectFavorites = 
        project.favoritedBy && project.favoritedBy.length > 0
        ? project.favoritedBy
            .map(
            (user) => `- ${user.firstName} ${user.lastName} (${user.email})`
            )
            .join("\n")
        : "No users"
  
    const markdownContent = `

# ${project.name}
by: ${project.creator.firstName} ${project.creator.lastName}

---

## Technologies Used
- ${projectTechnologies}

    ---

    ## Description
    - ${project.description}

    ---

    ## Number of Favorites
    - ${project.numOfFavorites}

    ---  

    ## Favorited By

    - ${projectFavorites}

    ---
    ## Comments
    -  

    `;

  return (
    <div
      className="justify-items-center bg-white text-white"
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
      }}
    >
      <div className="w-1/2 bg-gray-300 shadow-2xl text-black rounded-xl shadow-black/50">
        <ReactMarkdown className="markdown-content prose lg:prose-lg">
          {markdownContent}
        </ReactMarkdown>
        <style>
          {`        h1 { font-size: 2.5rem; font-weight: bold; }
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

      {currentUser._id != project.creator._id &&
      (
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Add Comment
        </button>
      )}
      </div>

      <AddCommentModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          projectId={project._id}
          userId={currentUser._id} 
          onCommentAdded={handleAddComment}
        />

    </div>
  );
}

export default Project;
