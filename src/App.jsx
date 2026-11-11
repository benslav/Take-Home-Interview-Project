import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import MovieDetails from "./components/ui/MovieDetails.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:imdbID" element={<MovieDetails />} />
          <Route path="*" element={<p role="alert">Page not found.</p>} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
