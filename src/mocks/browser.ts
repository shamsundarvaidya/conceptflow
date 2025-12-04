// src/mocks/handlers.ts
import { authHandlers } from "./authHandlers";
import { projectHandlers } from "./projectHandlers";

export const handlers = [
  ...authHandlers,
  ...projectHandlers,
];
