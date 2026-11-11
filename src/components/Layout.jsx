import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";
import Footer from "./Footer.jsx";
import Nav from "./Nav.jsx";

const DEFAULT_BROWSE_QUERY = "movie";

export default function Layout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("s") || "");
  const query = searchParams.get("s") || DEFAULT_BROWSE_QUERY;
  const page = Math.max(1, Number.parseInt(searchParams.get("page"), 10) || 1);

  useEffect(() => {
    setSearchValue(searchParams.get("s") || "");
  }, [searchParams]);

  function handleSearch(event) {
    event.preventDefault();
    const nextQuery = searchValue.trim() || DEFAULT_BROWSE_QUERY;
    navigate(`/?s=${encodeURIComponent(nextQuery)}`);
  }

  return (
    <>
      {createPortal(
        <Nav
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          onSearch={handleSearch}
        />,
        document.getElementById("nav-react-content"),
      )}
      {createPortal(
        <Outlet context={{ query, page }} />,
        document.getElementById("browse-content"),
      )}
      {createPortal(<Footer />, document.getElementById("footer-content"))}
    </>
  );
}
