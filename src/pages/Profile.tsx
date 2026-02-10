// ================================
// 🌍 TRANSLATION: Profile Page
// Namespace: pages.profile.*
// ================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Mail,
  Calendar,
  Shield,
  Edit3,
  User as UserIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getCurrentUser, updateCurrentUser, type User } from "@/services/users.service";
import { ApiRequestError } from "@/lib/api";

const Profile = () => {
  const { t } = useLanguage();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const startEditing = () => {
    if (!user) return;
    setEditFullName(user.full_name);
    setEditUsername(user.username);
    setSaveError(null);
    setSaveSuccess(false);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!accessToken || !user) return;
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      const updated = await updateCurrentUser(accessToken, {
        full_name: editFullName,
        username: editUsername,
      });
      setUser(updated);
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setSaveError(err.detail);
      } else {
        setSaveError("Failed to update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!accessToken) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentUser(accessToken);
        setUser(data);
      } catch (err) {
        if (err instanceof ApiRequestError) {
          setError(err.detail);
        } else {
          setError("Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accessToken, navigate]);

  if (loading) {
    return (
      <DashboardLayout title={t("pages.profile.title")} subtitle={t("pages.profile.subtitle")}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout title={t("pages.profile.title")} subtitle={t("pages.profile.subtitle")}>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <AlertCircle className="w-10 h-10 text-destructive" />
          <p className="text-destructive font-medium">{error ?? "User not found."}</p>
        </div>
      </DashboardLayout>
    );
  }

  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joinDate = new Date(user.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
                  {initials}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 sm:pb-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {user.full_name}
                </h2>
                <p className="text-muted-foreground">
                  {user.role ?? "No role assigned"}
                </p>
              </div>
              {!editing && (
                <Button
                  onClick={startEditing}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 gap-2 w-full sm:w-auto"
                >
                  <Edit3 className="w-4 h-4" />
                  {t("pages.profile.actions.edit")}
                </Button>
              )}
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
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={editing ? editFullName : user.full_name}
                    onChange={(e) => setEditFullName(e.target.value)}
                    disabled={!editing}
                    className={`w-full pl-12 pr-4 py-3 border border-border rounded-xl ${
                      editing
                        ? "bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                        : "bg-secondary/50"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  {t("pages.profile.fields.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3 bg-secondary/30 border border-border rounded-xl text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={editing ? editUsername : user.username}
                    onChange={(e) => setEditUsername(e.target.value)}
                    disabled={!editing}
                    className={`w-full pl-12 pr-4 py-3 border border-border rounded-xl ${
                      editing
                        ? "bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                        : "bg-secondary/50"
                    }`}
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
                  {t("pages.profile.fields.role")}
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    defaultValue={user.role ?? "No role assigned"}
                    disabled
                    className="w-full pl-12 pr-4 py-3 bg-secondary/30 border border-border rounded-xl text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  {t("pages.profile.fields.memberSince")}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    defaultValue={joinDate}
                    disabled
                    className="w-full pl-12 pr-4 py-3 bg-secondary/30 border border-border rounded-xl text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Status
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <div className="w-full pl-12 pr-4 py-3 bg-secondary/30 border border-border rounded-xl flex items-center">
                    <span className={user.is_active ? "text-green-500 font-medium" : "text-yellow-500 font-medium"}>
                      {user.is_active ? "Active" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save / Cancel / Success / Error */}
        {editing && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {saveError && (
              <div className="flex items-center gap-2 text-destructive mb-4 bg-destructive/10 px-4 py-3 rounded-xl">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{saveError}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={cancelEditing} disabled={saving}>
                {t("pages.profile.actions.cancel")}
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("pages.profile.actions.save")}
              </Button>
            </div>
          </motion.div>
        )}

        {saveSuccess && !editing && (
          <motion.div
            className="mt-4 bg-green-500/10 text-green-600 px-4 py-3 rounded-xl text-sm font-medium text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Profile updated successfully!
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
