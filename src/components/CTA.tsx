// ================================
// 🌍 TRANSLATION: CTA Component
// Namespace: cta.section.*
// ================================

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const CTA = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background" />

      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* ================================
              🌍 TRANSLATION: Badge
              Key: cta.section.badge
             ================================ */}
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full px-4 py-2 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("cta.section.badge")}
            </span>
          </motion.div>

          {/* ================================
              🌍 TRANSLATION: Title
              Key: cta.section.title
             ================================ */}
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              {t("cta.section.title")}
            </span>
          </h2>

          {/* ================================
              🌍 TRANSLATION: Description
              Key: cta.section.description
             ================================ */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t("cta.section.description")}
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link to="/register">
              {/* ================================
                  🌍 TRANSLATION: Primary CTA
                  Key: cta.section.actions.primary
                 ================================ */}
              <Button
                size="lg"
                className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-xl"
              >
                {t("cta.section.actions.primary")}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link to="/contact">
              {/* ================================
                  🌍 TRANSLATION: Secondary CTA
                  Key: cta.section.actions.secondary
                 ================================ */}
              <Button variant="outline" size="lg">
                {t("cta.section.actions.secondary")}
              </Button>
            </Link>
          </motion.div>

          {/* ================================
              🌍 TRANSLATION: Footer Note
              Key: cta.section.note
             ================================ */}
          <p className="text-sm text-muted-foreground mt-6">
            {t("cta.section.note")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
