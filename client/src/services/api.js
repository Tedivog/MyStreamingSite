// =======================================
// API SERVICE - CENTRALIZED FETCH SYSTEM
// =======================================

const API_URL = "http://localhost:3000/api";

// ==========================
// URL Base per il backend
// ==========================

export const BASE_URL = "http://localhost:3000";

// ==========================
// FUNZIONE BASE GENERICA
// ==========================
async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  auth = false,
  isForm = false
) {
  const headers = {};

  // Se NON è FormData → usa JSON
  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }

  // Se richiede autenticazione → aggiunge token
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = isForm ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  // Gestione errori centralizzata
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "Errore del server",
    }));
    throw errorData;
  }

  return response.json();
}

// ======================
// USERS (REGISTER/LOGIN)
// ======================

export const registerUser = (username, email, password) =>
  apiRequest("/users/register", "POST", {
    username,
    email,
    password,
  });

export const loginUser = (email, password) =>
  apiRequest("/users/login", "POST", {
    email,
    password,
  });

// ===============
// PROFILE
// ===============

export const getProfile = () =>
  apiRequest("/profile", "GET", null, true);

// ===============
// VIDEOS
// ===============

// UPLOAD VIDEO (FORMDATA)
export const uploadVideo = (
  title,
  description,
  file,
  categoryId,
  newCategory
) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("file", file);
  formData.append("categoryId", categoryId);
  formData.append("newCategory", newCategory);

  return apiRequest("/videos/upload", "POST", formData, true, true);
};

// SEARCH LIVE
export const searchVideos = (query) =>
  apiRequest(`/videos/search?q=${encodeURIComponent(query)}`);

// FILTER CATEGORY VIDEOS
export const getVideosByCategory = (category_id) =>
  apiRequest(`/videos/category/${category_id}`);

// GET CATEGORIES
export const getCategories = () =>
  apiRequest("/categories");

// GET ALL VIDEOS
export const getAllVideos = () =>
  apiRequest("/videos");

// GET VIDEO DETAILS
export const getVideoById = (id) =>
  apiRequest(`/videos/${id}`);

// ===============
// VIEWS
// ===============

// ADD VIEW
export const addView = (videoId) =>
  apiRequest("/views/add", "POST", { videoId }, true);

// GET VIEW COUNT
export const getViewCount = (videoId) =>
  apiRequest(`/views/count/${videoId}`);

// ===============
// COMMENTS
// ===============

// ADD COMMENT
export const addComment = (videoId, comment) =>
  apiRequest("/comments/add", "POST", { videoId, comment }, true);

// GET COMMENTS OF VIDEO
export const getComments = (videoId) =>
  apiRequest(`/comments/video/${videoId}`);

// DELETE COMMENT
export const deleteComment = (commentId) =>
  apiRequest(`/comments/delete/${commentId}`, "DELETE", null, true);

// VIDEO SUGGESTIONS (AUTOCOMPLETE)
export const getVideoSuggestions = (query, signal) =>
  apiRequest(
    `/videos/suggest?q=${encodeURIComponent(query)}`,
    "GET",
    null,
    false,
    false,
    signal
  );

// ===============================
// REACTIONS
// ===============================

// GET REACTIONS DI UN VIDEO
export const getReactions = (videoId) =>
  apiRequest(`/reactions/${videoId}`, "GET", null, true);

// POST REACTION (like/dislike)
export const postReaction = (videoId, type) =>
  apiRequest(`/reactions/${videoId}`, "POST", { type }, true);