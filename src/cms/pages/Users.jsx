import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MoreVertical,
  Loader2,
  X,
  User,
  Edit3,
  ShieldCheck,
  Trash2,
  Mail,
  Lock,
  Eye,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMembers,
  createMember,
  changeRole,
  toggleStatus,
  removeMember,
  updateProfile,
  resetPassword,
  reset,
} from "../../features/members/memberSlice";
import { toast } from "react-toastify";

/* ========================================================== */
/* UI/UX UTILITIES                                            */
/* ========================================================== */

const getInitials = (name) => {
  if (!name) return "SY";
  const parts = name.trim().split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Sleek, soft color palettes for roles
const getRoleBadgeStyle = (role) => {
  switch (role?.toLowerCase()) {
    case "super_admin":
    case "super admin":
      return "bg-[#e8f6f6] text-[#1c8f8f] border border-[#1c8f8f]/20";
    case "admin":
      return "bg-[#e8f6f6] text-[#1c8f8f] border border-[#1c8f8f]/20";
    case "editor":
      return "bg-blue-50 text-blue-600 border border-blue-600/20";
    case "author":
      return "bg-slate-100 text-slate-700 border border-slate-500/20";
    case "viewer":
      return "bg-amber-50 text-amber-700 border border-amber-600/20";
    default:
      return "bg-slate-50 text-slate-600 border border-slate-500/20";
  }
};

/* ========================================================== */
/* MAIN COMPONENT                                             */
/* ========================================================== */

export default function UsersManagement() {
  const dispatch = useDispatch();

  const {
    users = [],
    isLoading,
    isSuccess,
    isError,
    message,
  } = useSelector((state) => state.members);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [modal, setModal] = useState({ type: null, user: null });

  // BUG FIX: Only fetch users if the list is empty (prevents redundant API calls)
  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchMembers());
    }
  }, [dispatch, users.length]);

  useEffect(() => {
    if (isSuccess && message) toast.success(message);
    if (isError && message) toast.error(message);
    dispatch(reset());
  }, [isSuccess, isError, message, dispatch]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.emailId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchTerm, roleFilter]);

  const openModal = (type, user = null) => {
    setModal({ type, user });
    setActiveMenuId(null);
  };

  const closeModal = () => setModal({ type: null, user: null });

  return (
    <div className="w-full flex-1 flex flex-col font-sans bg-[#F8FAFC] min-h-screen relative">
      {/* Decorative background gradient */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-[#e8f6f6]/60 to-transparent pointer-events-none z-0" />

      {/* ================= HEADER ================= */}
      <header className="relative z-10 px-4 sm:px-8 lg:px-12 py-8 lg:py-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="w-full lg:w-auto">
          <h1 className="text-[26px] sm:text-[30px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Team Members
          </h1>
          <p className="text-[15px] text-slate-500 mt-1 font-medium">
            Manage platform access, roles, and overall security.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
          {/* SEARCH BAR */}
          <div className="relative group w-full sm:w-64 shrink-0">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#23b5b5] transition-colors"
            />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#23b5b5] focus:ring-4 focus:ring-[#23b5b5]/10 transition-all shadow-sm"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {/* FILTER */}
            <div className="relative w-full sm:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-700 focus:outline-none focus:border-[#23b5b5] focus:ring-4 focus:ring-[#23b5b5]/10 transition-all shadow-sm cursor-pointer hover:border-slate-300"
              >
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="author">Author</option>
                <option value="viewer">Viewer</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* NEW MEMBER BUTTON */}
            <button
              onClick={() => openModal("add")}
              className="w-full sm:w-auto bg-[#23b5b5] hover:bg-[#1da1a1] active:scale-[0.97] transition-all text-white px-6 py-2.5 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(35,181,181,0.25)] hover:shadow-[0_6px_16px_rgba(35,181,181,0.35)] whitespace-nowrap"
            >
              <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">New Member</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= DATA GRID (Responsive) ================= */}
      <main className="relative z-10 px-4 sm:px-8 lg:px-12 pb-20">
        <div className="bg-white rounded-[24px] ring-1 ring-slate-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full relative overflow-visible">
          
          {/* DESKTOP HEADER */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-5 border-b border-slate-100 bg-slate-50/50 rounded-t-[24px]">
            <div className="col-span-3 text-[12px] font-bold text-slate-400 uppercase tracking-widest">Identity</div>
            <div className="col-span-2 text-[12px] font-bold text-slate-400 uppercase tracking-widest">Role</div>
            <div className="col-span-2 text-[12px] font-bold text-slate-400 uppercase tracking-widest">Status</div>
            <div className="col-span-2 text-[12px] font-bold text-slate-400 uppercase tracking-widest">Dates</div>
            <div className="col-span-2 text-[12px] font-bold text-slate-400 uppercase tracking-widest">Created By</div>
            <div className="col-span-1 text-[12px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</div>
          </div>

          {/* LIST BODY */}
          <div className="flex flex-col divide-y divide-slate-100">
            {isLoading && users.length === 0 ? (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <Loader2 className="animate-spin text-[#23b5b5] h-10 w-10 mb-4" />
                <p className="text-[15px] text-slate-500 font-medium">
                  Loading your workspace...
                </p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center text-center px-4">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 ring-4 ring-slate-50/50">
                  <User size={32} className="text-slate-300" />
                </div>
                <p className="text-[16px] font-bold text-slate-800">No team members found</p>
                <p className="text-[14px] text-slate-500 mt-1 max-w-sm">
                  We couldn't find any members matching your current search or filter criteria.
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const creatorName = user.createdBy?.fullName || "System";
                const createdDate = formatDate(user.createdAt);
                const updatedDate = formatDate(user.updatedAt);

                return (
                  <div
                    key={user._id}
                    className="relative group flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-4 items-start lg:items-center px-5 sm:px-8 py-6 lg:py-4 hover:bg-slate-50/60 transition-colors duration-200"
                  >
                    {/* IDENTITY */}
                    <div className="lg:col-span-3 flex items-center gap-4 w-full pr-10 lg:pr-0">
                      <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-[#e6f7f7] to-[#cceded] text-[#1c8f8f] font-bold flex items-center justify-center text-[14px] shadow-sm ring-2 ring-white">
                        {getInitials(user.fullName)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-[15px] tracking-tight truncate">
                          {user.fullName}
                        </div>
                        <div className="text-[13px] text-slate-500 font-medium mt-0.5 truncate">
                          {user.emailId}
                        </div>
                      </div>
                    </div>

                    {/* ROLE */}
                    <div className="lg:col-span-2 flex flex-col lg:block w-full mt-2 lg:mt-0">
                      <span className="lg:hidden text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role</span>
                      <div className="inline-flex">
                        <span
                          className={`px-3 py-1.5 rounded-md text-[12px] font-bold uppercase tracking-wider ${getRoleBadgeStyle(
                            user.role
                          )}`}
                        >
                          {user.role?.replace("_", " ") || "No Role"}
                        </span>
                      </div>
                    </div>

                    {/* STATUS TOGGLE */}
                    <div className="lg:col-span-2 flex flex-col lg:block w-full mt-2 lg:mt-0">
                      <span className="lg:hidden text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Status</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            dispatch(
                              toggleStatus({
                                id: user._id,
                                isActive: !user.isActive,
                              })
                            )
                          }
                          className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23b5b5] focus-visible:ring-offset-2 ${
                            user.isActive ? "bg-[#23b5b5]" : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] ring-0 transition duration-200 ease-in-out ${
                              user.isActive ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className={`text-[13px] font-semibold ${user.isActive ? "text-slate-800" : "text-slate-400"}`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* DATES */}
                    <div className="lg:col-span-2 flex flex-col w-full mt-2 lg:mt-0">
                      <span className="lg:hidden text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dates</span>
                      <div className="text-[14px] text-slate-800 font-semibold">
                        {createdDate}
                      </div>
                      {user.updatedAt && (
                        <div className="text-[12px] text-slate-400 mt-1 font-medium">
                          Upd: {updatedDate}
                        </div>
                      )}
                    </div>

                    {/* CREATED BY */}
                    <div className="lg:col-span-2 flex flex-col lg:block w-full mt-2 lg:mt-0">
                      <span className="lg:hidden text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Created By</span>
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold ring-1 ring-slate-200/50 shadow-sm shrink-0">
                          {getInitials(creatorName)}
                        </div>
                        <span className="text-[14px] font-medium text-slate-700 truncate">
                          {creatorName}
                        </span>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="lg:col-span-1 absolute top-5 right-4 lg:relative lg:top-auto lg:right-auto flex justify-end lg:w-full">
                      <button
                        onClick={() =>
                          setActiveMenuId(
                            activeMenuId === user._id ? null : user._id
                          )
                        }
                        className="p-2 text-slate-400 hover:text-[#23b5b5] hover:bg-[#f0fafa] rounded-xl transition-all focus:outline-none"
                      >
                        <MoreVertical size={20} />
                      </button>

                      {/* POP-OUT MENU */}
                      <AnimatePresence>
                        {activeMenuId === user._id && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 top-12 lg:right-8 lg:top-10 w-48 bg-white border border-slate-100 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-50 p-1.5 overflow-hidden origin-top-right"
                          >
                            <button
                              onClick={() => openModal("view", user)}
                              className="w-full px-3 py-2.5 text-[13px] font-semibold text-slate-700 hover:text-[#23b5b5] hover:bg-[#f8fcfc] rounded-xl flex items-center gap-3 transition-colors text-left"
                            >
                              <User size={16} /> View Profile
                            </button>
                            <button
                              onClick={() => openModal("edit", user)}
                              className="w-full px-3 py-2.5 text-[13px] font-semibold text-slate-700 hover:text-[#23b5b5] hover:bg-[#f8fcfc] rounded-xl flex items-center gap-3 transition-colors text-left"
                            >
                              <Edit3 size={16} /> Edit Settings
                            </button>
                            <button
                              onClick={() => openModal("role", user)}
                              className="w-full px-3 py-2.5 text-[13px] font-semibold text-slate-700 hover:text-[#23b5b5] hover:bg-[#f8fcfc] rounded-xl flex items-center gap-3 transition-colors text-left"
                            >
                              <ShieldCheck size={16} /> Access Role
                            </button>
                            <div className="h-[1px] bg-slate-100 my-1 mx-2"></div>
                            <button
                              onClick={() => openModal("delete", user)}
                              className="w-full px-3 py-2.5 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-3 transition-colors text-left"
                            >
                              <Trash2 size={16} /> Delete Account
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* ================= MODALS OVERLAY ================= */}
      <AnimatePresence>
        {modal.type && (
          <ModalWrapper onClose={closeModal}>
            {modal.type === "add" && <AddMember closeModal={closeModal} />}
            {modal.type === "view" && (
              <ViewProfile user={modal.user} closeModal={closeModal} />
            )}
            {modal.type === "edit" && (
              <EditProfile user={modal.user} closeModal={closeModal} />
            )}
            {modal.type === "role" && (
              <ChangeRole user={modal.user} closeModal={closeModal} />
            )}
            {modal.type === "delete" && (
              <DeleteUser user={modal.user} closeModal={closeModal} />
            )}
          </ModalWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================================================== */
/* REUSABLE SUB-COMPONENTS                                    */
/* ========================================================== */

// 1. Premium Modal Wrapper (Larger Width, No Scrolling Needed)
const ModalWrapper = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-[100] p-4 sm:p-6"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      // INCREASED WIDTH to 520px for a sleeker, more breathable layout
      className="bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] ring-1 ring-slate-100 w-full max-w-[520px] relative flex flex-col"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-full transition-colors z-10"
      >
        <X size={20} />
      </button>
      <div className="p-7 sm:p-9">
        {children}
      </div>
    </motion.div>
  </motion.div>
);

// 2. Add Member Component
const AddMember = ({ closeModal }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    fullName: "",
    emailId: "",
    password: "",
    role: "author",
  });

  const handleSubmit = () => {
    dispatch(createMember({ ...form, isActive: true }));
    closeModal();
  };

  return (
    <>
      <div className="mb-8 pr-6">
        <h2 className="text-[24px] sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-tight">Add New Member</h2>
        <p className="text-[14px] text-slate-500 mt-2 font-medium">
          Invite a new user to your workspace and assign initial credentials.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
            Full Name
          </label>
          <input
            placeholder="e.g. Alice Freeman"
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-[15px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#23b5b5] focus:ring-4 focus:ring-[#23b5b5]/10 transition-all placeholder-slate-400"
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
            Email Address
          </label>
          <input
            placeholder="alice@company.com"
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-[15px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#23b5b5] focus:ring-4 focus:ring-[#23b5b5]/10 transition-all placeholder-slate-400"
            onChange={(e) => setForm({ ...form, emailId: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
            Initial Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-[15px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#23b5b5] focus:ring-4 focus:ring-[#23b5b5]/10 transition-all placeholder-slate-400"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-10 flex flex-col-reverse sm:flex-row gap-3">
        <button
          onClick={closeModal}
          className="w-full sm:flex-1 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-colors text-[14px] active:scale-[0.98]"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="w-full sm:flex-1 bg-[#23b5b5] text-white py-3.5 rounded-xl font-bold hover:bg-[#1da1a1] transition-all shadow-[0_4px_14px_rgba(35,181,181,0.25)] active:scale-[0.98] text-[14px]"
        >
          Create Account
        </button>
      </div>
    </>
  );
};

// 3. View Profile Component
const ViewProfile = ({ user, closeModal }) => (
  <div className="text-center pb-2">
    <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-[#e6f7f7] to-[#cceded] text-[#1c8f8f] font-bold text-4xl sm:text-5xl flex items-center justify-center border-[8px] border-white shadow-xl mx-auto mb-6">
      {getInitials(user.fullName)}
    </div>
    <h2 className="text-[24px] sm:text-[28px] font-extrabold text-slate-900 tracking-tight">{user.fullName}</h2>
    <p className="text-[15px] text-slate-500 font-medium mb-8">{user.emailId}</p>

    <div className="bg-slate-50/80 rounded-2xl p-6 text-left space-y-5 mb-8 border border-slate-100 shadow-inner">
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-slate-500 font-bold uppercase tracking-widest">
          Role
        </span>
        <span className="text-[13px] font-bold text-slate-700 uppercase tracking-wider px-3 py-1.5 bg-white ring-1 ring-slate-200 rounded-lg shadow-sm">
          {user.role.replace("_", " ")}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-slate-500 font-bold uppercase tracking-widest">
          Status
        </span>
        <span
          className={`text-[15px] font-bold flex items-center gap-2.5 ${
            user.isActive ? "text-[#23b5b5]" : "text-slate-400"
          }`}
        >
          <div className={`h-3 w-3 rounded-full ${user.isActive ? "bg-[#23b5b5] shadow-[0_0_8px_rgba(35,181,181,0.6)]" : "bg-slate-300"}`} />
          {user.isActive ? "Active User" : "Deactivated"}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-slate-500 font-bold uppercase tracking-widest">
          Member Since
        </span>
        <span className="text-[15px] font-bold text-slate-800">
          {formatDate(user.createdAt)}
        </span>
      </div>
    </div>

    <button
      onClick={closeModal}
      className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg active:scale-[0.98] text-[15px]"
    >
      Close Details
    </button>
  </div>
);

// 4. Edit Profile Component
const EditProfile = ({ user, closeModal }) => {
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState(user.fullName);
  const [emailId, setEmailId] = useState(user.emailId);
  const [password, setPassword] = useState("");

  const handleSave = async () => {
    await dispatch(updateProfile({ id: user._id, data: { fullName, emailId } }));
    if (password.trim() !== "") {
      await dispatch(resetPassword({ id: user._id, newPassword: password }));
    }
    closeModal();
  };

  return (
    <>
      <div className="flex items-center gap-5 mb-8 pr-6">
        <div className="h-14 w-14 bg-gradient-to-br from-[#e6f7f7] to-[#cceded] text-[#1c8f8f] rounded-2xl flex items-center justify-center shadow-sm shrink-0">
          <Edit3 size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-[22px] sm:text-[24px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Edit Settings
          </h2>
          <p className="text-[14px] text-slate-500 font-medium mt-0.5">
            Updating details for {user.fullName}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
            Full Name
          </label>
          <div className="relative group">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#23b5b5] transition-colors" />
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-xl text-[15px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#23b5b5] focus:ring-4 focus:ring-[#23b5b5]/10 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
            Email Address
          </label>
          <div className="relative group">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#23b5b5] transition-colors" />
            <input
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-xl text-[15px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#23b5b5] focus:ring-4 focus:ring-[#23b5b5]/10 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
            New Password <span className="text-slate-400 normal-case tracking-normal ml-1 font-medium">(Optional)</span>
          </label>
          <div className="relative group">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#23b5b5] transition-colors" />
            <input
              type="password"
              placeholder="Leave blank to keep current"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-11 pr-11 py-3.5 rounded-xl text-[15px] font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#23b5b5] focus:ring-4 focus:ring-[#23b5b5]/10 transition-all"
            />
            <Eye size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3.5 items-start shadow-sm">
        <AlertCircle size={20} className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-[13px] text-blue-700 font-medium leading-relaxed">
          Role modifications are restricted here. Use the{" "}
          <strong className="text-blue-900 font-bold">Access Role</strong> option from the dropdown menu to update permissions.
        </p>
      </div>

      <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
        <button
          onClick={closeModal}
          className="w-full sm:w-auto px-6 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-colors text-[14px] active:scale-[0.98]"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-8 bg-[#23b5b5] text-white py-3.5 rounded-xl font-bold hover:bg-[#1da1a1] transition-all shadow-[0_4px_14px_rgba(35,181,181,0.25)] active:scale-[0.98] text-[14px]"
        >
          Save Changes
        </button>
      </div>
    </>
  );
};

// 5. Change Role Component (No strict max-height, completely visible)
const ChangeRole = ({ user, closeModal }) => {
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState(user.role);

  const rolesList = [
    { id: "super_admin", title: "Super Admin", desc: "Full system access & control" },
    { id: "admin", title: "Admin", desc: "Manage users (except Super Admin)" },
    { id: "editor", title: "Editor", desc: "Edit, approve and publish any post" },
    { id: "author", title: "Author", desc: "Create and edit own posts only" },
    { id: "viewer", title: "Viewer", desc: "Read internal drafts and metrics" },
  ];

  const handleSubmit = () => {
    dispatch(changeRole({ id: user._id, role: selectedRole }));
    closeModal();
  };

  return (
    <>
      <div className="flex items-center gap-5 mb-8 pr-6">
        <div className="h-14 w-14 bg-gradient-to-br from-[#e6f7f7] to-[#cceded] text-[#1c8f8f] rounded-2xl flex items-center justify-center shadow-sm shrink-0">
          <ShieldCheck size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-[22px] sm:text-[24px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Update Access Role
          </h2>
          <p className="text-[14px] text-slate-500 font-medium mt-0.5">
            Modify permissions for {user.fullName}
          </p>
        </div>
      </div>

      {/* Removed scroll constraint so it displays beautifully inside the wider modal */}
      <div className="space-y-3">
        {rolesList.map((r) => {
          const isSelected = selectedRole === r.id;
          return (
            <div
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`flex items-start p-4 rounded-xl cursor-pointer transition-all border-2 ${
                isSelected
                  ? "border-[#23b5b5] bg-[#f8fcfc] shadow-[0_2px_12px_rgba(35,181,181,0.12)]"
                  : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 bg-white"
              }`}
            >
              <div
                className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 transition-colors ${
                  isSelected ? "border-[#23b5b5]" : "border-slate-300"
                }`}
              >
                {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-[#23b5b5]" />}
              </div>
              <div>
                <div className={`text-[15px] font-bold ${isSelected ? "text-[#1c8f8f]" : "text-slate-800"}`}>
                  {r.title}
                </div>
                <div className={`text-[13px] mt-1 font-medium ${isSelected ? "text-[#23b5b5]/80" : "text-slate-500"}`}>
                  {r.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
        <button
          onClick={closeModal}
          className="w-full sm:w-auto px-6 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-colors text-[14px] active:scale-[0.98]"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-8 bg-[#23b5b5] text-white py-3.5 rounded-xl font-bold hover:bg-[#1da1a1] transition-all shadow-[0_4px_14px_rgba(35,181,181,0.25)] active:scale-[0.98] text-[14px]"
        >
          Apply Role
        </button>
      </div>
    </>
  );
};

// 6. Delete Account Component
const DeleteUser = ({ user, closeModal }) => {
  const dispatch = useDispatch();
  const [confirmText, setConfirmText] = useState("");

  const isConfirmed = confirmText === user.emailId;

  const handleDelete = () => {
    if (isConfirmed) {
      dispatch(removeMember(user._id));
      closeModal();
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-5 pr-6">
        <div className="h-14 w-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-100 shadow-sm shrink-0">
          <AlertTriangle size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-[22px] sm:text-[24px] font-extrabold text-slate-900 tracking-tight leading-tight">Delete Account</h2>
        </div>
      </div>

      <div className="bg-rose-50/50 border border-rose-100/50 rounded-2xl p-5 mb-8">
        <p className="text-[14px] text-rose-800 font-medium leading-relaxed">
          You are about to permanently delete <strong className="text-rose-950 font-bold">{user.fullName}</strong>. This will instantly revoke their access and this action cannot be reversed.
        </p>
      </div>

      <div>
        <label className="text-[13px] font-bold text-slate-700 mb-2.5 block leading-loose">
          Type <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-mono text-[12px] border border-slate-200 select-all mx-1">{user.emailId}</span> to confirm
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="user@example.com"
          className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-[15px] font-mono font-medium focus:bg-white focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all text-slate-900"
        />
      </div>

      <div className="mt-10 flex flex-col-reverse sm:flex-row gap-3">
        <button
          onClick={closeModal}
          className="w-full sm:flex-1 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-colors text-[14px] active:scale-[0.98]"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={!isConfirmed}
          className={`w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[14px] transition-all ${
            isConfirmed
              ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_14px_rgba(244,63,94,0.3)] active:scale-[0.98] cursor-pointer"
              : "bg-rose-100 text-rose-300 cursor-not-allowed"
          }`}
        >
          <Trash2 size={18} strokeWidth={2.5} /> Delete Account
        </button>
      </div>
    </>
  );
};