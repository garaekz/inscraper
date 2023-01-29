import { Locator, PageScreenshotOptions } from "playwright";
import { Client } from "../client";
import { CookiesError } from "../errors";
import { Experience, Profile } from "../types";
import { ExperienceScraper } from "./experience.scraper";
import { Scraper } from "./scraper";

export class ProfileScraper extends Scraper {
  constructor(client: Client) {
    super(client);
  }

  private get url(): string {
    return `https://www.linkedin.com/in/${this.slug}`;
  }

  createUrlBySlug(slug: string): string {
    this.updateSlug(slug);
    return this.url;
  }

  async scrape(): Promise<Profile> {
    const page = await this.newPage(this.url);
    if (await page.$("meta[content='auth_wall_desktop_profile']")) {
      throw new CookiesError();
    }

    const experienceViewMore = page.locator("#experience ~ .pvs-list__outer-container .pvs-list__footer-wrapper");
  
    let experiencePromise: Promise<Experience[]>; 
  
    if (await experienceViewMore.isVisible()) {
      const experienceScraper = new ExperienceScraper(this.client);
      experiencePromise = experienceScraper.scrape();
    } else {
      // I need to make sure the experience section is loaded before I get the locators
      await page.waitForSelector("#experience ~ .pvs-list__outer-container > ul > li", { state: "attached" });
      const experienceItemsLocator = await page.locator("#experience ~ .pvs-list__outer-container > ul > li").all();
      experiencePromise = this.#getExperience(experienceItemsLocator);
    }

    const experience = await experiencePromise;
  
    const about = await page.locator("#about ~ div.display-flex.ph5.pv3 .inline-show-more-text span[aria-hidden='true']")
      .innerText()
      .then((text) => text.replace(/\r?\n|\r/g, ' '));
    const name = await page.innerText("main section:nth-child(1) h1");
    const headline = await page.innerText("main section:nth-child(1) .text-body-medium.break-words");
  
    return {
      name,
      headline,
      about,
      experience,
      getScreenshot: (options?: PageScreenshotOptions) => this.getScreenshot(options)
    };
  }

  async #getExperience(locators: Locator[]): Promise<Experience[]> {
    const experienceList = await Promise.all(locators.map(async (locator) => {
      const isMultiple = await locator.locator("ul ul ul li.pvs-list__item--with-top-padding").count();
      return isMultiple
          ? await this.#getExperienceMultipleRecords(locator)
          : await this.#getExperiencSingleRecord(locator);
    }));

    return experienceList.flat();
  }

  async #getExperiencSingleRecord(locator: Locator): Promise<Experience> {
    try {
      const locationLocator = locator.locator("div.display-flex.flex-column.full-width > span:nth-child(4) > span:nth-child(1)");
      const descriptionLocator = locator.locator("> div > div > div > ul.pvs-list");

      const title = await locator.locator("span.mr1.t-bold > span:nth-child(1)").innerText();
      const company = await locator.locator("div.display-flex.flex-column.full-width > span:nth-child(2) > span:nth-child(1)").innerText();
      const date = await locator.locator("div.display-flex.flex-column.full-width > span:nth-child(3) > span:nth-child(1)").innerText();
      const location = await locationLocator.isVisible() ? await locationLocator.innerText() : null
      const description = await descriptionLocator.isVisible() ? await descriptionLocator.locator("li span[aria-hidden=true]").allInnerTexts().then((list: Array<string>) => list.join(" | ").replace(/\r?\n|\r/g, ' ')) : null;
      return { title, company, date, location, description };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async #getExperienceMultipleRecords(locator: Locator): Promise<Experience[]> {
    try {
      const company = await locator.locator("> div > div > div > a > div > .mr1 > span:nth-child(1)").innerText();
      const location = await locator.locator("> div > div > div > a > .t-black--light > span:nth-child(1)").innerText();
      const locators = await locator.locator("> div > div > .pvs-list__outer-container > ul > li").all();

      return await Promise.all(locators.map(async (innerLocator: Locator) => {
        const descriptionLocator = innerLocator.locator(".align-self-center > .pvs-list__outer-container > ul");

        const title = await innerLocator.locator(".align-self-center > .justify-space-between a span:nth-child(1) > span:nth-child(1)").innerText();
        const date = await innerLocator.locator(".align-self-center > .justify-space-between a span:nth-child(2) > span:nth-child(1)").innerText();
        const description = await descriptionLocator.isVisible() ? await descriptionLocator.locator("li span[aria-hidden=true]").allInnerTexts().then((list: Array<string>) => list.join(" | ").replace(/\r?\n|\r/g, ' ')) : null;
        return { title, company, date, location, description };
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}