/**
 * ProcessingContext — Background document processing state.
 *
 * Lives above the Router in App.tsx so that processing state
 * persists across route changes.  Studio becomes a thin view
 * layer that reads from this context instead of local useState.
 */

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  processDocument,
  type DocumentProcessResponse,
} from "@/services/documents.service";
import { ragIngest } from "@/services/rag.service";
import { uploadFile } from "@/services/files.service";

/* ------------------------------------------------------------------ */
/*  Shared constant                                                    */
/* ------------------------------------------------------------------ */

export const SUPPORTED_EXTENSIONS = [
  ".pdf", ".jpg", ".jpeg", ".png", ".tif", ".tiff",
  ".bmp", ".docx", ".xlsx", ".pptx",
];

/* ------------------------------------------------------------------ */
/*  Context shape                                                      */
/* ------------------------------------------------------------------ */

interface ProcessingContextValue {
  // ── State ─────────────────────────────────────────────────────
  selectedFile: File | null;
  isProcessing: boolean;
  result: DocumentProcessResponse | null;
  error: string | null;
  isIngesting: boolean;
  ingested: boolean;
  ingestError: string | null;
  ingestChunks: number;
  isUploadingFile: boolean;
  fileUploaded: boolean;
  fileUploadWarning: string | null;

  // ── Actions ───────────────────────────────────────────────────
  selectFile: (file: File) => void;
  processFile: () => void;
  ingestToKB: () => void;
  reset: () => void;
}

const ProcessingContext = createContext<ProcessingContextValue | undefined>(
  undefined,
);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function ProcessingProvider({ children }: { children: ReactNode }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DocumentProcessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingested, setIngested] = useState(false);
  const [ingestError, setIngestError] = useState<string | null>(null);
  const [ingestChunks, setIngestChunks] = useState(0);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileUploadWarning, setFileUploadWarning] = useState<string | null>(null);

  /* ---- selectFile ---- */
  const selectFile = useCallback((file: File) => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported file type: ${ext}`);
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("File too large. Maximum size is 50 MB.");
      return;
    }
    setSelectedFile(file);
    setError(null);
    setResult(null);
    setIngested(false);
    setIngestError(null);
    setIngestChunks(0);
    setIsUploadingFile(false);
    setFileUploaded(false);
    setFileUploadWarning(null);
  }, []);

  /* ---- processFile ---- */
  const processFile = useCallback(async () => {
    if (!selectedFile || isProcessing) return;
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const res = await processDocument(selectedFile);
      setResult(res);
      if (!res.success) {
        setError(res.error || "Processing failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, isProcessing]);

  /* ---- ingestToKB ---- */
  const ingestToKB = useCallback(async () => {
    if (!result || !result.success || isIngesting || ingested) return;
    setIsIngesting(true);
    setIngestError(null);
    setFileUploadWarning(null);
    setFileUploaded(false);

    // Hoist document_id so both RAG ingest and file upload share the same ID
    const documentId = crypto.randomUUID();

    try {
      // Step 1: RAG ingest (primary — must succeed)
      const resp = await ragIngest({
        document_id: documentId,
        cleaned_text: result.cleaned_text || result.extracted_text,
        tables_markdown: result.tables_markdown ?? [],
        classification: result.classification?.category ?? "",
        language: result.primary_language ?? "unknown",
        source_file: result.filename,
      });
      setIngested(true);
      setIngestChunks(resp.chunks_created);

      // Step 2: File upload (secondary — warn on failure, don't rollback)
      if (selectedFile) {
        setIsUploadingFile(true);
        try {
          await uploadFile(documentId, selectedFile);
          setFileUploaded(true);
        } catch (uploadErr) {
          const msg =
            uploadErr instanceof Error
              ? uploadErr.message
              : "Original file upload failed";
          setFileUploadWarning(msg);
        } finally {
          setIsUploadingFile(false);
        }
      }
    } catch (err) {
      setIngestError(
        err instanceof Error ? err.message : "Failed to save to knowledge base",
      );
    } finally {
      setIsIngesting(false);
    }
  }, [result, selectedFile, isIngesting, ingested]);

  /* ---- reset ---- */
  const reset = useCallback(() => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setIngested(false);
    setIngestError(null);
    setIngestChunks(0);
    setIsUploadingFile(false);
    setFileUploaded(false);
    setFileUploadWarning(null);
  }, []);

  return (
    <ProcessingContext.Provider
      value={{
        selectedFile,
        isProcessing,
        result,
        error,
        isIngesting,
        ingested,
        ingestError,
        ingestChunks,
        isUploadingFile,
        fileUploaded,
        fileUploadWarning,
        selectFile,
        processFile,
        ingestToKB,
        reset,
      }}
    >
      {children}
    </ProcessingContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useProcessing(): ProcessingContextValue {
  const ctx = useContext(ProcessingContext);
  if (!ctx) {
    throw new Error("useProcessing must be used within <ProcessingProvider>");
  }
  return ctx;
}
