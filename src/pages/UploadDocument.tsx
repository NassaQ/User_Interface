import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  FileText,
  Shield,
  ArrowLeft,
  HardDrive,
  File,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const UploadDocument = () => {
  const { t } = useLanguage();

  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setFileName(file.name);
  };

  return (
    <DashboardLayout
      title={t("pages.upload.title")}
      subtitle={t("pages.upload.subtitle")}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Back link */}
          <Link
            to="/studio"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("pages.upload.back")}
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Upload Card */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-1">
                {t("pages.upload.add.title")}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {t("pages.upload.add.subtitle")}
              </p>

              {/* Title Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("pages.upload.fields.title")}
                </label>
                <Input
                  placeholder={t("pages.upload.placeholders.title")}
                  className="rounded-xl"
                />
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("pages.upload.fields.description")}
                </label>
                <Textarea
                  placeholder={t("pages.upload.placeholders.description")}
                  className="rounded-xl min-h-[80px] resize-none"
                />
              </div>

              {/* File Path Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("pages.upload.fields.category")}
                </label>
                <Input
                  placeholder={t("pages.upload.placeholders.category")}
                  className="rounded-xl"
                />
              </div>

              {/* Drag and Drop Zone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("pages.upload.fields.attach")}
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-secondary/50"
                  }`}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                      isDragging ? "bg-primary/10" : "bg-secondary"
                    }`}
                  >
                    <Upload
                      className={`w-6 h-6 ${
                        isDragging ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>

                  <p className="font-medium text-foreground mb-1">
                    {fileName || t("pages.upload.drag")}
                  </p>

                  <p className="text-sm text-muted-foreground mb-2">
                    {t("pages.upload.or")}
                  </p>

                  <span className="text-sm font-medium text-primary hover:underline">
                    {t("pages.upload.browse")}
                  </span>

                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setFileName(file.name);
                    }}
                  />
                </div>
              </div>

              {/* Upload Button */}
              <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-base font-semibold gap-2">
                <Upload className="w-5 h-5" />
                {t("pages.upload.actions.upload")}
              </Button>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Supported Formats */}
              <motion.div
                className="bg-card border border-border rounded-2xl p-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground text-sm">
                    {t("pages.upload.sidebar.formats")}
                  </h3>
                </div>

                <div className="space-y-2">
                  {[
                    { ext: ".pdf", label: "PDF Documents" },
                    { ext: ".doc/.docx", label: "Word Documents" },
                    { ext: ".txt", label: "Text Files" },
                    { ext: ".csv", label: "CSV Spreadsheets" },
                    { ext: ".xlsx", label: "Excel Files" },
                  ].map((format) => (
                    <div
                      key={format.ext}
                      className="flex items-center gap-2 text-sm"
                    >
                      <File className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {format.label}
                      </span>
                      <span className="ml-auto text-xs font-mono text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded">
                        {format.ext}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Limits */}
              <motion.div
                className="bg-card border border-border rounded-2xl p-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <HardDrive className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground text-sm">
                    {t("pages.upload.sidebar.limits")}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("pages.upload.limits.maxSize")}
                    </span>
                    <span className="font-medium text-foreground">25 MB</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("pages.upload.limits.maxFiles")}
                    </span>
                    <span className="font-medium text-foreground">
                      10 per upload
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("pages.upload.limits.maxPages")}
                    </span>
                    <span className="font-medium text-foreground">
                      500 pages
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Security */}
              <motion.div
                className="bg-card border border-border rounded-2xl p-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-foreground text-sm">
                    {t("pages.upload.sidebar.security")}
                  </h3>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("pages.upload.security.desc")}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default UploadDocument;
