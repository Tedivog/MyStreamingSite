import { useEffect, useState } from "react";
import { 
  getAllVideos, 
  getVideosByCategory, 
  getCategories 
} from "../services/api";

import VideoCard from "../components/VideoCard";
import Header from "../components/Header";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);

  const [liveResults, setLiveResults] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);

  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      const allVideos = await getAllVideos();
      const allCategories = await getCategories();

      setVideos(allVideos);
      setCategories(allCategories);
    };

    loadData();
  }, []);

  const listToShow =
    liveResults.length > 0
      ? liveResults
      : activeCategory !== "all" || filteredVideos.length
        ? filteredVideos
        : videos;

  const filterByCategory = async (catId) => {
    setActiveCategory(catId);
    setLiveResults([]); 

    if (catId === "all") {
      setFilteredVideos([]);
      return;
    }

    try {
      const res = await getVideosByCategory(catId);

      setFilteredVideos(res.length > 0 ? res : videos);
    } catch (error) {
      console.error("Errore nel recupero video per categoria:", error);

      setFilteredVideos(videos);
    }
};

  return (
    <>
      {/* HEADER */}
      <Header onSearchSelect={setLiveResults} />

      <div className="container">

        {/* CATEGORY BAR */}
        <div className="category-bar">
          <button
            className={activeCategory === "all" ? "active" : ""}
            onClick={() => filterByCategory("all")}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              className={activeCategory === cat.id ? "active" : ""}
              onClick={() => filterByCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* VIDEO GRID */}
        <div className="video-grid">
          {listToShow.length === 0 ? (
            <p>Nessun video trovato.</p>
          ) : (
            listToShow.map((v) => (
              <VideoCard
                key={v.id}
                video={{
                  ...v,
                  thumbnail: v.thumbnail || "/placeholder.jpg",
                }}
              />
            ))
          )}
        </div>

      </div>
    </>
  );
}