import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  loginRequest,
  refreshRequest,
  type LoginCredentials,
  type TokenLogin,
} from "@/services/auth.service";
import { ApiRequestError } from "@/lib/api";

/* ------------------------------------------------------------------ */
/*  Token helpers – tokens live ONLY in memory (not localStorage)      */
/* ------------------------------------------------------------------ */

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

/** Decode the JWT payload (without verification – that's the server's job). */
function decodePayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/** Returns `true` when the token expires in less than `bufferMs` milliseconds. */
function isTokenExpiringSoon(token: string, bufferMs = 60_000): boolean {
  const payload = decodePayload(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return payload.exp * 1000 - Date.now() < bufferMs;
}

/* ------------------------------------------------------------------ */
/*  Context value                                                      */
/* ------------------------------------------------------------------ */

interface AuthContextValue {
  /** `true` while we are checking for an existing session on mount */
  isLoading: boolean;
  /** `true` when a valid access token exists in memory */
  isAuthenticated: boolean;
  /** Current access token (for attaching to API requests) */
  accessToken: string | null;
  /** Login with email + password */
  login: (credentials: LoginCredentials) => Promise<void>;
  /** Clear tokens and redirect to /login */
  logout: () => void;
  /** Get a valid access token, refreshing if needed */
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ref to avoid stale closures in the refresh logic
  const tokensRef = useRef(tokens);
  tokensRef.current = tokens;

  // Mutex for refresh so we don't fire multiple simultaneous refreshes
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  /* ---- login ---- */
  const login = useCallback(async (credentials: LoginCredentials) => {
    const data: TokenLogin = await loginRequest(credentials);
    setTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });
  }, []);

  /* ---- logout ---- */
  const logout = useCallback(() => {
    setTokens(null);
    refreshPromiseRef.current = null;
  }, []);

  /* ---- silent refresh ---- */
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    const current = tokensRef.current;
    if (!current?.refreshToken) return null;

    // If the refresh token itself is expired, force logout
    if (isTokenExpiringSoon(current.refreshToken, 0)) {
      logout();
      return null;
    }

    try {
      const data = await refreshRequest(current.refreshToken);
      const newTokens: Tokens = {
        accessToken: data.access_token,
        refreshToken: current.refreshToken, // keep the same refresh token
      };
      setTokens(newTokens);
      tokensRef.current = newTokens;
      return data.access_token;
    } catch (err) {
      // If refresh fails with 401, force logout
      if (err instanceof ApiRequestError && err.status === 401) {
        logout();
      }
      return null;
    }
  }, [logout]);

  /* ---- getAccessToken (used by API layer) ---- */
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const current = tokensRef.current;
    if (!current) return null;

    // If access token is still fresh, return it directly
    if (!isTokenExpiringSoon(current.accessToken)) {
      return current.accessToken;
    }

    // De-duplicate concurrent refresh calls
    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = refreshAccessToken().finally(() => {
        refreshPromiseRef.current = null;
      });
    }
    return refreshPromiseRef.current;
  }, [refreshAccessToken]);

  /* ---- proactive refresh before expiry ---- */
  useEffect(() => {
    if (!tokens?.accessToken) return;

    const payload = decodePayload(tokens.accessToken);
    if (!payload || typeof payload.exp !== "number") return;

    const expiresIn = payload.exp * 1000 - Date.now();
    // Refresh 60 s before expiry
    const refreshIn = Math.max(expiresIn - 60_000, 0);

    const timer = setTimeout(() => {
      getAccessToken(); // triggers refresh
    }, refreshIn);

    return () => clearTimeout(timer);
  }, [tokens?.accessToken, getAccessToken]);

  /* ---- context value ---- */
  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isAuthenticated: !!tokens?.accessToken,
      accessToken: tokens?.accessToken ?? null,
      login,
      logout,
      getAccessToken,
    }),
    [isLoading, tokens, login, logout, getAccessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
