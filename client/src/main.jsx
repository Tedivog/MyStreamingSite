import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes";
import "./style.css";
import ThemeProvider from "./ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  </React.StrictMode>
);
