// ================================
// 🌍 TRANSLATION: Billing Page
// Namespace: pages.billing.*
// ================================

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Check,
  Zap,
  CreditCard,
  Receipt,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Billing = () => {
  const { t } = useLanguage();
  const [isAnnual, setIsAnnual] = useState(true);

  const currentPlan = {
    nameKey: "pages.billing.plans.professional",
    price: 99,
    renewalDate: "January 15, 2025",
    usage: {
      aiRequests: { used: 8432, total: 10000 },
      storage: { used: 28.5, total: 50 },
      teamMembers: { used: 12, total: 25 },
    },
  };

  const plans = [
    {
      nameKey: "pages.billing.plans.starter",
      price: { monthly: 29, annual: 290 },
      featuresKeys: [
        "pages.billing.features.team5",
        "pages.billing.features.ai50",
        "pages.billing.features.storage1",
        "pages.billing.features.emailSupport",
      ],
      current: false,
    },
    {
      nameKey: "pages.billing.plans.professional",
      price: { monthly: 99, annual: 990 },
      featuresKeys: [
        "pages.billing.features.team25",
        "pages.billing.features.aiUnlimited",
        "pages.billing.features.storage50",
        "pages.billing.features.prioritySupport",
        "pages.billing.features.api",
      ],
      current: true,
      popular: true,
    },
    {
      nameKey: "pages.billing.plans.enterprise",
      price: { monthly: 299, annual: 2990 },
      featuresKeys: [
        "pages.billing.features.unlimitedMembers",
        "pages.billing.features.unlimitedAll",
        "pages.billing.features.support247",
        "pages.billing.features.sla",
        "pages.billing.features.onPrem",
      ],
      current: false,
    },
  ];

  const invoices = [
    {
      id: "INV-2024-012",
      date: "Dec 15, 2024",
      amount: "$99.00",
      statusKey: "pages.billing.status.paid",
    },
    {
      id: "INV-2024-011",
      date: "Nov 15, 2024",
      amount: "$99.00",
      statusKey: "pages.billing.status.paid",
    },
    {
      id: "INV-2024-010",
      date: "Oct 15, 2024",
      amount: "$99.00",
      statusKey: "pages.billing.status.paid",
    },
  ];

  return (
    <DashboardLayout
      title={t("pages.billing.title")}
      subtitle={t("pages.billing.subtitle")}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ================================
            🌍 TRANSLATION: Current Plan
           ================================ */}
        <motion.div
          className="bg-gradient-to-r from-primary via-accent to-primary p-[1px] rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-card rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {t("pages.billing.current.badge")}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {t(currentPlan.nameKey)}
                </h2>
                <p className="text-muted-foreground">
                  <span className="text-foreground font-semibold text-3xl">
                    ${currentPlan.price}
                  </span>
                  {t("pages.billing.perMonth")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="gap-2">
                  <CreditCard className="w-4 h-4" />
                  {t("pages.billing.actions.updatePayment")}
                </Button>
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 gap-2">
                  <Zap className="w-4 h-4" />
                  {t("pages.billing.actions.upgradePlan")}
                </Button>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
              {/* AI Requests */}
              <div className="bg-secondary/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("pages.billing.usage.ai")}
                  </span>
                  <span className="text-sm font-medium">
                    {currentPlan.usage.aiRequests.used.toLocaleString()} /{" "}
                    {currentPlan.usage.aiRequests.total.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                    style={{
                      width: `${
                        (currentPlan.usage.aiRequests.used /
                          currentPlan.usage.aiRequests.total) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Storage */}
              <div className="bg-secondary/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("pages.billing.usage.storage")}
                  </span>
                  <span className="text-sm font-medium">
                    {currentPlan.usage.storage.used} GB /{" "}
                    {currentPlan.usage.storage.total} GB
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                    style={{
                      width: `${
                        (currentPlan.usage.storage.used /
                          currentPlan.usage.storage.total) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Team */}
              <div className="bg-secondary/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("pages.billing.usage.team")}
                  </span>
                  <span className="text-sm font-medium">
                    {currentPlan.usage.teamMembers.used} /{" "}
                    {currentPlan.usage.teamMembers.total}
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                    style={{
                      width: `${
                        (currentPlan.usage.teamMembers.used /
                          currentPlan.usage.teamMembers.total) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {t("pages.billing.nextDate")} {currentPlan.renewalDate}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ================================
            🌍 TRANSLATION: Plans
           ================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">
              {t("pages.billing.availablePlans")}
            </h3>

            <div className="inline-flex items-center gap-2 bg-secondary rounded-full p-1">
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  !isAnnual
                    ? "bg-card text-foreground shadow"
                    : "text-muted-foreground"
                }`}
                onClick={() => setIsAnnual(false)}
              >
                {t("pages.billing.toggle.monthly")}
              </button>
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isAnnual
                    ? "bg-card text-foreground shadow"
                    : "text-muted-foreground"
                }`}
                onClick={() => setIsAnnual(true)}
              >
                {t("pages.billing.toggle.annual")}
                <span className="ml-1.5 text-xs text-primary">
                  {t("pages.billing.toggle.discount")}
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.nameKey}
                className={`relative bg-card border rounded-2xl p-6 ${
                  plan.current
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border hover:border-primary/30"
                } transition-all`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2 + index * 0.1,
                }}
              >
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      {t("pages.billing.current.badge")}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">
                    {t(plan.nameKey)}
                  </h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-muted-foreground">
                      /
                      {t(
                        isAnnual ? "pages.billing.year" : "pages.billing.month"
                      )}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.featuresKeys.map((key, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{t(key)}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.current ? "outline" : "default"}
                  className={`w-full ${
                    !plan.current &&
                    "bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  }`}
                  disabled={plan.current}
                >
                  {t(
                    plan.current
                      ? "pages.billing.actions.currentPlan"
                      : "pages.billing.actions.upgrade"
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ================================
            🌍 TRANSLATION: History
           ================================ */}
        <motion.div
          className="bg-card border border-border rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">
                {t("pages.billing.history.title")}
              </h3>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              {t("pages.billing.history.viewAll")}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="divide-y divide-border">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-5 hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-medium">{invoice.amount}</span>
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {t(invoice.statusKey)}
                  </span>
                  <Button variant="ghost" size="sm">
                    {t("pages.billing.history.download")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
