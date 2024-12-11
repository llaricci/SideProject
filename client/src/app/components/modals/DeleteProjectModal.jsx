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
    width: "50%",
    border: "1px solid #28547a",
    borderRadius: "4px",
    color: "black",
  },
};

function DeleteProjectModal(props) {
  const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
  const [Project, setProject] = useState(props.project.project);
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
              (projectRef) => Project._id !== readField("_id", projectRef)
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
  return (
    <div>
      <ReactModal
        name="deleteProjectModal"
        isOpen={showDeleteModal}
        contentLabel="Delete Project"
        style={customStyles}
      >
        <div>
          <p>Are you sure you want to delete ({Project.name})?</p>
          <form
            className="form"
            id="delete-project"
            onSubmit={async (e) => {
              e.preventDefault();
              deleteProject({
                variables: { id: Project._id },
              });
              setShowDeleteModal(false);
              props.handleClose();
            }}
          >
            <br />
            <button className="button" type="submit">
              Delete
            </button>
          </form>
        </div>
        <br />
        <button className="button" onClick={handleCloseDeleteModal}>
          Cancel
        </button>
      </ReactModal>
    </div>
  );
}

export default DeleteProjectModal;
