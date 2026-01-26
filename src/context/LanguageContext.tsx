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
  t: (key: string) => string;
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
    "dashboard.layout.nav.dashboard": "Dashboard",
    "dashboard.layout.nav.studio": "AI Studio",
    "dashboard.layout.nav.history": "History",
    "dashboard.layout.nav.profile": "Profile",
    "dashboard.layout.nav.settings": "Settings",
    "dashboard.layout.nav.billing": "Billing",
    "dashboard.layout.nav.help": "Help",
    "dashboard.layout.actions.signOut": "Sign Out",

    // ================================
    // CTA
    // ================================
    "cta.section.badge": "Start Your Free Trial",
    "cta.section.title": "Ready to Transform Your Workflow?",
    "cta.section.description":
      "Join thousands of teams already using Nassaq to automate their workflows and boost productivity.",
    "cta.section.actions.primary": "Get Started Free",
    "cta.section.actions.secondary": "Contact Sales",
    "cta.section.note":
      "No credit card required • 14-day free trial • Cancel anytime",

    // ================================
    // Features
    // ================================
    "features.section.badge": "Powerful Features",
    "features.section.title": "Everything you need to succeed",

    "features.cards.ai.title": "AI-Powered Intelligence",
    "features.cards.ai.desc":
      "Advanced machine learning algorithms that adapt to your workflow",

    "features.cards.fast.title": "Lightning Fast",
    "features.cards.fast.desc":
      "Process thousands of operations in milliseconds with optimized performance",

    "features.cards.security.title": "Enterprise Security",
    "features.cards.security.desc":
      "Bank-level encryption and compliance with global security standards",

    "features.cards.analytics.title": "Real-time Analytics",
    "features.cards.analytics.desc":
      "Gain actionable insights with comprehensive data visualization",

    "features.cards.team.title": "Team Collaboration",
    "features.cards.team.desc":
      "Work together seamlessly with powerful collaboration tools",

    "features.cards.global.title": "Global Scale",
    "features.cards.global.desc":
      "Deploy anywhere in the world with multi-region support",

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
    "hero.section.badge": "AI-Powered Platform",
    "hero.title": "Transform Your Workflow with AI",
    "hero.subtitle":
      "Powerful AI-driven solutions to streamline your business operations and boost productivity",
    "hero.cta.primary": "Get Started Free",
    "hero.cta.secondary": "Watch Demo",

    // ================================
    // How It Works
    // ================================
    "how.section.badge": "How It Works",
    "how.section.title": "Get Started in Minutes",
    "how.section.subtitle":
      "Simple four-step process to transform your workflow",

    "how.steps.connect.title": "Connect Your Data",
    "how.steps.connect.desc":
      "Seamlessly integrate with your existing tools and data sources",

    "how.steps.process.title": "AI Processing",
    "how.steps.process.desc":
      "Our AI analyzes and processes your data with advanced algorithms",

    "how.steps.insights.title": "Get Insights",
    "how.steps.insights.desc":
      "Receive actionable insights and automated recommendations",

    "how.steps.action.title": "Take Action",
    "how.steps.action.desc":
      "Implement changes and watch your productivity soar",

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
    "dashboard.layout.brand": "نسّـق",
    "dashboard.layout.nav.dashboard": "لوحة التحكم",
    "dashboard.layout.nav.studio": "استوديو الذكاء الاصطناعي",
    "dashboard.layout.nav.history": "السجل",
    "dashboard.layout.nav.profile": "الملف الشخصي",
    "dashboard.layout.nav.settings": "الإعدادات",
    "dashboard.layout.nav.billing": "الفواتير",
    "dashboard.layout.nav.help": "المساعدة",
    "dashboard.layout.actions.signOut": "تسجيل الخروج",

    // ================================
    // CTA
    // ================================
    "cta.section.badge": "ابدأ تجربتك المجانية",
    "cta.section.title": "جاهز لتحويل طريقة عملك؟",
    "cta.section.description":
      "انضم إلى آلاف الفرق التي تستخدم AI Flow لأتمتة سير العمل وزيادة الإنتاجية.",
    "cta.section.actions.primary": "ابدأ مجانًا",
    "cta.section.actions.secondary": "تواصل مع المبيعات",
    "cta.section.note":
      "لا حاجة لبطاقة ائتمان • تجربة مجانية لمدة 14 يومًا • يمكنك الإلغاء في أي وقت",

    // ================================
    // Features
    // ================================
    "features.section.badge": "ميزات قوية",
    "features.section.title": "كل ما تحتاجه للنجاح",

    "features.cards.ai.title": "ذكاء مدعوم بالذكاء الاصطناعي",
    "features.cards.ai.desc": "خوارزميات تعلم آلي متقدمة تتكيف مع سير عملك",

    "features.cards.fast.title": "أداء فائق السرعة",
    "features.cards.fast.desc":
      "تنفيذ آلاف العمليات في أجزاء من الثانية بأداء محسّن",

    "features.cards.security.title": "أمان بمستوى المؤسسات",
    "features.cards.security.desc":
      "تشفير بمستوى البنوك والالتزام بمعايير الأمان العالمية",

    "features.cards.analytics.title": "تحليلات لحظية",
    "features.cards.analytics.desc":
      "احصل على رؤى عملية من خلال تصور شامل للبيانات",

    "features.cards.team.title": "تعاون الفريق",
    "features.cards.team.desc": "اعملوا معًا بسلاسة باستخدام أدوات تعاون قوية",

    "features.cards.global.title": "انتشار عالمي",
    "features.cards.global.desc":
      "انشر خدماتك في أي مكان في العالم مع دعم متعدد المناطق",

    // ================================
    // Footer
    // ================================
    "footer.brand": "نسّـق",
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
    "hero.section.badge": "منصة مدعومة بالذكاء الاصطناعي",
    "hero.title": "حوّل سير عملك مع الذكاء الاصطناعي",
    "hero.subtitle":
      "حلول قوية مدععومة بالذكاء الاصطناعي لتبسيط عمليات عملك وتعزيز الإنتاجية",
    "hero.cta.primary": "ابدأ مجانًا",
    "hero.cta.secondary": "شاهد العرض",

    // ================================
    // How It Works
    // ================================
    "how.section.badge": "كيف يعمل",
    "how.section.title": "ابدأ خلال دقائق",
    "how.section.subtitle": "عملية بسيطة من أربع خطوات لتحويل طريقة عملك",

    "how.steps.connect.title": "اربط بياناتك",
    "how.steps.connect.desc": "تكامل سلس مع أدواتك الحالية ومصادر البيانات",

    "how.steps.process.title": "معالجة بالذكاء الاصطناعي",
    "how.steps.process.desc":
      "يقوم الذكاء الاصطناعي لدينا بتحليل بياناتك ومعالجتها بخوارزميات متقدمة",

    "how.steps.insights.title": "احصل على رؤى",
    "how.steps.insights.desc":
      "استقبل توصيات عملية وآلية تساعدك على اتخاذ القرار",

    "how.steps.action.title": "اتخذ الإجراء",
    "how.steps.action.desc": "نفّذ التغييرات وشاهد إنتاجيتك ترتفع",

    // ================================
    // Language Toggle
    // ================================
    "language.toggle.aria": "تغيير اللغة",
    "language.toggle.toArabic": "عربي",
    "language.toggle.toEnglish": "EN",

    // ================================
    // Navbar
    // ================================
    "navbar.brand": "نسّـق",
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

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
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
