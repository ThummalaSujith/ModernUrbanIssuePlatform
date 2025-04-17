import React, { useState } from "react";
import CommentForm from "./CommentForm"; // you already built this!
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";

const Comment = ({ comment, currentUser, onDelete, onReply, onUpdate }) => {
  const [isReplying, setIsReplying] = useState(false);

  // Submit reply with correct parentId
  const handleReplySubmit = (replyData) => {
    onReply({
      ...replyData,
      postId: comment.postId,
      parentId: comment.commentId,
    });
    setIsReplying(false); // hide reply form after submitting
  };

  return (
    <div className="border p-3 rounded bg-white mt-2 shadow-sm">
      {/* Comment text */}
      <p className="font-semibold font-mono text-[12px]">{comment.author}</p>
      <p className="text-gray-800 font-mono text-[13px]">{comment.text}</p>

      {/* Actions */}
      <div className="flex gap-4 text-sm text-gray-600 mt-2  ">
        <button onClick={() => setIsReplying(!isReplying)} ><FontAwesomeIcon icon={faMessage}/> Reply</button>

        {/* Only show delete if this is the user's comment */}
        {currentUser === comment.author && (
          <button onClick={() => onDelete(comment.commentId)}>🗑 Delete</button>
        )}
      </div>

      {/* Reply form (shown when user clicks Reply) */}
      {isReplying && (
        <div className="mt-2 ml-4">
          <CommentForm
            postId={comment.postId}
            parentId={comment.commentId}
            currentUser={currentUser}
            onSubmit={handleReplySubmit}
          />
        </div>
      )}

      {/* Nested replies (if any) */}
      {comment.replies?.length > 0 && (
        <div className="ml-6 mt-3">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.commentId}
              comment={reply}
              currentUser={currentUser}
              onReply={onReply}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;

