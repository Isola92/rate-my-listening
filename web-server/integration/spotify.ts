import * as querystring from "querystring";
const clientId = "622d99423897442c8e28951e88932df1";
const clientSecret = "8266235a015c4b5ba7db05814fcb3d37";

export const getSpotifyAuthToken = async (code, state) => {
  // Buffer.from(str, 'base64') andbuf.toString('base64')
  const authBuffer = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );
  console.info(authBuffer);
  const postQuery = `code=${code}&grant_type=authorization_code&redirect_uri=${redirect_uri}`;

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
  console.info("Received token", token);

  return token;
};

const scope = "user-top-read";
const redirect_uri = "http://localhost:8000/spotify-redirect";

export const getRedirectUrl = (
  state = Math.floor(Math.random() * 16).toString()
) => {
  return (
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: clientId,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
    })
  );
};
