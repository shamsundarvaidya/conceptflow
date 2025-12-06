import { create } from "zustand";
import type { User } from "../types/User";
import { user_login } from "../utils/authFunctions";


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



export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  async login({ email, password }) {
    set({ loading: true, error: null });

    try {
      const res = await user_login(email, password);
      if (res.success) {
        set({
          user: res.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } else {
        throw new Error(res.error);
      }
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
