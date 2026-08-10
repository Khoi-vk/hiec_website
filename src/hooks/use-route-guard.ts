import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { isAdmin, isAuthenticated, type SessionUser } from "@/lib/session";
import { useAuth } from "@/store/auth-store";

type AuthGuardOptions = {
  /** Redirect unauthenticated users to this route. Default: `/login` */
  loginRedirect?: string;
  /** Redirect authenticated admins away from user-only routes. Default: `/admin/dashboard` */
  adminRedirect?: string;
  /** Redirect non-admin users away from admin routes. Default: `/dashboard` */
  userRedirect?: string;
};

type AuthGuardResult = {
  user: SessionUser | null;
  hydrated: boolean;
  /** True once hydration is done and the user passes the guard. */
  allowed: boolean;
};

/** Require any authenticated user (profile, etc.) — admins included. */
export function useAuthenticatedRouteGuard(options: AuthGuardOptions = {}): AuthGuardResult {
  const { loginRedirect = "/login" } = options;
  const { user, hydrated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated(user)) {
      navigate({ to: loginRedirect });
    }
  }, [hydrated, user, navigate, loginRedirect]);

  const allowed = hydrated && isAuthenticated(user);
  return { user, hydrated, allowed };
}

/** Require any authenticated user (member dashboard). Admins are redirected to admin CMS. */
export function useAuthRouteGuard(options: AuthGuardOptions = {}): AuthGuardResult {
  const { loginRedirect = "/login", adminRedirect = "/admin/dashboard" } = options;
  const { user, hydrated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated(user)) {
      navigate({ to: loginRedirect });
      return;
    }
    if (isAdmin(user)) {
      navigate({ to: adminRedirect });
    }
  }, [hydrated, user, navigate, loginRedirect, adminRedirect]);

  const allowed = hydrated && isAuthenticated(user) && !isAdmin(user);
  return { user, hydrated, allowed };
}

/** Require admin role (admin CMS routes). */
export function useAdminRouteGuard(options: AuthGuardOptions = {}): AuthGuardResult {
  const { loginRedirect = "/login", userRedirect = "/dashboard" } = options;
  const { user, hydrated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated(user)) {
      navigate({ to: loginRedirect });
      return;
    }
    if (!isAdmin(user)) {
      navigate({ to: userRedirect });
    }
  }, [hydrated, user, navigate, loginRedirect, userRedirect]);

  const allowed = hydrated && isAdmin(user);
  return { user, hydrated, allowed };
}
