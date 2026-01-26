// ================================
// 🌍 TRANSLATION: Support Page
// Namespace: pages.support.*
// ================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  MessageCircle,
  Mail,
  ChevronDown,
  Book,
  Video,
  Headphones,
  Search,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Support = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      qKey: "pages.support.faq.q1",
      aKey: "pages.support.faq.a1",
    },
    {
      qKey: "pages.support.faq.q2",
      aKey: "pages.support.faq.a2",
    },
    {
      qKey: "pages.support.faq.q3",
      aKey: "pages.support.faq.a3",
    },
    {
      qKey: "pages.support.faq.q4",
      aKey: "pages.support.faq.a4",
    },
    {
      qKey: "pages.support.faq.q5",
      aKey: "pages.support.faq.a5",
    },
    {
      qKey: "pages.support.faq.q6",
      aKey: "pages.support.faq.a6",
    },
  ];

  const resources = [
    {
      icon: Book,
      titleKey: "pages.support.resources.docs.title",
      descKey: "pages.support.resources.docs.desc",
      link: "#",
    },
    {
      icon: Video,
      titleKey: "pages.support.resources.videos.title",
      descKey: "pages.support.resources.videos.desc",
      link: "#",
    },
    {
      icon: MessageCircle,
      titleKey: "pages.support.resources.community.title",
      descKey: "pages.support.resources.community.desc",
      link: "#",
    },
    {
      icon: Headphones,
      titleKey: "pages.support.resources.chat.title",
      descKey: "pages.support.resources.chat.desc",
      link: "#",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      t(faq.qKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(faq.aKey).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title={t("pages.support.title")}
      subtitle={t("pages.support.subtitle")}
    >
      <div className="max-w-4xl mx-auto">
        {/* Search */}
        <motion.div
          className="bg-card border border-border rounded-2xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4">
            {t("pages.support.search.title")}
          </h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("pages.support.search.placeholder")}
              className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
          </div>
        </motion.div>

        {/* Quick Resources */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <resource.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {t(resource.titleKey)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(resource.descKey)}
              </p>
            </a>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="bg-card border border-border rounded-2xl overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 p-5 border-b border-border bg-secondary/30">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">
              {t("pages.support.faq.title")}
            </h3>
          </div>

          <div className="divide-y divide-border">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index}>
                  <button
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/20 transition-colors"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-medium text-foreground pr-4">
                      {t(faq.qKey)}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                          {t(faq.aKey)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  {t("pages.support.search.noResults")} "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          className="bg-gradient-to-r from-primary via-accent to-primary p-[1px] rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="bg-card rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t("pages.support.contact.title")}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t("pages.support.contact.desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                {t("pages.support.contact.chat")}
              </Button>
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 gap-2">
                <Mail className="w-4 h-4" />
                {t("pages.support.contact.email")}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Support;
