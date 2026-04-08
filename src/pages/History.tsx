// ================================
// History Page — real data from /api/v1/documents/history
// ================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  FileText,
  MoreHorizontal,
  Calendar,
  ChevronDown,
  Download,
  Eye,
  FolderOpen,
  Loader2,
  Clock,
  Globe,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fetchHistory, type HistoryItem } from "@/services/documents.service";

// Category color mapping (same as Dashboard/Studio)
const categoryColors: Record<string, string> = {
  Technology: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Finance: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Politics: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Sports: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Culture: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Religion: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  Uncertain: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

const History = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchHistory(0, 200);
        if (!cancelled) setItems(data);
      } catch {
        // silently fail — empty list is shown
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Distinct categories for filter pills ───────────────────────────
  const distinctCategories = [...new Set(items.map((i) => i.category))].sort();

  const filters = [
    { id: "all", label: t("pages.history.filters.all") },
    ...distinctCategories.map((cat) => ({ id: cat, label: cat })),
  ];

  // ── Filtering ──────────────────────────────────────────────────────
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.primary_language.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === "all" || item.category === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // ── Helpers ────────────────────────────────────────────────────────
  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function downloadText(item: HistoryItem) {
    // We don't store full text in history — navigate to studio instead
    navigate("/dashboard/studio");
  }

  return (
    <DashboardLayout
      title={t("pages.history.title")}
      subtitle={t("pages.history.subtitle")}
    >
      {/* ── Loading ──────────────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && (
        <>
          {/* ── Search & Filters ────────────────────────────────── */}
          <motion.div
            className="bg-card border border-border rounded-2xl p-4 sm:p-5 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("pages.history.search.placeholder")}
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                />
              </div>

              {/* Sort info */}
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" disabled>
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {t("pages.history.filters.date")}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="gap-2" disabled>
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {t("pages.history.filters.more")}
                  </span>
                </Button>
              </div>
            </div>

            {/* Filter Pills (categories) */}
            {filters.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeFilter === filter.id
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Desktop Table ──────────────────────────────────── */}
          {filteredItems.length > 0 && (
            <motion.div
              className="bg-card border border-border rounded-2xl overflow-hidden hidden sm:block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {t("pages.history.table.name")}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {t("pages.history.table.category")}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {t("pages.history.table.confidence")}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {t("pages.history.table.pages")}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {t("pages.history.table.language")}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {t("pages.history.table.date")}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {t("pages.history.table.cost")}
                      </th>
                      <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                        {t("pages.history.table.time")}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {filteredItems.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        className="hover:bg-secondary/30 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 + index * 0.03 }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-medium text-foreground truncate block max-w-[200px]">
                                {item.filename}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {item.word_count.toLocaleString()} {t("pages.history.table.words")}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              categoryColors[item.category] ?? categoryColors.Uncertain
                            }`}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-secondary rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  item.confidence >= 0.8
                                    ? "bg-green-500"
                                    : item.confidence >= 0.5
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${item.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {(item.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {item.page_count}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground capitalize">
                              {item.primary_language}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground text-sm whitespace-nowrap">
                          {formatDate(item.processed_at)}
                        </td>
                        <td className="p-4 text-muted-foreground text-sm">
                          ${item.total_cost_usd.toFixed(4)}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {item.elapsed_seconds.toFixed(1)}s
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary footer */}
              <div className="border-t border-border px-4 py-3 bg-secondary/20 text-sm text-muted-foreground">
                {t("pages.history.summary")
                  .replace("{count}", filteredItems.length.toString())
                  .replace("{total}", items.length.toString())}
              </div>
            </motion.div>
          )}

          {/* ── Mobile Cards ──────────────────────────────────── */}
          {filteredItems.length > 0 && (
            <div className="sm:hidden space-y-3">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="bg-card border border-border rounded-2xl p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {item.filename}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(item.processed_at)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        categoryColors[item.category] ?? categoryColors.Uncertain
                      }`}
                    >
                      {item.category}
                    </span>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{item.page_count} pg</span>
                      <span>{(item.confidence * 100).toFixed(0)}%</span>
                      <span>${item.total_cost_usd.toFixed(4)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── Empty State ───────────────────────────────────── */}
          {filteredItems.length === 0 && (
            <motion.div
              className="bg-card border border-border rounded-2xl p-12 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("pages.history.empty.title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {items.length === 0
                  ? t("pages.history.empty.noDocsYet")
                  : t("pages.history.empty.subtitle")}
              </p>
              {items.length === 0 ? (
                <Button onClick={() => navigate("/dashboard/studio")}>
                  {t("pages.history.empty.goToStudio")}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                  }}
                >
                  {t("pages.history.empty.clear")}
                </Button>
              )}
            </motion.div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default History;
