import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth, firebaseConfigError, googleProvider, isFirebaseConfigured } from "../lib/firebase";
import { ensureUserProfile, getUserProfile, type UserProfile } from "../lib/firestore";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        await ensureUserProfile(nextUser);
        const nextProfile = await getUserProfile(nextUser.uid);
        setProfile(nextProfile);
      } catch (error) {
        // Keep auth session usable even if Firestore rules are not published yet.
        console.warn("User profile sync failed. Check Firestore rules deployment.", error);
        setProfile({
          name: nextUser.displayName ?? "",
          email: nextUser.email ?? "",
          photoURL: nextUser.photoURL ?? "",
        });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      signInWithGoogle: async () => {
        if (!isFirebaseConfigured) {
          throw new Error(firebaseConfigError ?? "Firebase config is incomplete.");
        }
        await signInWithPopup(auth, googleProvider);
      },
      logout: async () => {
        await signOut(auth);
      },
    }),
    [loading, profile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
