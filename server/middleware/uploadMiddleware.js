const multer = require("multer");
const path = require("path");

// CONFIG STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// FILTER SOLO MP4
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4") cb(null, true);
  else cb(new Error("Only MP4 allowed"), false);
};

module.exports = multer({ storage, fileFilter });
