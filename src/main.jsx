import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";

const rootElement = document.getElementById("react-root");
if (
  !rootElement ||
  !document.getElementById("nav-react-content") ||
  !document.getElementById("browse-content") ||
  !document.getElementById("footer-content")
) {
  throw new Error("Movie browser mount points are missing from index.html.");
}

createRoot(rootElement).render(<App />);
