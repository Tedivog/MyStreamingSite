import { useState } from "react";
import { addComment, getComments } from "../services/api";

export default function CommentForm({ videoId, setComments }) {
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;

    await addComment(videoId, text);

    // refresh comment list
    const updated = await getComments(videoId);
    setComments(updated);

    setText("");
  };

  return (
    <div style={styles.form}>
      <textarea
        style={styles.textarea}
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button style={styles.button} onClick={handleSubmit}>
        Post Comment
      </button>
    </div>
  );
}

const styles = {
  form: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
  },
  textarea: {
    width: "100%",
    minHeight: "60px",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    resize: "none",
  },
  button: {
    width: "150px",
    padding: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  }
};
