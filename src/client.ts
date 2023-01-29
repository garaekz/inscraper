import { ExperienceScraper } from './scrapers/experience.scraper';
import { Browser, BrowserContext, Cookie, Page, PageScreenshotOptions } from "playwright";
import { chromium } from "playwright";
import { ProfileScraper } from "./scrapers/profile.scraper";
import { Experience, JobExperience, Profile } from "./types";

export class Client {
  #browser: Browser;
  context: BrowserContext;
  public slug: string | null;

  constructor(browser: Browser, context: BrowserContext) {
    this.#browser = browser;
    this.context = context;
    this.slug = null;
  }

  async close() {
    await this.#browser?.close();
  }

  async getProfile(slug?: string): Promise<Profile> {
    this.#prepareToScrape(slug);
    const scraper = new ProfileScraper(this);
    return await scraper.scrape();
  }

  async getExperience(slug?: string): Promise<JobExperience> {
    this.#prepareToScrape(slug);
    const scraper = new ExperienceScraper(this);
    return await scraper.scrapeAlone();
  }

  #prepareToScrape(slug?: string) {
    if (!slug && !this.slug) {
      throw new Error("No slug specified");
    }

    if (slug) {
      this.slug = slug;
    }
  }
}

export const createClient = async (cookieString: string): Promise<Client> => {
  const cookie: Cookie = {
    name: "li_at",
    value: cookieString,
    domain: ".www.linkedin.com",
    path: "/",
    expires: -1,
    httpOnly: false,
    secure: true,
    sameSite: "None",
  };

  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addCookies([cookie]);

  return new Client(browser, context);
};
