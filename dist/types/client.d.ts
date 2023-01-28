/// <reference types="node" />
import { Browser, BrowserContext } from "playwright";
import { Profile } from "./types";
export declare class Client {
    private browser;
    private context;
    private page;
    private slug;
    constructor(browser: Browser, context: BrowserContext);
    close(): Promise<void>;
    getContext(): BrowserContext;
    getBrowser(): Browser;
    setPage(url?: string): Promise<void>;
    getProfile(profileSlug?: string): Promise<Profile>;
    getScreenshot(profileSlug?: string): Promise<Buffer>;
    private getExperience;
}
export declare const createClient: (cookieString: string) => Promise<Client>;
