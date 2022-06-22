export const getRymAlbumPath = (album, artist) => {
  const albumUrl = urlifyName(album);
  const artistUrl = urlifyName(artist);

  return `https://rateyourmusic.com/release/album/${artistUrl}/${albumUrl}/`;
};

import * as path from "path";

export const getRymAlbumBrowserFunctionPath = () =>
  `${path.resolve(__dirname)}../../../../browser-functions/album-page.js`;

const urlifyName = (name: string) => {
  return name.replaceAll(" ", "-").toLowerCase();
};
