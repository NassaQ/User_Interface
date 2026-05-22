// ================================
// 🌍 TRANSLATION: Theme Toggle
// Namespace: theme.toggle.*
// ================================

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/LanguageContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden"
      aria-label={t("theme.toggle.aria")}
    >
      <div
        className={`transition-transform duration-300 ${
          theme === "dark" ? "rotate-180" : "rotate-0"
        }`}
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </div>
    </Button>
  );
};

export default ThemeToggle;
