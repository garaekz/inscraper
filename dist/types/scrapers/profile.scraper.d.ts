import { Client } from "../client";
import { Profile } from "../types";
import { Scraper } from "./scraper";
export declare class ProfileScraper extends Scraper {
    #private;
    constructor(client: Client);
    private get url();
    createUrlBySlug(slug: string): string;
    scrape(): Promise<Profile>;
}
