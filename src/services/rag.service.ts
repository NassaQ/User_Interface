/**
 * RAG API service — semantic search, ask (Q&A), document management, and stats.
 *
 * Follows the same pattern as documents.service.ts:
 * reads the JWT token directly from localStorage.
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
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/* ------------------------------------------------------------------ */
/*  Types matching server/app/schemas/rag.py                           */
/* ------------------------------------------------------------------ */

// ── Search / Ask shared ──────────────────────────────────────────────

export interface SearchResultItem {
  text: string;
  text_original: string;
  document_id: string;
  source_file: string;
  page_number: number;
  section_heading: string;
  domain: string;
  classification: string;
  language: string;
  faiss_score: number;
  rerank_score: number;
}

// ── Search ───────────────────────────────────────────────────────────

export interface SearchRequest {
  query: string;
  top_k?: number;
  filter_domain?: string | null;
  filter_classification?: string | null;
  filter_language?: string | null;
  filter_document_id?: string | null;
}

export interface SearchResponse {
  query: string;
  results: SearchResultItem[];
  total_results: number;
}

// ── Ask (RAG Generation) ─────────────────────────────────────────────

export interface AskRequest {
  query: string;
  top_k?: number;
  filter_domain?: string | null;
  filter_classification?: string | null;
  filter_language?: string | null;
  filter_document_id?: string | null;
}

export interface AskResponse {
  answer: string;
  sources: SearchResultItem[];
  tokens_used: number;
  cost_usd: number;
}

// ── Ingest ───────────────────────────────────────────────────────────

export interface IngestRequest {
  document_id: string;
  cleaned_text: string;
  tables_markdown?: string[];
  domain?: string;
  classification?: string;
  language?: string;
  source_file?: string;
}

export interface IngestResponse {
  document_id: string;
  status: string;
  chunks_created: number;
  total_tokens: number;
  source_file: string;
}

// ── Document management ──────────────────────────────────────────────

export interface DocumentInfo {
  document_id: string;
  chunks_count: number;
  source_file: string;
  domain: string;
  classification: string;
  language: string;
}

export interface RemoveResponse {
  document_id: string;
  status: string;
  chunks_removed: number;
}

export interface StoreStats {
  total_vectors: number;
  total_documents: number;
}

/* ------------------------------------------------------------------ */
/*  API calls                                                          */
/* ------------------------------------------------------------------ */

/**
 * Semantic search across ingested documents.
 */
export async function ragSearch(body: SearchRequest): Promise<SearchResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/rag/search`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await extractDetail(res);
    throw new Error(detail);
  }

  return res.json();
}

/**
 * Ask a question — RAG retrieval + LLM generation.
 */
export async function ragAsk(body: AskRequest): Promise<AskResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/rag/ask`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await extractDetail(res);
    throw new Error(detail);
  }

  return res.json();
}

/**
 * Ingest a document into the vector store.
 */
export async function ragIngest(body: IngestRequest): Promise<IngestResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/rag/ingest`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await extractDetail(res);
    throw new Error(detail);
  }

  return res.json();
}

/**
 * List all ingested documents.
 */
export async function ragListDocuments(): Promise<DocumentInfo[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/rag/documents`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const detail = await extractDetail(res);
    throw new Error(detail);
  }

  return res.json();
}

/**
 * Remove a document from the vector store.
 */
export async function ragRemoveDocument(
  documentId: string,
): Promise<RemoveResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/rag/documents/${encodeURIComponent(documentId)}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );

  if (!res.ok) {
    const detail = await extractDetail(res);
    throw new Error(detail);
  }

  return res.json();
}

/**
 * Get vector store statistics.
 */
export async function ragStats(): Promise<StoreStats> {
  const res = await fetch(`${API_BASE_URL}/api/v1/rag/stats`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const detail = await extractDetail(res);
    throw new Error(detail);
  }

  return res.json();
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

async function extractDetail(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return typeof body.detail === "string" ? body.detail : "Request failed";
  } catch {
    return "Request failed";
  }
}
