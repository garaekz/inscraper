import { JobExperience } from './../types';
import { Locator, Page, PageScreenshotOptions } from "playwright";
import { Client } from "../client";
import { CookiesError } from "../errors";
import { Experience } from "../types";
import { Scraper } from "./scraper";

export class ExperienceScraper extends Scraper {
  constructor(client: Client) {
    super(client);
  }

  private get url(): string {
    if (!this.slug) throw new Error("No slug specified");
    return `https://www.linkedin.com/in/${this.slug}/details/experience/`;
  }

  createUrlBySlug(slug: string): string {
    this.updateSlug(slug);
    return this.url;
  }

  async scrapeAlone(): Promise<JobExperience> {
    const experience = await this.scrape();
    return {
      experience,
      getScreenshot: (options?: PageScreenshotOptions) => this.getScreenshot(options)
    };
  }

  async scrape(): Promise<Experience[]> {
    const page = await this.newPage(this.url);
    if (await page.$("meta[content='auth_wall_desktop_profile']")) {
      throw new CookiesError();
    }
    
    let experience: Experience[];
    try {
      const locators = await page.locator("section > .pvs-list__container > div > div > ul.pvs-list > li.pvs-list__paged-list-item").all();
      const experienceArray =  await Promise.all(locators.map(async (locator) => {
        const isMultiple = await locator.locator(".scaffold-finite-scroll__content").isVisible();
        return isMultiple
          ? await this.#getMultipleRecords(locator)
          : await this.#getSingleRecord(locator);
      }));

      experience = experienceArray.flat();
    } catch (error) {
      console.error(error);
      return [];
    }
    
    return experience;
  }

  async #getMultipleRecords(locator: Locator): Promise<Experience[]> {
    const company = await locator.locator(".pvs-list__item--no-padding-when-nested > div:nth-child(2) > div > a span.hoverable-link-text span:nth-child(1)").innerText();
    const location = await locator.locator(".pvs-list__item--no-padding-when-nested > div:nth-child(2) > div > a span:nth-child(3) span:nth-child(1)").innerText();
    const expLocators = await locator.locator("> div > div > div:nth-child(2).align-self-center li.pvs-list__paged-list-item").all();
    const experienceList: Experience[] = await Promise.all(expLocators.map(async (expLocator: Locator) => {
      const title = await expLocator.locator(">div > div > div:nth-child(2).align-self-center a .align-items-center span[aria-hidden='true']").innerText();
      const date = await expLocator.locator("a span.t-normal span:nth-child(1)").innerText();
      const description = await expLocator.locator("div.pvs-list__outer-container span:nth-child(1)").allInnerTexts().then((list: string[]) => list.join(" | ").replace(/\r?\n|\r/g, ' '));
      return { title, company, date, location, description };
    }));
    return experienceList;
  }
  
  async #getSingleRecord(locator: Locator): Promise<Experience> {
    const title = await locator.locator(".flex-column .align-items-center span > span:nth-child(1)").innerText();
    const company = await locator.locator("div.display-flex.flex-column.full-width > span:nth-child(2) > span:nth-child(1)").innerText();
    const date = await locator.locator("div.display-flex.flex-column.full-width > span:nth-child(3) > span:nth-child(1)").innerText();
    const location = await locator.locator("div.display-flex.flex-column.full-width > span:nth-child(4) > span:nth-child(1)").isVisible()
            ? await locator.locator("div.display-flex.flex-column.full-width > span:nth-child(4) > span:nth-child(1)").innerText()
            : null;
    const description = await locator.locator("> div > div > div:nth-child(2).align-self-center > div:nth-child(2).pvs-list__outer-container")
            .isVisible()
            ? await locator.locator("li.pvs-list__item--with-top-padding span:nth-child(1)").allInnerTexts().then((list: string[]) => list.join(" | ").replace(/\r?\n|\r/g, ' '))
            : null;
    return { title, company, date, location, description };
  }
}