import React from "react";

import {
  getComments,
  createComment,
  deleteComment,
  updateComment,
} from "../../services/commentApi";
import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
const CommentSection = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      console.log("🟡 Fetching comments for postId:", postId);
      const data = await getComments(postId);
      console.log("Fetched comments:", data);
      setComments(data);
      setLoading(false);
    }
    fetchData();
  }, [postId]);

  const handleAddComment = async (newComment) => {
    const added = await createComment(newComment);
    setComments((prev) => [...prev, { ...added, replies: [] }]);
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments((prev) => 
      prev.filter((c) => c.commentId != commentId)
    );
  };



  const handleUpdateComment = async (commentId, newText) => {
    const updated = await updateComment(commentId, newText);
    setComments((prev) =>
      prev.map((c) => (c.commentId === commentId ? { ...c, text: newText } : c))
    );
  };

  return (
    <div className="px-4 space-y-4 mt-2">
      <h2 className="text-[17px] font-bold font-mono">Comments</h2>

      <CommentForm
        postId={postId}
        onSubmit={handleAddComment}
        currentUser={currentUser}
      />

      {loading?(
        <p className="font-mono text-gray-400">Loading comments..</p>
      ):(<CommentList
        comments={comments}
        currentUser={currentUser}
        onDelete={handleDeleteComment}
        onReply={handleAddComment}
        onUpdate={handleUpdateComment}
      />)}

      
    </div>
  );
};

export default CommentSection;
