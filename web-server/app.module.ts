import { Module } from "@nestjs/common";
import { SpotifyController } from "./integration/spotify.controller";
import { ScrapeController } from "./scraping/scrape.controller";
import { ScrapeService } from "./scraping/scrape.service";

@Module({
  imports: [],
  controllers: [ScrapeController, SpotifyController],
  providers: [ScrapeService],
})
export class AppModule {}
