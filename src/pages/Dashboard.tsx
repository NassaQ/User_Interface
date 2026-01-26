// ================================
// 🌍 TRANSLATION: Dashboard Page
// Namespace: pages.dashboard.*
// ================================

import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  FileText,
  TrendingUp,
  Users,
  Activity,
  ArrowUpRight,
  Clock,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Dashboard = () => {
  const { t } = useLanguage();

  const stats = [
    {
      labelKey: "pages.dashboard.stats.documents",
      value: "1,247",
      change: "+12%",
      icon: FileText,
    },
    {
      labelKey: "pages.dashboard.stats.aiRequests",
      value: "8,432",
      change: "+23%",
      icon: Activity,
    },
    {
      labelKey: "pages.dashboard.stats.team",
      value: "24",
      change: "+2",
      icon: Users,
    },
    {
      labelKey: "pages.dashboard.stats.processing",
      value: "98.5%",
      change: "+0.8%",
      icon: TrendingUp,
    },
  ];

  const recentActivity = [
    {
      name: "Marketing Analysis Report",
      typeKey: "pages.dashboard.activity.type.document",
      timeKey: "pages.dashboard.time.2min",
      statusKey: "pages.dashboard.status.completed",
    },
    {
      name: "Q4 Financial Summary",
      typeKey: "pages.dashboard.activity.type.ai",
      timeKey: "pages.dashboard.time.15min",
      statusKey: "pages.dashboard.status.completed",
    },
    {
      name: "Customer Insights Draft",
      typeKey: "pages.dashboard.activity.type.document",
      timeKey: "pages.dashboard.time.1hour",
      statusKey: "pages.dashboard.status.processing",
    },
    {
      name: "Product Roadmap 2025",
      typeKey: "pages.dashboard.activity.type.ai",
      timeKey: "pages.dashboard.time.3hours",
      statusKey: "pages.dashboard.status.completed",
    },
    {
      name: "Team Performance Report",
      typeKey: "pages.dashboard.activity.type.document",
      timeKey: "pages.dashboard.time.yesterday",
      statusKey: "pages.dashboard.status.completed",
    },
  ];

  const quickActions = [
    {
      labelKey: "pages.dashboard.actions.newDoc",
      icon: FileText,
      color: "from-primary to-accent",
    },
    {
      labelKey: "pages.dashboard.actions.aiGenerate",
      icon: Sparkles,
      color: "from-accent to-primary",
    },
    {
      labelKey: "pages.dashboard.actions.history",
      icon: Clock,
      color: "from-primary/80 to-accent/80",
    },
  ];

  return (
    <DashboardLayout
      title={t("pages.dashboard.title")}
      subtitle={t("pages.dashboard.subtitle")}
    >
      {/* ================================
          🌍 TRANSLATION: Stats
         ================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
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
              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <ArrowUpRight className="w-4 h-4" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{t(stat.labelKey)}</p>
          </motion.div>
        ))}
      </div>

      {/* ================================
          🌍 TRANSLATION: Quick Actions
         ================================ */}
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

      {/* ================================
          🌍 TRANSLATION: Recent Activity
         ================================ */}
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
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            {t("pages.dashboard.viewAll")}
          </Button>
        </div>

        <div className="divide-y divide-border">
          {recentActivity.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-4 sm:p-5 hover:bg-secondary/30 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.typeKey === "pages.dashboard.activity.type.ai" ? (
                    <Sparkles className="w-5 h-5 text-primary" />
                  ) : (
                    <FileText className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(item.typeKey)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.statusKey === "pages.dashboard.status.completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}
                  >
                    {t(item.statusKey)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {t(item.timeKey)}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
