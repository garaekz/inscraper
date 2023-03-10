import { PageScreenshotOptions } from "playwright";

export interface Experience {
  title: string;
  company: string;
  location?: string;
  tenure?: string;
  description?: string;
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface Profile {
  name: string;
  headline: string;
  location: string | null;
  profileUrl: string;
  profilePicture: string | null;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export type GetProfileOptions = 'full' | 'experience' | 'education' | 'skills' | undefined;