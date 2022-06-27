import React, { useEffect } from "react";

export const Start = () => {
  return (
    <>
      <h1 id="start">Initiate Spotify authentication!</h1>
      <button id="auth-button" onClick={() => initiateAuth()}>
        OK
      </button>
    </>
  );
};

const initiateAuth = async () => {
  const spotifyAuthUrl = await fetch("http://localhost:3000/spotify/auth").then(
    (response) => response.json()
  );
  console.info("SpotifyAuthUrl", spotifyAuthUrl);
  window.location.href = spotifyAuthUrl.url;
};
