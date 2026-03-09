export type ProjectType =
    | '3D Printing / CAD'
    | 'Electronics / Embedded'
    | 'Software / Web'
    | 'Networking / Infrastructure'
    | 'Home Lab'
    | 'DevOps / Cloud';

export type ProjectStatus =
    | 'Completed'
    | 'In Progress'
    | 'Not Started'

export interface Project {
  title: string;
  types: ProjectType[];
  status: ProjectStatus;
  completionDate?: string;
  description: string;
  tags?: string[];
  images?: string[];
  
  detailsPage?: string;
  github?: string;
  printables?: string;
  dockerhub?: string;
  website?: string; // generic website
}
