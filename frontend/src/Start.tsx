import React, { useEffect } from "react";

export const Start = () => {
  useEffect(() => {
    initiateAuth();
  }, []);
  return <h1>Initiating Spotify authentication</h1>;
};

const initiateAuth = async () => {
  const spotifyAuthUrl = await fetch("http://localhost:3000/spotify/auth").then(
    (response) => response.json()
  );
  console.info("SpotifyAuthUrl", spotifyAuthUrl);
  window.location.href = spotifyAuthUrl.url;
};
