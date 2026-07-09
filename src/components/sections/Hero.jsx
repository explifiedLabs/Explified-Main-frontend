import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MessageSquare, Paperclip } from "lucide-react";
import { Link } from "react-router";

// --- 1. Real Brand Logos (Dashboard Icons) ---
const Logos = {
  Zoom: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <path
        d="M14 8C14 7.44772 13.5523 7 13 7H4C3.44772 7 3 7.44772 3 8V16C3 16.5523 3.44772 17 4 17H13C13.5523 17 14 16.5523 14 16V8Z"
        fill="#2D8CFF"
      />
      <path d="M19.5 8.5L15 11V13L19.5 15.5V8.5Z" fill="#2D8CFF" />
    </svg>
  ),
  Excel: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#217346" />
      <path
        d="M10 10L14 14M14 10L10 14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M7 4V20" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </svg>
  ),
  Teams: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="#6264A7" />
      <path
        d="M8 10C8 8.89543 8.89543 8 10 8H14C15.1046 8 16 8.89543 16 10V14H8V10Z"
        fill="white"
        fillOpacity="0.8"
      />
      <circle cx="12" cy="11" r="2" fill="#6264A7" />
    </svg>
  ),
  Outlook: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="#0078D4" />
      <path d="M12 12L4 7V17H20V7L12 12Z" fill="white" fillOpacity="0.5" />
      <path
        d="M15 7H19C19.55 7 20 7.45 20 8V9L12 14L4 9V8C4 7.45 4.45 7 5 7H9"
        fill="white"
        fillOpacity="0.2"
      />
    </svg>
  ),
  Word: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#2B579A" />
      <path
        d="M7 8L9 16L12 10L15 16L17 8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Figma: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <path
        d="M8 12C8 10.8954 8.89543 10 10 10H14V14H10C8.89543 14 8 13.1046 8 12Z"
        fill="#0ACF83"
      />
      <path
        d="M8 8C8 6.89543 8.89543 6 10 6H14V10H10C8.89543 10 8 9.10457 8 8Z"
        fill="#F24E1E"
      />
      <path d="M14 6H10V10H14V6Z" fill="#FF7262" />
      <path d="M14 10H10V14H14V10Z" fill="#A259FF" />
      <path
        d="M8 16C8 14.8954 8.89543 14 10 14V18C8.89543 18 8 17.1046 8 16Z"
        fill="#1ABCFE"
      />
    </svg>
  ),
  Slack: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <path
        d="M6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10H8V14H6Z"
        fill="#E01E5A"
      />
      <path
        d="M10 6C10 4.89543 10.8954 4 12 4C13.1046 4 14 4.89543 14 6V8H10V6Z"
        fill="#36C5F0"
      />
      <path
        d="M18 10C19.1046 10 20 10.8954 20 12C20 13.1046 19.1046 14 18 14H16V10H18Z"
        fill="#2EB67D"
      />
      <path
        d="M14 18C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18V16H14V18Z"
        fill="#ECB22E"
      />
      <rect x="10" y="10" width="4" height="4" rx="1" fill="white" />
    </svg>
  ),
  Gmail: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <path
        d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
        fill="#FFFFFF"
      />
      <path d="M4 6L12 12L20 6" stroke="#EA4335" strokeWidth="2.5" />
      <path d="M20 6V18" stroke="#EA4335" strokeWidth="1.5" />
      <path d="M4 6V18" stroke="#EA4335" strokeWidth="1.5" />
    </svg>
  ),
  Google: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <path
        d="M21.5 12.2C21.5 11.3 21.4 10.5 21.3 9.8H12V14.4H17.4C17.2 15.9 16.3 17.2 15 18.1V21H18.2C20.1 19.3 21.5 16.8 21.5 12.2Z"
        fill="#4285F4"
      />
      <path
        d="M12 21.9C14.7 21.9 16.9 21 18.5 19.5L15.3 16.6C14.4 17.2 13.3 17.6 12 17.6C9.5 17.6 7.4 15.9 6.6 13.6H3.3V16.6C4.9 19.8 8.2 21.9 12 21.9Z"
        fill="#34A853"
      />
      <path
        d="M6.6 13.6C6.4 13 6.3 12.3 6.3 11.6C6.3 10.9 6.4 10.2 6.6 9.6V6.6H3.3C2.7 7.9 2.3 9.3 2.3 10.9C2.3 12.5 2.7 13.9 3.3 15.2L6.6 13.6Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.5C13.5 5.5 14.8 6 15.8 7L18.6 4.3C16.9 2.7 14.7 1.8 12 1.8C8.2 1.8 4.9 3.9 3.3 7.1L6.6 10.1C7.4 7.8 9.5 5.5 12 5.5Z"
        fill="#EA4335"
      />
    </svg>
  ),
  Jira: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <path
        d="M10.84 4.14a1.87 1.87 0 0 0-2.64 0l-4.14 4.14a1.87 1.87 0 0 0 0 2.64l4.14 4.14a1.87 1.87 0 0 0 2.64 0l4.14-4.14a1.87 1.87 0 0 0 0-2.64l-4.14-4.14zM15.54 8.84a1.87 1.87 0 0 0-2.64 0l-4.14 4.14a1.87 1.87 0 0 0 0 2.64l4.14 4.14a1.87 1.87 0 0 0 2.64 0l4.14-4.14a1.87 1.87 0 0 0 0-2.64l-4.14-4.14zM20.24 13.54a1.87 1.87 0 0 0-2.64 0l-4.14 4.14a1.87 1.87 0 0 0 0 2.64l4.14 4.14a1.87 1.87 0 0 0 2.64 0l4.14-4.14a1.87 1.87 0 0 0 0-2.64l-4.14-4.14z"
        fill="#2684FF"
      />
    </svg>
  ),
  Trello: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#0079BF" />
      <rect x="6" y="6" width="5" height="10" rx="1" fill="#FFFFFF" />
      <rect x="13" y="6" width="5" height="6" rx="1" fill="#FFFFFF" />
    </svg>
  ),
  Github: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.839 21.49C9.339 21.582 9.52 21.273 9.52 21.007C9.52 20.768 9.511 19.957 9.506 18.883C6.725 19.487 6.138 17.542 6.138 17.542C5.684 16.388 5.03 16.082 5.03 16.082C4.125 15.464 5.098 15.476 5.098 15.476C6.098 15.546 6.625 16.503 6.625 16.503C7.513 18.025 8.955 17.585 9.541 17.33C9.63 16.666 9.898 16.226 10.194 15.974C7.974 15.722 5.638 14.863 5.638 11.169C5.638 10.118 6.013 9.259 6.643 8.586C6.543 8.334 6.212 7.356 6.739 6.023C6.739 6.023 7.558 5.761 9.492 7.072C10.271 6.855 11.109 6.746 11.94 6.742C12.771 6.746 13.609 6.855 14.389 7.072C16.321 5.761 17.139 6.023 17.139 6.023C17.667 7.356 17.336 8.334 17.236 8.586C17.868 9.259 18.241 10.118 18.241 11.169C18.241 14.875 15.901 15.717 13.673 15.961C14.043 16.28 14.373 16.906 14.373 17.871C14.373 19.256 14.361 20.373 14.361 20.722C14.361 20.993 14.54 21.309 15.048 21.211C19.015 19.889 21.88 16.14 21.88 11.714C21.88 6.19 17.403 1.714 11.88 1.714Z"
        fill="#FFFFFF"
      />
    </svg>
  ),
};

// --- 2. Tech Scroller Logos (PNG-based) ---
const ALL_LOGOS = [
  { name: "Chrome", src: "/logos/chrome.png" },
  { name: "Edge", src: "/logos/edge.png" },
  { name: "Figma", src: "/logos/figma.png" },
  { name: "ClickUp", src: "/logos/clickup.png" },
  { name: "OpenAI", src: "/logos/chatgpt.png" },
  { name: "Odoo", src: "/logos/odoo.png" },
  { name: "Penpot", src: "/logos/penpot.png" },
  { name: "HubSpot", src: "/logos/hubspot.png" },
  { name: "Canva", src: "/logos/canva.png" },
  { name: "Webex", src: "/logos/webex.png" },
  { name: "Trello", src: "/logos/trello.png" },
  { name: "Shopify", src: "/logos/shopify.png" },
  { name: "Bubble", src: "/logos/bubble.png" },
];

// Small floating marketplace tags scattered around the hero — purely decorative,
// keeps the "trusted brand" texture visible even before the scroller loads.
const FLOATING_TAGS = [
  {
    name: "Shopify",
    className: "top-[12%] left-2 sm:left-6 lg:left-[2%]",
    delay: 0.5,
  },
  {
    name: "Figma",
    className: "top-[16%] right-2 sm:right-6 lg:right-[3%]",
    delay: 0.65,
  },
  {
    name: "Chrome",
    className: "top-[40%] right-2 sm:right-8 lg:right-[10%]",
    delay: 0.8,
  },
  {
    name: "Framer",
    className: "top-[48%] right-4 sm:right-12 lg:right-[24%]",
    delay: 0.95,
  },
  {
    name: "Trello",
    className: "top-[50%] left-2 sm:left-8 lg:left-[8%]",
    delay: 1.1,
  },
];

// --- Animations Configuration ---
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.6 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const drawLine = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 0.6,
    transition: {
      pathLength: { duration: 1.5, bounce: 0 },
      opacity: { duration: 0.5 },
      ease: "easeInOut",
      delay: 0.8,
    },
  },
};

// --- Dashboard Sub-components ---
const TaskCard = ({ title, tag1, tag2, tools = [], comments, attachments }) => (
  <motion.div
    variants={cardVariants}
    className="bg-[#121214]/80 border border-white/5 rounded-2xl p-3 md:p-4 flex flex-col gap-3 shadow-lg hover:border-[#23b5b5]/30 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(35,181,181,0.05)] w-full"
  >
    <div className="flex gap-2 mb-1">
      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#2D2D3A] text-gray-400 uppercase tracking-wide border border-white/5 group-hover:bg-[#23b5b5]/10 group-hover:text-[#23b5b5] transition-colors">
        {tag1}
      </span>
      {tag2 && (
        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#2D2D3A] text-gray-400 uppercase tracking-wide border border-white/5">
          {tag2}
        </span>
      )}
    </div>

    <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors truncate">
      {title}
    </h4>

    <div className="flex gap-1.5 my-1">
      {tools.map((ToolLogo, i) => (
        <div
          key={i}
          className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/5 border border-white/5 overflow-hidden relative group-hover:border-white/10 transition-colors"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center scale-[1.75] pointer-events-none">
            <ToolLogo />
          </div>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between mt-auto pt-2">
      <div className="flex -space-x-1.5">
        <div className="w-5 h-5 rounded-full border border-[#121214] bg-orange-400/80 flex items-center justify-center text-[8px] text-black font-bold z-10">
          JD
        </div>
        <div className="w-5 h-5 rounded-full border border-[#121214] bg-blue-400/80 flex items-center justify-center text-[8px] text-black font-bold z-20">
          AL
        </div>
        {tools.length > 2 && (
          <div className="w-5 h-5 rounded-full border border-[#121214] bg-gray-600 flex items-center justify-center text-[8px] text-white z-30">
            +
          </div>
        )}
      </div>

      <div className="text-[10px] text-gray-600 flex gap-3 font-medium">
        <span className="flex items-center gap-1 group-hover:text-gray-400 transition-colors">
          <MessageSquare size={10} /> {comments}
        </span>
        <span className="flex items-center gap-1 group-hover:text-gray-400 transition-colors">
          <Paperclip size={10} /> {attachments}
        </span>
      </div>
    </div>
  </motion.div>
);

const ToolNode = ({ LogoComponent, side, top, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.2, x: side === "left" ? -30 : 30 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    transition={{ duration: 0.8, delay: delay, type: "spring", stiffness: 120 }}
    className={`hidden md:flex absolute ${side === "left" ? "left-4 lg:left-[8%]" : "right-4 lg:right-[8%]"} z-20 flex-col items-center`}
    style={{ top }}
  >
    <div className="w-16 h-16 rounded-2xl bg-[#0F0F11] border border-white/10 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] group hover:scale-110 transition-transform duration-300 relative">
      <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 flex items-center justify-center scale-125 pointer-events-none">
        <LogoComponent />
      </div>
    </div>
  </motion.div>
);

// Faint scattered pill tag used behind the headline, echoing the marketplace names.
// Two-stage animation: fades/scales in once, then drifts up and down forever.
const FloatingTag = ({
  name,
  className,
  delay,
  floatDuration = 4,
  floatDistance = 10,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.9 }}
    animate={{
      opacity: 1,
      scale: 1,
      y: [0, -floatDistance, 0],
    }}
    transition={{
      opacity: { duration: 0.7, delay, ease: "easeOut" },
      scale: { duration: 0.7, delay, ease: "easeOut" },
      y: {
        duration: floatDuration,
        delay: delay + 0.7,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }}
    className={`hidden sm:flex absolute z-10 items-center px-5 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm ${className}`}
  >
    <span className="text-xs md:text-sm font-medium text-gray-500">{name}</span>
  </motion.div>
);

// Tiny ambient teal dots scattered through the hero, echoing a starfield / node-graph feel.
const FLOATING_DOTS = [
  { className: "top-[11%] left-[15%]", size: "w-1.5 h-1.5", delay: 0.3 },
  { className: "top-[3%] left-[58%]", size: "w-1 h-1", delay: 0.5 },
  { className: "top-[8%] left-[61%]", size: "w-1.5 h-1.5", delay: 0.7 },
  { className: "top-[19%] left-[12%]", size: "w-1 h-1", delay: 0.9 },
  { className: "top-[65%] right-[20%]", size: "w-1.5 h-1.5", delay: 1.1 },
  { className: "top-[72%] right-[16%]", size: "w-1 h-1", delay: 1.3 },
  { className: "top-[79%] right-[13%]", size: "w-1 h-1", delay: 1.5 },
];

const FloatingDot = ({ className, size, delay }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0.4, 1, 0.4], scale: 1 }}
    transition={{
      opacity: { duration: 3, delay, repeat: Infinity, ease: "easeInOut" },
      scale: { duration: 0.5, delay },
    }}
    className={`hidden sm:block absolute rounded-full bg-[#23b5b5] shadow-[0_0_8px_rgba(35,181,181,0.8)] pointer-events-none z-10 ${size} ${className}`}
  />
);

// --- MAIN HERO COMPONENT ---
const Hero = () => {
  return (
    <section className="relative pt-42 pb-10 overflow-hidden min-h-screen flex flex-col items-center bg-[#050505]">
      {/* Faint background grid, echoing a blueprint / node-graph texture */}
      <div
        className="absolute top-0 left-0 right-0 h-[700px] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "250px 100%, 100% 150px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 70%, transparent 100%)",
        }}
      />

      {/* Two large atmospheric glow circles, top-right and bottom-left */}
      <motion.div
        className="absolute top-[-20px] right-[-20px] w-[300px] h-[300px] bg-[#23b5b5]/10 rounded-full pointer-events-none"
        animate={{ x: [-20, 20] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-[220px] left-[-20px] w-[450px] h-[450px] bg-[#23b5b5]/10 rounded-full pointer-events-none"
        animate={{ x: [30, -30] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      {/* Massive Atmospheric Glow */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[800px] bg-[#23b5b5]/15 blur-[150px] rounded-full pointer-events-none opacity-70" />
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#23b5b5]/10 blur-[100px] pointer-events-none" />

      {/* Gentle wavy line drifting across the lower half of the hero */}
      <svg
        className="absolute bottom-[8%] left-0 w-full h-[220px] pointer-events-none z-0"
        viewBox="0 0 1920 220"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d="M0,140 C320,60 640,200 960,110 S1600,40 1920,130"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
          variants={drawLine}
          initial="hidden"
          animate="visible"
        />
      </svg>

      {/* Scattered ambient teal dots */}
      {FLOATING_DOTS.map((dot, i) => (
        <FloatingDot key={i} {...dot} />
      ))}

      {/* Scattered marketplace tags floating behind the headline */}
      {FLOATING_TAGS.map((tag) => (
        <FloatingTag
          key={tag.name}
          name={tag.name}
          className={tag.className}
          delay={tag.delay}
        />
      ))}

      {/* --- Text Content (Animated Waterfall) --- */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-20 w-full max-w-7xl px-6 text-left mb-12"
      >
        <motion.div
          variants={fadeUpVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs md:text-sm text-gray-300 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#23b5b5] animate-pulse" />
          Building the platform layer for AI-native teams
        </motion.div>

        <motion.h1
          variants={fadeUpVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
        >
          <span className="text-white">
            We Digitally Transform Your Enterprise,
          </span>
          <br />
          <span className="text-transparent text-4xl md:text-5xl lg:text-7xl bg-clip-text bg-gradient-to-b from-gray-600 to-gray-700">
            Piece by Piece
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUpVariants}
          className="text-base md:text-lg text-gray-400 max-w-2xl mb-10 mt-12 leading-relaxed px-6"
        >
          AI-powered products and automation that modernize how your business
          runs.
        </motion.p>

        <motion.div
          variants={fadeUpVariants}
          className="flex flex-col sm:flex-row items-center justify-start gap-4 sm:gap-5"
        >
          <Link to="https://explified.com/labs">
            <button className="relative cursor-pointer overflow-hidden bg-[#23b5b5] text-black font-bold text-lg px-8 py-3.5 rounded-full flex items-center justify-center w-full sm:w-auto gap-2 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(35,181,181,0.4)]">
              <span className="relative z-10">Explore Labs</span>
              <ArrowRight size={18} className="relative z-10" />
              <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* --- TRUSTED PLATFORMS STRIP --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative w-full overflow-hidden mt-16 pt-10 z-20 flex flex-col items-center"
      >
        <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-[0.2em] mb-8 text-center px-4">
          Trusted across major platforms
        </p>

        <div
          className="relative w-full max-w-[100vw] mx-auto z-10"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
        >
          <div className="flex w-max animate-continuous-scroll hover:[animation-play-state:paused] items-center py-4">
            {[...ALL_LOGOS, ...ALL_LOGOS].map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center gap-3 w-[180px] md:w-[240px] shrink-0 group cursor-pointer text-neutral-600 transition-transform duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                  <img
                    src={item.src}
                    alt={item.name}
                    className="w-8 h-8 md:w-8 md:h-8 shrink-0 object-contain drop-shadow-md"
                  />
                </div>
                <span className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300 whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Inline Style for seamless infinite scroll animation */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); } 
          }
          .animate-continuous-scroll {
            animation: scroll 45s linear infinite;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `,
          }}
        />
      </motion.div>

      {/* ===================== Stats Section ===================== */}
      <section className="relative w-full bg-[#050505]">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Card 1 */}
            <div className="flex flex-col justify-center md:px-10 py-8">
              <div className="flex items-baseline-last gap-3">
                <h2 className="text-white text-[60px] leading-none font-extrabold tracking-tight">
                  50+
                </h2>

                <span className="text-[#23b5b5] text-[22px] font-semibold mb-2">
                  Apps
                </span>
              </div>

              <p className="mt-1 text-[16px] text-gray-400">
                Across all major marketplaces
              </p>
            </div>

            {/* Divider */}
            {/* <div className="hidden md:block absolute left-1/3 top-24 bottom-24 w-px bg-white/10" /> */}

            {/* Card 2 */}
            <div className="flex flex-col justify-center md:px-10 py-8 border-l border-teal-400/20 ">
              <div className="flex items-baseline-last gap-3">
                <h2 className="text-white text-[60px] leading-none font-extrabold tracking-tight">
                  7+
                </h2>

                <span className="text-[#23b5b5] text-[22px] font-semibold mb-2">
                  Platforms
                </span>
              </div>

              <p className="mt-1 text-[16px] text-gray-400 leading-relaxed">
                Figma, Shopify, Trello, Chrome,
                <br />
                Framer & more
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col justify-center md:px-10 py-8 border-l border-teal-400/20">
              <div className="flex items-baseline-last gap-3">
                <h2 className="text-white text-[60px] leading-none font-extrabold tracking-tight">
                  3.5K+
                </h2>

                <span className="text-[#23b5b5] text-[22px] font-semibold mb-2">
                  Followers
                </span>
              </div>

              <p className="mt-1 text-[16px] text-gray-400">
                Across Explified's content channels
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Hero;
