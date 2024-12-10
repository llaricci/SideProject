import React, { useState } from "react";
import "../../globals.css";
import { useMutation, useQuery } from "@apollo/client";
import ReactModal from "react-modal";
import queries from "../../queries";

ReactModal.setAppElement("body");

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
    overflow: "visible",
    color: "black",
  },
};

function AddProjectModal(props) {
  const [showAddModal, setShowAddModal] = useState(props.isOpen);
  const { data, loading, error } = useQuery(queries.projects, {
    fetchPolicy: "cache-and-network",
  });
  const [addProject] = useMutation(queries.addProject, {
    refetchQueries: [
      {
          query: queries.getUserById,
          variables: { id: props.user._id }
      }
  ],
    onError: (error) => {
      alert("Error adding project" + error);
      console.log(error);
    },
    onCompleted: (data) => {
      alert("Project added successfully");
      console.log(data);
      props.handleClose();
    },
    update(cache, { data: { addProject } }) {
      const { projects } = cache.readQuery({
        query: queries.projects,
      });
      cache.writeQuery({
        query: queries.projects,
        data: { projects: [...projects, addProject] },
      });
    },
  });
  const handleCloseModal = () => {
    setShowAddModal(false);
    props.handleClose();
  };
  let name, description;
  const [technologies, setTechnologies] = useState(["JAVASCRIPT"]);
  const handleChangeTechnologies = (i, technology) => {
    const newTechnology = [...technologies];
    newTechnology[i] = technology;
    setTechnologies(newTechnology);
  };
  const addTechnology = () => {
    setTechnologies([...technologies, ""]);
  };
  return (
    <div>
      <ReactModal
        name="addModal"
        isOpen={showAddModal}
        contentLabel="Add Project"
        style={customStyles}
      >
        <form
          className="form"
          id="add-project"
          onSubmit={(e) => {
            e.preventDefault();
            addProject({
              variables: {
                name: name.value,
                technologies: technologies,
                description: description.value,
                creatorId: props.user._id,
              },
            });
          }}
        >
          <div className="form-group">
            <label>
              Project Name:
              <br />
              <input
                ref={(node) => {
                  name = node;
                }}
                autoFocus={true}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>Technologies:</label>
            {technologies.map((technology, index) => (
              <select
                key={index}
                id="technology"
                name="technology"
                onChange={(e) =>
                  handleChangeTechnologies(index, e.target.value)
                }
                required
              >
                <option value="JAVASCRIPT">JAVASCRIPT</option>
                <option value="PYTHON">PYTHON</option>
                <option value="JAVA">JAVA</option>
                <option value="CSHARP">CSHARP</option>
                <option value="CPLUSPLUS">CPLUSPLUS</option>
                <option value="RUBY">RUBY</option>
                <option value="PHP">PHP</option>
                <option value="TYPESCRIPT">TYPESCRIPT</option>
                <option value="SWIFT">SWIFT</option>
                <option value="KOTLIN">KOTLIN</option>
                <option value="GO">GO</option>
                <option value="RUST">RUST</option>
                <option value="HTML">HTML</option>
                <option value="CSS">CSS</option>
                <option value="SQL">SQL</option>
                <option value="GRAPHQL">GRAPHQL</option>
                <option value="NODE_JS">NODE_JS</option>
                <option value="REACT">REACT</option>
                <option value="ANGULAR">ANGULAR</option>
                <option value="VUE">VUE</option>
                <option value="NEXT_JS">NEXT_JS</option>
                <option value="SVELTE">SVELTE</option>
                <option value="TAILWINDCSS">TAILWINDCSS</option>
                <option value="BOOTSTRAP">BOOTSTRAP</option>
                <option value="AWS">AWS</option>
                <option value="GOOGLE_CLOUD">GOOGLE_CLOUD</option>
                <option value="ORACLE_CLOUD">ORACLE_CLOUD</option>
                <option value="DOCKER">DOCKER</option>
                <option value="KUBERNETES">KUBERNETES</option>
                <option value="MONGODB">MONGODB</option>
                <option value="POSTGRESQL">POSTGRESQL</option>
                <option value="REDIS">REDIS</option>
                <option value="FIREBASE">FIREBASE</option>
                <option value="GIT">GIT</option>
                <option value="GITHUB">GITHUB</option>
                <option value="OTHER">OTHER</option>
              </select>
            ))}
            <button type="button" onClick={addTechnology}>
              Add Technology
            </button>
          </div>
          <div className="form-group">
            <label>
              Description:
              <br />
              <input
                ref={(node) => {
                  description = node;
                }}
                autoFocus={true}
                required
              />
            </label>
          </div>
          <button className="button add-button" type="submit">
            Add Project
          </button>
        </form>
        <br />
        <button className="button cancel-button" onClick={handleCloseModal}>
          Cancel
        </button>
      </ReactModal>
    </div>
  );
}
export default AddProjectModal;
