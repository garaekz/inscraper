import { Browser, BrowserContext } from "playwright";
export declare class PlaywrightClient {
    #private;
    context: BrowserContext;
    slug: string | null;
    constructor(browser: Browser, context: BrowserContext, cookie: string);
}
export declare const createPlaywrightClient: (cookieString: string) => Promise<PlaywrightClient>;
