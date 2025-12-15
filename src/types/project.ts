export type ProjectId = string | number;

export type ProjectType = 'mindmap' | 'canvas' | 'kanban' | 'flowchart' | 'whiteboard';

export type StorageType = 'local' | 'cloud';

export type ProjectVisibility = 'private' | 'public';

export interface Project {
  id: ProjectId;
  name: string;
  description?: string;
  projectType: ProjectType;
  storageType: StorageType;
  visibility: ProjectVisibility;
  color?: string;
  createdAt: string;  // ISO date
  updatedAt: string;  // ISO date
  thumbnailUrl?: string; // optional later for preview
  isPinned?: boolean;
  lastOpenedAt?: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  projectType: ProjectType;
  storageType: StorageType;
  visibility: ProjectVisibility;
  color?: string;
}

