// src/mocks/authUtils.ts
import { HttpResponse } from "msw";

export function isAuthenticated(cookies: Record<string, string>): boolean {

  return cookies.token === "mock-jwt-token-123";

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
