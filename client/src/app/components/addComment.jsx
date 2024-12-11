import React from "react";
import "../globals.css";
import { useMutation, useQuery } from "@apollo/client";
import ReactModal from "react-modal";
import queries from "../queries";

function AddComment(props) {
  const [addComment] = useMutation(queries.addComment, {
    update(cache, { data: { addComment } }) {
      const { comments } = cache.readQuery({
        query: queries.comments,
      });
      cache.writeQuery({
        query: queries.comments,
        data: { comments: [...comments, addComment] },
      });
    },
  });
  const onSubmitComment = (e) => {
    e.preventDefault();
    let comment = document.getElementById("comment").value;
    addComment({
      variables: {
        userId: props.userId,
        comment: comment,
        projectId: props.projectId,
      },
    });
    document.getElementById("comment").value = "";
    props.closeAddCommentState();
  };
  return (
    <div>
      <form>
        <div>
          <label>Comment:</label>
          <input type="text" id="comment" />
        </div>
        <button onClick={onSubmitComment}>Submit</button>
      </form>
    </div>
  );
}
export default AddComment;
