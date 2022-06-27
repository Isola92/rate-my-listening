import * as querystring from "querystring";
//import * as process from "process";

export class SpotifyService {
  private static SCOPE = "user-top-read";
  private static REDIRECT_URI = "http://localhost:8000/spotify-redirect";
  private static CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  private static CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

  public async getSpotifyAuthToken(code: string, state: string) {
    const authBuffer = Buffer.from(
      `${SpotifyService.CLIENT_ID}:${SpotifyService.CLIENT_SECRET}`
    ).toString("base64");
    const postQuery = `code=${code}&grant_type=authorization_code&redirect_uri=${SpotifyService.REDIRECT_URI}`;

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authBuffer}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: postQuery,
    }).catch((e) => {
      console.warn("Failed auth token exchange", e);
      throw new Error();
    });

    if (res.status !== 200) {
      console.warn("Failed auth token exchange", res.status, res.statusText);
      return "";
    }
    // This token can later be used for fetching listening data.
    const token = await res.json();
    return token;
  }

  public getRedirectUrl = (
    state = Math.floor(Math.random() * 16).toString()
  ) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    console.info("client id", clientId);

    return (
      "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: clientId,
        scope: SpotifyService.SCOPE,
        redirect_uri: SpotifyService.REDIRECT_URI,
        state: state,
      })
    );
  };
}
