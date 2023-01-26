"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = exports.Client = void 0;
const playwright_1 = require("playwright");
const cheerio = __importStar(require("cheerio"));
class Client {
    browser;
    context;
    constructor(browser, context) {
        this.browser = browser;
        this.context = context;
    }
    async close() {
        await this.browser?.close();
    }
    getContext() {
        return this.context;
    }
    getBrowser() {
        return this.browser;
    }
    async getProfile(profileSlug) {
        const page = await this.context.newPage();
        await page.goto(`https://www.linkedin.com/in/${profileSlug}`, {
            waitUntil: "load",
        });
        const html = await page.content();
        if (html.includes("auth_wall_desktop_profile")) {
            throw new Error("Cookies error");
        }
        await page.close();
        const $ = cheerio.load(html);
        return {
            name: $("main section:nth-child(1) h1").text(),
            headline: $("main section:nth-child(1) .text-body-medium.break-words")
                .text()
                .trim(),
            about: $("section > #about ~ div.display-flex.ph5.pv3 span[aria-hidden=true]").text(),
            experience: $("section > #experience ~ .pvs-list__outer-container ul ul ul li span[aria-hidden=true]")
                .toArray()
                .map((item) => $(item).text()),
        };
    }
    async getExperience(profileSlug) {
        const page = await this.context.newPage();
        await page.goto(`https://www.linkedin.com/in/${profileSlug}/details/experience/`, { waitUntil: "domcontentloaded" });
        const html = await page.content();
        if (html.includes("auth_wall_desktop_profile")) {
            throw new Error("Cookies error");
        }
        await page.close();
        const $ = cheerio.load(html);
        return $("section > #experience ~ .pvs-list__outer-container ul ul ul li span[aria-hidden=true]")
            .toArray()
            .map((item) => $(item).text());
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