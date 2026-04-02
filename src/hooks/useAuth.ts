import { useEffect } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "../services/authService";
import { useAuthStore } from "../store/authStore";

export interface UseAuthReturn {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
}

/**
 * Subscribes to Firebase auth state and syncs it with the Zustand auth store.
 * Automatically unsubscribes on component unmount.
 */
export function useAuth(): UseAuthReturn {
  const { user, setUser, loading, setLoading, error } = useAuthStore();

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [setUser, setLoading]);

  return { user, loading, error };
}
