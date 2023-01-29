/// <reference types="node" />
import { Page, PageScreenshotOptions } from "playwright";
import { Client } from "../client";
export declare abstract class Scraper {
    protected client: Client;
    protected slug: string | null;
    protected page: Page | null;
    constructor(client: Client);
    abstract createUrlBySlug(slug: string): string;
    newPage(url?: string): Promise<Page>;
    protected updateSlug(slug: string): void;
    getScreenshot(options?: PageScreenshotOptions): Promise<Buffer>;
}
