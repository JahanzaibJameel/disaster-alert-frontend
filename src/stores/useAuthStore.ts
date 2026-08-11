import { create } from "zustand";

interface AuthState {
    user: { name: string; email: string; role: "citizen" | "volunteer" } | null;
    isAuthenticated: boolean;
    login: (email: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: (email) =>
        set({
            user: { name: email.split("@")[0], email, role: "citizen" },
            isAuthenticated: true,
        }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));