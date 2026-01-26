// ================================
// 🌍 TRANSLATION: DashboardLayout
// Namespace: dashboard.layout.*
// ================================

import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Sparkles,
  History,
  User,
  Settings,
  HelpCircle,
  CreditCard,
  LogOut,
  Zap,
  Menu,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

// ================================
// 🌍 TRANSLATION: DashboardLayout
// Namespace: dashboard.layout.nav.*
// ================================
const navItems = [
  {
    icon: LayoutDashboard,
    labelKey: "dashboard.layout.nav.dashboard",
    path: "/dashboard",
  },
  { icon: Sparkles, labelKey: "dashboard.layout.nav.studio", path: "/studio" },
  { icon: History, labelKey: "dashboard.layout.nav.history", path: "/history" },
  { icon: User, labelKey: "dashboard.layout.nav.profile", path: "/profile" },
  {
    icon: Settings,
    labelKey: "dashboard.layout.nav.settings",
    path: "/settings",
  },
  {
    icon: CreditCard,
    labelKey: "dashboard.layout.nav.billing",
    path: "/billing",
  },
  { icon: HelpCircle, labelKey: "dashboard.layout.nav.help", path: "/support" },
];

const DashboardLayout = ({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-card border-r border-border
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>

            {/* ================================
                🌍 TRANSLATION: Brand
                Key: dashboard.layout.brand
               ================================ */}
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("dashboard.layout.brand")}
            </span>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.labelKey}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <Link to="/login">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-5 h-5" />

                {/* ================================
                    🌍 TRANSLATION: Actions
                    Key: dashboard.layout.actions.signOut
                   ================================ */}
                <span>{t("dashboard.layout.actions.signOut")}</span>
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-4 sm:px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* title و subtitle جايين مترجمين من الصفحات */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <LanguageToggle />
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <motion.main
          className="flex-1 p-4 sm:p-6 overflow-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;
