import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { SpotifyService } from "./spotify.service.ts";
import { Request } from "express";
import * as querystring from "querystring";

/**
 * TODO: Refactor into auth and album controllers.
 */
@Controller("spotify")
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get("/auth")
  async auth(): Promise<any> {
    return { url: this.spotifyService.getRedirectUrl() };
  }

  @Get("/token-exchange")
  async tokenExchange(
    @Query("code") code: string,
    @Query("state") state: string
  ) {
    console.info("Received request for token with code", code);

    try {
      return await this.spotifyService.getSpotifyAuthToken(code, state);
    } catch (e) {
      console.info("Failed to fetch spotify auth token for code", code, e);
      throw new HttpException("Forbidden", HttpStatus.BAD_REQUEST);
    }
  }

  @Get("/top-items")
  async getTopItems(
    @Query("type") type: string,
    @Query("token") token: string
  ) {
    console.info("Received top item request from client with token", token);

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/me/top/${type}?limit=50`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const topItems = await res.text();
      console.info("Fetched top items", topItems);
      return topItems;
    } catch (e) {
      console.info("Failed to fetch top items", e);
      throw new HttpException("Forbidden", HttpStatus.BAD_REQUEST);
    }
  }
}
