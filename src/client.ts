import { Browser, BrowserContext } from 'playwright';
import { Cookie } from 'playwright-core';
import { chromium } from 'playwright-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import * as cheerio from 'cheerio';
import { Profile } from './types';
chromium.use(StealthPlugin())

export class Client {
  private browser: Browser;
  private context: BrowserContext;

  constructor(browser: Browser, context: BrowserContext) {
    this.browser = browser;
    this.context = context;
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

  async getProfile(vanityName: string): Promise<Profile> {
    const page = await this.context.newPage();
    await page.goto(`https://www.linkedin.com/in/${vanityName}`, { waitUntil: 'load' });
    const html = await page.content();
    if (html.includes('auth_wall_desktop_profile')) {
      throw new Error('Cookies error');
    }
    await page.close();
    const $ = cheerio.load(html);
    return {
      name:  $('main section:nth-child(1) h1').text(),
      headline: $('main section:nth-child(1) .text-body-medium.break-words').text().trim(),
      about: $('section > #about ~ div.display-flex.ph5.pv3 span[aria-hidden=true]').text(),
      experience: $('section > #experience ~ .pvs-list__outer-container ul ul ul li span[aria-hidden=true]').toArray().map((item) => $(item).text()),
    };
  }

  async getExperience(vanityName: string): Promise<string[]> {
    const page = await this.context.newPage();
    await page.goto(`https://www.linkedin.com/in/${vanityName}/details/experience/`, { waitUntil: 'domcontentloaded' });
    const html = await page.content();
    if (html.includes('auth_wall_desktop_profile')) {
      throw new Error('Cookies error');
    }
    await page.close();
    const $ = cheerio.load(html);
    return $('section > #experience ~ .pvs-list__outer-container ul ul ul li span[aria-hidden=true]').toArray().map((item) => $(item).text());
  }
}

export const createClient = async (cookieString: string): Promise<Client> => {
  const cookie: Cookie = {
    name: 'li_at',
    value: cookieString,
    domain: '.www.linkedin.com',
    path: '/',
    expires: -1,
    httpOnly: false,
    secure: true,
    sameSite: 'None',
  };

  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addCookies([cookie]);

  return new Client(browser, context);
}