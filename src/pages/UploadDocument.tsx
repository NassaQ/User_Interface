import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useProcessing, SUPPORTED_EXTENSIONS } from "@/context/ProcessingContext";
import { toast } from "sonner";

const UploadDocument = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const {
    selectedFile,
    isProcessing,
    result,
    error,
    selectFile,
    processFile,
    reset,
  } = useProcessing();

  // ── Form state ───────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  // ── Navigate to Studio when processing completes ─────────────
  useEffect(() => {
    if (result && result.success) {
      toast.success(t("pages.upload.messages.success"), {
        description: result.filename,
        icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      });
      navigate("/studio");
    }
  }, [result, navigate, t]);

  // ── Show error toasts ────────────────────────────────────────
  useEffect(() => {
    if (error) {
      toast.error(t("pages.upload.messages.error"), {
        description: error,
        icon: <AlertCircle className="w-4 h-4 text-red-500" />,
      });
    }
  }, [error, t]);

  // ── Drag & drop handlers ─────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        setFileName(file.name);
        selectFile(file);
      }
    },
    [selectFile],
  );

  // ── File input handler ───────────────────────────────────────
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
        selectFile(file);
      }
    },
    [selectFile],
  );

  // ── Submit handler ───────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!selectedFile) {
      toast.error(t("pages.upload.messages.noFile"));
      return;
    }
    await processFile();
  }, [selectedFile, processFile, t]);

  return (
    <DashboardLayout
      title={t("pages.upload.title")}
      subtitle={t("pages.upload.subtitle")}
    >
      <div className="max-w-4xl mx-auto">
        <div className="animate-fade-in-up animate-on-mount">
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Upload Button */}
              <Button
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-base font-semibold gap-2"
                disabled={isProcessing}
                onClick={handleSubmit}
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                {isProcessing
                  ? t("pages.upload.actions.processing")
                  : t("pages.upload.actions.upload")}
              </Button>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Supported Formats */}
              <div
                className="bg-card border border-border rounded-2xl p-5 animate-slide-in-right animate-on-mount"
                style={{ animationDelay: '0.15s' }}
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
              </div>

              {/* Limits */}
              <div
                className="bg-card border border-border rounded-2xl p-5 animate-slide-in-right animate-on-mount"
                style={{ animationDelay: '0.25s' }}
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
              </div>

              {/* Security */}
              <div
                className="bg-card border border-border rounded-2xl p-5 animate-slide-in-right animate-on-mount"
                style={{ animationDelay: '0.35s' }}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadDocument;
