// ================================
// 🌍 TRANSLATION: Settings Page
// Namespace: pages.settings.*
// ================================

import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Smartphone,
  Mail,
  MessageSquare,
  Moon,
  Volume2,
  Eye,
  Lock,
  LogOut,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Settings = () => {
  const { t } = useLanguage();

  const settingsSections = [
    {
      titleKey: "pages.settings.sections.notifications",
      icon: Bell,
      settings: [
        {
          labelKey: "pages.settings.notifications.email.title",
          descKey: "pages.settings.notifications.email.desc",
          enabled: true,
          icon: Mail,
        },
        {
          labelKey: "pages.settings.notifications.push.title",
          descKey: "pages.settings.notifications.push.desc",
          enabled: true,
          icon: Smartphone,
        },
        {
          labelKey: "pages.settings.notifications.inapp.title",
          descKey: "pages.settings.notifications.inapp.desc",
          enabled: false,
          icon: MessageSquare,
        },
        {
          labelKey: "pages.settings.notifications.sound.title",
          descKey: "pages.settings.notifications.sound.desc",
          enabled: false,
          icon: Volume2,
        },
      ],
    },
    {
      titleKey: "pages.settings.sections.appearance",
      icon: Palette,
      settings: [
        {
          labelKey: "pages.settings.appearance.dark.title",
          descKey: "pages.settings.appearance.dark.desc",
          enabled: false,
          icon: Moon,
        },
        {
          labelKey: "pages.settings.appearance.motion.title",
          descKey: "pages.settings.appearance.motion.desc",
          enabled: false,
          icon: Eye,
        },
      ],
    },
    {
      titleKey: "pages.settings.sections.language",
      icon: Globe,
      settings: [
        {
          labelKey: "pages.settings.language.lang.title",
          descKey: "pages.settings.language.lang.desc",
          type: "select",
          icon: Globe,
        },
        {
          labelKey: "pages.settings.language.timezone.title",
          descKey: "pages.settings.language.timezone.desc",
          type: "select",
          icon: Globe,
        },
      ],
    },
  ];

  const securitySettings = [
    {
      labelKey: "pages.settings.security.password.title",
      descKey: "pages.settings.security.password.desc",
      icon: Key,
      actionKey: "pages.settings.actions.update",
    },
    {
      labelKey: "pages.settings.security.2fa.title",
      descKey: "pages.settings.security.2fa.desc",
      icon: Shield,
      actionKey: "pages.settings.actions.enable",
    },
    {
      labelKey: "pages.settings.security.sessions.title",
      descKey: "pages.settings.security.sessions.desc",
      icon: Smartphone,
      actionKey: "pages.settings.actions.view",
    },
    {
      labelKey: "pages.settings.security.history.title",
      descKey: "pages.settings.security.history.desc",
      icon: Eye,
      actionKey: "pages.settings.actions.view",
    },
  ];

  return (
    <DashboardLayout
      title={t("pages.settings.title")}
      subtitle={t("pages.settings.subtitle")}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.titleKey}
            className="bg-card border border-border rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
          >
            <div className="flex items-center gap-3 p-5 border-b border-border bg-secondary/30">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{t(section.titleKey)}</h3>
            </div>

            <div className="divide-y divide-border">
              {section.settings.map((setting, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-5 hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center">
                      <setting.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {t(setting.labelKey)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(setting.descKey)}
                      </p>
                    </div>
                  </div>

                  {setting.type === "select" ? (
                    <Button variant="outline" size="sm">
                      {t("pages.settings.actions.change")}
                    </Button>
                  ) : (
                    <button
                      className={`relative w-12 h-7 rounded-full transition-colors ${
                        setting.enabled ? "bg-primary" : "bg-border"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-5 h-5 bg-primary-foreground rounded-full shadow transition-all ${
                          setting.enabled ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Security Section */}
        <motion.div
          className="bg-card border border-border rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 p-5 border-b border-border bg-secondary/30">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">
              {t("pages.settings.sections.security")}
            </h3>
          </div>

          <div className="divide-y divide-border">
            {securitySettings.map((setting, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-5 hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center">
                    <setting.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {t(setting.labelKey)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(setting.descKey)}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {t(setting.actionKey)}
                </Button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className="bg-card border border-destructive/30 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 p-5 border-b border-destructive/20 bg-destructive/5">
            <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-destructive">
              {t("pages.settings.sections.danger")}
            </h3>
          </div>

          <div className="divide-y divide-destructive/20">
            <div className="flex items-center justify-between p-5 hover:bg-destructive/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {t("pages.settings.danger.signout.title")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("pages.settings.danger.signout.desc")}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                {t("pages.settings.danger.signout.action")}
              </Button>
            </div>

            <div className="flex items-center justify-between p-5 hover:bg-destructive/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {t("pages.settings.danger.delete.title")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("pages.settings.danger.delete.desc")}
                  </p>
                </div>
              </div>
              <Button variant="destructive" size="sm">
                {t("pages.settings.danger.delete.action")}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
