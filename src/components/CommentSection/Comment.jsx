import React, { useState } from "react";
import CommentForm from "./CommentForm"; // you already built this!
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faEdit, faTrashAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
// Make sure this path is correct or you have a similar utility
// import { formatTimeAgo } from '../../Hooks/useTime'; 

// Placeholder if formatTimeAgo is not readily available, replace with your actual import
const formatTimeAgo = (isoString) => {
  if (!isoString) return 'some time ago';
  // This is a very basic placeholder, use your actual robust function
  return new Date(isoString).toLocaleTimeString() + " on " + new Date(isoString).toLocaleDateString();
};

const Comment = ({ comment, currentUser, onDelete, onReply, onUpdate, postId, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Submit reply with correct parentId
  const handleReplySubmit = (replyData) => {
    onReply({
      ...replyData,
      postId: comment.postId,
      parentId: comment.commentId,
    });
    setIsReplying(false); // hide reply form after submitting
  };

  const handleUpdateSubmit = (updatedData) => {
    // Assuming onUpdate expects commentId and the new text
    onUpdate(comment.commentId, updatedData.text); 
    setIsEditing(false);
  };

  // Ensure comment.author (or comment.userId) and currentUser are available for comparison
  const canEditOrDelete = currentUser && comment.author && currentUser === comment.author;

  return (
    <div className={`comment-item ${depth > 0 ? 'ml-5 sm:ml-8' : ''} py-3`}>
      <div className="flex items-start space-x-2 sm:space-x-3">
        <FontAwesomeIcon icon={faUserCircle} className="text-2xl sm:text-3xl text-gray-400 mt-1" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <p className="font-semibold text-xs sm:text-sm font-mono text-gray-800">{comment.author || 'Anonymous'}</p>
            <span className="text-gray-400 text-xs">&bull;</span>
            {/* Make sure comment.createdAt exists and formatTimeAgo is correctly imported/defined */}
            <p className="text-xs text-gray-500 font-mono">{formatTimeAgo(comment.createdAt)}</p>
          </div>
          {!isEditing ? (
            <p className="text-sm text-gray-700 font-mono mt-1 whitespace-pre-wrap">{comment.text}</p>
          ) : (
            <div className="mt-1">
              <CommentForm
                postId={postId || comment.postId} // Ensure postId is available
                initialText={comment.text}
                onSubmit={handleUpdateSubmit}
                currentUser={currentUser}
                isEditing={true}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          )}
          
          {!isEditing && (
            <div className="actions mt-1.5 flex space-x-3 text-xs font-mono">
              <button onClick={() => setIsReplying(!isReplying)} className="text-blue-600 hover:underline">
                <FontAwesomeIcon icon={faReply} className="mr-1" /> Reply
              </button>
              {canEditOrDelete && (
                <>
                  <button onClick={() => setIsEditing(true)} className="text-gray-600 hover:underline">
                    <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                  </button>
                  <button onClick={() => onDelete(comment.commentId)} className="text-red-600 hover:underline">
                    <FontAwesomeIcon icon={faTrashAlt} className="mr-1" /> Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {isReplying && (
        <div className={`mt-2 ${depth > -1 ? 'ml-7 sm:ml-11' : ''}`}> {/* Indent reply form slightly more */}
          <CommentForm
            postId={postId || comment.postId} // Ensure postId is available
            onSubmit={handleReplySubmit} // handleReplySubmit already includes parentId
            currentUser={currentUser}
            isReplyForm={true}
            onCancel={() => setIsReplying(false)}
            placeholder={`Replying to ${comment.author || 'Anonymous'}...`}
          />
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className={`replies mt-2 ${depth > -1 ? 'pl-5 sm:pl-6 border-l-2 border-gray-200' : ''}`}>
          {comment.replies.map((reply) => (
            <Comment
              key={reply.commentId}
              comment={reply}
              currentUser={currentUser}
              onDelete={onDelete}
              onReply={onReply}
              onUpdate={onUpdate}
              postId={postId || comment.postId} // Pass postId down
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default Comment;
