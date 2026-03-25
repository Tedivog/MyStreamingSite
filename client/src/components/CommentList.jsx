import { deleteComment, getComments } from "../services/api";

export default function CommentList({ comments, setComments, videoId }) {
  const userId = getLoggedUserId();

  const handleDelete = async (commentId) => {
    await deleteComment(commentId);
    setComments(await getComments(videoId));
  };

  return (
    <div style={styles.list}>
      {comments.length === 0 && <p>No comments yet. Be the first!</p>}

      {comments.map((c) => (
        <div key={c.id} style={styles.commentBox}>
          <div style={styles.header}>
            <strong>{c.username}</strong>
            <span style={styles.date}>
              {new Date(c.created_at).toLocaleString()}
            </span>
          </div>

          <p>{c.comment}</p>

          {c.user_id === userId && (
            <button
              style={styles.deleteBtn}
              onClick={() => handleDelete(c.id)}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// Helper: extract logged user ID from JWT
function getLoggedUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.id;
}

const styles = {
  list: {
    marginTop: "20px",
  },
  commentBox: {
    padding: "10px",
    marginBottom: "15px",
    background: "#f1f1f1",
    borderRadius: "8px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px",
  },
  date: {
    fontSize: "12px",
    color: "#555",
  },
  deleteBtn: {
    marginTop: "5px",
    padding: "5px 10px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  }
};
