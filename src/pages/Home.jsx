import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { OMDB_API_KEY } from "../omdb.js";
import MovieCard from "../components/ui/MovieCard.jsx";

function getReleaseYear(movie) {
  const year = Number.parseInt(movie.Year, 10);
  return Number.isNaN(year) ? 0 : year;
}

export default function Home() {
  const { query, page } = useOutletContext();
  const [, setSearchParams] = useSearchParams();
  const [sortOrder, setSortOrder] = useState("none");
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      if (!OMDB_API_KEY || OMDB_API_KEY === "YOUR_OMDB_API_KEY") {
        setError("Add your OMDb API key in src/omdb.js to load movies.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          apikey: OMDB_API_KEY,
          s: query,
          type: "movie",
          page: String(page),
        });
        const response = await fetch(`https://www.omdbapi.com/?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`OMDb request failed with status ${response.status}.`);
        }

        const result = await response.json();
        if (result.Response === "False") {
          setMovies([]);
          setTotalPages(1);
          setError(result.Error || "No movies found.");
          return;
        }

        setMovies(result.Search || []);
        const resultCount = Number.parseInt(result.totalResults, 10) || 0;
        setTotalPages(Math.max(1, Math.min(Math.ceil(resultCount / 10), 100)));
      } catch (requestError) {
        if (requestError.name === "AbortError") return;
        console.error("Failed to load movies:", requestError);
        setError("Something went wrong loading movies. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMovies();
    return () => controller.abort();
  }, [page, query]);

  const sortedMovies = useMemo(() => {
    const sorted = [...movies];
    switch (sortOrder) {
      case "az":
        return sorted.sort((a, b) => a.Title.localeCompare(b.Title));
      case "za":
        return sorted.sort((a, b) => b.Title.localeCompare(a.Title));
      case "newest":
        return sorted.sort((a, b) => getReleaseYear(b) - getReleaseYear(a));
      case "oldest":
        return sorted.sort((a, b) => getReleaseYear(a) - getReleaseYear(b));
      default:
        return sorted;
    }
  }, [movies, sortOrder]);

  function changePage(nextPage) {
    setSearchParams({ s: query, page: String(nextPage) });
  }

  return (
    <>
      <div className="search">
        <h2>Movies matching <span className="purple">"{query}"</span></h2>
        <label className="sort-control" htmlFor="sort-select">Sort:</label>
        <select id="sort-select" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
          <option value="none">Default</option>
          <option value="az">A to Z</option>
          <option value="za">Z to A</option>
          <option value="newest">Newest to Oldest</option>
          <option value="oldest">Oldest to Newest</option>
        </select>
      </div>
      <div className={`loading${loading ? " loading__wrapper" : ""}`}>
        <i className="fa-solid fa-spinner loading__spinner fa-spin" aria-label="Loading movies"></i>
      </div>
      {error ? (
        <p role="alert">{error}</p>
      ) : (
        <div className="movie__list">
          {sortedMovies.map((movie) => <MovieCard key={movie.imdbID} movie={movie} />)}
        </div>
      )}
      {totalPages > 1 && (
        <div className="pagination" aria-label="Movie pages">
          <button type="button" disabled={page <= 1} onClick={() => changePage(page - 1)}>Previous</button>
          <span aria-live="polite">Page {page} of {totalPages} (10 movies per page)</span>
          <button type="button" disabled={page >= totalPages} onClick={() => changePage(page + 1)}>Next</button>
        </div>
      )}
    </>
  );
}
