import { useState, useEffect, useTransition } from "react";
import { getVideoSuggestions } from "../services/api";

/**
 * SearchBar component provides a search input with autocomplete video suggestions.
 * Features debounced search, keyboard navigation, and suggestion selection.
 * @param {function} onSearchSelect - Callback function called when user selects suggestions
 */
export default function SearchBar({ onSearchSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [_, startTransition] = useTransition();

  // AUTOCOMPLETE: Debounced search effect that fetches video suggestions
  // Clears suggestions when query is empty, aborts previous requests on new queries
  useEffect(() => {
    if (!query.trim()) {
      startTransition(() => setSuggestions([]));
      return;
    }

    const controller = new AbortController();

    const loadSuggestions = async () => {
      try {
        const data = await getVideoSuggestions(query, controller.signal);
        startTransition(() => setSuggestions(data));
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error suggestions:", err);
        }
      }
    };

    // Debounce the API call by 300ms to avoid excessive requests
    const delayDebounce = setTimeout(loadSuggestions, 300);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [query]);

  // Handle Enter key press: Pass all current suggestions to parent component
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0 && onSearchSelect) {
      onSearchSelect(suggestions);
      startTransition(() => {
        setQuery("");
        setSuggestions([]);
      });
    }
  };

  // Handle clicking on a suggestion: Pass the selected video to parent component
  const handleSuggestionClick = (video) => {
    if (onSearchSelect) onSearchSelect([video]);
    startTransition(() => {
      setQuery("");
      setSuggestions([]);
    });
  };

  return (
    <div className="search-container">
      {/* Main search input with placeholder and event handlers */}
      <input
        type="text"
        className="search-input"
        placeholder="Search videos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* Conditional rendering of suggestions dropdown */}
      {query && suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((v) => (
            <li
              key={v.id}
              className="search-suggestion-item"
              onClick={() => handleSuggestionClick(v)}
            >
              {v.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}