// ================================
// Search & Chat — RAG frontend
// Namespace: pages.search.*
// ================================

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search as SearchIcon,
  MessageSquare,
  Send,
  Database,
  FileText,
  Loader2,
  Trash2,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Globe,
  Tag,
  Hash,
  DollarSign,
  Zap,
  AlertCircle,
  Bot,
  User,
  ExternalLink,
} from "lucide-react";
import {
  ragSearch,
  ragAsk,
  ragListDocuments,
  ragRemoveDocument,
  ragStats,
  type SearchResponse,
  type AskResponse,
  type SearchResultItem,
  type DocumentInfo,
  type StoreStats,
} from "@/services/rag.service";
import { useLanguage } from "@/context/LanguageContext";
import { viewOriginalFile } from "@/services/files.service";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SearchResultItem[];
  tokens_used?: number;
  cost_usd?: number;
  timestamp: Date;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORY_COLORS: Record<string, string> = {
  Culture:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Finance:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Medical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Politics:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Religion:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Sports:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Technology:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

/* ------------------------------------------------------------------ */
/*  Helper: Source card                                                */
/* ------------------------------------------------------------------ */

function SourceCard({
  source,
  index,
  t,
}: {
  source: SearchResultItem;
  index: number;
  t: (key: string) => string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [viewingFile, setViewingFile] = useState(false);
  const displayText = source.text_original || source.text;
  const truncated = displayText.length > 200;

  const handleViewOriginal = async () => {
    if (!source.document_id || viewingFile) return;
    setViewingFile(true);
    try {
      await viewOriginalFile(source.document_id);
    } catch {
      // silent — file may not exist for older documents
    } finally {
      setViewingFile(false);
    }
  };

  return (
    <div
      className="border border-border rounded-lg p-3 bg-card/50 hover:bg-card transition-colors animate-fade-in-up animate-on-mount"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-sm font-medium truncate">
            {source.source_file || t("pages.search.sources.unknownFile")}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {source.classification &&
            source.classification !== "" && (
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] px-1.5 py-0",
                  CATEGORY_COLORS[source.classification] ?? "",
                )}
              >
                {source.classification}
              </Badge>
            )}
          {source.rerank_score > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {(source.rerank_score * 100).toFixed(0)}%
            </Badge>
          )}
          {source.document_id && (
            <button
              onClick={handleViewOriginal}
              disabled={viewingFile}
              className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
              title={t("pages.search.sources.viewOriginal")}
            >
              {viewingFile ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ExternalLink className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Metadata pills */}
      <div className="flex flex-wrap gap-1.5 mb-2 text-[11px] text-muted-foreground">
        {source.page_number > 0 && (
          <span className="flex items-center gap-0.5">
            <Hash className="w-3 h-3" />
            {t("pages.search.sources.page")} {source.page_number}
          </span>
        )}
        {source.language && (
          <span className="flex items-center gap-0.5">
            <Globe className="w-3 h-3" />
            {source.language.toUpperCase()}
          </span>
        )}
        {source.faiss_score > 0 && (
          <span className="flex items-center gap-0.5">
            <Zap className="w-3 h-3" />
            cos {source.faiss_score.toFixed(2)}
          </span>
        )}
      </div>

      {/* Text preview */}
      <p
        className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap break-words"
        dir="auto"
      >
        {expanded || !truncated
          ? displayText
          : displayText.slice(0, 200) + "..."}
      </p>
      {truncated && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-primary mt-1 hover:underline"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              {t("pages.search.sources.showLess")}
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              {t("pages.search.sources.showMore")}
            </>
          )}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const Search = () => {
  const { t } = useLanguage();

  // ── Chat state ────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Search state ──────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null,
  );
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // ── Knowledge base state ──────────────────────────────────────
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [kbLoading, setKbLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // ── Shared filters ────────────────────────────────────────────
  const [filterClassification, setFilterClassification] = useState<
    string | null
  >(null);
  const [filterLanguage, setFilterLanguage] = useState<string | null>(null);
  const [filterDocumentId, setFilterDocumentId] = useState<string | null>(null);

  // ── Active tab ────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("chat");

  // ── Read incoming query from Dashboard navigation ─────────────
  const location = useLocation();
  const hasConsumedState = useRef(false);

  // ── Auto-scroll chat ──────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  // ── Load knowledge base ───────────────────────────────────────
  const loadKnowledgeBase = useCallback(async () => {
    setKbLoading(true);
    try {
      const [docs, st] = await Promise.all([ragListDocuments(), ragStats()]);
      setDocuments(docs);
      setStats(st);
    } catch {
      // silent — stats area will show zeroes
    } finally {
      setKbLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKnowledgeBase();
  }, [loadKnowledgeBase]);

  // ── Chat: send message ────────────────────────────────────────
  const handleChatSend = async () => {
    const query = chatInput.trim();
    if (!query || chatLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const resp: AskResponse = await ragAsk({
        query,
        top_k: 5,
        filter_classification: filterClassification,
        filter_language: filterLanguage,
        filter_document_id: filterDocumentId,
      });
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: resp.answer,
        sources: resp.sources,
        tokens_used: resp.tokens_used,
        cost_usd: resp.cost_usd,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          err instanceof Error
            ? err.message
            : t("pages.search.chat.errorGeneric"),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // ── Search: execute ───────────────────────────────────────────
  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query || searchLoading) return;

    setSearchLoading(true);
    setSearchError(null);
    setSearchResults(null);

    try {
      const resp = await ragSearch({
        query,
        top_k: 10,
        filter_classification: filterClassification,
        filter_language: filterLanguage,
        filter_document_id: filterDocumentId,
      });
      setSearchResults(resp);
    } catch (err) {
      setSearchError(
        err instanceof Error
          ? err.message
          : t("pages.search.search.errorGeneric"),
      );
    } finally {
      setSearchLoading(false);
    }
  };

  // ── Auto-search when navigated from Dashboard with a query ────
  useEffect(() => {
    const state = location.state as { query?: string } | null;
    if (state?.query && !hasConsumedState.current) {
      hasConsumedState.current = true;
      setSearchQuery(state.query);
      setActiveTab("search");
      // Trigger search in next tick after state updates
      setTimeout(async () => {
        setSearchLoading(true);
        setSearchError(null);
        setSearchResults(null);
        try {
          const resp = await ragSearch({ query: state.query!, top_k: 10 });
          setSearchResults(resp);
        } catch (err) {
          setSearchError(
            err instanceof Error ? err.message : "Search failed",
          );
        } finally {
          setSearchLoading(false);
        }
      }, 0);
    }
  }, [location.state]);

  // ── Remove document ───────────────────────────────────────────
  const handleRemoveDocument = async (docId: string) => {
    setRemovingId(docId);
    try {
      await ragRemoveDocument(docId);
      await loadKnowledgeBase();
    } catch {
      // silent
    } finally {
      setRemovingId(null);
    }
  };

  // ── Unique classifications / languages from documents ─────────
  const classifications = Array.from(
    new Set(documents.map((d) => d.classification).filter(Boolean)),
  );
  const languages = Array.from(
    new Set(documents.map((d) => d.language).filter(Boolean)),
  );

  // ── Render ────────────────────────────────────────────────────
  return (
    <DashboardLayout
      title={t("pages.search.title")}
      subtitle={t("pages.search.subtitle")}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── Stats overview row ──────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: Database,
              label: t("pages.search.stats.totalVectors"),
              value: stats?.total_vectors ?? 0,
            },
            {
              icon: FileText,
              label: t("pages.search.stats.totalDocuments"),
              value: stats?.total_documents ?? 0,
            },
            {
              icon: MessageSquare,
              label: t("pages.search.stats.conversations"),
              value: messages.filter((m) => m.role === "user").length,
            },
            {
              icon: Sparkles,
              label: t("pages.search.stats.sources"),
              value: messages.reduce(
                (acc, m) => acc + (m.sources?.length ?? 0),
                0,
              ),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 animate-fade-in-up animate-on-mount"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters row ─────────────────────────────────────── */}
        {(classifications.length > 0 || languages.length > 0 || documents.length > 0) && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {t("pages.search.filters.label")}
            </span>

            {documents.length > 0 && (
              <Select
                value={filterDocumentId ?? "__all__"}
                onValueChange={(v) =>
                  setFilterDocumentId(v === "__all__" ? null : v)
                }
              >
                <SelectTrigger className="w-[200px] h-9 text-sm">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue
                    placeholder={t("pages.search.filters.allDocuments")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">
                    {t("pages.search.filters.allDocuments")}
                  </SelectItem>
                  {documents.map((doc) => (
                    <SelectItem key={doc.document_id} value={doc.document_id}>
                      {doc.source_file || doc.document_id.slice(0, 12) + "..."}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {classifications.length > 0 && (
              <Select
                value={filterClassification ?? "__all__"}
                onValueChange={(v) =>
                  setFilterClassification(v === "__all__" ? null : v)
                }
              >
                <SelectTrigger className="w-[160px] h-9 text-sm">
                  <Tag className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue
                    placeholder={t("pages.search.filters.allCategories")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">
                    {t("pages.search.filters.allCategories")}
                  </SelectItem>
                  {classifications.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {languages.length > 0 && (
              <Select
                value={filterLanguage ?? "__all__"}
                onValueChange={(v) =>
                  setFilterLanguage(v === "__all__" ? null : v)
                }
              >
                <SelectTrigger className="w-[140px] h-9 text-sm">
                  <Globe className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue
                    placeholder={t("pages.search.filters.allLanguages")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">
                    {t("pages.search.filters.allLanguages")}
                  </SelectItem>
                  {languages.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* ── Tabs: Chat / Search / Knowledge Base ────────────── */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t("pages.search.tabs.chat")}
              </span>
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-2">
              <SearchIcon className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t("pages.search.tabs.search")}
              </span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t("pages.search.tabs.knowledge")}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* ══════════════════════════════════════════════════════
              TAB 1: CHAT (RAG Ask)
             ══════════════════════════════════════════════════════ */}
          <TabsContent value="chat" className="mt-0">
            <div className="border border-border rounded-xl bg-card overflow-hidden flex flex-col h-[60vh]">
              {/* Chat messages area */}
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <Bot className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("pages.search.chat.emptyTitle")}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {t("pages.search.chat.emptyDescription")}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-6 justify-center">
                      {[
                        t("pages.search.chat.suggestion1"),
                        t("pages.search.chat.suggestion2"),
                        t("pages.search.chat.suggestion3"),
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setChatInput(suggestion);
                          }}
                          className="text-sm px-3 py-1.5 rounded-full border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <>
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex gap-3 animate-fade-in-up animate-on-mount",
                            msg.role === "user"
                              ? "justify-end"
                              : "justify-start",
                          )}
                        >
                          {msg.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                              <Bot className="w-4 h-4 text-primary" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "max-w-[80%] rounded-2xl px-4 py-3 space-y-3",
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary",
                            )}
                          >
                            <p
                              className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                              dir="auto"
                            >
                              {msg.content}
                            </p>

                            {/* Sources accordion */}
                            {msg.sources && msg.sources.length > 0 && (
                              <SourcesAccordion
                                sources={msg.sources}
                                t={t}
                                tokensUsed={msg.tokens_used}
                                costUsd={msg.cost_usd}
                              />
                            )}
                          </div>
                          {msg.role === "user" && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1">
                              <User className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </>

                    {/* Typing indicator */}
                    {chatLoading && (
                      <div className="flex gap-3 animate-fade-in-up animate-on-mount">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-secondary rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Chat input */}
              <div className="border-t border-border p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleChatSend();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={t("pages.search.chat.placeholder")}
                    disabled={chatLoading}
                    className="flex-1"
                    dir="auto"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!chatInput.trim() || chatLoading}
                  >
                    {chatLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════
              TAB 2: SEMANTIC SEARCH
             ══════════════════════════════════════════════════════ */}
          <TabsContent value="search" className="mt-0 space-y-4">
            {/* Search bar */}
            <div className="flex gap-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="flex gap-2 w-full"
              >
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("pages.search.search.placeholder")}
                    className="pl-9"
                    dir="auto"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!searchQuery.trim() || searchLoading}
                >
                  {searchLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <SearchIcon className="w-4 h-4 mr-2" />
                  )}
                  {t("pages.search.search.button")}
                </Button>
              </form>
            </div>

            {/* Search error */}
            {searchError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-fade-in animate-on-mount">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {searchError}
              </div>
            )}

            {/* Search results */}
            {searchResults && (
              <div className="space-y-3 animate-fade-in animate-on-mount">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t("pages.search.search.resultsCount").replace(
                      "{count}",
                      String(searchResults.total_results),
                    )}
                  </p>
                </div>
                <div className="space-y-3">
                  {searchResults.results.map((result, idx) => (
                    <SourceCard key={idx} source={result} index={idx} t={t} />
                  ))}
                </div>
                {searchResults.total_results === 0 && (
                  <div className="text-center py-12">
                    <SearchIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {t("pages.search.search.noResults")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {!searchResults && !searchLoading && !searchError && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("pages.search.search.emptyTitle")}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {t("pages.search.search.emptyDescription")}
                </p>
              </div>
            )}
          </TabsContent>

          {/* ══════════════════════════════════════════════════════
              TAB 3: KNOWLEDGE BASE
             ══════════════════════════════════════════════════════ */}
          <TabsContent value="knowledge" className="mt-0 space-y-4">
            {kbLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("pages.search.knowledge.emptyTitle")}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {t("pages.search.knowledge.emptyDescription")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.document_id}
                    className="border border-border rounded-xl p-4 bg-card flex items-center justify-between gap-4 animate-fade-in-up animate-on-mount"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {doc.source_file ||
                            doc.document_id.slice(0, 12) + "..."}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {doc.chunks_count}{" "}
                            {t("pages.search.knowledge.chunks")}
                          </span>
                          {doc.classification && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-[10px] px-1.5 py-0",
                                CATEGORY_COLORS[doc.classification] ?? "",
                              )}
                            >
                              {doc.classification}
                            </Badge>
                          )}
                          {doc.language && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {doc.language.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={async () => {
                          try {
                            await viewOriginalFile(doc.document_id);
                          } catch {
                            // file may not exist for older documents
                          }
                        }}
                        className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                        title={t("pages.search.sources.viewOriginal")}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        disabled={removingId === doc.document_id}
                        onClick={() => handleRemoveDocument(doc.document_id)}
                      >
                        {removingId === doc.document_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

/* ------------------------------------------------------------------ */
/*  Sources accordion (inside chat bubbles)                            */
/* ------------------------------------------------------------------ */

function SourcesAccordion({
  sources,
  t,
  tokensUsed,
  costUsd,
}: {
  sources: SearchResultItem[];
  t: (key: string) => string;
  tokensUsed?: number;
  costUsd?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-foreground/10 pt-2 mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs opacity-70 hover:opacity-100 transition-opacity"
      >
        <BookOpen className="w-3 h-3" />
        {sources.length} {t("pages.search.chat.sourcesLabel")}
        {tokensUsed != null && (
          <span className="ml-2 flex items-center gap-0.5">
            <Zap className="w-3 h-3" />
            {tokensUsed} tokens
          </span>
        )}
        {costUsd != null && costUsd > 0 && (
          <span className="ml-1 flex items-center gap-0.5">
            <DollarSign className="w-3 h-3" />${costUsd.toFixed(6)}
          </span>
        )}
        {open ? (
          <ChevronUp className="w-3 h-3 ml-auto" />
        ) : (
          <ChevronDown className="w-3 h-3 ml-auto" />
        )}
      </button>
      
        {open && (
          <div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-2">
              {sources.map((src, idx) => (
                <SourceCard key={idx} source={src} index={idx} t={t} />
              ))}
            </div>
          </div>
        )}
      
    </div>
  );
}

export default Search;
