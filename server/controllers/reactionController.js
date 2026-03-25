const db = require("../db");

exports.toggleReaction = async (req, res) => {
  const userId = req.user.id;
  const { videoId } = req.params;
  const { type } = req.body; // "like" or "dislike"

  try {
    const [existing] = await db.query(
      "SELECT * FROM video_reactions WHERE user_id = ? AND video_id = ?",
      [userId, videoId]
    );

    if (existing.length > 0) {
      if (existing[0].type === type) {
        // 🔥 Toggle OFF
        await db.query(
          "DELETE FROM video_reactions WHERE user_id = ? AND video_id = ?",
          [userId, videoId]
        );
      } else {
        // 🔁 Switch like <-> dislike
        await db.query(
          "UPDATE video_reactions SET type = ? WHERE user_id = ? AND video_id = ?",
          [type, userId, videoId]
        );
      }
    } else {
      await db.query(
        "INSERT INTO video_reactions (user_id, video_id, type) VALUES (?, ?, ?)",
        [userId, videoId, type]
      );
    }

    res.json({ message: "Reaction updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getReactions = async (req, res) => {
  const { videoId } = req.params;

  try {
    const [counts] = await db.query(
      `SELECT 
        COUNT(CASE WHEN type = 'like' THEN 1 END) as likes,
        COUNT(CASE WHEN type = 'dislike' THEN 1 END) as dislikes
       FROM video_reactions
       WHERE video_id = ?`,
      [videoId]
    );

    res.json({
      likes: counts[0]?.likes || 0,
      dislikes: counts[0]?.dislikes || 0,
      userReaction: null
    });

  } catch (err) {
    console.error("GET REACTIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};