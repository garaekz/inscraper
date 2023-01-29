import { Page, PageScreenshotOptions } from "playwright";
import { Client } from "../client";

export abstract class Scraper {
  protected client: Client;
  protected slug: string | null;
  protected page: Page | null;

  constructor(client: Client) {
    this.client = client;
    this.slug = client.slug;
    this.page = null;
  }

  abstract createUrlBySlug(slug: string): string;

  async newPage(url?: string): Promise<Page> {
    this.page = await this.client.context.newPage();
    if (url) {
      await this.page.goto(url);
    }

    return this.page;
  }

  protected updateSlug(slug: string) {
    this.slug = slug;
  }

  async getScreenshot(options?: PageScreenshotOptions): Promise<Buffer> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }

    return await this.page.screenshot(options);
  }
}
