import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";

// ─── State shape ──────────────────────────────────────────────────────────────

interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
}

// ─── Actions shape ────────────────────────────────────────────────────────────

interface AuthActions {
  setUser: (user: FirebaseUser | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user, error: null }),

  clearUser: () => set({ user: null, error: null }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
