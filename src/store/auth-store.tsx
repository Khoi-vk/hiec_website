import * as React from "react";

export type SessionUser = {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  provider: "password" | "google";
};

type StoredSession = { user: SessionUser; expiresAt: number };

type AuthContextValue = {
  user: SessionUser | null;
  hydrated: boolean;
  signIn: (identifier: string, opts?: { provider?: SessionUser["provider"] }) => SessionUser;
  signUp: (fullName: string, email: string) => SessionUser;
  signOut: () => void;
};

const STORAGE_KEY = "hiec.session";
/** Session kéo dài tối đa 30 ngày (Docs-BA-3). */
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const AuthContext = React.createContext<AuthContextValue | null>(null);

function readSession(): SessionUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.user || parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.user;
  } catch {
    return null;
  }
}

function persist(user: SessionUser) {
  const payload: StoredSession = { user, expiresAt: Date.now() + SESSION_TTL_MS };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setUser(readSession());
    setHydrated(true);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      hydrated,
      signIn: (identifier, opts) => {
        const email = identifier.includes("@") ? identifier : `${identifier}@hiec.vn`;
        const next: SessionUser = {
          id: "u-demo",
          fullName: (email.split("@")[0] ?? "").replace(/[._-]/g, " ") || "Thành viên HIEC",
          email,
          role: email.startsWith("admin") ? "admin" : "user",
          provider: opts?.provider ?? "password",
        };
        persist(next);
        setUser(next);
        return next;
      },
      signUp: (fullName, email) => {
        const next: SessionUser = {
          id: "u-new",
          fullName,
          email,
          role: "user",
          provider: "password",
        };
        persist(next);
        setUser(next);
        return next;
      },
      signOut: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      },
    }),
    [user, hydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
