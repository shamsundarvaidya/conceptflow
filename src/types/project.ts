export type ProjectId = string;

export interface Project {
  id: ProjectId;
  name: string;
  description?: string;
  createdAt: string;  // ISO date
  updatedAt: string;  // ISO date
  thumbnailUrl?: string; // optional later for preview
  isPinned?: boolean;
}
