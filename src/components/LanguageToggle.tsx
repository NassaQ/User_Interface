// ================================
// 🌍 TRANSLATION: Language Toggle
// Namespace: language.toggle.*
// ================================

import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "./ui/button";

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "ar" : "en")}
      className="gap-2"
      aria-label={t("language.toggle.aria")}
    >
      <Globe className="w-4 h-4" />

      {/* ================================
          🌍 TRANSLATION: Button Label
          Key: language.toggle.label
         ================================ */}
      <span className="text-sm font-medium">
        {language === "en"
          ? t("language.toggle.toArabic")
          : t("language.toggle.toEnglish")}
      </span>
    </Button>
  );
};

export default LanguageToggle;
