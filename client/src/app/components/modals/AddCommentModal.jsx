import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import ReusableModal from "./ReusableModal";
import queries from "../../queries";

const AddCommentModal = ({
  isOpen,
  onClose,
  projectId,
  userId,
  onCommentAdded,
}) => {
  const [fieldValues, setFieldValues] = useState({ comment: "" });
  const [addComment] = useMutation(queries.addComment, {
    refetchQueries: [
      {
        query: queries.GetProjectById,
        variables: { id: projectId },
      },
    ],
  });

  const handleSubmit = async () => {
    if (!fieldValues.comment.trim()) return;

    try {
      const { data } = await addComment({
        variables: {
          userId: userId, //Change later
          comment: fieldValues.comment,
          projectId,
        },
      });

      if (data?.addComment) {
        onCommentAdded(data.addComment);
        setFieldValues({ comment: "" });
        onClose();
      }
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
  };

  return (
    <ReusableModal
      open={isOpen}
      onClose={onClose}
      title="Add Comment"
      fields={[
        {
          name: "comment",
          label: "Your Comment",
          value: fieldValues.comment,
        },
      ]}
      setFieldValues={setFieldValues} // Pass setFieldValues for updates
      onSubmit={handleSubmit}
    />
  );
};

export default AddCommentModal;
