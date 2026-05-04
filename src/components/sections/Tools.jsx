import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import * as Lucide from "lucide-react";

// ==========================================
// 1. DATA CONFIGURATION
// ==========================================
const MARKETPLACE_DATA = [
  {
    id: "Our products",
    title: "Core Products",
    subtitle: "Powerful utilities that work beyond any single platform",
    label: "products",
    icon: "Chrome",
    items: [
      {
        title: "Lurph",
        desc: "The AI-native engine that connects your tools and automates your entire stack.",
        icon: "Camera",
        theme: "yellow",
        btnText: "lurph",
        link: "https://lurph.com",
      },
    ],
  },
  {
    id: "chrome",
    title: "Chrome Extensions",
    subtitle: "Supercharge your browser with AI-powered overlays",
    label: "EXTENSION",
    icon: "Chrome",
    items: [
      {
        title: "QuickShot",
        desc: "Capture scrolling screenshots and record screen with one click. Simple and high-quality.",
        icon: "Camera",
        theme: "blue",
        btnText: "See more",
        link: "https://chromewebstore.google.com/detail/quickshot-by-explified/hcldjmlmcjegedjflgohpneaaobmjcee",
      },
      {
        title: "Docify Web",
        desc: "Transform any webpage into a high-quality, searchable PDF document instantly.",
        icon: "FileSearch",
        theme: "purple",
        btnText: "See more",
        link: "https://chromewebstore.google.com/detail/docify-web/kefahljcnjlfjammghcilkbabdmjllok",
      },
      {
        title: "VidSum AI",
        desc: "The ultimate AI video summariser. Get key insights from any YouTube video in seconds.",
        icon: "Youtube",
        theme: "cyan",
        btnText: "See more",
        link: "http://chromewebstore.google.com/detail/vidsum-copilot-for-youtub/jmdecmahfbajaffljohfdlbdmkbngggj",
      },
      {
        title: "ColorSnap",
        desc: "Professional Color Picker – Capture any color on your screen for your design projects.",
        icon: "Pipette",
        theme: "lime",
        btnText: "See more",
        link: "https://chromewebstore.google.com/detail/colorsnap/lefmgnagiljekenhpdbjnihacfbmanmc",
      },
    ],
  },
  {
    id: "shopify",
    title: "Shopify Apps",
    subtitle: "Boost your store with automated marketing and SEO tools",
    label: "SHOPIFY",
    icon: "ShoppingBag",
    items: [
      {
        title: "Announce Mate",
        desc: "Boost store engagement by creating eye-catching, customizable announcement bars.",
        icon: "Megaphone",
        theme: "blue",
        btnText: "See more",
        link: "https://apps.shopify.com/announcement-generator?st_source=autocomplete&surface_detail=autocomplete_apps",
      },
      {
        title: "Form Maker Pro",
        desc: "Build professional, fully-responsive custom forms to collect leads and data.",
        icon: "ClipboardList",
        theme: "purple",
        btnText: "See more",
        link: "https://apps.shopify.com/formmaker",
      },
      {
        title: "Bloglift SEO",
        desc: "Enhance your store's search visibility with automated SEO optimization tools.",
        icon: "Layout",
        theme: "cyan",
        btnText: "See more",
        link: "https://apps.shopify.com/seo-optimizer-app?st_source=autocomplete&surface_detail=autocomplete_apps",
      },
      {
        title: "Confetti Maker",
        desc: "Celebrate customer milestones with vibrant, customizable confetti animations.",
        icon: "PartyPopper",
        theme: "emerald",
        btnText: "See more",
        link: "https://apps.shopify.com/confetti-maker?st_source=autocomplete&surface_detail=autocomplete_apps",
      },
    ],
  },
  {
    id: "figma",
    title: "Figma Plugins",
    subtitle: "Accelerate your design workflow with powerful Figma tools",
    label: "FIGMA",
    icon: "Figma",
    items: [
      {
        title: "Wireframe AI",
        desc: "Generate intelligent wireframes and UI layouts instantly using AI inside Figma.",
        icon: "LayoutTemplate",
        theme: "purple",
        stats: "Plugin",
        btnText: "See more",
        link: "https://www.figma.com/community/plugin/1607779209963334185",
      },
      {
        title: "FrameEdit",
        desc: "Edit and manage your Figma frames more efficiently with advanced bulk-editing tools.",
        icon: "SquarePen",
        theme: "blue",
        stats: "Plugin",
        btnText: "See more",
        link: "https://www.figma.com/community/plugin/1603417414226147264/frameedit",
      },
      {
        title: "Font Deck",
        desc: "Browse, preview, and apply beautiful fonts directly within your Figma design canvas.",
        icon: "Type",
        theme: "cyan",
        stats: "Plugin",
        btnText: "See more",
        link: "https://www.figma.com/community/plugin/1601625471155331537/font-deck",
      },
      {
        title: "QR Code Canvas",
        desc: "Generate and embed customizable QR codes directly into your Figma designs with ease.",
        icon: "QrCode",
        theme: "lime",
        stats: "Plugin",
        btnText: "See more",
        link: "https://www.figma.com/community/plugin/1602697007885514401/qr-code-canvas",
      },
    ],
  },
  {
    id: "ai-tools",
    title: "AI Content Tools",
    subtitle: "Write, summarize, and structure content with AI",
    label: "CONTENT",
    icon: "BrainCircuit",
    items: [
      {
        title: "AI Subtitle Generator",
        desc: "Automatically transcribe audio and generate precise subtitles for your video content.",
        icon: "PenLine",
        theme: "cyan",
        btnText: "See more",
        link: "https://app.explified.com/ai-subtitler",
      },
      {
        title: "AI Image Styler",
        desc: "Instantly transform your photos into unique artistic masterpieces with style transfer.",
        icon: "FileText",
        theme: "purple",
        btnText: "See more",
        link: "https://app.explified.com/login",
      },
      {
        title: "Text to Meme Generator",
        desc: "Turn any text prompt into a viral-ready meme by automatically pairing it with images.",
        icon: "Layers",
        theme: "emerald",
        btnText: "See more",
        link: "https://app.explified.com/text-to-meme",
      },
      {
        title: "AI Video Generator",
        desc: "Create professional-grade video content and animations from simple text descriptions.",
        icon: "Circle",
        theme: "orange",
        btnText: "See more",
        link: "https://app.explified.com/text-to-video",
      },
    ],
  },
];

// Unified button style: Default Black/Dark -> Hover Teal
const SHARED_BTN_STYLE = "bg-black/40 text-white border border-white/10 hover:bg-[#1da3a3] hover:text-[#05070A] hover:border-[#23b5b5] hover:shadow-[0_0_20px_rgba(35,181,181,0.4)]";

const THEMES = {
  yellow: { glow: "#cac70ee0", text: "text-[#cac70ee0]", btn: SHARED_BTN_STYLE },
  cyan: { glow: "#23b5b5", text: "text-[#23b5b5]", btn: SHARED_BTN_STYLE },
  purple: { glow: "#a855f7", text: "text-purple-400", btn: SHARED_BTN_STYLE },
  emerald: { glow: "#10b981", text: "text-emerald-400", btn: SHARED_BTN_STYLE },
  orange: { glow: "#f97316", text: "text-orange-400", btn: SHARED_BTN_STYLE },
  blue: { glow: "#3b82f6", text: "text-blue-400", btn: SHARED_BTN_STYLE },
  lime: { glow: "#84cc16", text: "text-lime-400", btn: SHARED_BTN_STYLE },
};

// ==========================================
// 2. REFINED COMPONENTS
// ==========================================

const BorderBeam = ({ color }) => (
  <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] overflow-hidden z-20">
    <motion.div
      animate={{
        top: ["-100%", "100%", "100%", "-100%", "-100%"],
        left: ["-100%", "-100%", "100%", "100%", "-100%"],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="absolute w-32 h-32 blur-2xl opacity-40"
      style={{ background: color }}
    />
    <div className="absolute inset-0 rounded-[2.5rem] border border-white/[0.08]" />
  </div>
);

const EliteCard = ({ item, label, index }) => {
  const theme = THEMES[item.theme] || THEMES.cyan;
  const Icon = Lucide[item.icon] || Lucide.Zap;
  const cardRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 150,
    damping: 20,
  });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseMove={(e) => {
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative flex flex-col bg-[#080B10] rounded-[2.5rem] h-[450px] shadow-2xl transition-all duration-300 overflow-hidden border border-white/5 hover:border-[#23b5b5]/30"
    >
      <BorderBeam color={theme.glow} />

      <div className="relative h-44 w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-70"
          style={{
            background: `radial-gradient(circle at center, ${theme.glow}33 0%, transparent 75%)`,
          }}
        />

        <div style={{ transform: "translateZ(50px)" }} className="relative">
          <div className="w-16 h-16 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110">
            <Icon className={theme.text} size={28} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div
        className="p-8 flex flex-col flex-grow bg-[#05070A]/80 backdrop-blur-sm relative z-10"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="space-y-4 flex-grow">
          <span
            className={`text-[9px] font-black tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 uppercase ${theme.text}`}
          >
            {label}
          </span>
          <h3 className="text-xl font-bold text-white group-hover:text-[#23b5b5] transition-colors duration-300 leading-tight">
            {item.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium">
            {item.desc}
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${theme.btn}`}
          >
            {item.btnText} <Lucide.ArrowRight size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-[#05070A] py-24 px-6 lg:px-24 font-sans relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-[#23b5b5]/5 blur-[160px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(#23b5b5 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto space-y-48 relative z-10">
        {MARKETPLACE_DATA.map((section) => {
          const SectionIcon = Lucide[section.icon];
          return (
            <section key={section.id} className="relative group/section">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#23b5b5]/20 to-transparent border border-[#23b5b5]/30 flex items-center justify-center shadow-[0_0_40px_rgba(35,181,181,0.1)] group-hover/section:rotate-[360deg] transition-transform duration-1000">
                    <SectionIcon className="text-[#23b5b5]" size={28} />
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                      {section.title}
                      <span className="text-[#23b5b5]">.</span>
                    </h2>
                    <p className="text-gray-500 text-lg mt-2 font-medium max-w-xl">
                      {section.subtitle}
                    </p>
                  </div>
                </div>

                <button className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-[#23b5b5] flex items-center gap-4 transition-all">
                  Browse Collection <Lucide.MoveRight size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {section.items.map((item, idx) => (
                  <EliteCard
                    key={item.title}
                    item={item}
                    label={section.label}
                    index={idx}
                  />
                ))}
              </div>

              <div className="absolute -bottom-24 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#23b5b5]/10 to-transparent" />
            </section>
          );
        })}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        body { background-color: #05070A; color: white; }
        ::selection { background: rgba(35, 181, 181, 0.3); color: white; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `,
        }}
      />
    </div>
  );
};

export default Marketplace;