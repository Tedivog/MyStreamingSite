import { useEffect, useState } from "react";
import { getProfile } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("history");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();

        if (
          !res ||
          res.message === "Invalid token" ||
          res.message === "No token"
        ) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setUser(res);
      } catch (error) {
        console.error("Profile fetch error:", error);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p className="loading">Loading profile...</p>;

  if (!user) return <p className="error">Unable to load profile.</p>;

 const renderVideos = (videos, emptyMessage) => {
  if (!videos || videos.length === 0) {
    return <p className="empty-message">{emptyMessage}</p>;
  }

  return (
    <div className="profile-video-wrapper">
      {videos.map((video) => (
        <Link
          to={`/video/${video.video_id || video.id}`}
          key={video.video_id || video.id}
          className="profile-video-item"
        >
          <div className="profile-video-preview">
            <video
              src={`http://localhost:5000/uploads/videos/${video.filepath}`}
              preload="metadata"
              muted
            />
          </div>

          <p className="profile-video-name">{video.title}</p>
        </Link>
      ))}
    </div>
  );
};

  return (
    <div className="profile-container">
      <h1 className="profile-title">Your Profile</h1>

      {/* NAVIGATION BAR */}
      <div className="profile-nav">
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>

        <button
          className={activeTab === "liked" ? "active" : ""}
          onClick={() => setActiveTab("liked")}
        >
          Liked
        </button>

        <button
          className={activeTab === "myvideos" ? "active" : ""}
          onClick={() => setActiveTab("myvideos")}
        >
          My Videos
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="video-section">
        {activeTab === "history" && (
          <>
            <h2>Recently Watched</h2>
            {renderVideos(user.history, "No watched videos yet.")}
          </>
        )}

        {activeTab === "liked" && (
          <>
            <h2>Liked Videos</h2>
            {renderVideos(user.liked, "No liked videos yet.")}
          </>
        )}

        {activeTab === "myvideos" && (
          <>
            <h2>My Videos</h2>
            {renderVideos(user.myVideos, "You haven't uploaded videos yet.")}
          </>
        )}
      </div>
    </div>
  );
}