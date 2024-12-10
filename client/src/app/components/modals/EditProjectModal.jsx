import { useState } from "react";
import ReactModal from "react-modal";
import { useMutation } from "@apollo/client";
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
    width: "75%",
    border: "1px solid #28547a",
    borderRadius: "4px",
    color: "black",
  },
};

function EditProjectModal(props) {
  const [error, setError] = useState(false);
  const [project, setProject] = useState(props.project.project);
  const [editProject] = useMutation(queries.editProject, {
    refetchQueries: [
      {
        query: queries.GetProjectById,
        variables: { id: project._id },
      },
    ],
    onError(err) {
      setError(err.message);
    },
  });

  const projectSubmit = async (e) => {
    e.preventDefault();

    let projectName = document.getElementById("name").value;
    let projectDescription = document.getElementById("description").value;

    // Taken from Online
    const formData = new FormData(e.target);
    const selectedTechnologies = formData.getAll("technologies");
    //console.log("Selected technologies:", selectedTechnologies);

    /* let obj =
        {
                _id: project._id,
                    name: projectName,
                    technologies: selectedTechnologies,
                    description: projectDescription
        }

        console.log(obj);*/

    projectName = projectName.trim();

    if (projectName.length < 2 || projectName.length > 50) {
      setError("Project Name must be between 2 and 50 characters!");
      return;
    }

    projectDescription = projectDescription.trim();

    if (projectDescription.length == 0) {
      setError("Project Description must not be empty!");
      return;
    }

    if (selectedTechnologies.length <= 0) {
      setError("At least one technology must be checked!");
      return;
    }

    try {
      await editProject({
        variables: {
          id: project._id,
          name: projectName,
          technologies: selectedTechnologies,
          description: projectDescription,
          creatorId: props.user._id,
        },
      });

      alert("Project successfully edited");
      setError("");
      props.handleClose();
    } catch (e) {
      setError(e.message);
      return;
    }
  };

  const handleCloseEditModal = () => {
    setProject(null);
    props.handleClose();
  };

  const technologies = [
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
  ];

  return (
    <div>
      <ReactModal
        name="editProjectModal"
        isOpen={props.isOpen}
        onRequestClose={props.handleClose}
        contentLabel="Edit Project"
        style={customStyles}
      >
        <div>
          <h1 className="text-2xl font-bold mb-4 text-center">
            Edit Project Form
          </h1>
          <h3 className="text-red-500 text-xl mb-4 text-center font-bold underline ">
            {error}
          </h3>
          <form id="editProject" onSubmit={projectSubmit} className="space-y-4">
            <label className="block text-lg font-medium mb-1"> Name: </label>
            <input
              id="name"
              defaultValue={project.name}
              className=" w-full rounded-md border-2 border-blue-500 rounded-full"
            />

            <label className="block text-lg font-medium mb-1">
              Technologies Used:
            </label>
            <div className="grid grid-cols-6 gap-1">
              {technologies.map((tech) => (
                <div key={tech} className="mb-2">
                  <input
                    type="checkbox"
                    id={tech.toLowerCase()}
                    name="technologies"
                    value={tech}
                    className="mr-2"
                    defaultChecked={project.technologies.includes(tech)}
                  />
                  <label htmlFor={tech.toLowerCase()}>{tech}</label>
                </div>
              ))}
            </div>

            <label
              htmlFor="description"
              className="block text-lg font-medium mb-1"
            >
              Description:
            </label>
            <textarea
              id="description"
              defaultValue={project.description}
              className=" w-full rounded-md border-2 border-blue-500 rounded-full"
            />
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Project
              </button>
              <button
                type="button"
                onClick={handleCloseEditModal}
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

export default EditProjectModal;
