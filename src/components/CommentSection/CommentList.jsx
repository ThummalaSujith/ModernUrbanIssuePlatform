import React from "react";
import Comment from "./Comment";

const CommentList = ({
  comments,
  currentUser,
  onDelete,
  onReply,
  onUpdate,
}) => {
  return (
    <div className="space-y-2">
      {comments.map((comment) => (
        <Comment
          key={comment.commentId}
          comment={comment}
          currentUser={currentUser}
          onDelete={onDelete}
          onReply={onReply}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default CommentList;
