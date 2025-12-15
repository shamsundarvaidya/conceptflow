const API_BASE_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:5000";

import type { User } from "../types/User";

type loginResponseState = {
    success: boolean;
    message: string;
    error?: string;
    user?: User;
}

export const user_login = async (email: string, password: string): Promise<loginResponseState> => {

    try {

        const res = await fetch(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include", // Important for cookie-based auth
        });

        if (!res.ok) {
            return {
                success: false,
                message: "Login failed",
                error: "Login failed",
            };
        }

        const data = (await res.json()) as User;
        console.log(data)
        return {
            success: true,
            message: "Login successful",
            user: data
        };
    } catch (error) {
        return {
            success: false,
            message: "Login failed",
            error: error instanceof Error ? error.message : "Login failed",
        };

    }





}