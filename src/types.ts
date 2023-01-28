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
}
