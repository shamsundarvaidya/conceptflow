// src/mocks/projectHandlers.ts
import { http, HttpResponse } from "msw";
import { requireAuth } from "./authUtils";
import type {
  CreateProjectBody,
  UpdateProjectBody,
} from "./types";
import {
  listProjects,
  listRecentProjects,
  touchProjectLastOpened,
  createProject,
  updateProject,
  deleteProject,
} from "./projectsDb";

const unauthorizedResponse = HttpResponse.json(
  { message: "Unauthorized" },
  { status: 401 }
);

export const projectHandlers = [
  // List all projects
  http.get("/api/projects", ({ cookies }) => {
    console.log("Mock: Fetching all projects");
    const unauthorized = requireAuth(cookies);
    if (unauthorized) return unauthorized;

    return HttpResponse.json(listProjects(), { status: 200 });
  }),

  // Recent projects
  http.get("/api/projects/recent", ({ cookies }) => {
    console.log("Mock: Fetching recent projects");
    const unauthorized = requireAuth(cookies);
    if (unauthorized) return unauthorizedResponse;

    return HttpResponse.json(listRecentProjects(5), { status: 200 });
  }),

  // Get project by id
  http.get<{ id: string }>(
    "/api/projects/:id",
    ({ params, cookies }) => {
      console.log("Mock: Fetching project", params.id);
      const unauthorized = requireAuth(cookies);
      if (unauthorized) return unauthorizedResponse;

      const id = Number(params.id);
      const project = touchProjectLastOpened(id);

      if (!project) {
        return HttpResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }

      return HttpResponse.json(project, { status: 200 });
    }
  ),


  // Create project
  http.post("/api/projects", async ({ request, cookies }) => {
    const unauthorized = requireAuth(cookies);
    if (unauthorized) return unauthorizedResponse;

    const { name, description, projectType, storageType, visibility, color } = (await request.json()) as CreateProjectBody;
    console.log("Mock: Creating project", { name, projectType, storageType });

    if (!name?.trim()) {
      return HttpResponse.json(
        { message: "Project name is required" },
        { status: 400 }
      );
    }

    const project = createProject({ name, description, projectType, storageType, visibility, color });
    return HttpResponse.json(project, { status: 201 });
  }),

  // Update project
  http.put<{ id: string }>("/api/projects/:id", async ({ params, request, cookies }) => {
    console.log("Mock: Updating project", params.id);
    const unauthorized = requireAuth(cookies);
    if (unauthorized) return unauthorizedResponse;

    const id = Number(params.id);
    const body = (await request.json()) as UpdateProjectBody;
    const project = updateProject(id, body);

    if (!project) {
      return HttpResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(project, { status: 200 });
  }),

  // Delete project
  http.delete<{ id: string }>(
    "/api/projects/:id",
    ({ params, cookies }) => {
      console.log("Mock: Deleting project", params.id);
      const unauthorized = requireAuth(cookies);
      if (unauthorized) return unauthorizedResponse;

      const id = Number(params.id);
      const removed = deleteProject(id);

      if (!removed) {
        return HttpResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }

      return HttpResponse.json(
        { message: "Project deleted" },
        { status: 200 }
      );
    }
  ),
];
