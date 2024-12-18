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

  console.log(comments);

  const handleAddComment = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const currentUser = {
    _id: "000000000000000000000000", // Replace this with actual authenticated user ID
  };

  const hasUserCommented = comments.some(
    (comment) => comment.user._id === currentUser._id
  );
  
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


      let projectComments = 
        project.comments && project.comments.length > 0
        ? " "
        : "No comments yet"


        let projectImages =
  project.images && project.images.length > 0
    ? project.images.map((image, index) => (
      <img
        key={index}
        src={image}
        alt={`Project Image ${index}`}
        className="rounded-lg"
      />
    )
  ) : (
    "No Images"
  );

  // Image Gallery Stuff
  // Taken from Online
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 1;

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = project.images
    ? project.images.slice(indexOfFirstImage, indexOfLastImage)
    : [];

  const totalPages = Math.ceil(project.images.length / imagesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };


const markdownContent = `
# ${project.name}
by: ${project.creator.firstName} ${project.creator.lastName}

---

## Technologies Used:
- ${projectTechnologies}

---

## Description:
${project.description}

---

## Number of Favorites:
${project.numOfFavorites}

---

## Favorited By:
${projectFavorites}

---

## Comments:

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

      <div className="grid grid-cols-2 gap-2 mx-auto">
          {project.comments && project.comments.length > 0 ? (
            project.comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))
          ) : (
            <p>No comments yet</p>
          )}
        </div>
        <br />

      {/*Taken from Online as well */}
      <h2>Image Gallery:</h2>
      {currentImages.length > 0 ? (
          currentImages.map((image, index) => (
            <img
              key={index}
              src={image}
              width={400} 
              height={200} 
  
              alt={`Project Image ${index}`}
              className="rounded-lg"
            />
          ))
        ) : (
          <p>No Images Available</p>
        )}

        {project.images && project.images.length > imagesPerPage && (
          <div className="pagination">
            <br />
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Previous
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            >
              Next
            </button>
          </div>
        )}

      {!hasUserCommented && currentUser._id != project.creator._id &&
      (
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Add Comment
        </button>
      )}

      <br />


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
