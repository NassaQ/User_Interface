import { apiFetch } from "@/lib/api";

/* ------------------------------------------------------------------ */
/*  Types matching backend UserResponse schema                         */
/* ------------------------------------------------------------------ */

export interface User {
  user_id: number;
  full_name: string;
  email: string;
  username: string;
  role: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserUpdate {
  full_name: string;
  username: string;
}

/* ------------------------------------------------------------------ */
/*  API calls                                                          */
/* ------------------------------------------------------------------ */

/** GET /api/v1/users/me – current authenticated user profile */
export function getCurrentUser(accessToken: string): Promise<User> {
  return apiFetch<User>("/api/v1/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

/** PATCH /api/v1/users/me – update current user's full_name and username */
export function updateCurrentUser(accessToken: string, data: UserUpdate): Promise<User> {
  return apiFetch<User>("/api/v1/users/me", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
