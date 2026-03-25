const db = require("../db");

// Aggiungi commento
exports.addComment = async (req, res) => {
  const { videoId, comment } = req.body;

  if (!videoId || !comment)
    return res.status(400).json({ error: "Missing fields" });

  try {
    await db.query(
      "INSERT INTO comments (video_id, user_id, comment) VALUES (?, ?, ?)",
      [videoId, req.user.id, comment]
    );

    res.json({ message: "Comment added" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ottieni commenti di un video
exports.getCommentsByVideo = async (req, res) => {
  const { videoId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE video_id = ? ORDER BY created_at DESC",
      [videoId]
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Elimina commento
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT user_id FROM comments WHERE id = ?",
      [commentId]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Comment not found" });

    if (rows[0].user_id !== req.user.id)
      return res.status(403).json({ error: "Not allowed" });

    await db.query("DELETE FROM comments WHERE id = ?", [commentId]);

    res.json({ message: "Comment deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
