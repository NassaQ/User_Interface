// ================================
// 🌍 TRANSLATION: Pricing Page
// Namespace: pages.pricing.*
// ================================

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Pricing = () => {
  const { t } = useLanguage();
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      nameKey: "pages.pricing.plans.starter.name",
      descKey: "pages.pricing.plans.starter.desc",
      price: { monthly: 29, annual: 290 },
      features: [
        "pages.pricing.plans.starter.features.team",
        "pages.pricing.plans.starter.features.requests",
        "pages.pricing.plans.starter.features.analytics",
        "pages.pricing.plans.starter.features.support",
        "pages.pricing.plans.starter.features.storage",
      ],
      highlight: false,
    },
    {
      nameKey: "pages.pricing.plans.pro.name",
      descKey: "pages.pricing.plans.pro.desc",
      price: { monthly: 99, annual: 990 },
      features: [
        "pages.pricing.plans.pro.features.team",
        "pages.pricing.plans.pro.features.requests",
        "pages.pricing.plans.pro.features.analytics",
        "pages.pricing.plans.pro.features.support",
        "pages.pricing.plans.pro.features.storage",
        "pages.pricing.plans.pro.features.integrations",
        "pages.pricing.plans.pro.features.api",
      ],
      highlight: true,
    },
    {
      nameKey: "pages.pricing.plans.enterprise.name",
      descKey: "pages.pricing.plans.enterprise.desc",
      price: { monthly: 299, annual: 2990 },
      features: [
        "pages.pricing.plans.enterprise.features.team",
        "pages.pricing.plans.enterprise.features.requests",
        "pages.pricing.plans.enterprise.features.analytics",
        "pages.pricing.plans.enterprise.features.support",
        "pages.pricing.plans.enterprise.features.storage",
        "pages.pricing.plans.enterprise.features.integrations",
        "pages.pricing.plans.enterprise.features.api",
        "pages.pricing.plans.enterprise.features.sla",
        "pages.pricing.plans.enterprise.features.onprem",
      ],
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-primary/5 to-background" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* ================================
              🌍 TRANSLATION: Header
             ================================ */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                {t("pages.pricing.hero.title")}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              {t("pages.pricing.hero.subtitle")}
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full p-1">
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  !isAnnual
                    ? "bg-gradient-to-r from-primary to-accent text-white"
                    : "text-muted-foreground"
                }`}
                onClick={() => setIsAnnual(false)}
              >
                {t("pages.pricing.toggle.monthly")}
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  isAnnual
                    ? "bg-gradient-to-r from-primary to-accent text-white"
                    : "text-muted-foreground"
                }`}
                onClick={() => setIsAnnual(true)}
              >
                {t("pages.pricing.toggle.annual")}
                <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {t("pages.pricing.toggle.save")}
                </span>
              </button>
            </div>
          </motion.div>

          {/* ================================
              🌍 TRANSLATION: Plans
             ================================ */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={`relative bg-card border rounded-3xl p-8 ${
                  plan.highlight
                    ? "border-primary shadow-2xl shadow-primary/20 scale-105 md:scale-110"
                    : "border-border hover:border-primary/50"
                } transition-all`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                      {t("pages.pricing.badge.popular")}
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{t(plan.nameKey)}</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {t(plan.descKey)}
                  </p>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-muted-foreground">
                      /
                      {isAnnual
                        ? t("pages.pricing.period.year")
                        : t("pages.pricing.period.month")}
                    </span>
                  </div>

                  {isAnnual && (
                    <p className="text-sm text-muted-foreground">
                      ${(plan.price.annual / 12).toFixed(2)}{" "}
                      {t("pages.pricing.billing.note")}
                    </p>
                  )}
                </div>

                <Link to="/register">
                  <Button
                    className={`w-full mb-8 ${
                      plan.highlight
                        ? "bg-gradient-to-r from-primary to-accent hover:opacity-90"
                        : ""
                    }`}
                    variant={plan.highlight ? "default" : "outline"}
                    size="lg"
                  >
                    {t("pages.pricing.actions.start")}
                  </Button>
                </Link>

                <ul className="space-y-4">
                  {plan.features.map((featureKey, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
