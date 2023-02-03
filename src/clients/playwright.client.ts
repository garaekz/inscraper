import { Browser, BrowserContext, Cookie } from "playwright";
import { chromium } from "playwright";

export class PlaywrightClient {
  #browser: Browser;
  #cookie: string;
  context: BrowserContext;
  public slug: string | null;

  constructor(browser: Browser, context: BrowserContext, cookie: string) {
    this.#browser = browser;
    this.#cookie = cookie;
    this.context = context;
    this.slug = null;
  }
}

export const createPlaywrightClient = async (cookieString: string): Promise<PlaywrightClient> => {
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

  return new PlaywrightClient(browser, context, cookieString);
};
