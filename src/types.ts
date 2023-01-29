import { PageScreenshotOptions } from "playwright";

export interface Experience {
  title: string;
  company: string;
  date: string;
  location: string | null;
  description: string | null;
}

export interface Profile {
  name: string;
  headline: string;
  about: string;
  experience: Experience[];
  getScreenshot: (options?: PageScreenshotOptions) => Promise<Buffer>;
}

export interface JobExperience {
  experience: Experience[];
  getScreenshot: (options?: PageScreenshotOptions) => Promise<Buffer>;
}
