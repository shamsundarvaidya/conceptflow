import { setupWorker } from "msw/browser";
import { authHandlers } from "./authHandlers";
import { projectHandlers } from "./projectHandlers";

export const handlers = [
  ...authHandlers,
  ...projectHandlers,
];

export const worker = setupWorker(...handlers);
