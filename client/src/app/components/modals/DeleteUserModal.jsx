import React, { useState } from "react";
import "../../globals.css";
import { useMutation } from "@apollo/client";
import ReactModal from "react-modal";
import queries from "../../queries";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/config/firebaseAuth";

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

function DeleteUserModal(props) {
  const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
  const [user, setUser] = useState(props.user);
  const [error, setError] = useState("");
  const [deleteUser] = useMutation(queries.deleteUser, {
    refetchQueries: [
      {
        query: queries.users,
      },
    ],
  });

  const router = useRouter();

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    props.handleClose();
  };

  const userSubmit = async (e) => {
    e.preventDefault();

    try {
      // Delete user from the database
      await deleteUser({
        variables: {
          id: user._id,
        },
      });

      // Sign out the user if they're logged in
      await signOut(auth);

      setError("");
      props.handleClose();
      router.push("/users"); 
    } catch (e) {
      setError(e.message);
      return;
    }
  };

  return (
    <div>
      <ReactModal
        name="deleteUser"
        isOpen={showDeleteModal}
        contentLabel="Delete User"
        style={customStyles}
      >
        <br />
        <h1 className="text-2xl font-bold mb-4 text-center">
          Delete User Form
        </h1>
        <h3 className="text-red-500 text-xl mb-4 text-center font-bold underline ">
          {error}
        </h3>
        <label className="block text-2xl font-medium mb-1">
          Are you sure you want to delete user: {user.firstName} {user.lastName}
          ?
        </label>
        <br />
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={userSubmit}
          >
            Delete User
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

export default DeleteUserModal;
