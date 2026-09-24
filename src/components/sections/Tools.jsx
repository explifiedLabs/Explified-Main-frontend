import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Youtube, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import * as Lucide from "lucide-react";
import { useCMS } from "../../hooks/useCMS.jsx";

// Local Logo Imports
import ExplifiedLabs from "../../../logo.png";
import AirLogisticsLogo from "../images/AirLogistics.jpg";
import AstroLogo from "../images/Astro.jpg";
import HistoricLogo from "../images/historic.jpg";

/* ─── Config / Constant Data ─── */
const CHANNELS = [
  {
    name: "Explified Labs",
    handle: "@explified",
    subs: "37.6K",
    url: "https://www.youtube.com/@explified",
    color: "#23b5b5",
    logo: ExplifiedLabs,
  },
  {
    name: "Airlogistics",
    handle: "@Airlogisticsanalyzer",
    subs: "70",
    url: "https://www.youtube.com/@Airlogisticsanalyzer",
    color: "#f97316",
    logo: AirLogisticsLogo,
  },
  {
    name: "Astro Visuals",
    handle: "@astro4141official",
    subs: "8",
    url: "https://www.youtube.com/@astro4141official",
    color: "#a855f7",
    logo: AstroLogo,
  },
  {
    name: "Historic Knowledge",
    handle: "@historicknowledgebyexplified",
    subs: "804",
    url: "https://www.youtube.com/@historicknowledgebyexplified",
    color: "#eab308",
    logo: HistoricLogo,
  },
];

const CORE_PRODUCTS = {
  id: "core-products",
  title: "Core Products",
  subtitle: "Powerful utilities that work beyond any single platform",
  label: "PRODUCTS",
  icon: "Package",
  platformIcon: null,
  items: [
    {
      title: "Lurph",
      desc: "The AI-native engine that connects your tools and automates your entire stack.",
      icon: "Zap",
      theme: "yellow",
      link: "https://lurph.com",
    },
    {
      title: "Slides",
      desc: "Turn text to slides instantly with AI — no design skills needed.",
      icon: "Monitor",
      theme: "cyan",
      link: "https://slides.explified.com",
    },
    {
      title: "Stream",
      desc: "Sub-second latency, built-in analytics, and a drop-in SDK. Private beta opening soon.",
      icon: "Tv2",
      theme: "cyan",
      link: "https://stream.explified.com",
    },
    {
      title: "Beacon",
      desc: "A modern browser designed for builders — fast, minimal, and intelligent.",
      icon: "Globe",
      theme: "cyan",
      link: "https://beacon.explified.com",
    },
  ],
};

const PLATFORM_CONFIG = [
  { key: "Figma", title: "Figma Plugins", label: "FIGMA", icon: "Figma", localIcon: "/logos/figma.png", sub: "AI-powered design utilities for design teams." },
  { key: "Shopify", title: "Shopify Apps", label: "SHOPIFY", icon: "ShoppingBag", localIcon: "/logos/shopify.png", sub: "Revenue and conversion tools for e-commerce stores." },
  { key: "Atlassian", title: "Trello Power-Ups", label: "TRELLO", icon: "Layout", localIcon: "/logos/trello.png", sub: "Workflow automation for project teams." },
  { key: "Chrome", title: "Chrome Extensions", label: "CHROME", icon: "Chrome", localIcon: "/logos/chrome.png", sub: "Browser-native productivity for everyone." },
  { key: "Framer", title: "Framer Plugins", label: "FRAMER", icon: "Box", localIcon: "/logos/framer.png", sub: "Visual tools for no-code builders." },
  { key: "Atlassian", title: "Atlassian Tools", label: "ATLASSIAN", icon: "Layout", localIcon: "/logos/atlassian.png", sub: "Enterprise productivity and workflow solutions." },
  { key: "Penpot", title: "Penpot Plugins", label: "PENPOT", icon: "PenTool", localIcon: "/logos/penpot.png", sub: "Open-source design and prototyping plugins." },
  { key: "Strapi", title: "Strapi Plugins", label: "STRAPI", icon: "Database", localIcon: "/logos/strapi.png", sub: "Extend your headless CMS with powerful plugins." },
  { key: "ClickUp", title: "ClickUp Apps", label: "CLICKUP", icon: "CheckSquare", localIcon: "/logos/clickup.png", sub: "Automate tasks and workflows inside ClickUp." },
  { key: "MicrosoftEdge", title: "Microsoft Edge", label: "EDGE", icon: "Globe2", localIcon: "/logos/edge.png", sub: "Productivity extensions for Microsoft Edge." },
  { key: "Opera", title: "Opera Extensions", label: "OPERA", icon: "Globe", sub: "Browser extensions for Opera users." },
  { key: "Bubble", title: "Bubble Plugins", label: "BUBBLE", icon: "Layers", localIcon: "/logos/bubble.png", sub: "No-code plugins for Bubble.io apps." },
  { key: "Odoo", title: "Odoo Modules", label: "ODOO", icon: "Grid", localIcon: "/logos/odoo.png", sub: "Business modules for the Odoo ERP platform." },
  { key: "Workflows", title: "Workflow Automation", label: "WORKFLOWS", icon: "GitBranch", sub: "Cross-platform automation that connects your stack." },
];

const themeColors = {
  cyan: "#23b5b5",
  purple: "#a855f7",
  yellow: "#eab308",
  emerald: "#10b981",
  orange: "#f97316",
};

const SPAN_PATTERN = [
  "md:col-span-2",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-1",
];

/* ─── Tiny floating app icon + label ─── */
const AppChip = ({ item }) => {
  const isImage = useMemo(() => {
    if (!item.icon || typeof item.icon !== "string") return false;
    return (
      item.icon.startsWith("http") ||
      item.icon.startsWith("/") ||
      item.icon.startsWith("data:") ||
      item.icon.includes(".")
    );
  }, [item.icon]);

  const LucideIcon = !isImage ? Lucide[item.icon] || Lucide.Boxes : null;
  const activeColor = themeColors[item.theme] || "#23b5b5";

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      title={item.title}
      className="group/chip flex flex-col items-center gap-1.5 w-[72px] no-underline shrink-0"
    >
      <div className="relative w-12 h-12 rounded-[12px] overflow-hidden flex items-center justify-center border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] transition-all duration-300 ease-out group-hover/chip:border-[#23b5b5]/70 group-hover/chip:-translate-y-1 group-hover/chip:shadow-[0_8px_24px_rgba(35,181,181,0.35)] group-hover/chip:scale-105">
        {/* inner sheen */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.10] to-transparent" />
        {isImage ? (
          <img
            src={item.icon}
            alt={item.title}
            className="w-full h-full object-cover select-none relative z-10"
          />
        ) : (
          <LucideIcon
            size={20}
            strokeWidth={1.75}
            style={{ color: activeColor }}
            className="relative z-10"
          />
        )}
      </div>
      <span className="text-[11px] leading-tight font-medium text-neutral-400 text-center line-clamp-2 group-hover/chip:text-white transition-colors">
        {item.title}
      </span>
    </a>
  );
};

/* ─── Bento Platform Card — polished ─── */
const BentoPlatformCard = ({ section, span }) => {
  const PlatformIconCmp = Lucide[section.icon] || Lucide.Box;
  const iconSrc = section.platformIcon || section.localIcon || null;
  const hasPlatformIcon = !!iconSrc;
  const items = section.items || [];

  const isLargeCard =
    span.includes("md:col-span-2") || span.includes("md:col-span-3");

  const ITEMS_PER_PAGE = isLargeCard ? 16 : 8;
  const [page, setPage] = useState(0);

  const paginatedItems = useMemo(() => {
    const start = page * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, page, ITEMS_PER_PAGE]);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const handleNext = (e) => {
    e.stopPropagation();
    if (page < totalPages - 1) setPage((prev) => prev + 1);
  };
  const handlePrev = (e) => {
    e.stopPropagation();
    if (page > 0) setPage((prev) => prev - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative flex flex-col rounded-[22px] overflow-hidden transition-all duration-500 ${span}`}
      style={{ height: "244px" }}
    >
      {/* ---------- Layered background system ---------- */}
      {/* 1. Base fill */}
      <div className="absolute inset-0 rounded-[22px] bg-[#08110F]" />

      {/* 2. Radial teal glow (top-left) */}
      <div
        className="absolute inset-0 rounded-[22px] opacity-90 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% -20%, rgba(35,181,181,0.22), transparent 55%), radial-gradient(circle at 100% 120%, rgba(35,181,181,0.10), transparent 60%)",
        }}
      />

      {/* 3. Fine grid texture, very faint */}
      <div
        className="absolute inset-0 rounded-[22px] opacity-[0.06] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 50%, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 50%, black, transparent 80%)",
        }}
      />

      {/* 4. Animated gradient border */}
      <div
        className="absolute inset-0 rounded-[22px] pointer-events-none transition-opacity duration-500"
        style={{
          padding: "1px",
          background:
            "linear-gradient(140deg, rgba(35,181,181,0.55) 0%, rgba(35,181,181,0.15) 25%, rgba(255,255,255,0.05) 55%, rgba(35,181,181,0.35) 100%)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          opacity: 0.55,
        }}
      />
      <div
        className="absolute inset-0 rounded-[22px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          padding: "1px",
          background:
            "linear-gradient(140deg, rgba(35,181,181,0.9) 0%, rgba(35,181,181,0.4) 30%, rgba(35,181,181,0.15) 60%, rgba(35,181,181,0.75) 100%)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* 5. Hover ambient underlay */}
      <div className="absolute inset-x-6 -bottom-6 h-16 rounded-full bg-[#23b5b5]/25 blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

      {/* ---------- Content ---------- */}
      <div className="relative z-10 p-7 w-full h-full flex flex-col justify-center">
        {/* DEFAULT VIEW */}
        <div className="flex flex-col justify-between h-full w-full transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] opacity-100 group-hover:opacity-0 group-hover:pointer-events-none group-hover:-translate-y-3">
          {/* Icon row with tiny arrow accent */}
          <div className="flex items-start justify-between">
            <div
              className="relative w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(35,181,181,0.20) 0%, rgba(35,181,181,0.04) 100%)",
                border: "1px solid rgba(35,181,181,0.28)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.08), 0 6px 18px rgba(35,181,181,0.14)",
              }}
            >
              {hasPlatformIcon ? (
                <img
                  src={iconSrc}
                  alt={section.title}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <PlatformIconCmp
                  size={22}
                  strokeWidth={1.75}
                  className="text-[#23b5b5]"
                />
              )}
            </div>

            {items.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider text-[#23b5b5]/80 uppercase px-2.5 py-1 rounded-full border border-[#23b5b5]/25 bg-[#23b5b5]/10">
                {items.length} {items.length === 1 ? "app" : "apps"}
              </span>
            )}
          </div>

          {/* Title + subtitle */}
          <div className="flex flex-col mt-auto">
            <h3 className="text-white text-[22px] font-bold tracking-tight leading-tight mb-1.5">
              {section.title}
            </h3>
            <p className="text-neutral-400 text-[13.5px] leading-relaxed max-w-md">
              {section.subtitle}
            </p>
            {items.length > 0 && (
              <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 group-hover:text-[#23b5b5] transition-colors">
                Hover to explore
                <ArrowUpRight
                  size={12}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            )}
          </div>
        </div>

        {/* HOVER LAUNCHPAD */}
        {items.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-between px-3 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-y-3 group-hover:translate-y-0">
            {/* Left arrow */}
            <div className="w-9 h-full flex items-center justify-center">
              {totalPages > 1 && page > 0 && (
                <button
                  onClick={handlePrev}
                  className="w-7 h-7 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm hover:bg-[#23b5b5]/15 hover:border-[#23b5b5]/40 text-neutral-300 hover:text-white flex items-center justify-center transition-all pointer-events-auto z-20"
                >
                  <ChevronLeft size={14} />
                </button>
              )}
            </div>

            {/* Launchpad grid */}
            <div className="flex flex-col items-center justify-center grow h-full px-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.22 }}
                  className={`grid gap-x-4 gap-y-4 justify-items-center items-center w-full grid-rows-2 ${
                    isLargeCard ? "grid-cols-8" : "grid-cols-4"
                  }`}
                >
                  {paginatedItems.map((item, i) => (
                    <AppChip key={item.title + i} item={item} />
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Page dots */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5 mt-4">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === page
                          ? "w-6 bg-[#23b5b5]"
                          : "w-1.5 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right arrow */}
            <div className="w-9 h-full flex items-center justify-center">
              {totalPages > 1 && page < totalPages - 1 && (
                <button
                  onClick={handleNext}
                  className="w-7 h-7 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm hover:bg-[#23b5b5]/15 hover:border-[#23b5b5]/40 text-neutral-300 hover:text-white flex items-center justify-center transition-all pointer-events-auto z-20"
                >
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Premium Channel Card ─── */
const ChannelCard = ({ channel, index }) => {
  const activeColor = channel.color || "#23b5b5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.05,
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative flex flex-col justify-between p-7 rounded-[2rem] bg-white/[0.03] border border-white/[0.06] hover:border-[#23b5b5]/30 transition-all duration-500 overflow-hidden w-full"
      style={{ minHeight: "260px" }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top, ${activeColor}, transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(to right, transparent, #23b5b5, transparent)",
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        <div>
          <div className="relative mb-5 w-14 h-14 transition-all duration-500 group-hover:scale-105">
            <div
              className="absolute inset-[-4px] rounded-full opacity-0 group-hover:opacity-35 blur-md transition-opacity duration-500"
              style={{ background: activeColor }}
            />
            <div
              className="w-full h-full rounded-full overflow-hidden relative"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
              }}
            >
              <img
                src={channel.logo}
                alt={channel.name}
                className="w-full h-full object-cover select-none"
              />
            </div>
          </div>

          <span className="inline-block text-[9px] font-bold tracking-widest text-neutral-500 uppercase mb-2">
            {channel.handle}
          </span>

          <h3 className="text-white text-base font-bold mb-2 tracking-tight uppercase group-hover:text-[#23b5b5] transition-colors duration-200">
            {channel.name}
          </h3>

          <div className="flex items-center gap-1.5 text-neutral-400">
            <Users size={12} style={{ color: activeColor }} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {channel.subs} Subs
            </span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/[0.04]">
          <a
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors duration-300 no-underline"
          >
            Subscribe
            <Youtube
              size={12}
              className="group-hover:scale-110 transition-transform duration-300"
              style={{ color: activeColor }}
            />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Component ─── */
const MarketplaceAndStudio = () => {
  const { data } = useCMS();

  const products = data?.header?.products || {};

  const dynamicSections = useMemo(() => {
    return PLATFORM_CONFIG.map((p) => {
      const platformData = products[p.key];
      const items = (platformData?.items || []).map((item) => ({
        title: item.title,
        desc: item.desc,
        icon: item.iconUrl || item.icon,
        link: item.url,
        theme: "cyan",
      }));
      return {
        id: p.key.toLowerCase(),
        title: p.title,
        subtitle: p.sub,
        label: p.label,
        icon: p.icon,
        platformIcon: platformData?.iconUrl || null,
        localIcon: p.localIcon || null,
        items,
      };
    }).filter((section) => section.items.length > 0);
  }, [products]);

  const ALL_SECTIONS = useMemo(() => {
    return [...dynamicSections, CORE_PRODUCTS];
  }, [dynamicSections]);

  return (
    <div
      className="min-h-screen text-white font-sans relative overflow-hidden"
      style={{ backgroundColor: "#050505", isolation: "isolate" }}
    >
      {/* Background scenography */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(35,181,181,0.08), transparent 75%)",
          filter: "blur(90px)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 90% 60% at 50% 0%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 60% at 50% 0%, black 30%, transparent 80%)",
        }}
      />

      {/* SECTION: Product Studio — Bento Grid */}
      <div className="max-w-[1340px] mx-auto px-6 lg:px-12 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-14 text-left"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-6 h-[1px] bg-[#23b5b5]" />
            <span className="text-[12px] text-[#23b5b5] font-extrabold tracking-[0.24em] uppercase">
              Our Craft
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] text-white">
            Every tool your team already uses
          </h1>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mt-2 flex items-center gap-4">
            <span className="w-8 md:w-12 h-[3px] bg-white/70 inline-block" />
            <span className="text-neutral-500">now smarter.</span>
          </h1>
          <p className="mt-6 text-neutral-400 text-[15px] max-w-xl leading-relaxed">
            From design canvases to project boards to browser tabs — Explified meets your team inside the tools they already live in.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ALL_SECTIONS.map((section, idx) => (
            <BentoPlatformCard
              key={section.id + idx}
              section={section}
              span={SPAN_PATTERN[idx % SPAN_PATTERN.length]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceAndStudio;