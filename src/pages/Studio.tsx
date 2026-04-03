import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  Sparkles,
  Copy,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Languages,
  BarChart3,
  Tag,
  Loader2,
  X,
  FileUp,
  Database,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useProcessing, SUPPORTED_EXTENSIONS } from "@/context/ProcessingContext";
import ReactMarkdown from "react-markdown";

const CATEGORY_COLORS: Record<string, string> = {
  Culture: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Finance: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Medical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Politics: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Religion: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Sports: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Technology: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  Uncertain: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  Error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const Studio = () => {
  const { t } = useLanguage();
  const {
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
  } = useProcessing();

  // ── Local UI-only state ─────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Drag & drop handlers ────────────────────────────────────
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) selectFile(file);
    },
    [selectFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // ── Copy text ────────────────────────────────────────────────
  const handleCopy = useCallback(() => {
    if (!result?.extracted_text) return;
    navigator.clipboard.writeText(result.extracted_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  // ── Download as .txt ─────────────────────────────────────────
  const handleDownload = useCallback(() => {
    if (!result?.extracted_text) return;
    const blob = new Blob([result.extracted_text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.filename.replace(/\.[^.]+$/, "")}_extracted.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  // ── Reset (wraps context reset + clears file input ref) ─────
  const handleReset = useCallback(() => {
    reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [reset]);

  const confidencePct = result?.avg_confidence ? Math.round(result.avg_confidence * 100) : 0;
  const classConfPct = result?.classification?.confidence
    ? Math.round(result.classification.confidence * 100)
    : 0;

  return (
    <DashboardLayout
      title={t("pages.studio.title")}
      subtitle="Upload documents for OCR text extraction and AI classification"
    >
      <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
        {/* -- Left Panel: Upload -------------------------------- */}
        <motion.div
          className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Document Upload</p>
                <p className="text-xs text-muted-foreground">
                  PDF, images, DOCX, XLSX, PPTX
                </p>
              </div>
            </div>
          </div>

          {/* Drop zone */}
          <div className="flex-1 min-h-0 p-4 flex flex-col">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={SUPPORTED_EXTENSIONS.join(",")}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) selectFile(file);
              }}
            />

            {!selectedFile && !isProcessing && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/30"
                }`}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <FileUp className="w-8 h-8 text-primary" />
                </div>
                <p className="font-medium text-foreground mb-1">
                  Drop your document here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse files
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: PDF, JPG, PNG, TIFF, BMP, DOCX, XLSX, PPTX (max 50 MB)
                </p>
              </div>
            )}

            {/* Selected file preview */}
            {selectedFile && !isProcessing && !result && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <p className="font-medium text-foreground mb-1 text-center break-all px-4">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleReset}>
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                  <Button
                    onClick={processFile}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Process Document
                  </Button>
                </div>
              </div>
            )}

            {/* Processing state */}
            {isProcessing && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="font-medium text-foreground mb-2">
                  Processing document...
                </p>
                <p className="text-sm text-muted-foreground text-center mb-4 max-w-xs">
                  Running OCR text extraction and AI classification.
                  This may take 10-30 seconds.
                </p>
                <div className="w-64">
                  <Progress value={undefined} className="h-2" />
                </div>
              </div>
            )}

            {/* Result summary (left panel) */}
            {result && result.success && (
              <div className="flex-1 min-h-0 overflow-auto space-y-4">
                {/* Success banner */}
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-green-700 dark:text-green-400">
                      Processing complete
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500">
                      {result.filename}
                    </p>
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard
                    icon={<FileText className="w-4 h-4" />}
                    label="Pages"
                    value={String(result.page_count)}
                  />
                  <MetricCard
                    icon={<BarChart3 className="w-4 h-4" />}
                    label="Words"
                    value={result.word_count.toLocaleString()}
                  />
                  <MetricCard
                    icon={<Languages className="w-4 h-4" />}
                    label="Language"
                    value={result.primary_language}
                  />
                  <MetricCard
                    icon={<Clock className="w-4 h-4" />}
                    label="Time"
                    value={`${result.ocr_elapsed_seconds.toFixed(1)}s`}
                  />
                </div>

                {/* Confidence */}
                <div className="p-3 bg-secondary/50 rounded-xl">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">OCR Confidence</span>
                    <span className="font-medium">{confidencePct}%</span>
                  </div>
                  <Progress value={confidencePct} className="h-2" />
                </div>

                {/* Classification */}
                {result.classification && (
                  <div className="p-3 bg-secondary/50 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        Classification
                      </span>
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          CATEGORY_COLORS[result.classification.category] ??
                          CATEGORY_COLORS.Uncertain
                        }`}
                      >
                        {result.classification.category}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-medium">{classConfPct}%</span>
                    </div>
                    <Progress value={classConfPct} className="h-2" />
                    {result.classification.reasoning && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {result.classification.reasoning}
                      </p>
                    )}
                  </div>
                )}

                {/* Cost */}
                {result.costs && (
                  <div className="p-3 bg-secondary/50 rounded-xl text-sm">
                    <p className="text-muted-foreground mb-1">Cost Breakdown</p>
                    <div className="flex justify-between">
                      <span>OCR</span>
                      <span>${result.costs.ocr_cost_usd.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Classification</span>
                      <span>${result.costs.classification_cost_usd.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t border-border mt-1 pt-1">
                      <span>Total</span>
                      <span>${result.costs.total_cost_usd.toFixed(4)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error state */}
            {error && !isProcessing && (
              <div className="mt-4 flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-red-700 dark:text-red-400">
                    Processing failed
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
                    {error}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Fixed footer: action buttons -- always visible */}
          {result && result.success && (
            <div className="flex-shrink-0 p-4 border-t border-border space-y-2">
              {ingested ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <Database className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-blue-700 dark:text-blue-400">
                        {t("pages.studio.ingest.success")}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-500">
                        {t("pages.studio.ingest.chunksCreated").replace("{count}", String(ingestChunks))}
                      </p>
                    </div>
                  </div>
                  {/* File upload status */}
                  {isUploadingFile && (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <Loader2 className="w-4 h-4 text-blue-600 flex-shrink-0 animate-spin" />
                      <p className="text-xs text-blue-600 dark:text-blue-500">
                        {t("pages.studio.ingest.fileUploading")}
                      </p>
                    </div>
                  )}
                  {fileUploaded && !fileUploadWarning && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <p className="text-xs text-green-600 dark:text-green-500">
                        {t("pages.studio.ingest.fileUploadSuccess")}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white"
                  onClick={ingestToKB}
                  disabled={isIngesting}
                >
                  {isIngesting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Database className="w-4 h-4 mr-2" />
                  )}
                  {isIngesting
                    ? t("pages.studio.ingest.saving")
                    : t("pages.studio.ingest.button")}
                </Button>
              )}
              {ingestError && (
                <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 dark:text-red-500">{ingestError}</p>
                </div>
              )}
              {fileUploadWarning && (
                <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-600 dark:text-amber-500">
                    {t("pages.studio.ingest.fileUploadWarning")}
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleReset}
              >
                <Upload className="w-4 h-4 mr-2" />
                Process Another Document
              </Button>
            </div>
          )}
        </motion.div>

        {/* -- Right Panel: Extracted Text ------------------------ */}
        <motion.div
          className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">Extracted Text</p>
                <p className="text-xs text-muted-foreground">
                  {result?.success
                    ? `${result.word_count.toLocaleString()} words extracted`
                    : "Upload a document to begin"}
                </p>
              </div>
            </div>
            {result?.success && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopy}
                  title="Copy text"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleDownload}
                  title="Download as text file"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-6 overflow-auto">
            {!result && !isProcessing && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <FileText className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">Extracted text will appear here</p>
              </div>
            )}

            {isProcessing && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-3 opacity-50" />
                <p className="text-sm">Extracting text...</p>
              </div>
            )}

            {result?.success && (
              <div className="space-y-6">
                {/* Main extracted text */}
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed"
                  dir="auto"
                  style={{ unicodeBidi: "plaintext" }}
                >
                  <ReactMarkdown>
                    {result.extracted_text || "(No text extracted)"}
                  </ReactMarkdown>
                </div>

                {/* Tables section */}
                {result.tables_markdown && result.tables_markdown.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <p className="font-medium text-sm mb-3">
                      Extracted Tables ({result.tables_markdown.length})
                    </p>
                    {result.tables_markdown.map((table, i) => (
                      <div
                        key={`table-${i}`}
                        className="mb-4 p-3 bg-secondary/30 rounded-lg overflow-x-auto"
                      >
                        <pre className="text-xs font-mono whitespace-pre" dir="auto">
                          {table}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* Per-page diagnostics */}
                {result.per_page && result.per_page.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <p className="font-medium text-sm mb-3">
                      Page Diagnostics
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {result.per_page.map((page, idx) => (
                        <div
                          key={`page-${page.page_number}-${idx}`}
                          className="p-2 bg-secondary/30 rounded-lg text-xs"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">
                              Page {page.page_number}
                            </span>
                            <span
                              className={
                                page.status === "good"
                                  ? "text-green-600"
                                  : page.status === "sparse"
                                    ? "text-amber-600"
                                    : "text-red-600"
                              }
                            >
                              {page.status}
                            </span>
                          </div>
                          <div className="text-muted-foreground mt-0.5">
                            {page.words_count} words |{" "}
                            {Math.round(page.avg_confidence * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {result && !result.success && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <AlertCircle className="w-12 h-12 mb-3 opacity-30 text-red-500" />
                <p className="text-sm text-red-600">{result.error}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

/* -- Metric card component ------------------------------------------ */
function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-3 bg-secondary/50 rounded-xl">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="font-semibold text-foreground text-sm">{value}</p>
    </div>
  );
}

export default Studio;
