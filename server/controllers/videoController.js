const db = require("../db");

// UPLOAD VIDEO
exports.uploadVideo = async (req, res) => {
  const { title, description, categoryId, newCategory } = req.body;

  if (!req.file)
    return res.status(400).json({ error: "No video uploaded" });

  try {
    let finalCategoryId = categoryId;

    // Se l'utente ha inserito una nuova categoria
    if (newCategory && newCategory.trim() !== "") {
      const [existing] = await db.query(
        "SELECT id FROM categories WHERE name = ?",
        [newCategory]
      );

      if (existing.length > 0) {
        finalCategoryId = existing[0].id;
      } else {
        const [result] = await db.query(
          "INSERT INTO categories (name) VALUES (?)",
          [newCategory]
        );
        finalCategoryId = result.insertId;
      }
    }

    await db.query(
      "INSERT INTO videos (user_id, title, description, filepath, category_id) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, title, description, req.file.filename, finalCategoryId]
    );

    res.json({ message: "Video uploaded successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL VIDEOS
exports.getAllVideos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM videos ORDER BY upload_date DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET VIDEO BY ID
exports.getVideoById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM videos WHERE id = ?", [
      req.params.id
    ]);

    if (rows.length === 0) return res.status(404).json({ error: "Video not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FILTER SEARCHED VIDEOS
exports.suggestVideos = async (req, res) => {
  const q = req.query.q || "";

  try {
    if (!q) return res.json([]); 

    const [rows] = await db.query(
      `SELECT * 
       FROM videos
       WHERE title LIKE ? OR description LIKE ?
       ORDER BY upload_date DESC
       LIMIT 10`,  
      [`%${q}%`, `%${q}%`] 
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//FILTER CATEGORY
exports.categoryVideos = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM videos
       WHERE category_id = ?
       ORDER BY upload_date DESC`,
      [req.params.category_id]
    );

    if (rows.length === 0) return res.status(404).json({ error: "No Videos in Category" });

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};