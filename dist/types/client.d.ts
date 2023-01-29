import { Browser, BrowserContext } from "playwright";
import { JobExperience, Profile } from "./types";
export declare class Client {
    #private;
    context: BrowserContext;
    slug: string | null;
    constructor(browser: Browser, context: BrowserContext);
    close(): Promise<void>;
    getProfile(slug?: string): Promise<Profile>;
    getExperience(slug?: string): Promise<JobExperience>;
}
export declare const createClient: (cookieString: string) => Promise<Client>;
