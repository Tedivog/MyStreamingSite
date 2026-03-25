import { Link } from "react-router-dom";
import { BASE_URL } from "../services/api";

export default function VideoCard({ video }) {
  return (
    <div className="video-card">
      <Link to={`/video/${video.id}`}>
        <video
          className="video-thumbnail"
          src={`${BASE_URL}/uploads/videos/${video.filepath}`}
          preload="metadata"
          loading="lazy" 
        />
      </Link>

      <p className="video-title">{video.title}</p>
      <p className="video-meta">{video.views} views</p>
    </div>
  );
}