const db = require("../db.js");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // USER INFO
    const [userRows] = await db.query(
      "SELECT id, username, email, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // HISTORY (recenti prima)
    const [history] = await db.query(
      `SELECT *
       FROM views w
       JOIN videos v ON w.video_id = v.id
       WHERE w.user_id = ?
       ORDER BY w.view_date DESC
       LIMIT 8`,
      [userId]
    );

    // LIKED (recenti prima)
    const [liked] = await db.query(
      `SELECT *
       FROM video_reactions r
       JOIN videos v ON r.video_id = v.id
       WHERE r.user_id = ?
       AND r.type = 'like'
       ORDER BY r.created_at DESC
       LIMIT 8`,
      [userId]
    );

    // MY VIDEOS (recenti prima)
    const [myVideos] = await db.query(
      `SELECT *
       FROM videos
       WHERE user_id = ?
       ORDER BY upload_date DESC
       LIMIT 8`,
      [userId]
    );

    res.json({
      ...userRows[0],
      history,
      liked,
      myVideos
    });

  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};