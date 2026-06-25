import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Red de seguridad: silencia SOLO los AbortError benignos (p. ej. video.play() o
// un fetch interrumpidos al navegar/desmontar). No afecta a ningún otro error real.
window.addEventListener("unhandledrejection", (event) => {
  if (event.reason && event.reason.name === "AbortError") {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
