// ================================
// Dashboard Page — real stats from /api/v1/documents/stats
// Falls back to zeros when no data / API unreachable
// ================================

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  FileText,
  TrendingUp,
  BarChart3,
  Activity,
  ArrowUpRight,
  Clock,
  Sparkles,
  MoreHorizontal,
  Loader2,
  Globe,
  DollarSign,
  Search,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  fetchStats,
  fetchHistory,
  type StatsResponse,
  type HistoryItem,
} from "@/services/documents.service";
import { ragSearch, type SearchResultItem } from "@/services/rag.service";

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [recentItems, setRecentItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Smart Search state ──────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { source_file: string; classification: string; score: number; snippet: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [statsData, historyData] = await Promise.all([
          fetchStats().catch(() => null),
          fetchHistory(0, 5).catch(() => [] as HistoryItem[]),
        ]);
        if (cancelled) return;
        setStats(statsData);
        setRecentItems(historyData);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Smart Search handler ────────────────────────────────────────────
  const handleSearch = useCallback(async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);
    setHasSearched(true);

    try {
      // Request extra chunks so we can group by file and still get 3 unique files
      const resp = await ragSearch({ query: q, top_k: 10 });

      // Group by document_id, keep best rerank_score per file
      const fileMap = new Map<
        string,
        { source_file: string; classification: string; score: number; snippet: string }
      >();

      for (const item of resp.results) {
        const existing = fileMap.get(item.document_id);
        if (!existing || item.rerank_score > existing.score) {
          fileMap.set(item.document_id, {
            source_file: item.source_file,
            classification: item.classification,
            score: item.rerank_score,
            snippet:
              (item.text_original || item.text).slice(0, 180) +
              ((item.text_original || item.text).length > 180 ? "..." : ""),
          });
        }
      }

      // Sort by score descending, take top 3
      const top3 = Array.from(fileMap.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setSearchResults(top3);
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : "Search failed",
      );
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // ── Derived stat cards ──────────────────────────────────────────────
  const statCards = [
    {
      labelKey: "pages.dashboard.stats.documents",
      value: stats?.total_documents?.toLocaleString() ?? "0",
      sub: `${stats?.total_pages?.toLocaleString() ?? "0"} ${t("pages.dashboard.stats.pages")}`,
      icon: FileText,
    },
    {
      labelKey: "pages.dashboard.stats.words",
      value: stats?.total_words?.toLocaleString() ?? "0",
      sub: `${t("pages.dashboard.stats.avgTime")} ${stats ? stats.avg_processing_time.toFixed(1) : "0"}s`,
      icon: Activity,
    },
    {
      labelKey: "pages.dashboard.stats.confidence",
      value: stats ? `${(stats.avg_confidence * 100).toFixed(1)}%` : "0%",
      sub: t("pages.dashboard.stats.avgOcr"),
      icon: TrendingUp,
    },
    {
      labelKey: "pages.dashboard.stats.cost",
      value: stats ? `$${stats.total_cost_usd.toFixed(4)}` : "$0.00",
      sub: t("pages.dashboard.stats.totalSpent"),
      icon: DollarSign,
    },
  ];

  // ── Category distribution for mini chart ────────────────────────────
  const categoryEntries = stats?.categories
    ? Object.entries(stats.categories).sort(([, a], [, b]) => b - a)
    : [];

  const languageEntries = stats?.languages
    ? Object.entries(stats.languages).sort(([, a], [, b]) => b - a)
    : [];

  // ── Quick actions ──────────────────────────────────────────────────
  const quickActions = [
    {
      labelKey: "pages.dashboard.actions.newDoc",
      icon: FileText,
      color: "from-primary to-accent",
      onClick: () => navigate("/studio"),
    },
    {
      labelKey: "pages.dashboard.actions.aiGenerate",
      icon: Sparkles,
      color: "from-accent to-primary",
      onClick: () => navigate("/studio"),
    },
    {
      labelKey: "pages.dashboard.actions.history",
      icon: Clock,
      color: "from-primary/80 to-accent/80",
      onClick: () => navigate("/history"),
    },
  ];

  // ── Helper: format relative time ───────────────────────────────────
  function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return t("pages.dashboard.time.justNow");
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  // Category color helper
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

  return (
    <DashboardLayout
      title={t("pages.dashboard.title")}
      subtitle={t("pages.dashboard.subtitle")}
    >
      {/* ── Loading skeleton ──────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && (
        <>
          {/* ── Stat Cards ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-card border border-border rounded-2xl p-5 sm:p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  {stats && stats.total_documents > 0 && (
                    <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                      <ArrowUpRight className="w-4 h-4" />
                      {t("pages.dashboard.stats.live")}
                    </span>
                  )}
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{t(stat.labelKey)}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{stat.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Smart Search ───────────────────────────────────────── */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Search className="w-4.5 h-4.5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    {t("pages.dashboard.search.title")}
                  </h2>
                </div>
              </div>

              {/* Search input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="flex gap-3 mb-1"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("pages.dashboard.search.placeholder")}
                  className="flex-1 h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  dir="auto"
                />
                <Button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="h-11 px-5 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  {isSearching
                    ? t("pages.dashboard.search.searching")
                    : t("pages.dashboard.search.button")}
                </Button>
              </form>

              {/* Search error */}
              {searchError && (
                <div className="mt-4 flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-red-700 dark:text-red-400">
                      {t("pages.dashboard.search.error")}
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
                      {searchError}
                    </p>
                  </div>
                </div>
              )}

              {/* Search results — top 3 files */}
              {hasSearched && !isSearching && !searchError && (
                <>
                  {searchResults.length === 0 ? (
                    <div className="mt-4 py-6 text-center text-muted-foreground">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="font-medium text-sm">
                        {t("pages.dashboard.search.noResults")}
                      </p>
                      <p className="text-xs mt-1">
                        {t("pages.dashboard.search.noResultsHint")}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {searchResults.map((file, idx) => {
                        const pct = Math.round(file.score * 100);
                        return (
                          <motion.div
                            key={idx}
                            className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl border border-border hover:border-primary/30 transition-all"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.08 }}
                          >
                            {/* Rank badge */}
                            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">
                                {idx + 1}
                              </span>
                            </div>

                            {/* File info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                                <p className="font-medium text-sm text-foreground truncate">
                                  {file.source_file}
                                </p>
                                {file.classification && (
                                  <span
                                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                      categoryColors[file.classification] ??
                                      categoryColors.Uncertain
                                    }`}
                                  >
                                    {file.classification}
                                  </span>
                                )}
                              </div>
                              <p
                                className="text-xs text-muted-foreground line-clamp-2 leading-relaxed"
                                dir="auto"
                              >
                                {file.snippet}
                              </p>
                            </div>

                            {/* Score */}
                            <div className="flex-shrink-0 text-right">
                              <p className="text-xl font-bold text-primary">
                                {pct}%
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {t("pages.dashboard.search.relevance")}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Link to full Search & Chat page */}
                      <div className="text-center pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary"
                          onClick={() =>
                            navigate("/search", {
                              state: { query: searchQuery },
                            })
                          }
                        >
                          {t("pages.dashboard.search.viewAll")}
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* ── Quick Actions ──────────────────────────────────────── */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold mb-4">
              {t("pages.dashboard.quickActions")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="group flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <action.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="font-medium text-foreground">
                    {t(action.labelKey)}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Category & Language Distribution ───────────────────── */}
          {(categoryEntries.length > 0 || languageEntries.length > 0) && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              {/* Categories */}
              {categoryEntries.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">{t("pages.dashboard.categories")}</h3>
                  </div>
                  <div className="space-y-3">
                    {categoryEntries.map(([cat, count]) => {
                      const total = stats!.total_documents;
                      const pct = total > 0 ? (count / total) * 100 : 0;
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-sm mb-1">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[cat] ?? categoryColors.Uncertain}`}
                            >
                              {cat}
                            </span>
                            <span className="text-muted-foreground">
                              {count} ({pct.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Languages */}
              {languageEntries.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">{t("pages.dashboard.languages")}</h3>
                  </div>
                  <div className="space-y-3">
                    {languageEntries.map(([lang, count]) => {
                      const total = stats!.total_documents;
                      const pct = total > 0 ? (count / total) * 100 : 0;
                      return (
                        <div key={lang}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium capitalize">{lang}</span>
                            <span className="text-muted-foreground">
                              {count} ({pct.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-accent rounded-full h-2 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Recent Activity ────────────────────────────────────── */}
          <motion.div
            className="bg-card border border-border rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border">
              <h2 className="text-lg font-semibold">
                {t("pages.dashboard.recentActivity")}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => navigate("/history")}
              >
                {t("pages.dashboard.viewAll")}
              </Button>
            </div>

            {recentItems.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">{t("pages.dashboard.noActivity")}</p>
                <p className="text-sm mt-1">{t("pages.dashboard.noActivityHint")}</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center justify-between p-4 sm:p-5 hover:bg-secondary/30 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {item.filename}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.page_count} {t("pages.dashboard.stats.pages")} &middot;{" "}
                          {item.word_count.toLocaleString()} {t("pages.dashboard.stats.wordsLabel")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            categoryColors[item.category] ?? categoryColors.Uncertain
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {relativeTime(item.processed_at)}
                      </span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
