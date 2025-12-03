import { create } from "zustand";

export type User = {
  id: string;
  name: string;
  email: string;
  token: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};

// Optional: central API base URL for your mock server
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5173";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  async login({ email, password }) {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Handle non-2xx status
      if (!res.ok) {
        let message = "Login failed";
        try {
          const data = await res.json();
          if (data?.message && typeof data.message === "string") {
            message = data.message;
          }
          
        } catch {
          // ignore JSON parsing error
        }
        throw new Error(message);
      }

      // Expect your mock server to return a User-like object
      console.log("Login response status:", res.status);
      const data = (await res.json()) as User;

      set({
        user: data,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed";

      set({
        loading: false,
        isAuthenticated: false,
        error: message,
      });

      // Re-throw so UI can show toasts, etc.
      throw err;
    }
  },

  logout() {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },
}));
