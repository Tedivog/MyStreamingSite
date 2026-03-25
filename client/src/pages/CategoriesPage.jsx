import { useEffect, useState } from "react";
import { getCategories } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div className="category-section">
      <h2>Categories</h2>

      <div className="category-grid">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="category-item"
            onClick={() => navigate(`/categories/${cat.id}`)}
          >
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
}