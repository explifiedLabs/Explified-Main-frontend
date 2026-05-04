import React, { useState, useEffect, useRef, Suspense } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice"; // Adjust path
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronRight,
  Menu,
  X,
  Command,
  ChevronsUpDown,
  LogOut,
  Delete,
  Archive,
  DraftingCompass,
  AlignLeft,
  Inbox,
} from "lucide-react";

import { toast } from "react-toastify";

const PageLoader = () => (
  <div className="w-full h-full flex items-center justify-center text-[#23b5b5] font-medium text-sm mt-20">
    Loading page...
  </div>
);

export default function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPostsMenuOpen, setIsPostsMenuOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // REDUX SETUP FOR LOGOUT
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const onLogout = async () => {
  try {
    const response = await dispatch(logout()).unwrap();

    toast.success(response?.message || "Logged out");

    navigate("/admin", { replace: true });

  } catch (err) {
    toast.error(err || "Logout failed");
  }
};

  const mainLinkStyle = ({ isActive }) => `
    relative flex items-center gap-3 w-full py-2.5 px-3 rounded-md text-sm font-medium transition-all duration-200 group
    ${isActive ? "bg-[#23b5b5]/[0.12] text-[#23b5b5]" : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100"}
  `;

  const subLinkStyle = ({ isActive }) => `
    relative flex items-center gap-3 w-full py-2 pr-3 pl-2 rounded-md text-[13px] font-medium transition-all duration-200 group
    ${isActive ? "text-[#23b5b5]" : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100"}
  `;

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans selection:bg-[#23b5b5]/30 selection:text-white flex antialiased text-zinc-100 w-full">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#000000] border-b border-white/5 flex items-center px-4 z-30">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
        <div className="ml-3 flex items-center gap-2">
          <Command size={16} className="text-[#23b5b5]" strokeWidth={2} />
          <span className="font-bold text-white tracking-[0.15em] text-xs">
            NEXUS
          </span>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-[260px] bg-[#000000] border-r border-white/5 
          flex flex-col z-50 transform transition-transform duration-300 ease-in-out shrink-0
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 shrink-0 border-b border-white/[0.02]">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-[#23b5b5]/20 to-[#23b5b5]/5 border border-[#23b5b5]/20 flex items-center justify-center text-[#23b5b5] group-hover:bg-[#23b5b5]/20 transition-all duration-300">
              <Command size={14} strokeWidth={2} />
            </div>
            <span className="font-bold text-zinc-100 tracking-[0.15em] text-[11px] mt-0.5">
              Explified CMS
            </span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-zinc-500 hover:text-white p-1"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto custom-scrollbar">
          {/* Overview Section */}
          <div className="flex flex-col space-y-1">
            <span className="px-3 pb-2 text-[10px] font-semibold tracking-[0.15em] text-zinc-500 uppercase">
              Overview
            </span>
            <NavLink
              to="/admin/dashboard"
              end
              className={mainLinkStyle}
              onClick={() => window.innerWidth < 768 && setIsMobileOpen(false)}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#23b5b5] rounded-r-full shadow-[0_0_8px_rgba(35,181,181,0.5)]" />
                  )}
                  <LayoutDashboard
                    size={18}
                    className={
                      isActive
                        ? "text-[#23b5b5]"
                        : "text-zinc-500 group-hover:text-zinc-300"
                    }
                    strokeWidth={1.5}
                  />
                  <span className="tracking-wide">Dashboard</span>
                </>
              )}
            </NavLink>
          </div>

          {/* Content Section */}
          <div className="flex flex-col space-y-1">
            <span className="px-3 pb-2 text-[10px] font-semibold tracking-[0.15em] text-zinc-500 uppercase">
              Content
            </span>
            <button
              onClick={() => setIsPostsMenuOpen(!isPostsMenuOpen)}
              className="relative flex items-center justify-between w-full py-2.5 px-3 rounded-md text-sm font-medium text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <FileText
                  size={18}
                  className="text-zinc-500 group-hover:text-zinc-300 transition-colors"
                  strokeWidth={1.5}
                />
                <span className="tracking-wide">Posts</span>
              </div>
              <ChevronRight
                size={14}
                strokeWidth={2}
                className={`text-zinc-500 transition-transform duration-300 ${isPostsMenuOpen ? "rotate-90 text-zinc-300" : ""}`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${isPostsMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div className="pt-1 pb-1">
                  <div className="relative ml-[21px] pl-2 border-l border-white/10 flex flex-col space-y-0.5">
                    <NavLink
                      to="/admin/dashboard/posts"
                      className={subLinkStyle}
                      onClick={() =>
                        window.innerWidth < 768 && setIsMobileOpen(false)
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-[-3px] w-1.5 h-1.5 rounded-full bg-[#23b5b5] shadow-[0_0_8px_rgba(35,181,181,0.6)]" />
                          )}
                          <Inbox
                            size={18}
                            className={
                              isActive
                                ? "text-[#23b5b5]"
                                : "text-zinc-500 group-hover:text-zinc-300"
                            }
                            strokeWidth={1.5}
                          />
                          <span className="tracking-wide">All Posts</span>
                        </>
                      )}
                    </NavLink>

                    <NavLink
                      to="/admin/dashboard/create-blog"
                      className={subLinkStyle}
                      onClick={() =>
                        window.innerWidth < 768 && setIsMobileOpen(false)
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-[-3px] w-1.5 h-1.5 rounded-full bg-[#23b5b5] shadow-[0_0_8px_rgba(35,181,181,0.6)]" />
                          )}
                          <AlignLeft
                            size={18}
                            className={
                              isActive
                                ? "text-[#23b5b5]"
                                : "text-zinc-500 group-hover:text-zinc-300"
                            }
                            strokeWidth={1.5}
                          />
                          <span className="tracking-wide">Create Post</span>
                        </>
                      )}
                    </NavLink>

                    <NavLink
                      to="/admin/dashboard/drafts"
                      className={subLinkStyle}
                      onClick={() =>
                        window.innerWidth < 768 && setIsMobileOpen(false)
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-[-3px] w-1.5 h-1.5 rounded-full bg-[#23b5b5] shadow-[0_0_8px_rgba(35,181,181,0.6)]" />
                          )}
                          <DraftingCompass
                            size={18}
                            className={
                              isActive
                                ? "text-[#23b5b5]"
                                : "text-zinc-500 group-hover:text-zinc-300"
                            }
                            strokeWidth={1.5}
                          />
                          <span className="tracking-wide">Draft</span>
                        </>
                      )}
                    </NavLink>

                    <NavLink
                      to="/admin/dashboard/archive"
                      className={subLinkStyle}
                      onClick={() =>
                        window.innerWidth < 768 && setIsMobileOpen(false)
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-[-3px] w-1.5 h-1.5 rounded-full bg-[#23b5b5] shadow-[0_0_8px_rgba(35,181,181,0.6)]" />
                          )}
                          <Archive
                            size={18}
                            className={
                              isActive
                                ? "text-[#23b5b5]"
                                : "text-zinc-500 group-hover:text-zinc-300"
                            }
                            strokeWidth={1.5}
                          />
                          <span className="tracking-wide">Archive</span>
                        </>
                      )}
                    </NavLink>

                    <NavLink
                      to="/admin/dashboard/deleted"
                      className={subLinkStyle}
                      onClick={() =>
                        window.innerWidth < 768 && setIsMobileOpen(false)
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-[-3px] w-1.5 h-1.5 rounded-full bg-[#23b5b5] shadow-[0_0_8px_rgba(35,181,181,0.6)]" />
                          )}
                          <Delete
                            size={18}
                            className={
                              isActive
                                ? "text-[#23b5b5]"
                                : "text-zinc-500 group-hover:text-zinc-300"
                            }
                            strokeWidth={1.5}
                          />
                          <span className="tracking-wide">Deleted</span>
                        </>
                      )}
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Section */}
          <div className="flex flex-col space-y-1">
            <span className="px-3 pb-2 text-[10px] font-semibold tracking-[0.15em] text-zinc-500 uppercase">
              System
            </span>

            <NavLink
              to="/admin/dashboard/users"
              className={mainLinkStyle}
              onClick={() => window.innerWidth < 768 && setIsMobileOpen(false)}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#23b5b5] rounded-r-full shadow-[0_0_8px_rgba(35,181,181,0.5)]" />
                  )}
                  <Users
                    size={18}
                    className={
                      isActive
                        ? "text-[#23b5b5]"
                        : "text-zinc-500 group-hover:text-zinc-300"
                    }
                    strokeWidth={1.5}
                  />
                  <span className="tracking-wide">Users</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/dashboard/settings"
              className={mainLinkStyle}
              onClick={() => window.innerWidth < 768 && setIsMobileOpen(false)}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#23b5b5] rounded-r-full shadow-[0_0_8px_rgba(35,181,181,0.5)]" />
                  )}
                  <Settings
                    size={18}
                    className={
                      isActive
                        ? "text-[#23b5b5]"
                        : "text-zinc-500 group-hover:text-zinc-300"
                    }
                    strokeWidth={1.5}
                  />
                  <span className="tracking-wide">Settings</span>
                </>
              )}
            </NavLink>
          </div>
        </nav>

        {/* User Profile & Logout */}
    
<div className="p-4 shrink-0 relative" ref={profileRef}>
  <div
    className={`
      absolute bottom-[calc(100%-12px)] left-4 right-4 mb-2 
      bg-[#121212] border border-white/10 rounded-lg shadow-2xl shadow-black
      transition-all duration-200 ease-out origin-bottom z-50
      ${isProfileOpen
        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
        : "opacity-0 scale-95 translate-y-2 pointer-events-none"}
    `}
  >
    <div className="p-1.5">
      <button
        onClick={onLogout}
        className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium text-zinc-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
      >
        <LogOut size={16} strokeWidth={1.5} />
        <span>Log out</span>
      </button>
    </div>
  </div>

  <div
    onClick={() => setIsProfileOpen(!isProfileOpen)}
    className={`
      flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer group 
      transition-all duration-200 border
      ${
        isProfileOpen
          ? "bg-white/[0.08] border-white/10"
          : "hover:bg-white/[0.04] border-transparent hover:border-white/[0.05]"
      }
    `}
  >
    <div className="flex items-center gap-3">
      {/* Avatar Initial */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/10 flex items-center justify-center text-xs font-semibold text-zinc-200 shadow-sm uppercase">
        {user?.user?.fullName
          ? user.user.fullName.charAt(0).toUpperCase()
          : "A"}
      </div>

      {/* Name + Email */}
      <div className="flex flex-col">
        <span className="text-[13px] font-medium text-zinc-200 group-hover:text-white transition-colors leading-tight">
          {user?.user?.fullName || "Admin User"}
        </span>
        <span className="text-[11px] text-zinc-500 mt-0.5 truncate max-w-[120px]">
          {user?.user?.emailId || "admin@nexus.com"}
        </span>
      </div>
    </div>

    <ChevronsUpDown
      size={14}
      className={`text-zinc-500 transition-all duration-300 ${
        isProfileOpen
          ? "text-zinc-300 rotate-180"
          : "group-hover:text-zinc-300"
      }`}
      strokeWidth={1.5}
    />
  </div>
</div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pt-16 md:pt-0 h-screen overflow-auto bg-gray-50 text-gray-900">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `,
        }}
      />

    </div>
  );
}
