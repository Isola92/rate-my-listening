import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { AlbumData } from "./model/AlbumData";
import topItemsAtom from "./atom/topItems";
import { TopItemResponse } from "./model/TopItemResponse";

export const SpotifyRedirect = () => {
  const [topItems, setTopItems] = useRecoilState(topItemsAtom);

  const navigate = useNavigate();
  useEffect(() => {
    exchangeToken()
      .then(fetchTopItems)
      .then(fetchScrapedRating)
      .then(setTopItems);
  }, []);

  useEffect(() => {
    if (topItems.length > 0) navigate("/result");
  }, [topItems]);
  return (
    <>
      <h1>Processing your listening data..</h1>;
    </>
  );
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
  return processSpotifyAlbumData(topItems).slice(15, 16);
};

const fetchScrapedRating = async (spotifyAlbumData: AlbumData[]) => {
  //const spotifyAlbumData = processSpotifyAlbumData(topItems);
  console.info(spotifyAlbumData);
  const albumWithRatings = await fetch("http://localhost:3000/scrape/rating", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ items: spotifyAlbumData }),
  }).then((x) => x.json());

  console.info("Fetched album with ratings", albumWithRatings);
  return albumWithRatings;
};

const processSpotifyAlbumData = (response: TopItemResponse): AlbumData[] => {
  return response.items.map((x) => {
    return {
      artist: x.album.artists[0].name,
      album: x.album.name,
    };
  });
};
