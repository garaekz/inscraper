export interface Experience {
    title?: string;
    company: string;
    location?: string;
    tenure?: string;
    positions?: {
        title: string;
        tenure: string;
        description: string;
    }[];
    description?: string;
}
export interface Education {
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    description: string | null;
}
export interface Profile {
    name: string;
    headline: string;
    location: string | null;
    profileUrl: string;
    profilePicture: string;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
}
export type GetProfileOptions = 'full' | 'experience' | 'education' | 'skills' | undefined;
