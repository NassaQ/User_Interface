import { Brain, Zap, Shield, TrendingUp, Users, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";

const Features = () => {
  const { t } = useLanguage();

  const { ref: headerRef, inView: headerInView } = useInView<HTMLDivElement>({ once: true });
  const { ref: badgeRef, inView: badgeInView } = useInView<HTMLDivElement>({ once: true });
  const { ref: gridRef, inView: gridInView } = useInView<HTMLDivElement>({ once: true });

  // ================================
  // 🌍 TRANSLATION: Features Cards
  // Namespace: features.cards.*
  // ================================
  const features = [
    {
      icon: Brain,
      titleKey: "features.cards.ai.title",
      descKey: "features.cards.ai.desc",
      gradient: "from-primary to-accent",
    },
    {
      icon: Zap,
      titleKey: "features.cards.fast.title",
      descKey: "features.cards.fast.desc",
      gradient: "from-accent to-primary",
    },
    {
      icon: Shield,
      titleKey: "features.cards.security.title",
      descKey: "features.cards.security.desc",
      gradient: "from-primary via-accent to-primary",
    },
    {
      icon: TrendingUp,
      titleKey: "features.cards.analytics.title",
      descKey: "features.cards.analytics.desc",
      gradient: "from-accent to-primary",
    },
    {
      icon: Users,
      titleKey: "features.cards.team.title",
      descKey: "features.cards.team.desc",
      gradient: "from-primary to-accent",
    },
    {
      icon: Globe,
      titleKey: "features.cards.global.title",
      descKey: "features.cards.global.desc",
      gradient: "from-accent via-primary to-accent",
    },
  ];

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          ref={headerRef}
          className={`text-center mb-16 animate-fade-in-up ${headerInView ? 'in-view' : ''}`}
        >
          {/* ================================
              🌍 TRANSLATION: Section Badge
              Key: features.section.badge
             ================================ */}
          <div
            ref={badgeRef}
            className={`inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4 animate-fade-in-scale ${badgeInView ? 'in-view' : ''}`}
          >
            <span className="text-sm font-medium text-primary">
              {t("features.section.badge")}
            </span>
          </div>

          {/* ================================
              🌍 TRANSLATION: Section Title
              Key: features.section.title
             ================================ */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              {t("features.section.title")}
            </span>
          </h2>
        </div>

        <div ref={gridRef}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative animate-fade-in-up ${gridInView ? 'in-view' : ''} hover:-translate-y-1`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-full bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                  <div
                    className={`inline-flex p-4 bg-gradient-to-br ${feature.gradient} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* ================================
                      🌍 TRANSLATION: Card Title
                     ================================ */}
                  <h3 className="text-xl font-bold mb-3">
                    {t(feature.titleKey)}
                  </h3>

                  {/* ================================
                      🌍 TRANSLATION: Card Description
                     ================================ */}
                  <p className="text-muted-foreground leading-relaxed">
                    {t(feature.descKey)}
                  </p>

                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
