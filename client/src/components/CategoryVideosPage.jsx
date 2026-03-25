import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideosByCategory } from "../services/api";
import VideoCard from "../components/VideoCard";

export default function CategoryVideosPage() {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getVideosByCategory(id).then(setVideos);
  }, [id]);

  return (
    <div className="container">
      <h2>Category Videos</h2>

      <div className="video-grid">
        {videos.map(v => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  );
}