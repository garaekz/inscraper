import { Browser, BrowserContext, Cookie, Page } from "playwright";
import { chromium } from "playwright";
import { Experience, Profile } from "./types";
import { CookiesError } from "./errors";

export class Client {
  private browser: Browser;
  private context: BrowserContext;
  private page: Page | null;
  private slug: string | null;

  constructor(browser: Browser, context: BrowserContext) {
    this.browser = browser;
    this.context = context;
    this.page = null;
    this.slug = null;
  }

  async close() {
    await this.browser?.close();
  }

  getContext(): BrowserContext {
    return this.context;
  }

  getBrowser(): Browser {
    return this.browser;
  }

  async setPage(url?: string): Promise<void> {
    if (!this.page) {
      this.page = await this.context.newPage();
    }
    if (url) {
      await this.page.goto(url);
    }
  }

  async getProfile(profileSlug?: string): Promise<Profile> {
    if (!this.page && !profileSlug) {
      throw new Error("No page or slug specified");
    }

    if (profileSlug) {
      if(this.page) await this.page.close();
      
      await this.setPage(`https://www.linkedin.com/in/${profileSlug}`);
      this.slug = profileSlug;
    }

    if (!this.page) {
      /* 
      This should never happen but typescript is complaining.
      
      not page and not slug = error
      not page and slug = set page
      page and not slug = page already set
      page and slug = close page and set new page
      */
      throw new Error("No page specified");
    }

    if (await this.page.$("meta[content='auth_wall_desktop_profile']")) {
      throw new CookiesError();
    }

    const about = await this.page.locator("#about ~ div.display-flex.ph5.pv3 .inline-show-more-text span[aria-hidden='true']").innerText();
    const name = await this.page.innerText("main section:nth-child(1) h1");
    const headline = await this.page.innerText("main section:nth-child(1) .text-body-medium.break-words");
    
    const experienceViewMore = await this.page.$("#experience ~ .pvs-list__outer-container .pvs-list__footer-wrapper");

    let experience: Experience[];
    if (experienceViewMore) {
      experience = await this.getExperience(this.slug!);
    } else {
      const experienceLocator = await this.page.locator("#experience ~ .pvs-list__outer-container li.pvs-list__item--line-separated div.display-flex.flex-column.full-width.align-self-center").all();
      experience = await Promise.all(experienceLocator.map(async (item) => {
        let description: string | null = null;
        const descriptionLocator = item.locator("> div.pvs-list__outer-container > ul.pvs-list");
        if (await descriptionLocator.isVisible()) {
          description = await descriptionLocator.locator("li span[aria-hidden=true]").allInnerTexts().then((list: Array<string>) => list.join(" | "));
          description?.replace(/\r?\n|\r/g, ' ');
        }
        const locationLocator = item.locator("div.display-flex.flex-column.full-width > span:nth-child(4) > span:nth-child(1)");
        return {
          title: await item.locator("span.mr1.t-bold > span:nth-child(1)").innerText(),
          company: await item.locator("div.display-flex.flex-column.full-width > span:nth-child(2) > span:nth-child(1)").innerText(),
          date: await item.locator("div.display-flex.flex-column.full-width > span:nth-child(3) > span:nth-child(1)").innerText(),
          location: await locationLocator.isVisible() ? await locationLocator.innerText() : null,
          description,
        };
      }));
    }

    return {
      name,
      headline,
      about,
      experience,
    };
  }

  async getScreenshot(profileSlug?: string): Promise<Buffer> {
    if (!this.page && !profileSlug) {
      throw new Error("No page or slug specified");
    }
    if (!this.page) {
      this.page = await this.context.newPage();
      await this.page.goto(`https://www.linkedin.com/in/${profileSlug}`, {
        waitUntil: "domcontentloaded",
      });
    }

    const html = await this.page.content();
    if (html.includes("auth_wall_desktop_profile")) {
      throw new CookiesError();
    }
    const buffer = await this.page.screenshot({
      type: "png",
      fullPage: true,
    });

    return buffer;
  }

  private async getExperience(slug: string): Promise<Experience[]> {
    const page = await this.context.newPage();
    await page.goto(`https://www.linkedin.com/in/${slug}/details/experience/`);
    const locator = await page.locator(".pvs-list__container ul.pvs-list li.pvs-list__paged-list-item").all();
    const experience = await Promise.all(locator.map(async (item) => {
      let description: string | null = null;
      const descriptionLocator = item.locator("div > div > div.align-self-center > div:nth-child(2)");
      if (await descriptionLocator.isVisible()) {
        description = await descriptionLocator.locator("li.pvs-list__item--with-top-padding span:nth-child(1)").innerText()
        description = description.replace(/\r?\n|\r/g, ' ');
      }

      const location = item.locator("div.display-flex.flex-column.full-width > span:nth-child(4) > span:nth-child(1)");
      return {
        title: await item.locator(".flex-column .align-items-center span > span:nth-child(1)").innerText(),
        company: await item.locator("div.display-flex.flex-column.full-width > span:nth-child(2) > span:nth-child(1)").innerText(),
        date: await item.locator("div.display-flex.flex-column.full-width > span:nth-child(3) > span:nth-child(1)").innerText(),
        location: await location.isVisible ? await location.innerText() : null,
        description,
      };
    }));
      
    await page.close();
    return experience;
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
