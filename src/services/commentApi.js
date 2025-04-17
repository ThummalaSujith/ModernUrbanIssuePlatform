const API_BASE = "https://5cc1lcitg9.execute-api.eu-west-2.amazonaws.com/prod";

export const getComments = async (postId) => {
  const res = await fetch(`${API_BASE}/comments?postId=${postId}`);
  const data = await res.json();
  return data;
};

export const createComment = async (commentData) => {
  const res = await fetch(`${API_BASE}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  });

  const data = await res.json();

  return data.comment || data;
};

export const deleteComment = async (commentId) => {
  await fetch(`${API_BASE}/comments/${commentId}`, {
    method: "DELETE",
  });
};

export const updateComment = async (commentId, newText) => {
 const res= await fetch(`${API_BASE}/comments/${commentId}`, {
    method: "PUT",
    body: JSON.stringify({ text: newText }),
    headers: {
      "Content-Type": "application/json",
    },

  });

  const data = await res.json()
  return data;
};
