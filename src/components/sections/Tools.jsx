import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Youtube } from "lucide-react";
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
  platformIcon: null, // uses Lucide icon fallback
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

// All platforms visible in the UI — key must match products[key] from CMS/API
// platformIcon: URL string from API (item.iconUrl on the platform level), or null to fall back to lucide
const PLATFORM_CONFIG = [
  {
    key: "Figma",
    title: "Figma Plugins",
    label: "FIGMA",
    icon: "Figma",
    localIcon: "/logos/figma.png",
    sub: "AI-powered design utilities for design teams.",
  },
  {
    key: "Shopify",
    title: "Shopify Apps",
    label: "SHOPIFY",
    icon: "ShoppingBag",
    localIcon: "/logos/shopify.png",
    sub: "Revenue and conversion tools for e-commerce stores.",
  },
  {
    key: "Atlassian",
    title: "Trello Power-Ups",
    label: "TRELLO",
    icon: "Layout",
    localIcon: "/logos/trello.png",
    sub: "Workflow automation for project teams.",
  },
  {
    key: "Chrome",
    title: "Chrome Extensions",
    label: "CHROME",
    icon: "Chrome",
    localIcon: "/logos/chrome.png",
    sub: "Browser-native productivity for everyone.",
  },
  {
    key: "Framer",
    title: "Framer Plugins",
    label: "FRAMER",
    icon: "Box",
    localIcon: "/logos/framer.png",
    sub: "Visual tools for no-code builders.",
  },
  {
    key: "Atlassian",
    title: "Atlassian Tools",
    label: "ATLASSIAN",
    icon: "Layout",
    localIcon: "/logos/atlassian.png",
    sub: "Enterprise productivity and workflow solutions.",
  },
  {
    key: "Penpot",
    title: "Penpot Plugins",
    label: "PENPOT",
    icon: "PenTool",
    localIcon: "/logos/penpot.png",
    sub: "Open-source design and prototyping plugins.",
  },
  {
    key: "Strapi",
    title: "Strapi Plugins",
    label: "STRAPI",
    icon: "Database",
    localIcon: "/logos/strapi.png",
    sub: "Extend your headless CMS with powerful plugins.",
  },
  {
    key: "ClickUp",
    title: "ClickUp Apps",
    label: "CLICKUP",
    icon: "CheckSquare",
    localIcon: "/logos/clickup.png",
    sub: "Automate tasks and workflows inside ClickUp.",
  },
  {
    key: "MicrosoftEdge",
    title: "Microsoft Edge",
    label: "EDGE",
    icon: "Globe2",
    localIcon: "/logos/edge.png",
    sub: "Productivity extensions for Microsoft Edge.",
  },
  {
    key: "Opera",
    title: "Opera Extensions",
    label: "OPERA",
    icon: "Globe",
    sub: "Browser extensions for Opera users.",
  },
  {
    key: "Bubble",
    title: "Bubble Plugins",
    label: "BUBBLE",
    icon: "Layers",
    localIcon: "/logos/bubble.png",
    sub: "No-code plugins for Bubble.io apps.",
  },
  {
    key: "Odoo",
    title: "Odoo Modules",
    label: "ODOO",
    icon: "Grid",
    localIcon: "/logos/odoo.png",
    sub: "Business modules for the Odoo ERP platform.",
  },
  {
    key: "Workflows",
    title: "Workflow Automation",
    label: "WORKFLOWS",
    icon: "GitBranch",
    sub: "Cross-platform automation that connects your stack.",
  },
];

const themeColors = {
  cyan: "#23b5b5",
  purple: "#a855f7",
  yellow: "#eab308",
  emerald: "#10b981",
  orange: "#f97316",
};

// Bento span pattern, repeats every 6 cards: [wide, narrow, narrow, narrow, narrow, wide]
const SPAN_PATTERN = [
  "md:col-span-2",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-3",
];

/* ─── Tiny floating app icon + label, links straight to the marketplace listing ─── */
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
      className="group/chip flex flex-col items-center gap-1.5 w-[58px] no-underline shrink-0"
    >
      <div className="w-11 h-11 rounded-[10px] overflow-hidden flex items-center justify-center border border-white/10 bg-white/[0.04] transition-all duration-200 group-hover/chip:border-[#23b5b5]/60 group-hover/chip:-translate-y-0.5 group-hover/chip:shadow-[0_4px_14px_rgba(35,181,181,0.25)]">
        {isImage ? (
          <img
            src={item.icon}
            alt={item.title}
            className="w-full h-full object-cover select-none"
          />
        ) : (
          <LucideIcon
            size={19}
            strokeWidth={1.75}
            style={{ color: activeColor }}
          />
        )}
      </div>
      <span className="text-[8px] leading-tight font-semibold text-neutral-400 text-center line-clamp-2 group-hover/chip:text-white transition-colors">
        {item.title}
      </span>
    </a>
  );
};

/* ─── Bento Platform Card ─── */
const BentoPlatformCard = ({ section, span }) => {
  const PlatformIconCmp = Lucide[section.icon] || Lucide.Box;
  // Prefer a live icon URL from the CMS, then fall back to the local PNG in /public/logos
  const iconSrc = section.platformIcon || section.localIcon || null;
  const hasPlatformIcon = !!iconSrc;
  const items = section.items || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative flex flex-col rounded-2xl border border-white/[0.07] hover:border-[#23b5b5]/40 transition-all duration-300 overflow-hidden ${span}`}
      style={{
        borderLeft: "2px solid rgba(35,181,181,0.45)",
        backgroundColor: "rgba(8,20,18,0.55)",
        backgroundImage:
          "radial-gradient(circle at 15% -10%, rgba(35,181,181,0.16), transparent 55%), linear-gradient(180deg, rgba(35,181,181,0.05) 0%, rgba(5,10,9,0) 45%)",
        minHeight: "220px", // Gives the grid a premium, unified baseline height
      }}
    >
      <div className="p-7 flex flex-col h-full relative grow">
        {/* Platform Icon: Fades out on hover, just like the title/subtitle */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden shrink-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] opacity-100 group-hover:opacity-0 group-hover:-translate-y-3"
          style={{
            background:
              "linear-gradient(135deg, rgba(35,181,181,0.14) 0%, rgba(35,181,181,0.03) 100%)",
            border: "1px solid rgba(35,181,181,0.2)",
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
              size={20}
              strokeWidth={1.75}
              className="text-[#23b5b5]"
            />
          )}
        </div>

        {/* Unified Swap Container */}
        <div className="relative grow grid grid-cols-1 grid-rows-1 items-start">
          {/* DEFAULT STATE: Name & Description (Disappears on hover) */}
          <div className="col-start-1 row-start-1 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] opacity-100 group-hover:opacity-0 group-hover:pointer-events-none group-hover:-translate-y-3">
            <h3 className="text-white text-xl font-bold tracking-tight mb-1.5">
              {section.title}
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {section.subtitle}
            </p>
          </div>

          {/* HOVER STATE: Product Icons (Appears in the exact same spot) */}
          {items.length > 0 && (
            <div className="col-start-1 row-start-1 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-y-3 group-hover:translate-y-0">
              <div className="flex flex-wrap gap-x-3 gap-y-3">
                {items.map((item, i) => (
                  <AppChip key={item.title + i} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
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

  // Build all dynamic platform sections from PLATFORM_CONFIG + CMS data
  // platformIcon comes from products[key].iconUrl (the marketplace logo from API)
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
        // The platform-level icon URL from the API result (e.g. platformData?.iconUrl)
        platformIcon: platformData?.iconUrl || null,
        // Local PNG fallback from /public/logos (used when the CMS has no iconUrl)
        localIcon: p.localIcon || null,
        items,
      };
    }).filter((section) => section.items.length > 0);
    // .slice(0, 5);
  }, [products]);

  const ALL_SECTIONS = useMemo(() => {
    return [...dynamicSections, CORE_PRODUCTS];
  }, [dynamicSections]);

  return (
    <div
      className="min-h-screen text-white font-sans relative"
      style={{ backgroundColor: "#050505", isolation: "isolate" }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(35,181,181,0.04), transparent 75%)",
          filter: "blur(80px)",
        }}
      />

      {/* SECTION 1: Product Studio — Bento Grid */}
      <div className="max-w-[1340px] mx-auto px-6 lg:px-12 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-14 text-left "
        >
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-4 h-[1px] bg-[#23b5b5]" />
            <span className="text-[14px] text-[#23b5b5] font-extrabold tracking-[0.2em] uppercase">
              Our Craft
            </span>
          </div>
          <h1 className="text-5xl  md:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Every tool your team already uses
            {/* <br /> */}
          </h1>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mt-1 flex items-center gap-4">
            <span className="w-8 md:w-12 h-[3px] bg-white/70 inline-block" />
            <span className="text-neutral-500">now smarter.</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ALL_SECTIONS.map((section, idx) => (
            <BentoPlatformCard
              key={section.id}
              section={section}
              span={SPAN_PATTERN[idx % SPAN_PATTERN.length]}
            />
          ))}
        </div>
      </div>

      {/* <div className="w-full relative h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent my-6" /> */}

      {/* SECTION 2: Content Studio */}
      {/* <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 relative z-10">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2.5 mb-2.5">
            <div className="w-5 h-5 rounded bg-[#23b5b5]/10 border border-[#23b5b5]/20 flex items-center justify-center">
              <Youtube className="text-[#23b5b5]" size={11} />
            </div>
            <span className="text-[9px] text-[#23b5b5] font-extrabold tracking-wider uppercase">
              Our Channels
            </span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            Content Studio
          </h1>
          <p className="text-gray-400 text-xs mt-1.5 max-w-2xl font-medium leading-relaxed mx-auto">
            The digital media arm of Explified. Exploring automation, history,
            and global logistics through visual storytelling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CHANNELS.map((channel, idx) => (
            <ChannelCard key={idx} channel={channel} index={idx} />
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default MarketplaceAndStudio;
