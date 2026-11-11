import React from "react";
import { useLocation } from "react-router-dom";

export default function Nav({ searchValue, onSearchValueChange, onSearch }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="nav__layout">
      <div className="nav__center">
        <h1 className="nav__title">{isHome ? "Browse movies" : "Movie details"}</h1>
        {isHome && (
          <form className="search__wrapper" onSubmit={onSearch}>
            <div className="search__input-wrapper">
              <input
                id="search-input"
                type="text"
                placeholder="Search movies..."
                aria-label="Search movies"
                value={searchValue}
                onChange={(event) => onSearchValueChange(event.target.value)}
              />
              <button className="search__btn" type="submit" aria-label="Search">
                <i className="fa-solid fa-magnifying-glass search__icon click"></i>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
