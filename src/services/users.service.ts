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

export interface UserAdminUpdate {
  full_name?: string;
  email?: string;
  username?: string;
  role_id?: number;
  is_active?: boolean;
}

/* ------------------------------------------------------------------ */
/*  API calls                                                          */
/* ------------------------------------------------------------------ */

/** GET /api/v1/users/ – list all users (admin only) */
export function listUsers(
  accessToken: string,
  skip = 0,
  limit = 20,
): Promise<User[]> {
  return apiFetch<User[]>(`/api/v1/users/?skip=${skip}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

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

/** PATCH /api/v1/users/:id – admin update any user */
export function updateUser(
  accessToken: string,
  userId: number,
  data: UserAdminUpdate,
): Promise<User> {
  return apiFetch<User>(`/api/v1/users/${userId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/** PATCH /api/v1/users/:id/activate – activate a user */
export function activateUser(accessToken: string, userId: number): Promise<User> {
  return apiFetch<User>(`/api/v1/users/${userId}/activate`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

/** DELETE /api/v1/users/:id – delete a user (admin only) */
export function deleteUser(accessToken: string, userId: number): Promise<void> {
  return apiFetch<void>(`/api/v1/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
