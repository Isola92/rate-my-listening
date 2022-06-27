import { test, expect } from "@playwright/test";

test.describe("Average rating", () => {
  test("should fetch albums and present average rating ", async ({ page }) => {
    await page.goto("http://localhost:8000");
    await expect(page.locator("#start")).toHaveText(
      "Initiate Spotify authentication!"
    );

    await page.click("#auth-button");

    const testUser = process.env.SPOTIFY_TEST_USER;
    const testPw = process.env.SPOTIFY_TEST_PW;

    await expect(page.locator("#login-to-continue")).toHaveText(
      "Logga in på Spotify för att fortsätta."
    );

    await page.type("#login-username", testUser);
    await page.type("#login-password", testPw);
    await page.click("#login-button");
    await expect(page.locator("h1")).toHaveText(
      "Processing your listening data.."
    );

    await expect(page.locator("h1")).toHaveText(`Average: ${3.53}`, {
      timeout: 30000,
    });
  });
});
