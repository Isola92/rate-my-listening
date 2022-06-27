import { Body, Controller, Get, HttpCode, Post, Req } from "@nestjs/common";
import { getRymAlbumBrowserFunctionPath, getRymAlbumPath } from "./paths";
import { ScrapeQueryOptions, ScrapeService } from "./scrape.service";
import * as fs from "fs/promises";

@Controller("scrape")
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  @Post("/rating")
  async ratings(@Body() ratingRequest: RatingRequest): Promise<RymAlbumData[]> {
    const queryFunction = await await fs.readFile(
      getRymAlbumBrowserFunctionPath(),
      {
        encoding: "utf8",
      }
    );

    const queryOptions: ScrapeQueryOptions[] = ratingRequest.items.map(
      (request) => {
        return {
          url: getRymAlbumPath(request.album, request.artist),
          queryFunction,
        };
      }
    );

    const res = await this.scrapeService.getRatings(queryOptions);
    console.info("Scraped info for albums", res);
    return res;
  }
}

interface RatingRequest {
  items: Omit<RymAlbumData, "rating">[];
}

export interface RymAlbumData {
  artist: string;
  album: string;
  rating: string;
}
