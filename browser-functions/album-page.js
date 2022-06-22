function crawl() {
  const artist = ".artist";

  const album = ".album_title";

  const rating = ".avg_rating";

  return {
    artist: document.querySelector(artist).innerText,
    album: document.querySelector(album).innerText,
    rating: document.querySelector(rating).innerText,
  };
}
