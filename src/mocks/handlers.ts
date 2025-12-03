import { http, HttpResponse } from "msw";

interface LoginRequest {
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  token: string;
}

interface LoginSuccessResponse {
  id: number;
  name: string;
  email: string;
  token: string;
}

interface LoginErrorResponse {
  message: string;
}

export const handlers = [
  // ---- LOGIN ----
  http.post<never, LoginRequest, LoginSuccessResponse | LoginErrorResponse>(
    "/login",
    async ({ request }) => {
      const body = await request.json();

      const { email, password } = body;
      console.log("Mock server received login:", { email, password });

      // ✅ Simple rule: success vs fail
      // You can change this logic however you like.
      const isValidUser =
        email === "test@mail.com" && password === "test123";

      if (!isValidUser) {
        // ❌ FAIL CASE
        return HttpResponse.json(
          {
            message: "Invalid email or password",
          },
          {
            status: 401,
          }
        );
      }

      // ✅ SUCCESS CASE
      return HttpResponse.json(
        {
          id: 1,
          name: "Mock User",
          email,
          token: "mock-token-123",
        },
        {
          status: 200,
        }
      );
    }
  ),

  // ---- PROJECTS ----
  http.get("/projects", () => {
    return HttpResponse.json([
      { id: 1, name: "Mind Map Project" },
      { id: 2, name: "ConceptFlow" }
    ]);
  }),

  // ---- Example: GET a single project ----
  http.get("/projects/:id", ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      name: "Project " + params.id
    });
  })
];
