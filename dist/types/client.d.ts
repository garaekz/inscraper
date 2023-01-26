import { Browser, BrowserContext } from "playwright";
import { Profile } from "./types";
export declare class Client {
    private browser;
    private context;
    constructor(browser: Browser, context: BrowserContext);
    close(): Promise<void>;
    getContext(): BrowserContext;
    getBrowser(): Browser;
    getProfile(profileSlug: string): Promise<Profile>;
    getExperience(profileSlug: string): Promise<string[]>;
}
export declare const createClient: (cookieString: string) => Promise<Client>;
