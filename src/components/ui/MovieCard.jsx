import React from "react";
import { Link, useLocation } from "react-router-dom";
import { decodeHtmlEntities } from "../../utils.js";

export default function MovieCard({ movie }) {
  const title = decodeHtmlEntities(movie.Title);
  const location = useLocation();
  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <Link
      className="movie-card-link"
      to={`/movie/${encodeURIComponent(movie.imdbID)}`}
      state={{ from: `${location.pathname}${location.search}` }}
      aria-label={`View details for ${title}`}
    >
      <article className="movie">
        <figure className="movie__img--wrapper">
          {hasPoster ? (
            <img src={movie.Poster} alt={`${title} poster`} className="movie__img" />
          ) : (
            <div className="movie__img movie__img--missing">No poster available</div>
          )}
        </figure>
        <div className="movie__title">{title}</div>
        <div className="movie__release--date">{movie.Year || "Year unknown"}</div>
      </article>
    </Link>
  );
}
