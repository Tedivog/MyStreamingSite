const db = require("../db");

// Aggiungi visualizzazione
exports.addView = async (req, res) => {
  const { videoId } = req.body;
  const userId = req.user ? req.user.id : null; // null if not logged

  if (!videoId) return res.status(400).json({ error: "Missing videoId" });
  if (!userId) {
    return res.status(401).json({ error: "You must be logged in to count views" });
  }

  try {
    // Inserisci nella tabella views
    const [existing] = await db.query(
      "SELECT id FROM views WHERE video_id = ? AND user_id = ?",
      [videoId, userId]
    );

    if (existing.length > 0) {
      return res.json({ message: "View already counted" });
    }
    await db.query(
      "INSERT INTO views (video_id, user_id) VALUES (?, ?)",
      [videoId, req.user.id]
    );

    // Incrementa il contatore veloce nella tabella videos
    await db.query(
      "UPDATE videos SET views = views + 1 WHERE id = ?",
      [videoId]
    );

    res.json({ message: "View registered" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Numero totale visualizzazioni
exports.getViewCount = async (req, res) => {
  const { videoId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS count FROM views WHERE video_id = ?",
      [videoId]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Visualizzazioni di oggi
exports.getTodayViews = async (req, res) => {
  const { videoId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS count FROM views WHERE video_id = ? AND DATE(view_date) = CURDATE()",
      [videoId]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lista visualizzazioni complete del video
exports.getViewsByVideo = async (req, res) => {
  const { videoId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM views WHERE video_id = ? ORDER BY view_date DESC",
      [videoId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
