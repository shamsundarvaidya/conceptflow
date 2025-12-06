// src/mocks/authHandlers.ts
/**
 * Authentication Handlers
 * 
 * This file contains MSW handlers for authentication-related endpoints:
 * - POST /api/login: Authenticates a user with email and password, setting a simulated HttpOnly cookie.
 * - POST /api/logout: Logs out the user by expiring the authentication cookie.
 */
import { http, HttpResponse } from "msw";

import type { LoginRequest, LoginSuccessResponse, LoginErrorResponse } from "./types";

import { MOCK_TOKEN } from "./types";


export const authHandlers = [
  http.post<never, LoginRequest, LoginSuccessResponse | LoginErrorResponse>(
    "/api/login",
    async ({ request }) => {
      const { email, password } = await request.json();

      const isValidUser =
        email === "test@mail.com" && password === "test123";

      if (!isValidUser) {
        return HttpResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        );
      }

      return HttpResponse.json(
        {
          id: 1,
          name: "Mock User",
          email,
        },
        {
          status: 200,
          headers: {
            "Set-Cookie": `token=${MOCK_TOKEN}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
          },
        }
      );
    }
  ),

  // Optional: logout mock
  http.post("/api/logout", () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        // Expire the cookie
        "Set-Cookie":
          "token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
      },
    });
  }),
];
