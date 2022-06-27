import * as puppeteer from "puppeteer";
import * as fs from "fs/promises";
import * as uuid from "uuid";
import { RymAlbumData } from "./scrape.controller";

export interface ScrapeQueryOptions {
  url: string;
  queryFunction: string;
}

export class ScrapeService {
  async getRecentData(options: ScrapeQueryOptions): Promise<RymAlbumData> {
    let browser: puppeteer.Browser;
    try {
      browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(options.url);
      const result = await this.callBrowserContextFunction(
        options.queryFunction,
        page
      );

      const json = JSON.stringify(result);
      await fs.writeFile(`albums-${uuid.v4()}.json`, json, "utf8");
      return result as RymAlbumData;
    } catch (e) {
      console.warn("Error during scraping", e);
    } finally {
      browser.close();
    }
  }

  async callBrowserContextFunction(queryFunction, page) {
    console.info("Calling", queryFunction);
    return await page.evaluate((funcString) => {
      const func = new Function(`return ${funcString}.apply(null, arguments)`);
      return func();
    }, queryFunction);
  }

  async getRatings(options: ScrapeQueryOptions[]) {
    const ratings = [];
    for (const option of options) {
      const data = await this.getRecentData(option);
      if (!data || Object.keys(data).length === 0) {
        console.info("Failed to fetch data for url", option.url);
        continue;
      }
      ratings.push(data);
    }

    return ratings;
  }
}
