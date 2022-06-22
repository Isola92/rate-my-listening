const processAuthResponse = async () => {
  console.info("Window location", window.location);

  if (window.location.href.includes("spotify-redirect")) {
    const { code, state } = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );

    const token = await fetch(
      `http://localhost:3000/spotify/token-exchange?code=${code}&state=${state}`
    ).then((response) => response.json());

    console.info("Token", token);
    // We don't get albums here but hopefully there's an album prop on the track object
    const topItems = await fetch(
      `http://localhost:3000/spotify/top-items?type=tracks&token=${token.access_token}`
    ).then((response) => response.json());

    console.info("Identified topItems", topItems);

    const spotifyAlbumData = processSpotifyAlbumData(topItems);
    console.info(spotifyAlbumData);
    const albumWithRatings = await fetch(
      "http://localhost:3000/scrape/rating",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ items: spotifyAlbumData }),
      }
    ).then((x) => x.json());

    console.info("Fetched album with ratings", albumWithRatings);

    const average = (albumWithRatings as any[])
      .map((x) => Number(x.rating.trim()))
      .reduce((acc, current) => (acc += current));

    document.write((average / albumWithRatings.length).toString());
  } else if (!window.location.href.includes("spotify-redirect")) {
    const spotifyAuthUrl = await fetch(
      "http://localhost:3000/spotify/auth"
    ).then((response) => response.json());
    console.info("SpotifyAuthUrl", spotifyAuthUrl);
    window.location.href = spotifyAuthUrl.url;
  }
};

processAuthResponse();

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
