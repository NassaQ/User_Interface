// ================================
// 🌍 TRANSLATION: CTA Component
// Namespace: cta.section.*
// ================================

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";

const CTA = () => {
  const { t } = useLanguage();

  const { ref: wrapperRef, inView: wrapperInView } = useInView<HTMLDivElement>({ once: true });
  const { ref: badgeRef, inView: badgeInView } = useInView<HTMLDivElement>({ once: true });
  const { ref: btnsRef, inView: btnsInView } = useInView<HTMLDivElement>({ once: true });

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background" />

      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={wrapperRef}
          className={`max-w-4xl mx-auto text-center animate-fade-in-up-lg ${wrapperInView ? 'in-view' : ''}`}
        >
          {/* ================================
              🌍 TRANSLATION: Badge
              Key: cta.section.badge
             ================================ */}
          <div
            ref={badgeRef}
            className={`inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full px-4 py-2 mb-6 animate-fade-in-scale ${badgeInView ? 'in-view' : ''}`}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("cta.section.badge")}
            </span>
          </div>

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

          <div
            ref={btnsRef}
            className={`flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up ${btnsInView ? 'in-view' : ''}`}
            style={{ animationDelay: '0.2s' }}
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
          </div>

          {/* ================================
              🌍 TRANSLATION: Footer Note
              Key: cta.section.note
             ================================ */}
          <p className="text-sm text-muted-foreground mt-6">
            {t("cta.section.note")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
