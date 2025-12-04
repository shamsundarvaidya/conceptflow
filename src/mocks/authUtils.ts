// src/mocks/authUtils.ts
import { HttpResponse } from "msw";

export function isAuthenticated(cookies: Record<string, string>): boolean {
  // You can also check the value here if you want
  // return cookies.token === "mock-jwt-token-123";
  return Boolean(cookies.token);
}

export function requireAuth(cookies: Record<string, string>) {
  if (!isAuthenticated(cookies)) {
    return HttpResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  return null;
}
