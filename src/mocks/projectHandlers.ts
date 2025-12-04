// src/mocks/projectHandlers.ts
import { http, HttpResponse } from "msw";
import { requireAuth } from "./authUtils";
import {
  listProjects,
  listRecentProjects,
  findProject,
  touchProjectLastOpened,
  createProject,
  updateProject,
  deleteProject,
  type Project,
} from "./projectsDb";

type CreateProjectBody = {
  name: string;
  description?: string;
};

type UpdateProjectBody = {
  name?: string;
  description?: string;
};

export const projectHandlers = [
  // List all projects
  http.get("/api/projects", ({ cookies }) => {
    const unauthorized = requireAuth(cookies);
    if (unauthorized) return unauthorized;

    return HttpResponse.json(listProjects(), { status: 200 });
  }),

  // Recent projects
  http.get("/api/projects/recent", ({ cookies }) => {
    const unauthorized = requireAuth(cookies);
    if (unauthorized) return unauthorized;

    return HttpResponse.json(listRecentProjects(5), { status: 200 });
  }),

  // Get project by id
  http.get<{ id: string }>(
    "/api/projects/:id",
    ({ params, cookies }) => {
      const unauthorized = requireAuth(cookies);
      if (unauthorized) return unauthorized;

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
    if (unauthorized) return unauthorized;

    const { name, description } = (await request.json()) as CreateProjectBody;

    if (!name?.trim()) {
      return HttpResponse.json(
        { message: "Project name is required" },
        { status: 400 }
      );
    }

    const project = createProject({ name, description });
    return HttpResponse.json(project, { status: 201 });
  }),

  // Update project
  http.put<{ id: string }>("/api/projects/:id", async ({ params, request, cookies }) => {
    const unauthorized = requireAuth(cookies);
    if (unauthorized) return unauthorized;

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
      const unauthorized = requireAuth(cookies);
      if (unauthorized) return unauthorized;

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
