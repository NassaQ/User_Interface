// ================================
// 🌍 TRANSLATION: About Page
// Namespace: pages.about.*
// ================================

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Target, Users, Award, Rocket } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import nada from "../assets/photo_2025-11-24_11-02-19.jpg";
import waly from "../assets/waly.jpg";
import youssif from "../assets/yosifmohammed.jpg";
import ganna from "../assets/ganna.jpg";
import alaa from "../assets/alaa.jpg";
import sayed from "../assets/sayed.jpg";
import osama from "../assets/Osama.jpg";
import abdulrahman from "../assets/abdulrahman.png";

const About = () => {
  const { t } = useLanguage();

  const team = [
    {
      nameKey: "pages.about.team.names.nada",
      roleKey: "pages.about.team.roles.frontend",
      image: nada,
    },
    {
      nameKey: "pages.about.team.names.osama",
      roleKey: "pages.about.team.roles.backend",
      image: osama,
    },
    {
      nameKey: "pages.about.team.names.ganna",
      roleKey: "pages.about.team.roles.data",
      image: ganna,
    },
    {
      nameKey: "pages.about.team.names.ahmed",
      roleKey: "pages.about.team.roles.data",
      image: waly,
    },
    {
      nameKey: "pages.about.team.names.youssef",
      roleKey: "pages.about.team.roles.ai",
      image: "https://i.pravatar.cc/150?img=4",
    },
    {
      nameKey: "pages.about.team.names.alaa",
      roleKey: "pages.about.team.roles.data",
      image: alaa,
    },
    {
      nameKey: "pages.about.team.names.elsayed",
      roleKey: "pages.about.team.roles.data",
      image: sayed,
    },
    {
      nameKey: "pages.about.team.names.yousef2",
      roleKey: "pages.about.team.roles.ai",
      image: youssif,
    },
    {
      nameKey: "pages.about.team.names.abdulrahman",
      roleKey: "pages.about.team.roles.backend",
      image: abdulrahman,
    },
  ];


  const values = [
    {
      icon: Target,
      titleKey: "pages.about.values.mission.title",
      descKey: "pages.about.values.mission.desc",
    },
    {
      icon: Users,
      titleKey: "pages.about.values.vision.title",
      descKey: "pages.about.values.vision.desc",
    },
    {
      icon: Award,
      titleKey: "pages.about.values.values.title",
      descKey: "pages.about.values.values.desc",
    },
    {
      icon: Rocket,
      titleKey: "pages.about.values.goal.title",
      descKey: "pages.about.values.goal.desc",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* ================================
              🌍 TRANSLATION: Hero
             ================================ */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                {t("pages.about.hero.title")}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              {t("pages.about.hero.subtitle")}
            </p>
          </motion.div>

          {/* ================================
              🌍 TRANSLATION: Values
             ================================ */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all hover:shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{t(value.titleKey)}</h3>
                <p className="text-muted-foreground">{t(value.descKey)}</p>
              </motion.div>
            ))}
          </div>

          {/* ================================
              🌍 TRANSLATION: Story
             ================================ */}
          <motion.div
            className="max-w-4xl mx-auto mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
              {t("pages.about.story.title")}
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>{t("pages.about.story.p1")}</p>
              <p>{t("pages.about.story.p2")}</p>
              <p>{t("pages.about.story.p3")}</p>
            </div>
          </motion.div>

          {/* ================================
              🌍 TRANSLATION: Team
             ================================ */}
          <div>
            <motion.h2
              className="text-3xl lg:text-4xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {t("pages.about.team.title")}
            </motion.h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative mb-6 group">
                    <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-border group-hover:border-primary transition-all">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">
                    {t(member.nameKey)}
                  </h3>

                  <p className="text-muted-foreground">{t(member.roleKey)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
