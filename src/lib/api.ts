const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

/**
 * Lightweight fetch wrapper for the backend API.
 * Token refresh is handled by the AuthContext – this module only
 * deals with low-level HTTP calls so that the auth layer
 * can call it without circular imports.
 */

export interface ApiError {
  status: number;
  detail: string;
}

export class ApiRequestError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = "ApiRequestError";
    this.status = status;
    this.detail = detail;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
    },
  });

  if (!res.ok) {
    let detail = "Something went wrong";
    try {
      const body = await res.json();
      if (typeof body.detail === "string") {
        detail = body.detail;
      } else if (Array.isArray(body.detail)) {
        // FastAPI 422 validation errors: [{loc, msg, type, ...}, ...]
        detail = body.detail.map((err: { loc?: string[]; msg?: string }) => {
          const field = err.loc?.slice(-1)[0] ?? "field";
          return `${field}: ${err.msg}`;
        }).join("\n");
      }
    } catch {
      /* ignore parse errors */
    }
    throw new ApiRequestError(res.status, detail);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
