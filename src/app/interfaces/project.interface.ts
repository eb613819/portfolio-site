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

export interface ProjectChallenge {
  problem: string;
  solution: string;
}

export interface Project {
  title: string;
  types: ProjectType[];
  status: ProjectStatus;
  completionDate?: string;
  
  //description fields
  overview: string;
  motivation?: string;
  plan?: string;
  architecture?: string;
  hardware?: string[];
  design?: string;
  features?: string[];
  challenges?: ProjectChallenge[];
  learned?: string;

  tags?: string[];
  images?: string[];
  
  detailsPage?: string;
  github?: string;
  printables?: string;
  dockerhub?: string;
  website?: string; // generic website
}
