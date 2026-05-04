import { memo } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  LayoutDashboard,
  Users,
  CalendarDays,
  Settings,
  MoreHorizontal,
  ChevronDown,
  User,
} from "lucide-react";
import { Logo1, Logo2, Logo3 } from "./svgAssets";

const DUMMY_STATS = [1, 2, 3];

const MEMBERS_LIST = [
  { name: "Leslie Alexander", role: "Owner" },
  { name: "Courtney Henry", role: "Editor" },
  { name: "Robert Fox", role: "Viewer" },
];

export const DashboardPreview = memo(() => {
  return (
    <div className="hidden lg:flex w-[55%] p-4 lg:p-6 pl-0">
      <div className="w-full h-full bg-[#050505] rounded-[40px] relative overflow-hidden flex flex-col pt-16 px-16 border border-gray-200/50 shadow-2xl">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#23b5b5] opacity-[0.08] blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative z-20 max-w-md"
        >
          <h2 className="text-[38px] leading-[1.15] font-bold text-white mb-5 tracking-tight">
            The simplest way to manage your workforce
          </h2>
          <p className="text-gray-400 text-[17px] leading-relaxed font-light">
            Enter your credentials to access your unified dashboard. Track time,
            manage schedules, and process payroll efficiently.
          </p>
        </motion.div>

        <div className="relative flex-1 w-full mt-12">
          <motion.div
            initial={{ opacity: 0, y: 60, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="absolute top-0 right-[-10%] w-[110%] max-w-[850px] bg-[#0a0a0a] border border-white/[0.08] rounded-tl-2xl rounded-tr-2xl shadow-[0_0_80px_rgba(0,0,0,1)] overflow-hidden flex flex-col z-10"
            style={{ height: "calc(100% + 100px)" }}
          >
            <div className="h-14 border-b border-white/[0.05] flex items-center px-6 gap-4 bg-[#050505]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/[0.15]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.15]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.15]" />
              </div>
              <div className="h-6 w-32 bg-white/[0.03] rounded-md border border-white/[0.05] ml-4" />
              <div className="ml-auto h-7 w-24 bg-[#23b5b5]/10 rounded-full border border-[#23b5b5]/20 flex items-center justify-center text-[11px] text-[#23b5b5] font-medium">
                Add member +
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="w-20 border-r border-white/[0.05] bg-[#050505] flex flex-col items-center py-8 gap-8">
                <div className="w-10 h-10 rounded-xl bg-[#23b5b5] flex items-center justify-center text-white shadow-[0_0_15px_rgba(35,181,181,0.3)]">
                  <LayoutDashboard size={20} />
                </div>
                <Users size={20} className="text-white/30" />
                <CalendarDays size={20} className="text-white/30" />
                <Settings size={20} className="text-white/30 mt-auto mb-10" />
              </div>

              <div className="flex-1 p-8 bg-[#0a0a0a] flex flex-col gap-6">
                <div className="flex gap-6">
                  <div className="flex-1 h-32 bg-[#111] border border-white/[0.05] rounded-2xl p-5 flex flex-col justify-between">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                      Productive Time
                    </span>
                    <div>
                      <div className="text-3xl font-bold text-white mb-1">
                        12.4 hr
                      </div>
                      <div className="text-xs text-[#23b5b5]">
                        +23% last week
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 h-32 bg-[#111] border border-white/[0.05] rounded-2xl p-5 flex flex-col justify-between">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                      Focused Time
                    </span>
                    <div>
                      <div className="text-3xl font-bold text-white mb-1">
                        8.5 hr
                      </div>
                      <div className="text-xs text-red-400">-10% last week</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-[#111] border border-white/[0.05] rounded-2xl p-6">
                  <div className="h-4 w-32 bg-white/10 rounded mb-6" />
                  {DUMMY_STATS.map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-4 border-b border-white/[0.03] last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                          ${i === 1 ? "bg-blue-500" : i === 2 ? "bg-orange-500" : "bg-green-500"}
                        `}
                        >
                          {i === 1 ? "M" : i === 2 ? "C" : "D"}
                        </div>
                        <div>
                          <div className="h-3 w-24 bg-white/20 rounded mb-1.5" />
                          <div className="h-2 w-16 bg-white/10 rounded" />
                        </div>
                      </div>
                      <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#23b5b5] w-[60%]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            className="absolute top-32 right-12 w-[340px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-gray-100 p-5 z-20"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-900 text-[15px]">
                Add Member
              </span>
              <MoreHorizontal size={16} className="text-gray-400" />
            </div>

            <div className="flex gap-2 mb-6">
              <div className="flex-1 h-10 border border-gray-200 rounded-lg flex items-center px-3 gap-2">
                <Mail size={14} className="text-gray-400" />
                <div className="h-3 w-32 bg-gray-200 rounded" />
              </div>
              <button className="h-10 px-4 bg-[#23b5b5] text-white text-xs font-semibold rounded-lg">
                Send Invite
              </button>
            </div>

            <div className="space-y-4">
              {MEMBERS_LIST.map((member, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center">
                      <User size={14} className="text-gray-500" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        xyz@example.com
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[12px] text-gray-500 font-medium">
                    {member.role} <ChevronDown size={14} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#000000] to-transparent z-30 pointer-events-none flex items-end pb-8 px-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex items-center gap-12 text-white/30"
          >
            <Logo1 />
            <Logo2 />
            <Logo3 />
          </motion.div>
        </div>
      </div>
    </div>
  );
});
