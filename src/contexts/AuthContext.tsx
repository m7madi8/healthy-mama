import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from "firebase/auth";
import { getAuthErrorMessage, shouldUseRedirectSignIn } from "../lib/authErrors";
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
    let active = true;

    async function finishRedirectSignIn() {
      try {
        await getRedirectResult(auth);
      } catch (error) {
        console.warn("Google redirect sign-in failed:", getAuthErrorMessage(error), error);
      }
    }

    void finishRedirectSignIn();

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!active) return;
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        await ensureUserProfile(nextUser);
        const nextProfile = await getUserProfile(nextUser.uid);
        if (active) setProfile(nextProfile);
      } catch (error) {
        console.warn("User profile sync failed. Check Firestore rules deployment.", error);
        if (active) {
          setProfile({
            name: nextUser.displayName ?? "",
            email: nextUser.email ?? "",
            photoURL: nextUser.photoURL ?? "",
          });
        }
      }
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      unsubscribe();
    };
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
        try {
          await signInWithPopup(auth, googleProvider);
        } catch (error) {
          if (shouldUseRedirectSignIn(error)) {
            await signInWithRedirect(auth, googleProvider);
            return;
          }
          throw new Error(getAuthErrorMessage(error));
        }
      },
      logout: async () => {
        await signOut(auth);
      },
    }),
    [loading, profile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
