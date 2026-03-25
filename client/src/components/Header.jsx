import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

export default function Header({ onSearchSelect }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleHomeClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.location.reload(); // 🔄 refresh solo se già su /
    } else {
      navigate("/");
    }
  };

  return (
    <header className="header">
      
      {/* LOGO */}
      <Link className="logo" to="/" onClick={handleHomeClick}>
        MyStream
      </Link>

      {/* SEARCH BAR */}
      <div className="search-bar">
        <SearchBar onSearchSelect={onSearchSelect} />
      </div>

      {/* NAVIGATION */}
      <nav className="navbar">
        <div className="navbar-links">
          <ThemeToggle />
          <Link to="/" className="nav-btn" onClick={handleHomeClick}>
            Home
          </Link>

          <Link to="/upload" className="nav-btn">
            Upload
          </Link>

          <Link to="/profile" className="nav-btn">
            Me
          </Link>

          <Link to="/login" className="nav-profile">
            <span className="nav-avatar">👤</span>
          </Link>

        </div>
      </nav>

    </header>
  );
}