// ================================
// 🌍 TRANSLATION: Profile Page
// Namespace: pages.profile.*
// ================================

import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Shield,
  Edit3,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Profile = () => {
  const { t } = useLanguage();

  const profileData = {
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    company: "Tech Innovations Inc.",
    role: "Product Manager",
    joinDate: "January 2023",
    plan: "Professional",
  };

  return (
    <DashboardLayout
      title={t("pages.profile.title")}
      subtitle={t("pages.profile.subtitle")}
    >
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          className="bg-card border border-border rounded-2xl overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-primary via-accent to-primary" />

          {/* Avatar & Basic Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-3xl font-bold text-primary-foreground border-4 border-card">
                  JD
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 sm:pb-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {profileData.name}
                </h2>
                <p className="text-muted-foreground">
                  {profileData.role} {t("pages.profile.at")}{" "}
                  {profileData.company}
                </p>
              </div>
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 gap-2 w-full sm:w-auto">
                <Edit3 className="w-4 h-4" />
                {t("pages.profile.actions.edit")}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <motion.div
            className="bg-card border border-border rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-6">
              {t("pages.profile.sections.personal")}
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  {t("pages.profile.fields.fullName")}
                </label>
                <input
                  type="text"
                  defaultValue={profileData.name}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  {t("pages.profile.fields.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    defaultValue={profileData.email}
                    className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  {t("pages.profile.fields.phone")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    defaultValue={profileData.phone}
                    className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  {t("pages.profile.fields.location")}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    defaultValue={profileData.location}
                    className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-xl"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Work Information */}
          <motion.div
            className="bg-card border border-border rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6">
              {t("pages.profile.sections.work")}
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  {t("pages.profile.fields.company")}
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    defaultValue={profileData.company}
                    className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  {t("pages.profile.fields.role")}
                </label>
                <input
                  type="text"
                  defaultValue={profileData.role}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  {t("pages.profile.fields.memberSince")}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    defaultValue={profileData.joinDate}
                    disabled
                    className="w-full pl-12 pr-4 py-3 bg-secondary/30 border border-border rounded-xl text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  {t("pages.profile.fields.plan")}
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <div className="w-full pl-12 pr-4 py-3 bg-secondary/30 border border-border rounded-xl flex items-center justify-between">
                    <span className="text-foreground">{profileData.plan}</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-primary"
                    >
                      {t("pages.profile.actions.upgrade")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-end mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Button variant="outline" className="order-2 sm:order-1">
            {t("pages.profile.actions.cancel")}
          </Button>
          <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 order-1 sm:order-2">
            {t("pages.profile.actions.save")}
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
