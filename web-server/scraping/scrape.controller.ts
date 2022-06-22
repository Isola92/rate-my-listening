import { Controller, Get } from "@nestjs/common";
import { getRymAlbumBrowserFunctionPath, getRymAlbumPath } from "./paths";
import { ScrapeQueryOptions, ScrapeService } from "./scrape.service";
import * as fs from "fs/promises";

@Controller("scrape")
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  @Get("/rating")
  async getHello(): Promise<RymAlbumData[]> {
    const queryOptions: ScrapeQueryOptions = {
      url: getRymAlbumPath("The Tired Sounds Of", "Stars Of The Lid"),
      queryFunction: await fs.readFile(getRymAlbumBrowserFunctionPath(), {
        encoding: "utf8",
      }),
    };
    return this.scrapeService.getRecentData(queryOptions);
  }
}

export interface RymAlbumData {
  artist: string;
  album: string;
  rating: string;
}
