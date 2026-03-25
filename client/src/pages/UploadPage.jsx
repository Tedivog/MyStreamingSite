import { useState, useEffect } from "react";
import { uploadVideo, getCategories } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setMsg("Please select a video file.");
      return;
    }

    if (!selectedCategory && !newCategory) {
      setMsg("Please select or create a category.");
      return;
    }

    try {
      setLoading(true);

      await uploadVideo(
        title,
        description,
        file,
        selectedCategory,
        newCategory
      );

      setMsg("Video uploaded successfully!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      console.log(err);
      setMsg("Upload error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h2 className="upload-title">Upload New Video</h2>

        {msg && (
          <p
            className={`upload-message ${
              msg.includes("success") ? "success" : "error"
            }`}
          >
            {msg}
          </p>
        )}

        {/* TITLE */}
        <input
          type="text"
          className="upload-input"
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* DESCRIPTION */}
        <textarea
          className="upload-textarea"
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* CATEGORY SECTION */}
        <div className="category-group">
          <select
            className="upload-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setNewCategory("");
            }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="upload-divider">OR</div>

          <input
            type="text"
            className="upload-new-category"
            placeholder="Add new category..."
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
              setSelectedCategory("");
            }}
          />
        </div>

        {/* FILE INPUT */}
        <div className="upload-file-wrapper">
          <label className="upload-file-label">
            <span className="upload-file-button">Choose Video</span>
            <span className="upload-file-name">
              {file ? file.name : "No file selected"}
            </span>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              hidden
            />
          </label>
        </div>

        {/* BUTTON */}
        <button
          className="upload-button"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </div>
    </div>
  );
}