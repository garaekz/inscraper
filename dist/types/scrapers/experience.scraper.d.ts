import { JobExperience } from './../types';
import { Client } from "../client";
import { Experience } from "../types";
import { Scraper } from "./scraper";
export declare class ExperienceScraper extends Scraper {
    #private;
    constructor(client: Client);
    private get url();
    createUrlBySlug(slug: string): string;
    scrapeAlone(): Promise<JobExperience>;
    scrape(): Promise<Experience[]>;
}
