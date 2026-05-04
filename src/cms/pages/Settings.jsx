import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  KeyRound,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Info,
  BadgeCheck,
  Camera,
  Check
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, resetPassword } from "../../features/members/memberSlice";
import { toast } from "react-toastify";

export default function ProfileSettingsPage() {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const loggedUser = authState?.user?.user;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
  });

  const [passwords, setPasswords] = useState({
    new: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (loggedUser) {
      setFormData({
        fullName: loggedUser.fullName || "",
        email: loggedUser.emailId || "",
        role: loggedUser.role?.replace("_", " ").toUpperCase() || "",
      });
    }
  }, [loggedUser]);

  const isPrivileged =
    loggedUser?.role === "super_admin" || loggedUser?.role === "admin";

  /* ================= PERSONAL DETAILS SAVE ================= */
  const handleProfileSave = async () => {
    if (!isPrivileged) return;
    try {
      setSavingProfile(true);
      await dispatch(
        updateProfile({
          id: loggedUser._id,
          data: {
            fullName: formData.fullName,
            emailId: formData.email,
          },
        })
      ).unwrap();
      toast.success("Profile details updated ✅");
    } catch (err) {
      toast.error(err || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  /* ================= PASSWORD SAVE ================= */
  const handlePasswordSave = async () => {
    if (!isPrivileged) return;
    if (!passwords.new) {
      toast.warning("Enter a new password");
      return;
    }
    try {
      setSavingPassword(true);
      await dispatch(
        resetPassword({
          id: loggedUser._id,
          newPassword: passwords.new,
        })
      ).unwrap();
      toast.success("Password updated successfully 🔐");
      setPasswords({ new: "" });
    } catch (err) {
      toast.error(err || "Password update failed");
    } finally {
      setSavingPassword(false);
    }
  };

  // UI Helpers
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans py-10 px-4 sm:px-6 lg:px-8 selection:bg-indigo-100 selection:text-indigo-900">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1100px] mx-auto space-y-8"
      >
        {/* PAGE HEADER */}
        <motion.div variants={itemVariants} className="pb-4 border-b border-slate-200/80">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            Manage your profile identity, email addresses, and security preferences.
          </p>
        </motion.div>

        {/* NON-PRIVILEGED ALERT */}
        {!isPrivileged && (
          <motion.div variants={itemVariants} className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 shadow-sm backdrop-blur-sm">
            <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">View-Only Mode Active</h4>
              <p className="text-sm text-amber-800/80 mt-1">
                Your current role (<strong>{formData.role || "USER"}</strong>) restricts you from editing these details. 
                Please contact a workspace Super Admin to request changes to your profile.
              </p>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT SIDEBAR: PROFILE OVERVIEW */}
          <motion.div variants={itemVariants} className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/80 overflow-hidden relative">
              {/* Cover Banner - Upgraded Gradient */}
              <div className="h-28 bg-gradient-to-tr from-[#23b5b5] via-[#0b7878] to-[#0a5555] w-full relative">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-white text-xs font-semibold shadow-sm border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-[#169696] animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                  Active
                </div>
              </div>

              {/* Avatar & Info */}
              <div className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center">
                <div className="w-22 h-22 rounded-2xl bg-white p-1.5 -mt-12 shadow-lg relative group cursor-pointer border border-slate-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-blue-50 text-[#23b5b5] flex items-center justify-center rounded-xl text-2xl font-bold border border-indigo-100/50">
                    {getInitials(formData.fullName)}
                  </div>
                  {isPrivileged && (
                    <div className="absolute inset-1.5 bg-slate-900/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 backdrop-blur-sm">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-900 flex items-center justify-center gap-1.5 w-full">
                  <span className="truncate">{formData.fullName || "User Name"}</span>
                  {isPrivileged && <BadgeCheck className="w-4.5 h-4.5 text-[#23b5b5] flex-shrink-0" />}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5 truncate w-full px-2">{formData.email || "user@example.com"}</p>

                {formData.role && (
                  <div className="mt-5 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-xs font-bold tracking-widest border border-slate-200/80 uppercase flex items-center gap-1.5 shadow-sm">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    {formData.role}
                  </div>
                )}
              </div>
              
              {/* Feature List */}
              <div className="border-t border-slate-100 px-6 py-5 bg-slate-50/50">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Permissions</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
                    <CheckCircle2 className={`w-4 h-4 ${isPrivileged ? "text-emerald-500" : "text-slate-300"}`} />
                    Edit Profile Data
                  </li>
                  <li className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
                    <CheckCircle2 className={`w-4 h-4 ${isPrivileged ? "text-emerald-500" : "text-slate-300"}`} />
                    Update Security Keys
                  </li>
                  <li className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    View Workspace
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: FORMS */}
          <div className="flex-1 w-full space-y-6">
            
            {/* PERSONAL DETAILS CARD */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/80 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Personal Details</h3>
                <p className="text-sm text-slate-500 mt-1">Update your display name and contact email address.</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.fullName}
                        disabled={!isPrivileged}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all duration-200 ${
                          !isPrivileged
                            ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                            : "bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        disabled={!isPrivileged}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all duration-200 ${
                          !isPrivileged
                            ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                            : "bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">
                  {isPrivileged ? "Changes will be reflected across your workspace." : "Contact an administrator to change these details."}
                </p>
                <button
                  onClick={handleProfileSave}
                  disabled={!isPrivileged || savingProfile}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    !isPrivileged
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-[0.98]"
                  }`}
                >
                  {savingProfile ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving</>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </motion.div>

            {/* SECURITY CARD */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/80 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Security Details</h3>
                  <p className="text-sm text-slate-500 mt-1">Set a new password to keep your account secure.</p>
                </div>
              </div>

              <div className="p-6">
                <div className="max-w-md space-y-4">
                  {/* ONLY New Password Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">New Password</label>
                    <div className="relative flex items-center">
                      <KeyRound className="absolute left-3 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="password"
                        placeholder="Enter a strong password..."
                        disabled={!isPrivileged}
                        value={passwords.new}
                        onChange={(e) => setPasswords({ new: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all duration-200 ${
                          !isPrivileged
                            ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                            : "bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Password Requirement Hint */}
                  {isPrivileged && (
                    <div className="flex gap-4 pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Check className={`w-3.5 h-3.5 ${passwords.new.length >= 8 ? 'text-emerald-500' : 'text-slate-300'}`} />
                        Min 8 characters
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Check className={`w-3.5 h-3.5 ${passwords.new.length > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                        Different from old
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">
                  You will be logged out of other devices after changing your password.
                </p>
                <button
                  onClick={handlePasswordSave}
                  disabled={!isPrivileged || savingPassword}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    !isPrivileged
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-[#169c9c] text-white hover:bg-[#127f7f] hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98]"
                  }`}
                >
                  {savingPassword ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Updating</>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}