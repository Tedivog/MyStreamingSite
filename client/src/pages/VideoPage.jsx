import { useEffect, useState } from "react"; 
import { useParams } from "react-router-dom";
import {
  getVideoById,
  getComments,
  addComment,
  addView,
  getReactions,
  postReaction,
  BASE_URL
} from "../services/api";

export default function VideoPage() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [msg, setMsg] = useState("");

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const [animating, setAnimating] = useState(null);

  const isLogged = !!localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [videoData, commentsData, reactionsData] = await Promise.all([
          getVideoById(id),
          getComments(id),
          isLogged
            ? getReactions(id)
            : Promise.resolve({ likes: 0, dislikes: 0, userReaction: null })
        ]);

        if (!isMounted) return;

        setVideo(videoData);
        setComments(commentsData);
        setLikes(reactionsData.likes || 0);
        setDislikes(reactionsData.dislikes || 0);
        setUserReaction(reactionsData.userReaction);

        addView(id).catch(() => {});
      } catch (err) {
        console.error("Errore:", err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, isLogged]);

  const handleReaction = async (type) => {
    if (!isLogged) {
      alert("Login required");
      return;
    }

    try {
      setAnimating(type);

      await postReaction(id, type);

      const data = await getReactions(id);

      setLikes(data.likes || 0);
      setDislikes(data.dislikes || 0);
      setUserReaction(data.userReaction);

      setTimeout(() => setAnimating(null), 250);
    } catch (err) {
      console.error("Errore reaction:", err);
    }
  };

  const postComment = async () => {
    if (!msg.trim()) return;

    try {
      await addComment(id, msg);
      setMsg("");
      setComments(await getComments(id));
    } catch (err) {
      console.error("Errore comment:", err);
    }
  };

  if (!video) return <p>Loading...</p>;

  return (
    <div className="video-page">
      <video
        className="video-player"
        controls
        autoPlay
        src={`${BASE_URL}/uploads/videos/${video.filepath}`}
        loading="lazy" 
      />

      <div className="video-details">
        <h1>{video.title}</h1>
        <p className="video-description">{video.description}</p>

        <div className="video-reactions">
          <button
            className={`reaction-btn 
              ${userReaction === "like" ? "active-like" : ""}
              ${animating === "like" ? "animate" : ""}
            `}
            onClick={() => handleReaction("like")}
          >
            👍 {likes}
          </button>

          <button
            className={`reaction-btn 
              ${userReaction === "dislike" ? "active-dislike" : ""}
              ${animating === "dislike" ? "animate" : ""}
            `}
            onClick={() => handleReaction("dislike")}
          >
            👎 {dislikes}
          </button>
        </div>
      </div>

      <div className="comments-section">
        <h2>Comments</h2>

        {comments.map((c) => (
          <div className="comment-card" key={c.id}>
            <span className="comment-author">{c.username}</span>
            <span className="comment-date">
              {" "}
              – {new Date(c.created_at).toLocaleString()}
            </span>
            <p>{c.comment}</p>
          </div>
        ))}

        {!isLogged ? (
          <div className="login-comment-box">
            <p>🔒 Log in to comment</p>
            <a className="login-button" href="/login">
              Login
            </a>
          </div>
        ) : (
          <>
            <textarea
              className="comment-input"
              placeholder="Write a comment..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button className="comment-submit" onClick={postComment}>
              Post Comment
            </button>
          </>
        )}
      </div>
    </div>
  );
}