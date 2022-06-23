import React, { useEffect, useState } from "react";

export const SpotifyRedirect = () => {
  const [averageRating, setAverageRating] = useState(0);
  useEffect(() => {
    exchangeToken()
      .then(fetchTopItems)
      .then(fetchScrapedRating)
      .then(setAverageRating);
  }, []);
  return <h1>Hello Redirect. Rating: {averageRating}</h1>;
};

const exchangeToken = async (): Promise<string> => {
  const { code, state } = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );

  const token = await fetch(
    `http://localhost:3000/spotify/token-exchange?code=${code}&state=${state}`
  ).then((response) => response.json());

  console.info("Successfully exchanged token", token);
  return token;
};

// We don't get albums here but hopefully there's an album prop on the track object
const fetchTopItems = async (token: string) => {
  const topItems = await fetch(
    `http://localhost:3000/spotify/top-items?type=tracks&token=${token.access_token}`
  ).then((response) => response.json());

  console.info("Identified topItems", topItems);
  return topItems;
};

const fetchScrapedRating = async (topItems: TopItemResponse) => {
  const spotifyAlbumData = processSpotifyAlbumData(topItems);
  console.info(spotifyAlbumData);
  const albumWithRatings = await fetch("http://localhost:3000/scrape/rating", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ items: spotifyAlbumData }),
  }).then((x) => x.json());

  console.info("Fetched album with ratings", albumWithRatings);

  const sum = (albumWithRatings as any[])
    .map((x) => Number(x.rating.trim()))
    .reduce((acc, current) => (acc += current));

  return sum / albumWithRatings.length;
};

const processSpotifyAlbumData = (response: TopItemResponse) => {
  return response.items.map((x) => {
    return {
      artist: x.album.artists[0].name,
      album: x.album.name,
    };
  });
};

interface TopItemResponse {
  items: TopItemEntity[];
}

interface TopItemEntity {
  album: SpotifyApi.AlbumObjectSimplified;
}
