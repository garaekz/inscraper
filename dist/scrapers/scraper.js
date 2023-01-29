"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scraper = void 0;
class Scraper {
    client;
    slug;
    page;
    constructor(client) {
        this.client = client;
        this.slug = client.slug;
        this.page = null;
    }
    async newPage(url) {
        this.page = await this.client.context.newPage();
        if (url) {
            await this.page.goto(url);
        }
        return this.page;
    }
    updateSlug(slug) {
        this.slug = slug;
    }
    async getScreenshot(options) {
        if (!this.page) {
            throw new Error("Page not initialized");
        }
        return await this.page.screenshot(options);
    }
}
exports.Scraper = Scraper;
//# sourceMappingURL=scraper.js.map