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

export interface Project {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    lastOpenedAt?: string;
}

export type CreateProjectBody = {
    name: string;
    description?: string;
};

export type UpdateProjectBody = {
    name?: string;
    description?: string;
};

export const MOCK_TOKEN = "mock-jwt-token-123";
