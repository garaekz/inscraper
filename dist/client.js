"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = exports.Client = void 0;
const experience_scraper_1 = require("./scrapers/experience.scraper");
const playwright_1 = require("playwright");
const profile_scraper_1 = require("./scrapers/profile.scraper");
class Client {
    #browser;
    context;
    slug;
    constructor(browser, context) {
        this.#browser = browser;
        this.context = context;
        this.slug = null;
    }
    async close() {
        await this.#browser?.close();
    }
    async getProfile(slug) {
        this.#prepareToScrape(slug);
        const scraper = new profile_scraper_1.ProfileScraper(this);
        return await scraper.scrape();
    }
    async getExperience(slug) {
        this.#prepareToScrape(slug);
        const scraper = new experience_scraper_1.ExperienceScraper(this);
        return await scraper.scrapeAlone();
    }
    #prepareToScrape(slug) {
        if (!slug && !this.slug) {
            throw new Error("No slug specified");
        }
        if (slug) {
            this.slug = slug;
        }
    }
}
exports.Client = Client;
const createClient = async (cookieString) => {
    const cookie = {
        name: "li_at",
        value: cookieString,
        domain: ".www.linkedin.com",
        path: "/",
        expires: -1,
        httpOnly: false,
        secure: true,
        sameSite: "None",
    };
    const browser = await playwright_1.chromium.launch();
    const context = await browser.newContext();
    await context.addCookies([cookie]);
    return new Client(browser, context);
};
exports.createClient = createClient;
//# sourceMappingURL=client.js.map