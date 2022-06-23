import React from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { SpotifyRedirect } from "./SpotifyRedirect";
import { Start } from "./Start";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />}></Route>
        <Route path="/spotify-redirect" element={<SpotifyRedirect />}></Route>
        <Route path="/top-items" element={<TopItems />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

const TopItems = () => {
  return <h1>Hello top items</h1>;
};

document.addEventListener("DOMContentLoaded", () => {
  const root = createRoot(document.querySelector("#root"));
  root.render(<App />);
});
