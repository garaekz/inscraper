"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlaywrightClient = exports.PlaywrightClient = void 0;
const playwright_1 = require("playwright");
class PlaywrightClient {
    #browser;
    #cookie;
    context;
    slug;
    constructor(browser, context, cookie) {
        this.#browser = browser;
        this.#cookie = cookie;
        this.context = context;
        this.slug = null;
    }
}
exports.PlaywrightClient = PlaywrightClient;
const createPlaywrightClient = async (cookieString) => {
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
    return new PlaywrightClient(browser, context, cookieString);
};
exports.createPlaywrightClient = createPlaywrightClient;
//# sourceMappingURL=playwright.client.js.map