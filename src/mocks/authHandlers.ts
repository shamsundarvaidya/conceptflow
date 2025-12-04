// src/mocks/authHandlers.ts
import { http, HttpResponse } from "msw";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginSuccessResponse {
  id: number;
  name: string;
  email: string;
}

interface LoginErrorResponse {
  message: string;
}

const MOCK_TOKEN = "mock-jwt-token-123";

export const authHandlers = [
  http.post<never, LoginRequest, LoginSuccessResponse | LoginErrorResponse>(
    "/api/login",
    async ({ request }) => {
      const { email, password } = await request.json();

      const isValidUser =
        email === "user@example.com" && password === "password123";

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
