// ================================
// 🌍 TRANSLATION: Navbar Component
// Namespace: navbar.*
// ================================

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ================================
  // 🌍 TRANSLATION: Nav Links
  // Namespace: navbar.links.*
  // ================================
  const navLinks = [
    { key: "navbar.links.home", path: "/" },
    { key: "navbar.links.about", path: "/about" },
    { key: "navbar.links.pricing", path: "/pricing" },
    { key: "navbar.links.contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="animate-slide-in-left animate-on-mount">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl lg:text-2xl font-bold"
            >
              <img src="/logo.png" alt="Nassaq" className="w-9 h-9 object-contain" />

              {/* ================================
                  🌍 TRANSLATION: Brand
                  Key: navbar.brand
                 ================================ */}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {t("navbar.brand")}
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <div
                key={link.path}
                className="animate-slide-down animate-on-mount"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-300 relative ${
                    isActive(link.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(link.key)}
                  {isActive(link.path) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <LanguageToggle />

            <Link to="/login">
              {/* ================================
                  🌍 TRANSLATION: Login
                  Key: navbar.actions.login
                 ================================ */}
              <Button variant="ghost" size="sm">
                {t("navbar.actions.login")}
              </Button>
            </Link>

            <Link to="/register">
              {/* ================================
                  🌍 TRANSLATION: Register
                  Key: navbar.actions.register
                 ================================ */}
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {t("navbar.actions.register")}
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-foreground p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t("navbar.mobile.toggle")}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card/95 backdrop-blur-xl border-t border-border animate-slide-down animate-on-mount">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-2 font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <ThemeToggle />
              <LanguageToggle />
            </div>

            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full">
                {t("navbar.actions.login")}
              </Button>
            </Link>

            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-primary to-accent">
                {t("navbar.actions.register")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
