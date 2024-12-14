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
    width: "75%",
    border: "1px solid #28547a",
    borderRadius: "4px",
    overflow: "visible",
    color: "black",
  },
};

function AddProjectModal(props) {
  const [showAddModal, setShowAddModal] = useState(props.isOpen);

  const [error, setError] = useState(false);

  const [addProject] = useMutation(queries.addProject, 
    {
      refetchQueries: [
        {
          query: queries.getUserById,
          variables: { id: props.user._id },
        },
      ],
    
      update(cache, { data: { addProject } }) 
      {
        const existingData = cache.readQuery(
        {
          query: queries.getUserById,
          variables: { id: props.user._id },
        });
      
        if (existingData?.getUserById?.projects) 
        {
          const { getUserById } = existingData;
      
          cache.writeQuery(
          {
            query: queries.getUserById,
            variables: { id: props.user._id },
            data: {
              getUserById: 
              {
                ...getUserById,
                projects: [...getUserById.projects, addProject],
              },
            },
          });
        }
      }
    });
  

  const handleCloseModal = () => 
  {
    setShowAddModal(false);
    props.handleClose();
  };


  const [technologies, setTechnologies] = useState([
    "JAVASCRIPT",
    "PYTHON",
    "JAVA",
    "CSHARP",
    "CPLUSPLUS",
    "RUBY",
    "PHP",
    "TYPESCRIPT",
    "SWIFT",
    "KOTLIN",
    "GO",
    "RUST",
    "HTML",
    "CSS",
    "SQL",
    "GRAPHQL",
    "NODE_JS",
    "REACT",
    "ANGULAR",
    "VUE",
    "NEXT_JS",
    "SVELTE",
    "TAILWINDCSS",
    "BOOTSTRAP",
    "AWS",
    "GOOGLE_CLOUD",
    "ORACLE_CLOUD",
    "DOCKER",
    "KUBERNETES",
    "MONGODB",
    "POSTGRESQL",
    "REDIS",
    "FIREBASE",
    "GIT",
    "GITHUB",
    "OTHER",
  ]);
  const handleChangeTechnologies = (i, technology) => {
    const newTechnology = [...technologies];
    newTechnology[i] = technology;
    setTechnologies(newTechnology);
  };
  const addTechnology = () => {
    setTechnologies([...technologies, ""]);
  };

  const projectSubmit = async (e) => 
  {
    e.preventDefault();

    let projectName = document.getElementById("name").value;
    let projectDescription = document.getElementById("description").value;

    // Taken from Online
    const formData = new FormData(e.target);
    const selectedTechnologies = formData.getAll("technologies");

    if (projectName.trim().length < 2 || projectName.trim().length > 50) 
    {
      setError("Project Name must be between 2 and 50 characters!");
      return;
    }

    projectName = projectName.trim();

    if (projectDescription.trim().length == 0) 
    {
      setError("Project Description must not be empty!");
      return;
    }

    projectDescription = projectDescription.trim();

    if (selectedTechnologies.length <= 0) {
      setError("At least one technology must be checked!");
      return;
    }

    try {
      await addProject({
        variables: {
          name: projectName,
          technologies: selectedTechnologies,
          description: projectDescription,
          creatorId: props.user._id,
        },
      });

      //alert("Project successfully edited");
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
          name="editProjectModal"
          isOpen={props.isOpen}
          onRequestClose={props.handleClose}
          contentLabel="Add Project"
          style={customStyles}
        >
          <div>
            <h1 className="text-2xl font-bold mb-4 text-center">
              Add Project Form
            </h1>
            <h3 className="text-red-500 text-xl mb-4 text-center font-bold underline ">
              {error}
            </h3>
            <form onSubmit={projectSubmit} className="space-y-4">
              <label className="text-xl font- mb-1"> Project Name: </label>
              <input
                id="name"
                className=" w-full rounded-md border-2 border-blue-500 rounded-full"
              />
  
              <br /> <br />
              <label className="text-xl font- mb-1"> Technologies Used: </label>
              <div className="grid grid-cols-6 gap-1">
                {technologies.map((tech) => (
                  <div key={tech} className="mb-2">
                    <input
                      type="checkbox"
                      id={tech.toLowerCase()}
                      name="technologies"
                      value={tech}
                      className="mr-2"
                    />
                    <label htmlFor={tech.toLowerCase()}>{tech}</label>
                  </div>
                ))}
              </div>
  
              <br />
              <label className="text-xl font- mb-1"> Project Description: </label>
              <textarea
                id="description"
                className=" w-full rounded-md border-2 border-blue-500 rounded-full"
              />
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onSubmit = {projectSubmit}
                >
                  Add Project
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </ReactModal>
      </div>
    );
}
export default AddProjectModal;
