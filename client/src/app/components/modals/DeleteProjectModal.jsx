import React, { useState } from "react";
import "../../globals.css";
import { useMutation, useQuery } from "@apollo/client";
import ReactModal from "react-modal";
import queries from "../../queries";

ReactModal.setAppElement("#__next");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    border: "1px solid #28547a",
    borderRadius: "4px",
    color: "black",
  },
};

function DeleteProjectModal(props) {
  const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
  const [project, setProject] = useState(props.project.project);
  const [error, setError] = useState("");
  const [deleteProject] = useMutation(queries.deleteProject, {
    refetchQueries: [
      {
        query: queries.getUserById,
        variables: { id: props.user._id },
      },
    ],
    update(cache) {
      cache.modify({
        fields: {
          projects(existingProjects, { readField }) {
            return existingProjects.filter(
              (projectRef) => project._id !== readField("_id", projectRef)
            );
          },
        },
      });
    },
  });
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    props.handleClose();
  };

  const projectSubmit = async (e) => {
    //e.preventDefault();

    try {
      await deleteProject({
        variables: {
          id: project._id,
        },
      });

      // alert("Project successfully deleted");

      setError("");
      props.handleClose();
    } catch (e) {
      setError(e.message);
      return;
    }
  };

  return (
    <div>
      <ReactModal
        name="deleteProjectModal"
        isOpen={showDeleteModal}
        contentLabel="Delete project"
        style={customStyles}
      >
        <br />
        <h1 className="text-2xl font-bold mb-4 text-center">
          Delete Project Form
        </h1>
        <h3 className="text-red-500 text-xl mb-4 text-center font-bold underline ">
          {error}
        </h3>
        <label className="block text-2xl font-medium mb-1">
          Are you sure you want to delete project: {project.name}?
        </label>
        <br />
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={projectSubmit}
          >
            Delete Project
          </button>
          <button
            type="button"
            onClick={handleCloseDeleteModal}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </ReactModal>
    </div>
  );
}

export default DeleteProjectModal;
