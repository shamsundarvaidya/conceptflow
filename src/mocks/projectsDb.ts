// src/mocks/projectsDb.ts
/**
 * Projects Database Simulation
 * 
 * This file acts as a simple in-memory database for projects. It provides helper functions to:
 * - listProjects: Retrieve all projects sorted by update time.
 * - listRecentProjects: Retrieve recently opened projects.
 * - findProject: Get a specific project by ID.
 * - createProject: Create a new project with a unique ID and timestamps.
 * - updateProject: Update an existing project's details.
 * - deleteProject: Remove a project from the simulated database.
 * - touchProjectLastOpened: Update the 'lastOpenedAt' timestamp for a project.
 */
import type { Project } from "./types";

let nextProjectId = 3;

let projects: Project[] = [
  {
    id: 1,
    name: "ConceptFlow Demo",
    description: "Example mind-map project",
    createdAt: new Date("2025-12-01T09:00:00Z").toISOString(),
    updatedAt: new Date("2025-12-01T10:00:00Z").toISOString(),
    lastOpenedAt: new Date("2025-12-02T07:30:00Z").toISOString(),
  },
  {
    id: 2,
    name: "Brainstorm - New Features",
    description: "Rough ideas for next release",
    createdAt: new Date("2025-12-02T08:00:00Z").toISOString(),
    updatedAt: new Date("2025-12-02T09:15:00Z").toISOString(),
    lastOpenedAt: new Date("2025-12-03T05:45:00Z").toISOString(),
  },
];

export function listProjects(): Project[] {
  return [...projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function listRecentProjects(limit = 5): Project[] {
  return [...projects]
    .sort(
      (a, b) => (b.lastOpenedAt ?? "").localeCompare(a.lastOpenedAt ?? "")
    )
    .slice(0, limit);
}

export function findProject(id: number): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function touchProjectLastOpened(id: number): Project | undefined {
  const project = findProject(id);
  if (!project) return undefined;

  project.lastOpenedAt = new Date().toISOString();
  return project;
}

export function createProject(data: {
  name: string;
  description?: string;
}): Project {
  const now = new Date().toISOString();

  const newProject: Project = {
    id: nextProjectId++,
    name: data.name.trim(),
    description: data.description,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
  };

  projects.push(newProject);
  return newProject;
}

export function updateProject(
  id: number,
  data: { name?: string; description?: string }
): Project | undefined {
  const project = findProject(id);
  if (!project) return undefined;

  if (data.name !== undefined) {
    project.name = data.name.trim();
  }
  if (data.description !== undefined) {
    project.description = data.description;
  }
  project.updatedAt = new Date().toISOString();

  return project;
}

export function deleteProject(id: number): boolean {
  const before = projects.length;
  projects = projects.filter((p) => p.id !== id);
  return projects.length < before;
}
