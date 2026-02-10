import { apiFetch } from "@/lib/api";

/* ------------------------------------------------------------------ */
/*  Types matching the backend schemas                                 */
/* ------------------------------------------------------------------ */

export interface TokenLogin {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface TokenRefresh {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  username?: string;
}

export interface UserResponse {
  full_name: string;
  email: string;
  username: string;
  user_id: number;
  role: string;
  is_active: boolean;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  API calls                                                          */
/* ------------------------------------------------------------------ */

/**
 * The backend uses OAuth2 password flow, so the body must be sent as
 * `application/x-www-form-urlencoded` with fields `username` and `password`.
 */
export async function loginRequest(
  credentials: LoginCredentials,
): Promise<TokenLogin> {
  const body = new URLSearchParams();
  body.append("username", credentials.email); // backend expects email in `username`
  body.append("password", credentials.password);

  return apiFetch<TokenLogin>("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
}

/**
 * Exchange a valid refresh token for a new access token.
 */
export async function refreshRequest(
  refreshToken: string,
): Promise<TokenRefresh> {
  return apiFetch<TokenRefresh>("/api/v1/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });
}

/**
 * Register a new user account.
 */
export async function registerRequest(
  data: RegisterData,
): Promise<UserResponse> {
  return apiFetch<UserResponse>("/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
