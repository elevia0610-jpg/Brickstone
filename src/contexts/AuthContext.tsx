import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, getStoredToken, setStoredToken } from "@/lib/api";

type AdminUser = { id: string; username: string };

type AuthContextValue = {
  token: string | null;
  admin: AdminUser | null;
  isReady: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function parsePayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = parsePayload(token);

  if (!payload || typeof payload.exp !== "number") {
    return true;
  }

  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
}

function parseAdminFromToken(token: string): AdminUser | null {
  const payload = parsePayload(token);
  if (
    payload &&
    typeof payload.sub === "string" &&
    typeof payload.username === "string"
  ) {
    return { id: payload.sub, username: payload.username };
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const t = getStoredToken();

    if (t && !isTokenExpired(t)) {
      setToken(t);
    } else {
      setStoredToken(null);
      setToken(null);
    }

    setIsReady(true);
  }, []);

  const admin = useMemo(() => (token ? parseAdminFromToken(token) : null), [token]);

  const login = useCallback(async (username: string, password: string) => {
    const { data } = await api.post<{ token: string; admin: AdminUser }>(
      "/api/auth/login",
      { username, password }
    );

    if (isTokenExpired(data.token)) {
      throw new Error("Received expired token");
    }

    setStoredToken(data.token);
    setToken(data.token);
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      admin,
      isReady,
      login,
      logout,
    }),
    [token, admin, isReady, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
