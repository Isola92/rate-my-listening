import { Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { getRedirectUrl, getSpotifyAuthToken } from "./spotify";
import { Request } from "express";
import * as querystring from "querystring";

/**
 * TODO: Refactor into auth and album controllers.
 */
@Controller("spotify")
export class SpotifyController {
  constructor() {}

  @Get("/auth")
  async auth(): Promise<any> {
    return { url: getRedirectUrl() };
  }

  @Get("/token-exchange")
  async tokenExchange(@Req() request: Request) {
    const { code, state } = querystring.parse(request.url.split("?")[1]);
    console.info("Received request for token with code", code);
    return getSpotifyAuthToken(code, state);
  }

  @Get("/top-items/")
  async getTopItems(
    @Query("type") type: string,
    @Query("token") token: string
  ) {
    console.info("Received top item request from client with token", token);
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
  }
}
