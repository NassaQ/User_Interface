import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
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
  Image,
  Code,
  MessageSquare,
  FolderOpen,
  Upload,
  X,
  File,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Studio = () => {
  const { t } = useLanguage();

  const [inputText, setInputText] = useState("");
  const [showFilePopup, setShowFilePopup] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const outputModes = [
    {
      icon: MessageSquare,
      label: t("pages.studio.modes.chat"),
      active: true,
      link: null,
    },
    {
      icon: FolderOpen,
      label: t("pages.studio.modes.document"),
      active: false,
      link: "/upload-document",
    },
    {
      icon: Image,
      label: t("pages.studio.modes.image"),
      active: false,
      link: null,
    },
    {
      icon: Code,
      label: t("pages.studio.modes.code"),
      active: false,
      link: null,
    },
  ];

  const templates = [
    {
      name: t("pages.studio.templates.blog.title"),
      description: t("pages.studio.templates.blog.desc"),
    },
    {
      name: t("pages.studio.templates.product.title"),
      description: t("pages.studio.templates.product.desc"),
    },
    {
      name: t("pages.studio.templates.email.title"),
      description: t("pages.studio.templates.email.desc"),
    },
    {
      name: t("pages.studio.templates.social.title"),
      description: t("pages.studio.templates.social.desc"),
    },
  ];

  return (
    <DashboardLayout
      title={t("pages.studio.title")}
      subtitle={t("pages.studio.subtitle")}
    >
      <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
        {/* LEFT PANEL */}
        <motion.div
          className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Modes */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              {outputModes.map((mode, index) => {
                const classes = `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  mode.active
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`;

                return mode.link ? (
                  <Link key={index} to={mode.link} className={classes}>
                    <mode.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{mode.label}</span>
                  </Link>
                ) : (
                  <button key={index} className={classes}>
                    <mode.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{mode.label}</span>
                  </button>
                );
              })}
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
                    {template.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Attached Badge */}
          {attachedFile && (
            <div className="px-4 pt-3">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-lg border border-primary/20">
                <File className="w-3.5 h-3.5" />
                <span className="max-w-[200px] truncate">{attachedFile}</span>
                <button onClick={() => setAttachedFile(null)}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex-1 p-4 flex flex-col">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                attachedFile
                  ? t("pages.studio.input.filePlaceholder")
                  : t("pages.studio.input.placeholder")
              }
              className="w-full h-full min-h-[200px] bg-secondary/30 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilePopup(true)}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>

                <Button variant="ghost" size="icon">
                  <Wand2 className="w-4 h-4" />
                </Button>
              </div>

              <Button className="bg-gradient-to-r from-primary to-accent gap-2">
                <Sparkles className="w-4 h-4" />
                {t("pages.studio.actions.generate")}
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <p className="font-medium text-sm">
                {t("pages.studio.output.title")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("pages.studio.output.subtitle")}
              </p>
            </div>

            <div className="flex gap-1">
              <Button variant="ghost" size="icon">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-auto">
            <div className="whitespace-pre-wrap text-sm text-foreground/90">
              {t("pages.studio.sampleOutput")}
            </div>
          </div>

          <div className="p-4 border-t border-border bg-secondary/30 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {t("pages.studio.output.meta")}
            </p>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                {t("pages.studio.actions.refine")}
              </Button>
              <Button size="sm">{t("pages.studio.actions.save")}</Button>
            </div>
          </div>
        </motion.div>
      </div>
      {/* FILE POPUP */}
      <AnimatePresence>
        {showFilePopup && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilePopup(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <button
                    onClick={() => setShowFilePopup(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center flex-1">
                    <h3 className="font-semibold text-foreground text-sm">
                      {t("pages.studio.popup.title")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t("pages.studio.popup.subtitle")}
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-primary" />
                  </div>
                </div>

                {/* Drop Zone */}
                <div
                  className="border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-secondary/50 mb-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <p className="font-medium text-foreground text-sm mb-1">
                    {t("pages.studio.popup.drag")}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, TXT, CSV, XLSX — Max 25MB
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAttachedFile(file.name);
                        setShowFilePopup(false);
                      }
                    }}
                  />
                </div>

                {/* Extensions Chips */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {[".xlsx", ".csv", ".txt", ".docx", ".doc", ".pdf"].map(
                    (ext) => (
                      <span
                        key={ext}
                        className="text-xs font-mono text-primary/70 bg-primary/5 px-3 py-1 rounded-full border border-primary/10"
                      >
                        {ext}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Studio;
