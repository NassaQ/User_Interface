import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  FolderOpen,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  fetchHistory,
  moveDocument,
  type HistoryItem,
} from "@/services/documents.service";
import { viewOriginalFile } from "@/services/files.service";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_COLORS: Record<string, string> = {
  Technology: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Finance: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Politics: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Sports: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Culture: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Religion: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  Uncertain: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

const ALL_CATEGORIES = [
  "Technology",
  "Finance",
  "Medical",
  "Politics",
  "Sports",
  "Culture",
  "Religion",
  "Uncertain",
];

const MyFiles = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<number | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchHistory(0, 500);
        if (!cancelled) setItems(data);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const folders = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [items]);

  const folderItems = useMemo(
    () =>
      selectedCategory
        ? items.filter((i) => i.category === selectedCategory)
        : [],
    [items, selectedCategory],
  );

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  async function handleViewOriginal(documentId: string) {
    setViewingId(documentId);
    try {
      await viewOriginalFile(documentId);
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Failed to open file",
        variant: "destructive",
      });
    } finally {
      setViewingId(null);
    }
  }

  async function handleMove(docId: number, newCategory: string) {
    setMovingId(docId);
    try {
      await moveDocument(docId, newCategory);
      setItems((prev) =>
        prev.map((item) =>
          item.doc_id === docId ? { ...item, category: newCategory } : item,
        ),
      );
      if (selectedCategory && selectedCategory !== newCategory) {
        setSelectedCategory(null);
      }
      toast({ title: t("pages.myFiles.move"), description: newCategory });
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Move failed",
        variant: "destructive",
      });
    } finally {
      setMovingId(null);
    }
  }

  const subtitle = selectedCategory
    ? selectedCategory
    : t("pages.myFiles.folderSubtitle");

  return (
    <DashboardLayout
      title={t("pages.myFiles.title")}
      subtitle={subtitle}
    >
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && selectedCategory && (
        <div className="mb-6 animate-fade-in-up animate-on-mount">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => setSelectedCategory(null)}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("pages.myFiles.back")}
          </Button>
        </div>
      )}

      {!loading && !selectedCategory && folders.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-12 text-center animate-fade-in-scale animate-on-mount">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("pages.myFiles.empty")}</h3>
          <p className="text-muted-foreground mb-6">{t("pages.myFiles.emptyHint")}</p>
          <Button onClick={() => navigate("/studio")}>{t("pages.history.empty.goToStudio")}</Button>
        </div>
      )}

      {!loading && !selectedCategory && folders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {folders.map(({ category, count }, index) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className="bg-card border border-border rounded-2xl p-6 text-left hover:border-primary/40 hover:shadow-md transition-all animate-fade-in-up animate-on-mount"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Uncertain
                }`}
              >
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-1">{category}</h3>
              <p className="text-sm text-muted-foreground">
                {t("pages.myFiles.files").replace("{count}", count.toString())}
              </p>
            </button>
          ))}
        </div>
      )}

      {!loading && selectedCategory && (
        <>
          {folderItems.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center animate-fade-in-scale animate-on-mount">
              <p className="text-muted-foreground">{t("pages.myFiles.noFiles")}</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden animate-fade-in-up animate-on-mount">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {t("pages.myFiles.table.name")}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {t("pages.myFiles.table.type")}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {t("pages.myFiles.table.pages")}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {t("pages.myFiles.table.date")}
                      </th>
                      <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                        {t("pages.myFiles.table.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {folderItems.map((item) => (
                      <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-medium truncate max-w-[200px]">
                              {item.filename}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.Uncertain
                            }`}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">{item.page_count}</td>
                        <td className="p-4 text-muted-foreground text-sm whitespace-nowrap">
                          {formatDate(item.processed_at)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1"
                              disabled={viewingId === item.document_id}
                              onClick={() => handleViewOriginal(item.document_id)}
                            >
                              {viewingId === item.document_id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <ExternalLink className="w-4 h-4" />
                              )}
                              <span className="hidden lg:inline">
                                {t("pages.myFiles.viewOriginal")}
                              </span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={movingId === item.doc_id}
                                >
                                  {movingId === item.doc_id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <MoreHorizontal className="w-4 h-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {ALL_CATEGORIES.filter((c) => c !== item.category).map(
                                  (cat) => (
                                    <DropdownMenuItem
                                      key={cat}
                                      onClick={() => handleMove(item.doc_id, cat)}
                                    >
                                      {t("pages.myFiles.moveTo")} {cat}
                                    </DropdownMenuItem>
                                  ),
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default MyFiles;
