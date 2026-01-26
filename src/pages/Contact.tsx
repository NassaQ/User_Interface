// ================================
// 🌍 TRANSLATION: Contact Page
// Namespace: pages.contact.*
// ================================

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000),
});

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      contactSchema.parse(formData);
      console.log("Form submitted:", formData);
      setErrors({});
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      titleKey: "pages.contact.info.email",
      value: "ahes64033@gmail.com",
    },
    {
      icon: Phone,
      titleKey: "pages.contact.info.phone",
      value: "+20 1033689664",
    },
    {
      icon: MapPin,
      titleKey: "pages.contact.info.location",
      value: "123 AI Street, Tech City, TC 12345",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* ================================
              🌍 TRANSLATION: Hero
             ================================ */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                {t("pages.contact.hero.title")}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              {t("pages.contact.hero.subtitle")}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* ================================
                🌍 TRANSLATION: Form
               ================================ */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">
                  {t("pages.contact.form.title")}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {t("pages.contact.form.nameLabel")}
                    </Label>
                    <Input
                      id="name"
                      placeholder={t("pages.contact.form.namePlaceholder")}
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {t("pages.contact.form.emailLabel")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("pages.contact.form.emailPlaceholder")}
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      {t("pages.contact.form.subjectLabel")}
                    </Label>
                    <Input
                      id="subject"
                      placeholder={t("pages.contact.form.subjectPlaceholder")}
                      value={formData.subject}
                      onChange={handleChange}
                      className={errors.subject ? "border-destructive" : ""}
                    />
                    {errors.subject && (
                      <p className="text-sm text-destructive">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {t("pages.contact.form.messageLabel")}
                    </Label>
                    <Textarea
                      id="message"
                      placeholder={t("pages.contact.form.messagePlaceholder")}
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    size="lg"
                  >
                    {t("pages.contact.form.submit")}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* ================================
                🌍 TRANSLATION: Info
               ================================ */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {t("pages.contact.info.title")}
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">{t(info.titleKey)}</h3>
                        <p className="text-muted-foreground">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4">
                  {t("pages.contact.hours.title")}
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>{t("pages.contact.hours.weekdays")}</p>
                  <p>{t("pages.contact.hours.saturday")}</p>
                  <p>{t("pages.contact.hours.sunday")}</p>
                </div>
              </div>

              {/* Help */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-2">
                  {t("pages.contact.help.title")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("pages.contact.help.subtitle")}
                </p>
                <Button variant="outline" className="w-full">
                  {t("pages.contact.help.cta")}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
