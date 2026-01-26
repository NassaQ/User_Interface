// ================================
// 🌍 TRANSLATION: Footer Component
// Namespace: footer.*
// ================================

import { Link } from "react-router-dom";
import { Zap, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  // ================================
  // 🌍 TRANSLATION: Footer Links
  // Namespace: footer.links.*
  // ================================
  const footerLinks = {
    product: [
      { key: "footer.links.product.features", path: "/" },
      { key: "footer.links.product.pricing", path: "/pricing" },
      { key: "footer.links.product.security", path: "/" },
      { key: "footer.links.product.enterprise", path: "/" },
    ],
    company: [
      { key: "footer.links.company.about", path: "/about" },
      { key: "footer.links.company.blog", path: "/" },
      { key: "footer.links.company.careers", path: "/" },
      { key: "footer.links.company.contact", path: "/contact" },
    ],
    resources: [
      { key: "footer.links.resources.docs", path: "/" },
      { key: "footer.links.resources.help", path: "/" },
      { key: "footer.links.resources.community", path: "/" },
      { key: "footer.links.resources.status", path: "/" },
    ],
    legal: [
      { key: "footer.links.legal.privacy", path: "/" },
      { key: "footer.links.legal.terms", path: "/" },
      { key: "footer.links.legal.security", path: "/" },
      { key: "footer.links.legal.cookies", path: "/" },
    ],
  };

  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold mb-4"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>

              {/* ================================
                  🌍 TRANSLATION: Brand
                  Key: footer.brand
                 ================================ */}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("footer.brand")}
              </span>
            </Link>

            {/* ================================
                🌍 TRANSLATION: Description
                Key: footer.description
               ================================ */}
            <p className="text-muted-foreground mb-6 max-w-sm">
              {t("footer.description")}
            </p>

            <div className="flex gap-3">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Mail, href: "#", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* ================================
              🌍 TRANSLATION: Footer Columns
             ================================ */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              {/* ================================
                  🌍 TRANSLATION: Column Title
                 ================================ */}
              <h3 className="font-bold mb-4">
                {t(`footer.categories.${category}`)}
              </h3>

              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.key}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          {/* ================================
              🌍 TRANSLATION: Copyright
             ================================ */}
          <p className="text-sm text-muted-foreground text-center md:text-start">
            © 2025 {t("footer.brand")}. {t("footer.rights")}.
          </p>

          {/* ================================
              🌍 TRANSLATION: Legal Links
             ================================ */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              {t("footer.links.legal.privacy")}
            </Link>
            <Link to="/" className="hover:text-primary transition-colors">
              {t("footer.links.legal.terms")}
            </Link>
            <Link to="/" className="hover:text-primary transition-colors">
              {t("footer.links.legal.cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
