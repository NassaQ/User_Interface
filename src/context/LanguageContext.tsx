import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { pageTranslations } from "./LanguageContextPages";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// ================================
// 🌍 COMPONENT TRANSLATIONS
// ================================
const componentTranslations = {
  en: {
    // ================================
    // DashboardLayout
    // ================================
    "dashboard.layout.brand": "Nassaq",
    "dashboard.layout.section.admin": "Admin area",
    "dashboard.layout.nav.dashboard": "Dashboard",
    "dashboard.layout.nav.myFiles": "My Files",
    "dashboard.layout.nav.studio": "AI Studio",
    "dashboard.layout.nav.history": "History",
    "dashboard.layout.nav.search": "Search & Chat",
    "dashboard.layout.nav.users": "Users",
    "dashboard.layout.nav.profile": "Profile",
    "dashboard.layout.nav.settings": "Settings",
    "dashboard.layout.nav.billing": "Billing",
    "dashboard.layout.nav.help": "Help",
    "dashboard.layout.actions.signOut": "Sign Out",

    // Processing indicator
    "dashboard.layout.processing.active": "Processing in background...",

    // Global Search
    "dashboard.header.search.placeholder": "Search your files...",
    "dashboard.header.search.viewOriginal": "View original file",

    // ================================
    // CTA
    // ================================
    "cta.section.badge": "Start Your Free Trial",
    "cta.section.title": "Ready to Experience Smarter Document Management?",
    "cta.section.description":
      "Join thousands of organizations using Nassaq to organize, classify, and instantly retrieve their documents with AI.",
    "cta.section.actions.primary": "Get Started Free",
    "cta.section.actions.secondary": "Contact Sales",
    "cta.section.note":
      "No credit card required • 14-day free trial • Cancel anytime",

    // ================================
    // Features
    // ================================
    "features.section.badge": "Powerful Features",
    "features.section.title": "Everything you need to succeed",

    "features.cards.ai.title": "AI Document Classification",
    "features.cards.ai.desc":
      "Automatically classify and tag your documents using advanced AI - no manual sorting needed",

    "features.cards.fast.title": "Instant Search & Retrieval",
    "features.cards.fast.desc":
      "Find any document in seconds using semantic search powered by AI - search by meaning, not just keywords",

    "features.cards.security.title": "Secure Document Storage",
    "features.cards.security.desc":
      "Your documents are stored securely on Azure with enterprise-grade encryption and access control",

    "features.cards.analytics.title": "Chat with Your Documents",
    "features.cards.analytics.desc":
      "Ask questions about your documents in natural language and get accurate AI-powered answers with sources",

    "features.cards.team.title": "Team & Role Management",
    "features.cards.team.desc":
      "Manage your team with role-based access control - admins, users, and custom permissions",

    "features.cards.global.title": "OCR & Multi-language Support",
    "features.cards.global.desc":
      "Extract text from scanned documents and images with OCR, supporting Arabic and English content",

    // ================================
    // Footer
    // ================================
    "footer.brand": "Nassaq",
    "footer.description":
      "Empowering businesses with AI-driven solutions for the modern world.",
    "footer.rights": "All rights reserved",

    "footer.categories.product": "Product",
    "footer.categories.company": "Company",
    "footer.categories.resources": "Resources",
    "footer.categories.legal": "Legal",

    "footer.links.product.features": "Features",
    "footer.links.product.pricing": "Pricing",
    "footer.links.product.security": "Security",
    "footer.links.product.enterprise": "Enterprise",

    "footer.links.company.about": "About",
    "footer.links.company.blog": "Blog",
    "footer.links.company.careers": "Careers",
    "footer.links.company.contact": "Contact",

    "footer.links.resources.docs": "Documentation",
    "footer.links.resources.help": "Help Center",
    "footer.links.resources.community": "Community",
    "footer.links.resources.status": "Status",

    "footer.links.legal.privacy": "Privacy",
    "footer.links.legal.terms": "Terms",
    "footer.links.legal.security": "Security",
    "footer.links.legal.cookies": "Cookies",

    // ================================
    // Hero
    // ================================
    "hero.section.badge": "AI-Powered Document Management",
    "hero.title": "Manage Your Documents with AI Intelligence",
    "hero.subtitle":
      "Upload, classify, search, and chat with your documents using advanced AI - all in one secure platform",
    "hero.cta.primary": "Get Started Free",
    "hero.cta.secondary": "Watch Demo",

    // ================================
    // How It Works
    // ================================
    "how.section.badge": "How It Works",
    "how.section.title": "Get Started in Minutes",
    "how.section.subtitle":
      "Simple four-step process to transform your workflow",

    "how.steps.connect.title": "Upload Your Documents",
    "how.steps.connect.desc":
      "Upload any document - PDFs, scanned files, or images - and Nassaq handles the rest",

    "how.steps.process.title": "AI Classification & OCR",
    "how.steps.process.desc":
      "Our AI automatically extracts text, classifies documents, and organizes them by category",

    "how.steps.insights.title": "Search & Chat",
    "how.steps.insights.desc":
      "Search semantically or chat with your documents to get instant answers with source citations",

    "how.steps.action.title": "Manage & Collaborate",
    "how.steps.action.desc":
      "Share documents with your team, control access, and track all activity in one place",

    // ================================
    // Language Toggle
    // ================================
    "language.toggle.aria": "Toggle language",
    "language.toggle.toArabic": "AR",
    "language.toggle.toEnglish": "EN",

    // ================================
    // Navbar
    // ================================
    "navbar.brand": "Nassaq",
    "navbar.links.home": "Home",
    "navbar.links.about": "About",
    "navbar.links.pricing": "Pricing",
    "navbar.links.contact": "Contact",
    "navbar.actions.login": "Sign In",
    "navbar.actions.register": "Get Started",
    "navbar.mobile.toggle": "Toggle menu",

    // ================================
    // Theme Toggle
    // ================================
    "theme.toggle.aria": "Toggle theme",
  },

  ar: {
    // ================================
    // DashboardLayout
    // ================================
    "dashboard.layout.brand": "نسَّق",
    "dashboard.layout.section.admin": "منطقة الإدارة",
    "dashboard.layout.nav.dashboard": "لوحة التحكم",
    "dashboard.layout.nav.myFiles": "ملفاتي",
    "dashboard.layout.nav.studio": "استوديو الذكاء الاصطناعي",
    "dashboard.layout.nav.history": "السجل",
    "dashboard.layout.nav.search": "البحث والدردشة",
    "dashboard.layout.nav.users": "المستخدمون",
    "dashboard.layout.nav.profile": "الملف الشخصي",
    "dashboard.layout.nav.settings": "الإعدادات",
    "dashboard.layout.nav.billing": "الفواتير",
    "dashboard.layout.nav.help": "المساعدة",
    "dashboard.layout.actions.signOut": "تسجيل الخروج",

    // Processing indicator
    "dashboard.layout.processing.active": "جاري المعالجة في الخلفية...",

    // Global Search
    "dashboard.header.search.placeholder": "ابحث في ملفاتك...",
    "dashboard.header.search.viewOriginal": "عرض الملف الأصلي",

    // ================================
    // CTA
    // ================================
    "cta.section.badge": "ابدأ تجربتك المجانية",
    "cta.section.title": "هل أنت مستعد لإدارة مستنداتك بشكل أذكى؟",
    "cta.section.description":
      "انضم إلى المؤسسات التي تستخدم نسَّق لتنظيم مستنداتها وتصنيفها واسترجاعها فورًا بالذكاء الاصطناعي.",
    "cta.section.actions.primary": "ابدأ مجانًا",
    "cta.section.actions.secondary": "تواصل مع المبيعات",
    "cta.section.note":
      "لا حاجة لبطاقة ائتمان • تجربة مجانية لمدة 14 يومًا • يمكنك الإلغاء في أي وقت",

    // ================================
    // Features
    // ================================
    "features.section.badge": "ميزات قوية",
    "features.section.title": "كل ما تحتاجه للنجاح",

    "features.cards.ai.title": "تصنيف المستندات بالذكاء الاصطناعي",
    "features.cards.ai.desc": "صنّف مستنداتك تلقائيًا بالذكاء الاصطناعي دون الحاجة لفرز يدوي",

    "features.cards.fast.title": "بحث واسترجاع فوري",
    "features.cards.fast.desc":
      "ابحث عن أي مستند في ثوانٍ بالبحث الدلالي - ابحث بالمعنى لا بالكلمات فقط",

    "features.cards.security.title": "تخزين آمن للمستندات",
    "features.cards.security.desc":
      "مستنداتك محفوظة بأمان على Azure بتشفير احترافي وتحكم كامل في الوصول",

    "features.cards.analytics.title": "تحدّث مع مستنداتك",
    "features.cards.analytics.desc":
      "اسأل أسئلة عن مستنداتك بلغة طبيعية واحصل على إجابات دقيقة مع المصادر",

    "features.cards.team.desc": "أدِر فريقك بصلاحيات مخصصة - مسؤولون ومستخدمون وتحكم كامل في الوصول",
    "features.cards.global.title": "OCR ودعم متعدد اللغات",
    "features.cards.global.desc": "استخرج النصوص من المستندات الممسوحة والصور مع دعم كامل للعربية والإنجليزية",

    // ================================
    // Footer
    // ================================
    "footer.brand": "نسَّق",
    "footer.description":
      "تمكين الشركات بحلول مدعومة بالذكاء الاصطناعي لعالم الأعمال الحديث.",
    "footer.rights": "جميع الحقوق محفوظة",

    "footer.categories.product": "المنتج",
    "footer.categories.company": "الشركة",
    "footer.categories.resources": "الموارد",
    "footer.categories.legal": "قانوني",

    "footer.links.product.features": "المميزات",
    "footer.links.product.pricing": "الأسعار",
    "footer.links.product.security": "الأمان",
    "footer.links.product.enterprise": "الشركات",

    "footer.links.company.about": "من نحن",
    "footer.links.company.blog": "المدونة",
    "footer.links.company.careers": "الوظائف",
    "footer.links.company.contact": "تواصل معنا",

    "footer.links.resources.docs": "التوثيق",
    "footer.links.resources.help": "مركز المساعدة",
    "footer.links.resources.community": "المجتمع",
    "footer.links.resources.status": "حالة الخدمة",

    "footer.links.legal.privacy": "الخصوصية",
    "footer.links.legal.terms": "الشروط",
    "footer.links.legal.security": "الأمان",
    "footer.links.legal.cookies": "ملفات تعريف الارتباط",

    // ================================
    // Hero
    // ================================
    "hero.section.badge": "إدارة المستندات بالذكاء الاصطناعي",
    "hero.title": "أدِر مستنداتك بذكاء اصطناعي متقدم",
    "hero.subtitle":
      "ارفع، صنّف، ابحث، وتحدّث مع مستنداتك باستخدام الذكاء الاصطناعي - كل ذلك في منصة آمنة وموحّدة",
    "hero.cta.primary": "ابدأ مجانًا",
    "hero.cta.secondary": "شاهد العرض",

    // ================================
    // How It Works
    // ================================
    "how.section.badge": "كيف يعمل",
    "how.section.title": "ابدأ خلال دقائق",
    "how.section.subtitle": "عملية بسيطة من أربع خطوات لتحويل طريقة عملك",

    "how.steps.connect.title": "ارفع مستنداتك",
    "how.steps.connect.desc": "ارفع أي مستند - PDF أو صور أو ملفات ممسوحة - ونسَّق يتولى الباقي",

    "how.steps.process.title": "تصنيف بالذكاء الاصطناعي و OCR",
    "how.steps.process.desc":
      "يستخرج الذكاء الاصطناعي النصوص ويصنف المستندات ويرتبها تلقائيًا حسب الفئة",

    "how.steps.insights.title": "ابحث وتحدّث",
    "how.steps.insights.desc":
      "ابحث دلاليًا أو تحدّث مع مستنداتك للحصول على إجابات فورية مع المصادر",

    "how.steps.action.title": "أدِر وتعاون",
    "how.steps.action.desc": "شارك المستندات مع فريقك، تحكم في الوصول، وتابع كل النشاطات في مكان واحد",
    // ================================
    // Language Toggle
    // ================================
    "language.toggle.aria": "تغيير اللغة",
    "language.toggle.toArabic": "عربي",
    "language.toggle.toEnglish": "EN",

    // ================================
    // Navbar
    // ================================
    "navbar.brand": "نسَّق",
    "navbar.links.home": "الرئيسية",
    "navbar.links.about": "من نحن",
    "navbar.links.pricing": "الأسعار",
    "navbar.links.contact": "اتصل بنا",
    "navbar.actions.login": "تسجيل الدخول",
    "navbar.actions.register": "ابدأ الآن",
    "navbar.mobile.toggle": "القائمة",

    // ================================
    // Theme Toggle
    // ================================
    "theme.toggle.aria": "تغيير المظهر",
  },
};

// ================================
// 🌍 MERGED TRANSLATIONS
// ================================
const translations = {
  en: {
    ...componentTranslations.en,
    ...pageTranslations.en, // ✅ تفعيل ترجمة الصفحات
  },
  ar: {
    ...componentTranslations.ar,
    ...pageTranslations.ar, // ✅ تفعيل ترجمة الصفحات
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("language");
    return (stored as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    let value: string = translations[language][key as keyof typeof translations.en] || key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.split(`{${k}}`).join(String(v));
      }
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
