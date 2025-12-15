export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginSuccessResponse {
    id: number;
    name: string;
    email: string;
}

export interface LoginErrorResponse {
    message: string;
}

export type ProjectType = 'mindmap' | 'canvas' | 'kanban' | 'flowchart' | 'whiteboard';

export type StorageType = 'local' | 'cloud';

export type ProjectVisibility = 'private' | 'public';

export interface Project {
    id: number;
    name: string;
    description?: string;
    projectType: ProjectType;
    storageType: StorageType;
    visibility: ProjectVisibility;
    color?: string;
    createdAt: string;
    updatedAt: string;
    lastOpenedAt?: string;
}

export type CreateProjectBody = {
    name: string;
    description?: string;
    projectType: ProjectType;
    storageType: StorageType;
    visibility: ProjectVisibility;
    color?: string;
};

export type UpdateProjectBody = {
    name?: string;
    description?: string;
    projectType?: ProjectType;
    storageType?: StorageType;
    visibility?: ProjectVisibility;
    color?: string;
};

export const MOCK_TOKEN = "mock-jwt-token-123";
