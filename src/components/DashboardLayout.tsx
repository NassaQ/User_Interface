// ================================
// 🌍 TRANSLATION: DashboardLayout
// Namespace: dashboard.layout.*
// ================================

import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Sparkles,
  History,
  Search,
  User,
  Users,
  Settings,
  HelpCircle,
  CreditCard,
  LogOut,
  Zap,
  Menu,
  Loader2,
  FolderOpen,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useProcessing } from "@/context/ProcessingContext";
import { getCurrentUser, type User } from "@/services/users.service";
import GlobalSearch from "@/components/GlobalSearch";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

// ================================
// 🌍 TRANSLATION: DashboardLayout
// Namespace: dashboard.layout.nav.*
// ================================
const ADMIN_ROLE_ID = 99;

const mainNavItems = [
  {
    icon: LayoutDashboard,
    labelKey: "dashboard.layout.nav.dashboard",
    path: "/dashboard",
  },
  { icon: FolderOpen, labelKey: "dashboard.layout.nav.myFiles", path: "/files" },
  { icon: Sparkles, labelKey: "dashboard.layout.nav.studio", path: "/studio" },
  { icon: History, labelKey: "dashboard.layout.nav.history", path: "/history" },
  { icon: Search, labelKey: "dashboard.layout.nav.search", path: "/search" },
  { icon: Users, labelKey: "dashboard.layout.nav.users", path: "/users", adminOnly: true },
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

const adminNavItems = [
  {
    icon: Users,
    labelKey: "dashboard.layout.nav.users",
    path: "/users",
    adminOnly: true,
  },
];

const DashboardLayout = ({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();
  const { getAccessToken, logout, userRole } = useAuth();
  const { isProcessing, selectedFile } = useProcessing();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAccessToken().then((token) => {
      if (!token || cancelled) return;
      getCurrentUser(token).then((u) => { if (!cancelled) setUser(u); }).catch(() => {});
    });
    return () => { cancelled = true; };
  }, [getAccessToken]);

  const initials = user
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

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
        w-64 h-screen bg-card border-r border-border
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-6 h-full flex flex-col">
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

          <nav className="space-y-1 flex-1 overflow-y-auto">
            {mainNavItems.map((item) => {
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
                  {item.path === "/studio" && isProcessing && (
                    <span className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}

            {userRole === ADMIN_ROLE_ID && (
              <div className="mt-6 pt-4 border-t border-border/60 space-y-1">
                <p className="px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
                  {t("dashboard.layout.section.admin")}
                </p>

                {adminNavItems.map((item) => {
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
              </div>
            )}
          </nav>

          {/* Background processing indicator */}
          {isProcessing && (
            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-primary animate-spin flex-shrink-0" />
                <span className="text-xs font-medium text-primary">
                  {t("dashboard.layout.processing.active")}
                </span>
              </div>
              {selectedFile && (
                <p className="text-[11px] text-muted-foreground mt-1 truncate">
                  {selectedFile.name}
                </p>
              )}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border/60">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={logout}
            >
              <LogOut className="w-5 h-5" />
              <span>{t("dashboard.layout.actions.signOut")}</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-4 sm:px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden flex-shrink-0"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* title و subtitle جايين مترجمين من الصفحات */}
              <div className="hidden sm:block min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* 🌍 Global Semantic Search */}
            <GlobalSearch />

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <ThemeToggle />
              <LanguageToggle />
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto animate-fade-in animate-on-mount">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
