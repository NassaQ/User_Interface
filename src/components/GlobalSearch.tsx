import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Loader2, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ragSearch, type SearchResultItem } from "@/services/rag.service";
import { viewOriginalFile } from "@/services/files.service";
import { cn } from "@/lib/utils";

const GlobalSearch = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    setOpen(true);
    try {
      const res = await ragSearch({ query: trimmed, top_k: 6 });
      setResults(res.results);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    navigate("/search", { state: { query: trimmed } });
  };

  const handleViewOriginal = async (documentId: string) => {
    try {
      await viewOriginalFile(documentId);
    } catch {
      /* file may not exist for older documents */
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setOpen(true)}
            placeholder={t("dashboard.header.search.placeholder")}
            className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </form>

      {open && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in animate-on-mount">
          {loading && results.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">…</p>
          ) : results.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">
              {t("pages.dashboard.search.noResults")}
            </p>
          ) : (
            <ul className="max-h-72 overflow-y-auto py-1">
              {results.map((item, index) => (
                <li
                  key={`${item.document_id}-${item.page_number}-${index}`}
                  className="px-3 py-2 hover:bg-secondary/50 transition-colors"
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => {
                      setOpen(false);
                      navigate("/search", { state: { query: query.trim() } });
                    }}
                  >
                    <p className="text-sm font-medium truncate">{item.source_file}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {(item.text_original || item.text).slice(0, 120)}
                    </p>
                  </button>
                  {item.document_id && (
                    <button
                      type="button"
                      onClick={() => handleViewOriginal(item.document_id)}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {t("dashboard.header.search.viewOriginal")}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => navigate("/search", { state: { query: query.trim() } })}
            className={cn(
              "w-full border-t border-border px-3 py-2 text-xs text-primary hover:bg-secondary/30 transition-colors text-center",
            )}
          >
            {t("pages.dashboard.search.viewAll")}
          </button>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
