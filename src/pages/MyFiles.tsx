/**
 * My Files — browse documents organised by classification folder.
 *
 * Shows folder cards → click to see files → view original / move file.
 */

import { useEffect, useState, useCallback } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  FileText,
  ExternalLink,
  ArrowLeft,
  Loader2,
  Move,
  Search,
  Hash,
  Globe,
  BarChart3,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  fetchHistory,
  moveDocument,
  deleteDocument,
  type HistoryItem,
} from "@/services/documents.service";
import { viewOriginalFile } from "@/services/files.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/* ------------------------------------------------------------------ */
/*  Category colours                                                   */
/* ------------------------------------------------------------------ */
const CATEGORY_COLORS: Record<string, string> = {
  Contracts:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Litigation:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Court Rulings":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Legislation:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "Legal Opinions":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Uncertain:
    "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

const ALL_CATEGORIES = Object.keys(CATEGORY_COLORS).filter(
  (c) => c !== "Uncertain",
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const MyFiles = () => {
  const { t } = useLanguage();

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [movingDocId, setMovingDocId] = useState<number | null>(null);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<number | null>(null);
  const [showNewFolderInput, setShowNewFolderInput] = useState<number | null>(null);
  const [newFolderName, setNewFolderName] = useState("");

  // ── Existing folders (derived from actual data) ───────────────
  const existingFolders = [...new Set(items.map((i) => i.category))]
    .filter((c) => c && c !== "Uncertain" && c !== "Error")
    .sort();

  // ── Load data ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchHistory(0, 200);
        if (!cancelled) setItems(data);
      } catch {
        /* silent */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Group by category ──────────────────────────────────────────
  const folderMap = new Map<string, HistoryItem[]>();
  for (const item of items) {
    const cat = item.category || "Uncertain";
    if (!folderMap.has(cat)) folderMap.set(cat, []);
    folderMap.get(cat)!.push(item);
  }

  const folders = Array.from(folderMap.entries()).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  const selectedFiles = selectedCategory
    ? folderMap.get(selectedCategory) ?? []
    : [];

  // ── Move document ──────────────────────────────────────────────
  const handleMove = useCallback(
    async (docId: number, newDomain: string, newCategory: string) => {
      setMovingDocId(docId);
      try {
        await moveDocument(docId, newDomain, newCategory);
        // Refresh the list
        const data = await fetchHistory(0, 200);
        setItems(data);
        setSelectedCategory(newCategory);
      } catch (err) {
        alert(
          err instanceof Error ? err.message : "Failed to move document",
        );
      } finally {
        setMovingDocId(null);
      }
    },
    [],
  );

  // ── Delete document ────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    if (deleteConfirmId === null) return;
    setDeletingDocId(deleteConfirmId);
    try {
      await deleteDocument(deleteConfirmId);
      // Refresh the list
      const data = await fetchHistory(0, 200);
      setItems(data);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to delete document",
      );
    } finally {
      setDeletingDocId(null);
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId]);

  // ── View original file ─────────────────────────────────────────
  const handleView = useCallback(async (docId: string) => {
    setViewingFile(docId);
    try {
      await viewOriginalFile(docId);
    } catch {
      /* silent */
    } finally {
      setViewingFile(null);
    }
  }, []);

  // ── Format helpers ─────────────────────────────────────────────
  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  return (
    <DashboardLayout
      title={
        selectedCategory
          ? `${selectedCategory} (${selectedFiles.length})`
          : t("pages.myFiles.title")
      }
      subtitle={
        selectedCategory
          ? t("pages.myFiles.folderSubtitle")
          : t("pages.myFiles.subtitle")
      }
    >
      {/* ── Loading ────────────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && (
        <>
          {/* ── Breadcrumb ──────────────────────────────────────── */}
          {selectedCategory && (
            <div className="mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedCategory(null)}
              >
                <ArrowLeft className="w-4 h-4" />
                {t("pages.myFiles.back")}
              </Button>
            </div>
          )}

          {!selectedCategory ? (
              /* ══════ FOLDER GRID VIEW ══════ */
              <div
                key="folders"
                className="animate-fade-in-up animate-on-mount"
              >
                {folders.length === 0 ? (
                  <div className="py-16 text-center text-muted-foreground">
                    <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-medium">
                      {t("pages.myFiles.empty")}
                    </p>
                    <p className="text-sm mt-1">
                      {t("pages.myFiles.emptyHint")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {folders.map(([category, files], idx) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="group bg-card border border-border rounded-2xl p-5 text-left hover:border-primary/40 hover:shadow-md transition-all duration-200 animate-fade-in-up animate-on-mount"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              CATEGORY_COLORS[category] ??
                              CATEGORY_COLORS.Uncertain
                            }`}
                          >
                            <FolderOpen className="w-6 h-6" />
                          </div>
                          <span className="text-2xl font-bold text-foreground">
                            {files.length}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {category}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("pages.myFiles.files", { count: files.length })}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* ══════ FILE LIST VIEW ══════ */
              <div
                key="files"
                className="animate-fade-in-up animate-on-mount"
              >
                {selectedFiles.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>{t("pages.myFiles.noFiles")}</p>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-2xl"> {/* no overflow-hidden — dropdowns must be able to overflow */}
                    {/* Table header */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-secondary/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                      <div className="col-span-4">{t("pages.myFiles.table.name")}</div>
                      <div className="col-span-2">{t("pages.myFiles.table.type")}</div>
                      <div className="col-span-2">{t("pages.myFiles.table.pages")}</div>
                      <div className="col-span-2">{t("pages.myFiles.table.date")}</div>
                      <div className="col-span-2 text-right">{t("pages.myFiles.table.actions")}</div>
                    </div>

                    {/* File rows */}
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={file.id}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 px-5 py-4 items-center border-b border-border/50 last:border-b-0 hover:bg-secondary/20 transition-colors animate-fade-in animate-on-mount"
                        style={{ animationDelay: `${idx * 0.03}s` }}
                      >
                        {/* Name */}
                        <div className="col-span-1 sm:col-span-4 flex items-center gap-3 min-w-0">
                          <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="font-medium text-foreground truncate text-sm">
                            {file.filename}
                          </span>
                        </div>

                        {/* Type */}
                        <div className="col-span-1 sm:col-span-2 flex items-center gap-2">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              CATEGORY_COLORS[file.category] ??
                              CATEGORY_COLORS.Uncertain
                            }`}
                          >
                            {file.category}
                          </span>
                        </div>

                        {/* Pages */}
                        <div className="col-span-1 sm:col-span-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Hash className="w-3.5 h-3.5" />
                          {file.page_count}
                          {file.word_count > 0 && (
                            <span className="text-xs text-muted-foreground/60 ml-1">
                              · {(file.word_count / 1000).toFixed(1)}k
                            </span>
                          )}
                        </div>

                        {/* Date */}
                        <div className="col-span-1 sm:col-span-2 text-sm text-muted-foreground">
                          {relativeTime(file.processed_at)}
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 sm:col-span-2 flex items-center justify-start sm:justify-end gap-1">
                          {/* View Original */}
                          <button
                            onClick={() => handleView(file.document_id)}
                            disabled={viewingFile === file.document_id}
                            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                            title={t("pages.myFiles.viewOriginal")}
                          >
                            {viewingFile === file.document_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <ExternalLink className="w-4 h-4" />
                            )}
                          </button>

                          {/* Move to folder */}
                          <div className="relative z-[9999]">
                            <button
                              onClick={() =>
                                setOpenDropdownId(
                                  openDropdownId === file.doc_id
                                    ? null
                                    : file.doc_id,
                                )
                              }
                              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                              title={t("pages.myFiles.move")}
                            >
                              <Move className="w-4 h-4" />
                            </button>
                            {openDropdownId === file.doc_id && (
                              <>
                                {/* Backdrop to catch outside clicks */}
                                <div
                                  className="fixed inset-0 z-30"
                                  onClick={() => {
                                    setOpenDropdownId(null);
                                    setShowNewFolderInput(null);
                                    setNewFolderName("");
                                  }}
                                />
                                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl z-40 min-w-[180px] py-1 max-h-64 overflow-y-auto">
                                  <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {t("pages.myFiles.moveTo")}
                                  </p>

                                  {/* Existing folders */}
                                  {existingFolders
                                    .filter((c) => c !== file.category)
                                    .map((cat) => (
                                      <button
                                        key={cat}
                                        onClick={() => {
                                          handleMove(file.doc_id, "Law", cat);
                                          setOpenDropdownId(null);
                                        }}
                                        disabled={movingDocId === file.doc_id}
                                        className="w-full text-left px-3 py-1.5 text-sm hover:bg-secondary/50 transition-colors flex items-center gap-2"
                                      >
                                        <FolderOpen className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                        {cat}
                                      </button>
                                    ))}

                                  {existingFolders.length > 0 && (
                                    <div className="border-t border-border my-1" />
                                  )}

                                  {/* New folder option */}
                                  {showNewFolderInput === file.doc_id ? (
                                    <div className="px-3 py-2 space-y-2">
                                      <input
                                        type="text"
                                        value={newFolderName}
                                        onChange={(e) =>
                                          setNewFolderName(e.target.value)
                                        }
                                        placeholder="Folder name"
                                        className="w-full text-sm rounded-lg border border-border bg-background px-2.5 py-1.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        autoFocus
                                        onKeyDown={(e) => {
                                          if (
                                            e.key === "Enter" &&
                                            newFolderName.trim()
                                          ) {
                                            handleMove(
                                              file.doc_id,
                                              "Law",
                                              newFolderName.trim(),
                                            );
                                            setOpenDropdownId(null);
                                            setShowNewFolderInput(null);
                                            setNewFolderName("");
                                          }
                                          if (e.key === "Escape") {
                                            setShowNewFolderInput(null);
                                            setNewFolderName("");
                                          }
                                        }}
                                      />
                                      <div className="flex gap-1.5">
                                        <button
                                          onClick={() => {
                                            if (newFolderName.trim()) {
                                              handleMove(
                                                file.doc_id,
                                                "Law",
                                                newFolderName.trim(),
                                              );
                                              setOpenDropdownId(null);
                                              setShowNewFolderInput(null);
                                              setNewFolderName("");
                                            }
                                          }}
                                          disabled={
                                            !newFolderName.trim() ||
                                            movingDocId === file.doc_id
                                          }
                                          className="flex-1 text-xs font-medium rounded-lg bg-primary text-primary-foreground py-1.5 hover:opacity-90 transition-opacity disabled:opacity-50"
                                        >
                                          Create
                                        </button>
                                        <button
                                          onClick={() => {
                                            setShowNewFolderInput(null);
                                            setNewFolderName("");
                                          }}
                                          className="flex-1 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground py-1.5 hover:bg-secondary/70 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setShowNewFolderInput(file.doc_id);
                                        setNewFolderName("");
                                      }}
                                      className="w-full text-left px-3 py-1.5 text-sm text-primary hover:bg-secondary/50 transition-colors flex items-center gap-2"
                                    >
                                      <FolderOpen className="w-3.5 h-3.5 flex-shrink-0" />
                                      + New folder...
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmId(file.doc_id)}
                            disabled={deletingDocId === file.doc_id}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            title="Delete"
                          >
                            {deletingDocId === file.doc_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
        </>
      )}

      {/* ── Delete Confirmation Dialog ──────────────────────────── */}
      <AlertDialog
          open={deleteConfirmId !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteConfirmId(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Document</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this document? This action
                cannot be undone. The file, OCR results, and any RAG index
                entries will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deletingDocId !== null}
              >
                {deletingDocId !== null ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </DashboardLayout>
  );
};

export default MyFiles;
