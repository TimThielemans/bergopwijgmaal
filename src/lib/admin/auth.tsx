import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { adminConfig } from "@/lib/config";

/**
 * Isolated admin auth seam — PLACEHOLDER ONLY.
 *
 * This is NOT a security boundary: there is no backend, no credential check and
 * no protected data. It exists so a real provider (Sanity login, OAuth, ...) can
 * be dropped in later without touching routes or components.
 *
 * To make it real, replace `signIn`/`signOut`/session restore below with calls to
 * the provider named by `VITE_ADMIN_PROVIDER`. The rest of the app only ever uses
 * `useAdminAuth()`.
 */

const STORAGE_KEY = "bow.admin.session";

export interface AdminSession {
  email: string;
  provider: string;
  createdAt: string;
}

interface AdminAuthValue {
  /** False until the browser session has been restored (avoids SSR mismatches). */
  ready: boolean;
  session: AdminSession | null;
  isAuthenticated: boolean;
  signIn: (email: string) => Promise<AdminSession>;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

function readStoredSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AdminSession>;
    if (!parsed || typeof parsed.email !== "string") return null;
    return {
      email: parsed.email,
      provider: typeof parsed.provider === "string" ? parsed.provider : "placeholder",
      createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(readStoredSession());
    setReady(true);
  }, []);

  const signIn = useCallback(async (email: string) => {
    // TODO(sanity): exchange credentials with the real provider here.
    const next: AdminSession = {
      email: email.trim() || "beheerder@bergopwijgmaal.be",
      provider: adminConfig.provider || "placeholder",
      createdAt: new Date().toISOString(),
    };
    setSession(next);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — session stays in memory */
    }
    return next;
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AdminAuthValue>(
    () => ({ ready, session, isAuthenticated: session !== null, signIn, signOut }),
    [ready, session, signIn, signOut],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthValue {
  const value = useContext(AdminAuthContext);
  if (!value) {
    throw new Error("useAdminAuth moet binnen <AdminAuthProvider> gebruikt worden.");
  }
  return value;
}

export { adminConfig };
