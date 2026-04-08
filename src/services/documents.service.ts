/**
 * Documents API service — handles file upload, processing history, and stats.
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

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ------------------------------------------------------------------ */
/*  Types matching the backend schemas                                 */
/* ------------------------------------------------------------------ */

export interface PageDiagnostic {
  page_number: number;
  status: string;
  words_count: number;
  avg_confidence: number;
}

export interface ClassificationInfo {
  category: string;
  confidence: number;
  reasoning: string;
  tokens_used: number;
  cost_usd: number;
  error: string | null;
}

export interface CostBreakdown {
  ocr_cost_usd: number;
  classification_cost_usd: number;
  total_cost_usd: number;
}

export interface DocumentProcessResponse {
  success: boolean;
  error: string | null;
  filename: string;
  extracted_text: string;
  cleaned_text: string;
  primary_language: string;
  tables_markdown: string[];
  page_count: number;
  word_count: number;
  avg_confidence: number;
  ocr_elapsed_seconds: number;
  chunks_used: number;
  quality: Record<string, unknown>;
  per_page: PageDiagnostic[];
  classification: ClassificationInfo | null;
  costs: CostBreakdown;
}

export interface HistoryItem {
  id: string;
  filename: string;
  category: string;
  confidence: number;
  page_count: number;
  word_count: number;
  primary_language: string;
  ocr_cost_usd: number;
  classification_cost_usd: number;
  total_cost_usd: number;
  processed_at: string;
  elapsed_seconds: number;
}

export interface StatsResponse {
  total_documents: number;
  total_pages: number;
  total_words: number;
  total_cost_usd: number;
  avg_confidence: number;
  avg_processing_time: number;
  categories: Record<string, number>;
  languages: Record<string, number>;
}

/* ------------------------------------------------------------------ */
/*  API calls                                                          */
/* ------------------------------------------------------------------ */

/**
 * Upload a file for OCR processing and classification.
 *
 * Uses multipart/form-data — the browser sets the Content-Type
 * and boundary automatically when we pass a FormData body.
 */
export async function processDocument(
  file: File,
  skipClassification = false,
): Promise<DocumentProcessResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const url = new URL(`${API_BASE_URL}/api/v1/documents/process`);
  if (skipClassification) {
    url.searchParams.set("skip_classification", "true");
  }

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: authHeaders(), // no Content-Type — browser sets it for FormData
    body: formData,
  });

  if (!res.ok) {
    let detail = "Processing failed";
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
 * Fetch processing history for the current user.
 */
export async function fetchHistory(
  skip = 0,
  limit = 50,
): Promise<HistoryItem[]> {
  const url = `${API_BASE_URL}/api/v1/documents/history?skip=${skip}&limit=${limit}`;

  const res = await fetch(url, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch history");
  }

  return res.json();
}

/**
 * Fetch dashboard statistics for the current user.
 */
export async function fetchStats(): Promise<StatsResponse> {
  const url = `${API_BASE_URL}/api/v1/documents/stats`;

  const res = await fetch(url, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch stats");
  }

  return res.json();
}
