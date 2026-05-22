/**
 * Files API service — upload original files & view them in a new tab.
 *
 * Follows the same auth pattern as documents.service.ts / rag.service.ts.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

const STORAGE_KEY = "__nassaq_tokens";

function getAccessToken(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const tokens = JSON.parse(raw);
    return tokens.accessToken ?? null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FileUploadResponse {
  document_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  status: string;
}

/* ------------------------------------------------------------------ */
/*  API calls                                                          */
/* ------------------------------------------------------------------ */

/**
 * Upload an original file to Azure Blob Storage via the backend.
 *
 * Uses multipart/form-data with `file` + `document_id` fields.
 */
export async function uploadFile(
  documentId: string,
  file: File,
): Promise<FileUploadResponse> {
  const token = getAccessToken();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("document_id", documentId);

  const res = await fetch(`${API_BASE_URL}/api/v1/files/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    let detail = "File upload failed";
    try {
      const body = await res.json();
      detail = typeof body.detail === "string" ? body.detail : detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  return res.json();
}

/**
 * Fetch the original file from the backend and open it in a new browser tab.
 *
 * - PDFs / images render natively in the browser.
 * - Other types (DOCX, XLSX, etc.) trigger a download.
 * - The blob URL is revoked after 60 seconds to free memory.
 */
export async function viewOriginalFile(documentId: string): Promise<void> {
  const token = getAccessToken();

  const res = await fetch(
    `${API_BASE_URL}/api/v1/files/${encodeURIComponent(documentId)}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );

  if (!res.ok) {
    let detail = "Failed to retrieve file";
    try {
      const body = await res.json();
      detail = typeof body.detail === "string" ? body.detail : detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  window.open(url, "_blank");

  // Revoke the blob URL after 60 seconds to free memory
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
