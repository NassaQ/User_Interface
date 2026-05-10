// ================================
// 🌍 TRANSLATION: Hero Section
// Namespace: hero.section.*
// ================================

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import heroDashboard from "@/assets/hero-dashboard.png";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-0">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-start animate-fade-in-up-lg animate-on-mount">
            {/* ================================
                🌍 TRANSLATION: Badge
                Key: hero.section.badge
               ================================ */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full px-4 py-2 mb-6 animate-fade-in-scale animate-on-mount">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("hero.section.badge")}
              </span>
            </div>

            {/* ================================
                🌍 TRANSLATION: Title
                Key: hero.title
               ================================ */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 animate-fade-in-up animate-on-mount delay-300">
              <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                {t("hero.title")}
              </span>
            </h1>

            {/* ================================
                🌍 TRANSLATION: Subtitle
                Key: hero.subtitle
               ================================ */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up animate-on-mount delay-500">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animate-on-mount delay-700">
              <Link to="/register">
                {/* ================================
                    🌍 TRANSLATION: Primary CTA
                    Key: hero.cta.primary
                   ================================ */}
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
                >
                  {t("hero.cta.primary")}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* ================================
                  🌍 TRANSLATION: Secondary CTA
                  Key: hero.cta.secondary
                 ================================ */}
              <Button variant="outline" size="lg" className="group">
                <Play className="mr-2 w-5 h-5" />
                {t("hero.cta.secondary")}
              </Button>
            </div>
          </div>

          {/* Image side (no translation needed) */}
          <div className="relative animate-fade-in-up-lg animate-on-mount delay-500">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={heroDashboard}
                  alt="AI Dashboard"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 mix-blend-overlay" />
              </div>

              <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-accent/30 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator (no translation needed) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
