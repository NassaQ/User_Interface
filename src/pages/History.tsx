// ================================
// 🌍 TRANSLATION: History Page
// Namespace: pages.history.*
// ================================

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  FileText,
  Sparkles,
  MoreHorizontal,
  Calendar,
  ChevronDown,
  Download,
  Trash2,
  Eye,
  FolderOpen,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const History = () => {
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", labelKey: "pages.history.filters.all" },
    { id: "documents", labelKey: "pages.history.filters.documents" },
    { id: "ai", labelKey: "pages.history.filters.ai" },
    { id: "archived", labelKey: "pages.history.filters.archived" },
  ];

  const historyItems = [
    {
      id: 1,
      name: "Q4 Financial Report Analysis",
      typeKey: "pages.history.type.ai",
      date: "Dec 28, 2024",
      size: "2.4 MB",
      status: "completed",
    },
    {
      id: 2,
      name: "Marketing Campaign Strategy",
      typeKey: "pages.history.type.document",
      date: "Dec 27, 2024",
      size: "1.8 MB",
      status: "completed",
    },
    {
      id: 3,
      name: "Customer Feedback Summary",
      typeKey: "pages.history.type.ai",
      date: "Dec 26, 2024",
      size: "856 KB",
      status: "completed",
    },
    {
      id: 4,
      name: "Product Roadmap 2025",
      typeKey: "pages.history.type.document",
      date: "Dec 25, 2024",
      size: "3.2 MB",
      status: "completed",
    },
    {
      id: 5,
      name: "Competitive Analysis Report",
      typeKey: "pages.history.type.ai",
      date: "Dec 24, 2024",
      size: "1.1 MB",
      status: "completed",
    },
    {
      id: 6,
      name: "Team Performance Review",
      typeKey: "pages.history.type.document",
      date: "Dec 23, 2024",
      size: "945 KB",
      status: "archived",
    },
  ];

  const filteredItems = historyItems.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "documents")
      return item.typeKey === "pages.history.type.document";
    if (activeFilter === "ai") return item.typeKey === "pages.history.type.ai";
    if (activeFilter === "archived") return item.status === "archived";
    return true;
  });

  return (
    <DashboardLayout
      title={t("pages.history.title")}
      subtitle={t("pages.history.subtitle")}
    >
      {/* ================================
          🌍 TRANSLATION: Search & Filters
         ================================ */}
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

          {/* Filters */}
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t("pages.history.filters.date")}
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t("pages.history.filters.more")}
              </span>
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
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
              {t(filter.labelKey)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ================================
          🌍 TRANSLATION: Desktop Table
         ================================ */}
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
                  {t("pages.history.table.type")}
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  {t("pages.history.table.date")}
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  {t("pages.history.table.size")}
                </th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                  {t("pages.history.table.actions")}
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
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        {item.typeKey === "pages.history.type.ai" ? (
                          <Sparkles className="w-5 h-5 text-primary" />
                        ) : (
                          <FileText className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <span className="font-medium text-foreground">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.typeKey === "pages.history.type.ai"
                          ? "bg-accent/10 text-accent"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {t(item.typeKey)}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{item.date}</td>
                  <td className="p-4 text-muted-foreground">{item.size}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ================================
          🌍 TRANSLATION: Mobile Cards
         ================================ */}
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  {item.typeKey === "pages.history.type.ai" ? (
                    <Sparkles className="w-5 h-5 text-primary" />
                  ) : (
                    <FileText className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                  item.typeKey === "pages.history.type.ai"
                    ? "bg-accent/10 text-accent"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {t(item.typeKey)}
              </span>
              <span className="text-sm text-muted-foreground">{item.size}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================================
          🌍 TRANSLATION: Empty State
         ================================ */}
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
            {t("pages.history.empty.subtitle")}
          </p>
          <Button variant="outline">{t("pages.history.empty.clear")}</Button>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default History;
