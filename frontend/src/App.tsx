import React from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { SpotifyRedirect } from "./SpotifyRedirect";
import { Start } from "./Start";
import { RecoilRoot } from "recoil";
import { Result } from "./Result";
const App = () => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />}></Route>
          <Route path="/spotify-redirect" element={<SpotifyRedirect />}></Route>
          <Route path="/result" element={<Result />}></Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const root = createRoot(document.querySelector("#root"));
  root.render(<App />);
});
