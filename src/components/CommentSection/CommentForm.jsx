import React from "react";
import { useState } from "react";

const CommentForm = ({ postId, onSubmit, currentUser, parentId = null }) => {
  console.log("commentForm:", currentUser);
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    onSubmit({
      postId,
      text,

      author: currentUser,
      parentId,
    });

    setText("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your comment..."
        className="w-full border rounded p-2 font-mono placeholder-gray-400 placeholder-mono placeholder-opacity-75 placeholder:text-[16px]"
      />
      <button className="bg-gray-950 text-white px-4 py-1 mt-0.5 rounded font-mono">
        Post
      </button>
    </form>
  );
};

export default CommentForm;
