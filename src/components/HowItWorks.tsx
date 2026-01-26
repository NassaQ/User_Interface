// ================================
// 🌍 TRANSLATION: How It Works Section
// Namespace: how.section.*
// ================================

import { motion } from "framer-motion";
import { Upload, Cpu, Sparkles, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const HowItWorks = () => {
  const { t } = useLanguage();

  // ================================
  // 🌍 TRANSLATION: Steps
  // Namespace: how.steps.*
  // ================================
  const steps = [
    {
      icon: Upload,
      number: "01",
      titleKey: "how.steps.connect.title",
      descKey: "how.steps.connect.desc",
    },
    {
      icon: Cpu,
      number: "02",
      titleKey: "how.steps.process.title",
      descKey: "how.steps.process.desc",
    },
    {
      icon: Sparkles,
      number: "03",
      titleKey: "how.steps.insights.title",
      descKey: "how.steps.insights.desc",
    },
    {
      icon: CheckCircle,
      number: "04",
      titleKey: "how.steps.action.title",
      descKey: "how.steps.action.desc",
    },
  ];

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* ================================
              🌍 TRANSLATION: Badge
              Key: how.section.badge
             ================================ */}
          <motion.div
            className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium text-accent">
              {t("how.section.badge")}
            </span>
          </motion.div>

          {/* ================================
              🌍 TRANSLATION: Title
              Key: how.section.title
             ================================ */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              {t("how.section.title")}
            </span>
          </h2>

          {/* ================================
              🌍 TRANSLATION: Subtitle
              Key: how.section.subtitle
             ================================ */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("how.section.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all hover:shadow-xl">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                    {step.number}
                  </div>
                </div>

                <div className="mt-8 mb-6">
                  <div
                    className={`inline-flex p-4 bg-gradient-to-br ${
                      index % 2 === 0
                        ? "from-primary to-accent"
                        : "from-accent to-primary"
                    } rounded-xl`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* ================================
                    🌍 TRANSLATION: Step Title
                   ================================ */}
                <h3 className="text-xl font-bold mb-3">{t(step.titleKey)}</h3>

                {/* ================================
                    🌍 TRANSLATION: Step Description
                   ================================ */}
                <p className="text-muted-foreground">{t(step.descKey)}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-accent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
