import { useState } from "react";
import ReactModal from "react-modal";
import { useMutation } from "@apollo/client";
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
    color: "black",
  },
};

function EditUserModal(props) {
  const [error, setError] = useState(false);
  const [user, setUser] = useState(props.user);

  const [editUser] = useMutation(queries.editUser, {
    onCompleted: (data) => {
      console.log(data);
      props.handleClose();
    },
  });

  function checkEmail(email) {
    if (!email) {
      setError(`Error you must provide an email`);
      return;
    }

    if (typeof email !== "string") {
      setError(`Error: Email must be of type string`);
      return;
    }

    email = email.trim();

    if (email.length === 0) {
      setError(`Email cannot be empty spaces`);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError(`Error: Invalid email format`);
      return;
    }
    return email;
  }

  const userSubmit = async (e) => {
    e.preventDefault();

    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let biography = document.getElementById("biography").value;

    if (firstName.trim().length < 2 || firstName.trim().length > 50) {
      setError("First Name must be between 2 and 50 characters!");
      return;
    }

    firstName = firstName.trim();

    if (lastName.trim().length < 2 || lastName.trim().length > 50) {
      setError("Last Name must be between 2 and 50 characters!");
      return;
    }

    lastName = lastName.trim();

    email = checkEmail(email);

    if (biography.trim().length < 2) {
      setError("Biography must be at least 2 characters");
      return;
    }

    biography = biography.trim();

    const formData = new FormData(e.target);
    const selectedTechnologies = formData.getAll("technologies");

    if (selectedTechnologies.length <= 0) {
      setError("At least one technology must be checked!");
      return;
    }

    let obj = {
      id: user._id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      bio: biography,
      profLanguages: selectedTechnologies,
    };

    console.log(obj);

    try {
      await editUser({
        variables: {
          id: user._id,
          firstName: firstName,
          lastName: lastName,
          email: email,
          bio: biography,
          profLanguages: selectedTechnologies,
        },
      });

      setError("");
      props.handleClose();
    } catch (e) {
      setError(e.message);
      return;
    }
  };

  const handleCloseEditModal = () => {
    setUser(null);
    props.handleClose();
  };

  const technologies = [
    "JavaScript",
    "Python",
    "Java",
    "CSharp",
    "CPlusPlus",
    "Ruby",
    "PHP",
    "TypeScript",
    "Swift",
    "Kotlin",
    "Go",
    "Rust",
    "HTML",
    "CSS",
    "SQL",
    "GraphQL",
    "NodeJS",
    "React",
    "Angular",
    "Vue",
    "NextJS",
    "Svelte",
    "TailwindCSS",
    "Bootstrap",
    "AWS",
    "GoogleCloud",
    "OracleCloud",
    "Docker",
    "Kubernetes",
    "MongoDB",
    "PostgreSQL",
    "Redis",
    "Firebase",
    "Git",
    "GitHub",
    "Other",
  ];

  return (
    <div>
      <ReactModal
        name="editUserModal"
        isOpen={props.isOpen}
        onRequestClose={props.handleClose}
        contentLabel="Edit Project"
        style={customStyles}
      >
        <div>
          <h1 className="text-2xl font-bold mb-4 text-center">
            Edit User Form
          </h1>
          <h3 className="text-red-500 text-xl mb-4 text-center font-bold underline ">
            {error}
          </h3>
          <form id="edituser" onSubmit={userSubmit} className="space-y-4">
            <label className="text-xl font- mb-1"> First Name: </label>
            <input
              id="firstName"
              defaultValue={user.firstName}
              className=" w-full rounded-md border-2 border-blue-500 rounded-full"
            />
            <br />
            <label className="text-xl font- mb-1"> Last Name: </label>
            <textarea
              id="lastName"
              defaultValue={user.lastName}
              className=" w-full rounded-md border-2 border-blue-500 rounded-full"
            />
            <br />
            <label className="text-xl font- mb-1"> Email: </label>
            <textarea
              id="email"
              defaultValue={user.email}
              className=" w-full rounded-md border-2 border-blue-500 rounded-full"
            />
            <br />
            <label className="text-xl font- mb-1"> Biography: </label>
            <textarea
              id="biography"
              defaultValue={user.bio}
              className=" w-full rounded-md border-2 border-blue-500 rounded-full"
            />

            <label className="text-xl font- mb-1">
              {" "}
              Proficient Technologies{" "}
            </label>
            <div className="grid grid-cols-8 gap-1">
              {technologies.map((tech) => (
                <div key={tech} className="mb-2">
                  <input
                    type="checkbox"
                    id={tech}
                    name="technologies"
                    value={tech}
                    className="mr-2"
                    defaultChecked={user.profLanguages.includes(tech)}
                  />
                  <label htmlFor={tech}>{tech}</label>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update User
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

export default EditUserModal;
