import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import Header from "./components/Header";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const VideoPage = lazy(() => import("./pages/VideoPage"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const CategoryVideosPage = lazy(() => import("./components/CategoryVideosPage"));

export function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Header />

      <Suspense fallback={<p className="loading">Loading page...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video/:id" element={<VideoPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:id" element={<CategoryVideosPage />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <UploadPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>

    </BrowserRouter>
  );
}