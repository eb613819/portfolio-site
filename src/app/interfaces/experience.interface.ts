export type ExperienceType = 'job' | 'research' | 'teaching' | 'education';

export interface Experience {
    role: string;
    organization: string;
    startDate: string;
    endDate: string;
    description: string;
    tags?: string[];
    type:ExperienceType;
}
