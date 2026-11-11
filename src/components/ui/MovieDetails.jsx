import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { OMDB_API_KEY } from "../../omdb.js";
import { decodeHtmlEntities } from "../../utils.js";

const DETAIL_FIELDS = [
  ["Genre", "Genre"],
  ["Writer", "Writer"],
  ["Actors", "Actors"],
  ["Plot", "Plot"],
  ["Language", "Language"],
  ["Awards", "Awards"],
];

export default function MovieDetails() {
  const { imdbID } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDetails() {
      if (!OMDB_API_KEY || OMDB_API_KEY === "YOUR_OMDB_API_KEY") {
        setError("Add your OMDb API key in src/omdb.js to load movie details.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          apikey: OMDB_API_KEY,
          i: imdbID,
          plot: "full",
        });
        const response = await fetch(`https://www.omdbapi.com/?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`OMDb request failed with status ${response.status}.`);
        }

        const result = await response.json();
        if (result.Response === "False") {
          throw new Error(result.Error || "Could not load movie details.");
        }
        setMovie(result);
      } catch (requestError) {
        if (requestError.name === "AbortError") return;
        console.error("Failed to load movie details:", requestError);
        setError(requestError.message || "Something went wrong loading movie details.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDetails();
    return () => controller.abort();
  }, [imdbID]);

  const backTo = location.state?.from || "/";

  return (
    <section className="movie-details-page">
      <div className="movie-details">
        <Link className="movie-details__back" to={backTo}>← Back</Link>
        {loading ? (
          <p className="movie-details__status" role="status">Loading movie details...</p>
        ) : error ? (
          <p className="movie-details__status" role="alert">{error}</p>
        ) : movie ? (
          <div className="movie-details__content">
            <div className="movie-details__summary">
              {movie.Poster && movie.Poster !== "N/A" ? (
                <img className="movie-details__poster" src={movie.Poster} alt={`${decodeHtmlEntities(movie.Title)} poster`} />
              ) : (
                <div className="movie-details__poster movie__img--missing">No poster available</div>
              )}
              <h1 className="movie-details__title">{decodeHtmlEntities(movie.Title)}</h1>
              <p>Year: {decodeHtmlEntities(movie.Year || "N/A")}</p>
              <p>Rating: {movie.imdbRating && movie.imdbRating !== "N/A" ? `${movie.imdbRating}/10` : "N/A"}</p>
              <p>Released: {decodeHtmlEntities(movie.Released || "N/A")}</p>
            </div>
            <dl className="movie-details__facts">
              {DETAIL_FIELDS.map(([label, property]) => (
                <div className="movie-details__fact" key={property}>
                  <dt>{label}</dt>
                  <dd>{decodeHtmlEntities(movie[property] && movie[property] !== "N/A" ? movie[property] : "N/A")}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </section>
  );
}
