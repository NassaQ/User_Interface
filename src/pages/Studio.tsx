// ================================
// 🌍 TRANSLATION: Studio Page
// Namespace: pages.studio.*
// ================================

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Send,
  Paperclip,
  Sparkles,
  Copy,
  Download,
  RotateCcw,
  Wand2,
  FileText,
  Image,
  Code,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Studio = () => {
  const { t } = useLanguage();
  const [inputText, setInputText] = useState("");

  const outputModes = [
    { icon: FileText, labelKey: "pages.studio.modes.document", active: true },
    { icon: MessageSquare, labelKey: "pages.studio.modes.chat", active: false },
    { icon: Image, labelKey: "pages.studio.modes.image", active: false },
    { icon: Code, labelKey: "pages.studio.modes.code", active: false },
  ];

  const templates = [
    {
      nameKey: "pages.studio.templates.blog.title",
      descKey: "pages.studio.templates.blog.desc",
    },
    {
      nameKey: "pages.studio.templates.product.title",
      descKey: "pages.studio.templates.product.desc",
    },
    {
      nameKey: "pages.studio.templates.email.title",
      descKey: "pages.studio.templates.email.desc",
    },
    {
      nameKey: "pages.studio.templates.social.title",
      descKey: "pages.studio.templates.social.desc",
    },
  ];

  const sampleOutput = t("pages.studio.sampleOutput");

  return (
    <DashboardLayout
      title={t("pages.studio.title")}
      subtitle={t("pages.studio.subtitle")}
    >
      <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
        {/* Left Panel - Input */}
        <motion.div
          className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Output Mode Selector */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              {outputModes.map((mode, index) => (
                <button
                  key={index}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    mode.active
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <mode.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{t(mode.labelKey)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="p-4 border-b border-border">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              {t("pages.studio.templates.title")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((template, index) => (
                <button
                  key={index}
                  className="text-left p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors group"
                >
                  <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {t(template.nameKey)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t(template.descKey)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t("pages.studio.input.placeholder")}
                className="w-full h-full min-h-[200px] bg-secondary/30 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Input Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Wand2 className="w-4 h-4" />
                </Button>
              </div>
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 gap-2">
                <Sparkles className="w-4 h-4" />
                {t("pages.studio.actions.generate")}
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Output */}
        <motion.div
          className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Output Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {t("pages.studio.output.title")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("pages.studio.output.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Output Content */}
          <div className="flex-1 p-4 sm:p-6 overflow-auto">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed text-sm">
                {sampleOutput}
              </div>
            </div>
          </div>

          {/* Output Footer */}
          <div className="p-4 border-t border-border bg-secondary/30">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {t("pages.studio.output.meta")}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  {t("pages.studio.actions.refine")}
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  {t("pages.studio.actions.save")}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Studio;
