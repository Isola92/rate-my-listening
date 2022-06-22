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
    ).then((response) => response.text());

    console.info(topItems);
  } else if (!window.location.href.includes("spotify-redirect")) {
    const spotifyAuthUrl = await fetch(
      "http://localhost:3000/spotify/auth"
    ).then((response) => response.json());
    console.info("SpotifyAuthUrl", spotifyAuthUrl);
    window.location.href = spotifyAuthUrl.url;
  }
};

processAuthResponse();
