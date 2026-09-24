import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Cpu, Database, Activity, X } from "lucide-react";

// --- CONFIG ---
const BRAND_COLOR = "#23b5b5";

// --- ANIMATION HELPERS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

// --- COMPONENT: ANIMATED GRADIENT BACKGROUND ---
const BackgroundMesh = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-black">
    <motion.div
      animate={{
        x: [0, 100, 0],
        y: [0, -50, 0],
        opacity: [0.1, 0.2, 0.1],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full blur-[140px]"
      style={{
        background: `radial-gradient(circle, ${BRAND_COLOR}44 0%, transparent 70%)`,
      }}
    />
    <motion.div
      animate={{
        x: [0, -80, 0],
        y: [0, 100, 0],
        opacity: [0.05, 0.15, 0.05],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[120px]"
      style={{
        background: `radial-gradient(circle, ${BRAND_COLOR}33 0%, transparent 70%)`,
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.15]"
      style={{
        backgroundImage: `radial-gradient(${BRAND_COLOR} 0.5px, transparent 0.5px)`,
        backgroundSize: "30px 30px",
      }}
    />
  </div>
);

// --- COMPONENT: GET ADVISORY MODAL UI ---
const GetAdvisoryModal = ({ isOpen, onClose }) => {
  const [scheduleCall, setScheduleCall] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-[#0a1213] border border-[#23b5b5]/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(35,181,181,0.15)] z-10 overflow-hidden text-white"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
                Get advisory
              </h2>
              <p className="text-sm text-gray-400">
                Thank you for contacting Explified Labs.
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Name <span className="text-[#23b5b5]">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#070d0e] border border-white/10 focus:border-[#23b5b5] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Email <span className="text-[#23b5b5]">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#070d0e] border border-white/10 focus:border-[#23b5b5] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Contact number & Company name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Contact number
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-[#070d0e] border border-white/10 focus:border-[#23b5b5] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Company name <span className="text-[#23b5b5]">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#070d0e] border border-white/10 focus:border-[#23b5b5] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Company website */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Company website
                </label>
                <input
                  type="text"
                  placeholder="yourcompany.com"
                  className="w-full bg-[#070d0e] border border-white/10 focus:border-[#23b5b5] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder-gray-600"
                />
              </div>

              {/* Describe your project */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Describe your project{" "}
                  <span className="text-[#23b5b5]">*</span>
                </label>
                <textarea
                  rows={3}
                  className="w-full bg-[#070d0e] border border-white/10 focus:border-[#23b5b5] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Checkbox Section */}
              <div
                onClick={() => setScheduleCall(!scheduleCall)}
                className="flex items-center justify-between bg-[#070d0e] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 cursor-pointer transition-all select-none"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={scheduleCall}
                    onChange={() => {}}
                    className="w-4 h-4 rounded accent-[#23b5b5] cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-gray-200">
                    Also schedule a call
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  Optional • 30 min
                </span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  className="w-full py-3.5 font-bold rounded-2xl text-black transition-all hover:opacity-90 active:scale-[0.99] shadow-[0_10px_25px_-5px_#23b5b566]"
                  style={{ backgroundColor: BRAND_COLOR }}
                >
                  Get advisory
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- COMPONENT: HERO SECTION ---
const HeroSection = ({ onOpenModal }) => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-24 overflow-hidden bg-black">
      <BackgroundMesh />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center z-10 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={fadeInUp}>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#23b5b533] bg-[#23b5b50a] backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#23b5b5] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#23b5b5]"></span>
              </span>
              <span className="text-[#23b5b5] text-[10px] font-black uppercase tracking-[0.3em]">
                Trusted by 100+ creators & businesses
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl lg:text-8xl font-bold leading-[1.1] tracking-tighter text-white"
          >
            Build Systems That <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[#23b5b5]">
              Scale, Not Just Work
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-400 max-w-xl leading-relaxed"
          >
            From AI tools to automated workflows — Explified Labs helps you turn
            effort into repeatable outcomes.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-5">
            <button
              onClick={onOpenModal}
              className="relative group px-10 py-5 font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_-10px_#23b5b566] inline-block cursor-pointer"
              style={{ backgroundColor: BRAND_COLOR, color: "#000" }}
            >
              <span className="relative z-10">Get advisory</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </motion.div>
        </motion.div>

        {/* Hero Visual: The Flowbox */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#23b5b5] to-blue-500 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-[#050505] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0%,#23b5b5_50%,transparent_100%)] opacity-10 pointer-events-none"
            />

            <div className="flex justify-between items-center mb-12 relative z-10">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#23b5b5]">
                <Activity size={14} className="animate-pulse" /> LIVE SYSTEM
                FLOW
              </div>
              <div className="px-3 py-1 bg-[#23b5b51a] border border-[#23b5b533] rounded-full text-[9px] font-black text-[#23b5b5] uppercase tracking-tighter">
                ● All Systems Active
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 relative z-10">
              <SystemNode icon={Database} label="Input" sub="Data Source" />
              <SystemNode
                icon={Cpu}
                label="AI Processing"
                sub="Neural Engine"
                active
              />
              <SystemNode icon={Zap} label="Output" sub="Delivered" />

              <div className="col-span-3 grid grid-cols-3 gap-4 mt-6">
                <StatusPill t="Content Engine" tag="Active" />
                <StatusPill t="Automation" tag="Running" />
                <StatusPill t="Analytics" tag="Live" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- SUB-COMPONENTS ---
const SystemNode = ({ icon: Icon, label, sub, active }) => (
  <div className="flex flex-col items-center gap-4 relative">
    <motion.div
      animate={
        active
          ? {
              boxShadow: [
                "0 0 0px #23b5b500",
                "0 0 30px #23b5b544",
                "0 0 0px #23b5b500",
              ],
            }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity }}
      className={`p-5 rounded-2xl border transition-all duration-500 ${active ? "bg-[#23b5b51a] border-[#23b5b5]" : "bg-white/5 border-white/10 opacity-40"}`}
    >
      <Icon size={24} style={{ color: active ? BRAND_COLOR : "#555" }} />
    </motion.div>
    <div className="text-center">
      <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className="text-[8px] text-gray-600 font-black uppercase">{sub}</div>
    </div>
  </div>
);

const StatusPill = ({ t, tag }) => (
  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#23b5b533] transition-all">
    <div className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-2">
      {t}
    </div>
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-[#23b5b5] animate-pulse" />
      <span className="text-[8px] font-black text-[#23b5b5] uppercase tracking-widest">
        {tag}
      </span>
    </div>
  </div>
);

export default function ExplifiedLabs() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-black text-white selection:bg-[#23b5b544] selection:text-[#23b5b5]">
      <HeroSection onOpenModal={() => setIsModalOpen(true)} />
      <GetAdvisoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
