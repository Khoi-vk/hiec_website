export type SessionUser = {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  provider: "password" | "google";
};

type StoredSession = { user: SessionUser; expiresAt: number };

export const SESSION_STORAGE_KEY = "hiec.session";
/** Session kéo dài tối đa 30 ngày (Docs-BA-3). */
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function readSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.user || parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return parsed.user;
  } catch {
    return null;
  }
}

export function persistSession(user: SessionUser) {
  const payload: StoredSession = { user, expiresAt: Date.now() + SESSION_TTL_MS };
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function isAdmin(user: SessionUser | null | undefined): user is SessionUser {
  return user?.role === "admin";
}

export function isAuthenticated(user: SessionUser | null | undefined): user is SessionUser {
  return user != null;
}
