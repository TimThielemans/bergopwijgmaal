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
import { adminLogin, adminLogout, getAdminSession } from "./auth.functions";

/**
 * Admin auth: email + password checked on the server against the `ADMIN_USERS`
 * secret; the session is an encrypted httpOnly cookie. Every admin server
 * function re-checks the session itself (see `session.server.ts`).
 */

export interface AdminSession {
  email: string;
  provider: string;
  createdAt: string;
}

interface AdminAuthValue {
  ready: boolean;
  session: AdminSession | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    getAdminSession()
      .then((s) => {
        if (alive) setSession(s ? { ...s, provider: "password" } : null);
      })
      .catch(() => alive && setSession(null))
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await adminLogin({ data: { email, password } });
    if (!result.ok) return false;
    setSession({ ...result.session, provider: "password" });
    return true;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await adminLogout();
    } finally {
      setSession(null);
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
  if (!value) throw new Error("useAdminAuth moet binnen <AdminAuthProvider> gebruikt worden.");
  return value;
}

export { adminConfig };
