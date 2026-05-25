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
  type LucideIcon,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useProcessing } from "@/context/ProcessingContext";
import { getCurrentUser, type User } from "@/services/users.service";
import GlobalSearch from "@/components/GlobalSearch";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const ADMIN_ROLE_ID = 99;

type NavItem = {
  icon: LucideIcon;
  labelKey: string;
  path: string;
};

const mainNavItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    labelKey: "dashboard.layout.nav.dashboard",
    path: "/dashboard",
  },
  { icon: FolderOpen, labelKey: "dashboard.layout.nav.myFiles", path: "/files" },
  { icon: Sparkles, labelKey: "dashboard.layout.nav.studio", path: "/studio" },
  { icon: History, labelKey: "dashboard.layout.nav.history", path: "/history" },
  { icon: Search, labelKey: "dashboard.layout.nav.search", path: "/search" },
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

const adminNavItems: NavItem[] = [
  {
    icon: Users,
    labelKey: "dashboard.layout.nav.users",
    path: "/users",
  },
];

function SidebarNavLink({
  item,
  isActive,
  onNavigate,
  t,
  trailing,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate: () => void;
  t: (key: string) => string;
  trailing?: React.ReactNode;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
        isActive
          ? "border border-primary/20 bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="min-w-0 flex-1 truncate font-medium">{t(item.labelKey)}</span>
      {trailing}
    </Link>
  );
}

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
  const isAdmin = userRole === ADMIN_ROLE_ID;

  useEffect(() => {
    let cancelled = false;
    getAccessToken().then((token) => {
      if (!token || cancelled) return;
      getCurrentUser(token)
        .then((u) => {
          if (!cancelled) setUser(u);
        })
        .catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, [getAccessToken]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const initials = user
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen min-h-[100dvh] bg-secondary/30">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-[min(18rem,85vw)] flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ease-out lg:static lg:z-auto lg:h-screen lg:w-64 lg:translate-x-0 lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label={t("dashboard.layout.brand")}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-border/60 px-5 py-5">
          <Link to="/" className="flex min-w-0 items-center gap-2" onClick={closeSidebar}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="truncate bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-bold text-transparent">
              {t("dashboard.layout.brand")}
            </span>
          </Link>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <SidebarNavLink
                key={item.path}
                item={item}
                isActive={location.pathname === item.path}
                onNavigate={closeSidebar}
                t={t}
                trailing={
                  item.path === "/studio" && isProcessing ? (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse" />
                  ) : undefined
                }
              />
            ))}
          </div>

          {isAdmin && (
            <div className="mt-6 space-y-1 border-t border-border/60 pt-4">
              <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
                {t("dashboard.layout.section.admin")}
              </p>
              {adminNavItems.map((item) => (
                <SidebarNavLink
                  key={item.path}
                  item={item}
                  isActive={location.pathname === item.path}
                  onNavigate={closeSidebar}
                  t={t}
                />
              ))}
            </div>
          )}

          {isProcessing && (
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-primary" />
                <span className="text-xs font-medium text-primary">
                  {t("dashboard.layout.processing.active")}
                </span>
              </div>
              {selectedFile && (
                <p className="mt-1 truncate text-[11px] text-muted-foreground">
                  {selectedFile.name}
                </p>
              )}
            </div>
          )}
        </nav>

        <div className="shrink-0 border-t border-border/60 p-4">
          <Button
            variant="ghost"
            className="h-11 w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={() => {
              closeSidebar();
              logout();
            }}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="truncate">{t("dashboard.layout.actions.signOut")}</span>
          </Button>
        </div>
      </aside>

      <div className="flex min-h-[100dvh] min-w-0 flex-1 flex-col lg:min-h-screen">
        <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
          <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-bold sm:text-2xl">{title}</h1>
                {subtitle && (
                  <p className="truncate text-xs text-muted-foreground sm:text-sm">
                    {subtitle}
                  </p>
                )}
              </div>

              <Link
                to="/search"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
                aria-label={t("dashboard.layout.nav.search")}
              >
                <Search className="h-5 w-5" />
              </Link>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <ThemeToggle />
                <LanguageToggle />
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
                  {initials || "?"}
                </div>
              </div>
            </div>

            <div className="hidden w-full md:block">
              <GlobalSearch />
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 animate-fade-in animate-on-mount">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
