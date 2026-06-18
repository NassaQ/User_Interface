/**
 * GlobalSearch — semantic search box in the Dashboard header.
 *
 * Features:
 *   - 300ms debounce on typing
 *   - Enter triggers immediate search
 *   - Dropdown shows top 3 matching files with relevance %
 *   - Click a result → opens original file in a new tab
 *   - Each result shows: rank, filename, category badge, relevance, folder path
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ragSearch } from "@/services/rag.service";
import { viewOriginalFile } from "@/services/files.service";
import {
  Search,
  FileText,
  Loader2,
  ExternalLink,
  FolderOpen,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Category colours (mirrors dashboard & search page)                 */
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
  Uncertain:
    "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SearchHit {
  source_file: string;
  classification: string;
  score: number;
  document_id: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const GlobalSearch = () => {
  const { t } = useLanguage();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // ── Close dropdown on outside click ──────────────────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Perform search ───────────────────────────────────────────────
  const doSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    try {
      const resp = await ragSearch({ query: trimmed, top_k: 10 });

      // Group chunks by document_id, keep best rerank_score per file
      const fileMap = new Map<string, SearchHit>();
      for (const item of resp.results) {
        const existing = fileMap.get(item.document_id);
        if (!existing || item.rerank_score > existing.score) {
          fileMap.set(item.document_id, {
            source_file: item.source_file,
            classification: item.classification,
            score: item.rerank_score,
            document_id: item.document_id,
          });
        }
      }

      // Sort by score descending, take top 3
      const top3 = Array.from(fileMap.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setResults(top3);
      setIsOpen(top3.length > 0);
    } catch {
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // ── Input handler with 300ms debounce ────────────────────────────
  const onInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  // ── Keyboard shortcuts ───────────────────────────────────────────
  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      doSearch(query);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // ── View original file ──────────────────────────────────────────
  const handleViewFile = async (documentId: string) => {
    try {
      await viewOriginalFile(documentId);
    } catch {
      /* silent — file may not exist for older documents */
    }
  };

  return (
    <div className="relative flex-1 max-w-xs lg:max-w-sm xl:max-w-md mx-2 sm:mx-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onInputKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={t("dashboard.header.search.placeholder")}
          className="w-full h-9 pl-9 pr-8 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          dir="auto"
        />
        {isSearching && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
        >
          {results.map((file, idx) => {
            const pct = Math.round(Math.min(file.score, 1) * 100);
            return (
              <div
                key={file.document_id}
                className="flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors cursor-pointer border-b border-border/50 last:border-b-0"
                onClick={() => handleViewFile(file.document_id)}
              >
                {/* Rank badge */}
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <FileText className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground truncate max-w-[160px]">
                      {file.source_file}
                    </span>
                    {file.classification && (
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${
                          CATEGORY_COLORS[file.classification] ??
                          CATEGORY_COLORS.Uncertain
                        }`}
                      >
                        {file.classification}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate flex items-center gap-1">
                    <FolderOpen className="w-3 h-3 flex-shrink-0" />
                    <span>
                      {file.classification
                        ? `${file.classification.toLowerCase()}/${file.source_file}`
                        : file.source_file}
                    </span>
                  </p>
                </div>

                {/* Score + view button */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-sm font-bold text-primary w-9 text-right">
                    {pct}%
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewFile(file.document_id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                    title={t("dashboard.header.search.viewOriginal")}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
