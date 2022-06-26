import { selector } from "recoil";
import topItems from "../atom/topItems";

/**
 * Subscribes to topItems and calculates and stores the average rating.
 */
export default selector({
  key: "averageRating",
  get: ({ get }) => {
    const albums = get(topItems);

    if (!albums || albums.length === 0) {
      return 0;
    }
    const sum = albums
      .map((x) => Number(x.rating.trim()))
      .reduce((acc, current) => (acc += current));
    return sum / albums.length;
  },
});
