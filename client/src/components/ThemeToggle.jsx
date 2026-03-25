import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import "../style.css";

export default function ThemeToggle() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <div className="theme-toggle-wrapper">
      <div
        className={`theme-toggle ${darkMode ? "active" : ""}`}
        onClick={() => setDarkMode(prev => !prev)}
      >
        <div className="toggle-thumb"></div>
      </div>
    </div>
  );
}