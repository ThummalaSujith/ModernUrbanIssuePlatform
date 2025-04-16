import React from "react";

import { getComments, createComment } from "../../services/commentApi";
import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
const CommentSection = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getComments(postId);
      setComments(data);
    }
    fetchData();
  }, [postId]);

  const handleAddComment = async (newComment) => {
    const added = await createComment(newComment);
    setComments((prev) => [...prev, added]);
  };
  return (
    <div className="px-4 space-y-4 mt-2">
      <h2 className="text-[17px] font-bold font-mono">Comments</h2>

      <CommentForm postId={postId} onSubmit={handleAddComment} currentUser={currentUser}/>
    </div>
  );
};

export default CommentSection;
