import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useCMS } from "../../hooks/useCMS.jsx";


const BRAND = "#23b5b5";
const BRAND_DIM = "rgba(35,181,181,0.12)";
const SCHEDULE_CALL_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf3E-9_WpCdMKM38mh5FL0GQq7frinMK4lRJTucASeXTQ55dw/viewform";

const useAuth = () => {
  const [user, setUser] = useState(null);
  return { user, setUser };
};

// ── REAL ICON COMPONENT (mirrors Navbar's ItemIcon logic) ──────────────────
const ItemIcon = ({ item }) => {
  const iconUrl = item.iconUrl || item.imageUrl || item.icon;
  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={item.title || "Icon"}
        className="w-full h-full object-contain p-1"
        onError={e => { e.currentTarget.style.display = "none"; }}
      />
    );
  }
  const toPascal = (str) =>
    (str || "").replace(/[-_ ]+/g, " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
  const rawName = item.iconName || item.title || "Box";
  const pascalName = toPascal(rawName);
  const Icon = LucideIcons[rawName] || LucideIcons[pascalName] || LucideIcons.Box;
  return <Icon size={22} color={BRAND} />;
};

const FLAGSHIP_APP_TITLES = [
  "QR Code Canvas",
  "Announcemate",
  "BlogLift",
  "Sumify",
  "Docify Web",
  "QuickShot Screenshot",
  "Wireframer AI"
];

const normalizeCMSApp = (app, platformKey, index) => {
  const charCodeSum = (app.title || "").split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const isFlagship = app.ours || FLAGSHIP_APP_TITLES.some(
    t => t.toLowerCase() === (app.title || "").trim().toLowerCase()
  );

  const tag = app.tag || (isFlagship ? "Our App" : (charCodeSum % 2 === 0 ? "Free" : "Pro"));

  return {
    ...app,
    tag,
    ours: isFlagship,
    endorsed: true,
    requiresLogin: true
  };
};


// ── MOCK CMS DATA ────────────────────────────────────────────────────────────
const MOCK_CMS_HEADER = {
  figma: {
    title: "Figma",
    imageUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/figma.svg",
    items: [
      { title: "Wireframer AI", desc: "Instantly transforms text prompts into Figma wireframes.", iconUrl: "https://placehold.co/48x48/7c3aed/ffffff?text=W", tag: "Pro", requiresLogin: true, endorsed: true },
      { title: "Design to Code", desc: "Transforms Figma components into production-ready HTML/CSS.", iconUrl: "https://placehold.co/48x48/0ea5e9/ffffff?text=D", tag: "Free", requiresLogin: false, endorsed: false },
      { title: "FrameEdit", desc: "All-in-one image editing and design toolkit for Figma.", iconUrl: "https://placehold.co/48x48/059669/ffffff?text=F", tag: "Free", requiresLogin: false, endorsed: false },
      { title: "Font Dock", desc: "Browse, customize, and insert Font Awesome icons directly.", iconUrl: "https://placehold.co/48x48/d97706/ffffff?text=F", tag: "Free", requiresLogin: false, endorsed: false },
      { title: "QR Code Canvas", desc: "Generate beautiful, customizable QR codes inside Figma.", iconUrl: "https://placehold.co/48x48/23b5b5/000000?text=Q", tag: "Our App", requiresLogin: true, endorsed: true, ours: true },
      { title: "Smart Exporter", desc: "Export frames, components, and assets with one click.", iconUrl: "https://placehold.co/48x48/6366f1/ffffff?text=S", tag: "Pro", requiresLogin: true, endorsed: true },
    ],
  },
  shopify: {
    title: "Shopify",
    imageUrl: "https://placehold.co/32x32/96bf48/ffffff?text=S",
    items: [
      { title: "AnnounceMate", desc: "Create and manage custom announcement bars for your store.", iconUrl: "https://placehold.co/48x48/23b5b5/000000?text=A", tag: "Our App", requiresLogin: true, endorsed: true, ours: true },
      { title: "Form Maker", desc: "Create professional, customizable forms without code.", iconUrl: "https://placehold.co/48x48/f97316/ffffff?text=F", tag: "Free", requiresLogin: false, endorsed: false },
      { title: "Judge.me", desc: "Collect, manage, and display customer reviews automatically.", iconUrl: "https://placehold.co/48x48/eab308/000000?text=J", tag: "Free", requiresLogin: false, endorsed: true },
      { title: "Confetti Maker", desc: "Add lightweight celebration effects and animations.", iconUrl: "https://placehold.co/48x48/ec4899/ffffff?text=C", tag: "Free", requiresLogin: false, endorsed: false },
      { title: "Cross Currency", desc: "Let customers view prices in their preferred currency.", iconUrl: "https://placehold.co/48x48/a855f7/ffffff?text=X", tag: "Pro", requiresLogin: true, endorsed: false },
      { title: "BlogLift", desc: "AI-powered blogging and SEO optimization for merchants.", iconUrl: "https://placehold.co/48x48/23b5b5/000000?text=B", tag: "Our App", requiresLogin: true, endorsed: true, ours: true },
    ],
  },
  atlassian: {
    title: "Atlassian",
    imageUrl: "https://placehold.co/32x32/0052cc/ffffff?text=A",
    items: [
      { title: "CardLytics", desc: "Enhance Trello with dynamic dashboard cards and real-time visuals.", iconUrl: "https://placehold.co/48x48/0ea5e9/ffffff?text=C", tag: "Pro", requiresLogin: true, endorsed: false },
      { title: "Secure Notes", desc: "Add private, encrypted notes directly within Trello cards.", iconUrl: "https://placehold.co/48x48/22c55e/ffffff?text=S", tag: "Free", requiresLogin: false, endorsed: false },
      { title: "Progress", desc: "Powerful Trello time and goal-tracking Power-Up.", iconUrl: "https://placehold.co/48x48/84cc16/000000?text=P", tag: "Pro", requiresLogin: true, endorsed: false },
      { title: "Summify", desc: "Transforms complex Trello boards into professional dashboards.", iconUrl: "https://placehold.co/48x48/6b7280/ffffff?text=S", tag: "Pro", requiresLogin: true, endorsed: false },
      { title: "Comment AI", desc: "Integrate AI directly into Trello to generate smart comments.", iconUrl: "https://placehold.co/48x48/23b5b5/000000?text=C", tag: "Our App", requiresLogin: true, endorsed: true, ours: true },
      { title: "Pause Card", desc: "Temporarily hide Trello cards and bring them back on schedule.", iconUrl: "https://placehold.co/48x48/f59e0b/000000?text=P", tag: "Free", requiresLogin: false, endorsed: false },
    ],
  },
  chrome: {
    title: "Chrome",
    imageUrl: "https://placehold.co/32x32/4285f4/ffffff?text=C",
    items: [
      { title: "Tab Hoarder Pro", desc: "Save, organize, and resurface your tabs intelligently.", iconUrl: "https://placehold.co/48x48/3b82f6/ffffff?text=T", tag: "Free", requiresLogin: false, endorsed: false },
      { title: "AI Summarizer", desc: "One-click AI summaries for any page you're reading.", iconUrl: "https://placehold.co/48x48/23b5b5/000000?text=A", tag: "Our App", requiresLogin: true, endorsed: true, ours: true },
    ],
  },
};

const MARKETPLACE_KEYS = Object.keys(MOCK_CMS_HEADER);

const STATS = [
  { value: "200+", label: "Apps Listed", icon: "Grid2X2" },
  { value: "4", label: "Marketplaces", icon: "Store" },
  { value: "120k+", label: "Total Installs", icon: "Download" },
  { value: "4.7★", label: "Avg Rating", icon: "Star" },
];

const TESTIMONIALS = [
  { name: "Leila Nasser", role: "Product Designer @ Mindful", avatar: "LN", quote: "QR Code Canvas from Explified is now a permanent fixture in every Figma project. It's that good.", app: "QR Code Canvas", platform: "figma", color: BRAND },
  { name: "James Okafor", role: "Shopify Store Owner", avatar: "JO", quote: "AnnounceMate doubled my click-through rate on promos. The analytics dashboard alone is worth it.", app: "AnnounceMate", platform: "shopify", color: "#96bf48" },
  { name: "Riya Mehta", role: "Project Manager @ Orbit", avatar: "RM", quote: "Comment AI in Trello turned our weekly syncs into 5-minute check-ins. Absolute game changer.", app: "Comment AI", platform: "atlassian", color: "#0052cc" },
];

const PLATFORM_META = {
  figma: { color: "#7c3aed", label: "Figma", bg: "rgba(124,58,237,0.12)" },
  shopify: { color: "#96bf48", label: "Shopify", bg: "rgba(150,191,72,0.12)" },
  atlassian: { color: "#0052cc", label: "Atlassian / Trello", bg: "rgba(0,82,204,0.12)" },
  chrome: { color: "#4285f4", label: "Chrome", bg: "rgba(66,133,244,0.12)" },
  penpot: { color: "#e85d43", label: "Penpot", bg: "rgba(232,93,67,0.12)" },
  strapi: { color: "#4945ff", label: "Strapi", bg: "rgba(73,69,255,0.12)" },
  framer: { color: "#0055ff", label: "Framer", bg: "rgba(0,85,255,0.12)" },
  clickup: { color: "#7b68ee", label: "ClickUp", bg: "rgba(123,104,238,0.12)" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

function useInViewOnce(margin = "-60px") {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: `0px 0px ${margin} 0px` });
  return [ref, inView];
}

const Noise = ({ opacity = 0.025 }) => (
  <svg className="pointer-events-none absolute inset-0 w-full h-full mix-blend-overlay" style={{ opacity }} xmlns="http://www.w3.org/2000/svg">
    <filter id={`n${opacity}`}>
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#n${opacity})`} />
  </svg>
);

// ── REDIRECT TO LOGIN ─────────────────────────────────────────────────────────
const goToLogin = () => { window.location.href = "/login"; };

// ── AUTH MODAL ────────────────────────────────────────────────────────────────
const AuthModal = ({ open, onClose, onLogin }) => (
  <AnimatePresence>
    {open && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[400] flex items-center justify-center px-5">
        <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-[#06090F] overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(35,181,181,0.18),transparent_55%)] pointer-events-none" />
          <Noise />
          <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
            <LucideIcons.X size={15} />
          </button>
          <div className="relative p-8 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: BRAND_DIM, border: `1px solid ${BRAND}33` }}>
              <LucideIcons.Sparkles size={28} color={BRAND} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Unlock This App</h2>
            <p className="text-gray-400 text-sm mb-7 leading-relaxed max-w-xs mx-auto">
              Sign in or create a free account to access all marketplace apps, track installs, and manage your workspace.
            </p>
            <button onClick={() => { onLogin(); onClose(); }}
              className="w-full py-3.5 rounded-2xl font-black text-base text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(35,181,181,0.45)] active:scale-[0.97] mb-3"
              style={{ background: `linear-gradient(135deg, #23b5b5, #1a9090)` }}>
              Sign In / Create Free Account →
            </button>
            <p className="text-[11px] text-gray-600">Free forever · No credit card required</p>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ── TAG PILL ──────────────────────────────────────────────────────────────────
const TagPill = ({ tag }) => {
  const tagColors = {
    "Our App": { bg: `rgba(35,181,181,0.15)`, color: BRAND, border: `rgba(35,181,181,0.35)` },
    "Pro": { bg: `rgba(167,139,250,0.12)`, color: "#a78bfa", border: `rgba(167,139,250,0.3)` },
    "Free": { bg: `rgba(52,211,153,0.10)`, color: "#34d399", border: `rgba(52,211,153,0.25)` },
  };
  const tc = tagColors[tag] || tagColors["Free"];
  return (
    <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest"
      style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>
      {tag}
    </span>
  );
};

// ── APP CARD ──────────────────────────────────────────────────────────────────
const AppCard = ({ app, platform, index }) => {
  const meta = PLATFORM_META[platform] || { color: BRAND, bg: BRAND_DIM };

  const handleClick = () => {
    goToLogin();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleClick}
      className="group relative rounded-2xl border bg-[#070A10]/80 p-5 flex flex-col gap-4 overflow-hidden transition-all duration-300 cursor-pointer"
      style={{ borderColor: app.ours ? `${BRAND}35` : "rgba(255,255,255,0.08)", boxShadow: app.ours ? `0 0 30px ${BRAND}10` : "none" }}>

      {app.ours && <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(35,181,181,0.08),transparent_60%)] pointer-events-none" />}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at 30% 0%, ${meta.color}0A 0%, transparent 65%)` }} />

      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="relative">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-[#0F1318] flex items-center justify-center shrink-0">
            <ItemIcon item={app} />
          </div>
          {app.endorsed && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: BRAND }}>
              <LucideIcons.BadgeCheck size={12} color="#000" />
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <TagPill tag={app.tag} />
          {app.ours && (
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-widest"
              style={{ background: `${BRAND}15`, color: BRAND, border: `1px solid ${BRAND}30` }}>
              By Explified
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-[15px] font-bold text-white mb-1.5 leading-tight group-hover:text-[#23b5b5] transition-colors tracking-tight">
          {app.title}
        </h3>
        <p className="text-[12.5px] leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">
          {app.desc}
        </p>
      </div>
    </motion.div>
  );
};


// ── MARKETPLACE EXPLORER ──────────────────────────────────────────────────────
const MarketplaceExplorer = () => {
  const { data } = useCMS();
  const headerData = data?.header || {};
  const productsData = (headerData && Object.keys(headerData).length > 0) ? (headerData.products || {}) : MOCK_CMS_HEADER;

  // Extract platforms from productsData dynamically
  const platforms = Object.entries(productsData)
    .filter(([key, val]) => {
      if (key === "url" || key === "openInNewTab") return false;
      return val && typeof val === "object" && Array.isArray(val.items);
    })
    .map(([key, val]) => {
      const normalizedKey = key.toLowerCase();
      const rawItems = val.items || [];
      const normalizedItems = rawItems.map((item, idx) => normalizeCMSApp(item, normalizedKey, idx));

      return {
        key: normalizedKey,
        originalKey: key,
        title: val.title || key,
        imageUrl: val.imageUrl || val.iconUrl,
        items: normalizedItems
      };
    });

  const [activeKey, setActiveKey] = useState("");

  // Initialize activeKey to first platform
  useEffect(() => {
    if (platforms.length > 0 && !activeKey) {
      setActiveKey(platforms[0].key);
    }
  }, [platforms, activeKey]);

  const activePlatform = platforms.find(p => p.key === activeKey) || platforms[0];
  const currentItems = activePlatform ? activePlatform.items : [];

  // Show a subset of items to avoid cluttering (e.g. limit to 3)
  const displayedItems = currentItems.slice(0, 3);

  const meta = activePlatform ? (PLATFORM_META[activePlatform.key] || { color: BRAND, bg: BRAND_DIM, label: activePlatform.title }) : { color: BRAND, bg: BRAND_DIM, label: "" };
  const [ref, inView] = useInViewOnce("40px");

  return (
    <section ref={ref} className="relative py-24 px-6 border-t border-white/5 bg-[#050505]">
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${BRAND}33, transparent)` }} />

      <motion.div variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className="max-w-7xl mx-auto">

        <motion.div variants={fadeUp} custom={0} className="text-center mb-14">

          <h2 className="font-bold text-white tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            Every app has it's
            <br />
            <span style={{ color: BRAND }}>independent pricing.</span>
          </h2>
          <p className="text-gray-400 text-base max-w-lg mx-auto leading-relaxed" style={{ fontWeight: 400 }}>
            Explified builds and endorses apps for the tools your team runs on — Figma, Shopify, Trello, Chrome, and more.
          </p>
        </motion.div>

        {/* Platform tabs */}
        <motion.div variants={fadeUp} custom={1} className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 justify-center flex-wrap">
          {platforms.map(p => {
            const m = PLATFORM_META[p.key] || { color: BRAND, label: p.title };
            const isActive = p.key === activeKey;
            return (
              <button key={p.key} onClick={() => setActiveKey(p.key)}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border shrink-0 cursor-pointer"
                style={isActive
                  ? { background: `${m.color}18`, color: m.color, borderColor: `${m.color}45` }
                  : { background: "transparent", color: "#6b7280", borderColor: "rgba(255,255,255,0.08)" }}>
                {p.imageUrl ? (
                  <div className="w-5 h-5 rounded flex items-center justify-center overflow-hidden" style={{ background: isActive ? `${m.color}25` : "rgba(255,255,255,0.05)" }}>
                    <img src={p.imageUrl} alt={p.title} className="w-4 h-4 object-contain" style={{ filter: isActive ? "none" : "grayscale(0.8) opacity(0.5)" }} onError={e => { e.currentTarget.style.display = "none"; }} />
                  </div>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: isActive ? m.color : "#374151" }} />
                )}
                {p.title}
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold"
                  style={{ background: isActive ? `${m.color}25` : "rgba(255,255,255,0.05)", color: isActive ? m.color : "#6b7280" }}>
                  {p.items?.length || 0}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Platform header */}
        {activePlatform && (
          <motion.div variants={fadeUp} custom={2}
            className="relative rounded-2xl border border-white/8 bg-[#07090E]/60 p-6 mb-8 overflow-hidden"
            style={{ borderColor: `${meta.color}25` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at left, ${meta.color}08, transparent 60%)` }} />
            <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center border overflow-hidden shrink-0" style={{ background: meta.bg, borderColor: `${meta.color}30` }}>
                {activePlatform.imageUrl
                  ? <img src={activePlatform.imageUrl} alt={meta.label} className="w-8 h-8 object-contain" onError={e => { e.currentTarget.style.display = "none"; }} />
                  : <div className="w-3 h-3 rounded-full" style={{ background: meta.color }} />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{meta.label} Marketplace</h3>
                <p className="text-gray-500 text-sm font-semibold">
                  {currentItems?.length || 0} apps verified & endorsed by Explified
                </p>
              </div>
              <div className="sm:ml-auto">
                <span className="text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  style={{ background: BRAND_DIM, color: BRAND, border: `1px solid ${BRAND}30` }}>
                  <LucideIcons.BadgeCheck size={12} />
                  Endorsed by Explified
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* App grid */}
        <AnimatePresence mode="wait">
          <motion.div key={activeKey}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedItems.map((app, idx) => (
              <AppCard key={app.title} app={app} platform={activeKey} index={idx} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pricing note */}
        <motion.div variants={fadeUp} custom={3} className="mt-8 flex items-center justify-center">
          <p className="text-sm text-center font-medium flex items-center gap-2"
            style={{ color: BRAND }}>
            <LucideIcons.Info size={14} color={BRAND} style={{ flexShrink: 0 }} />
            Pro plan pricing for each product is available on its respective marketplace listing.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};



// ── ROOT ──────────────────────────────────────────────────────────────────────
const LandingPage = () => {
  const { user, setUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const handleLogin = () => {
    setUser({ name: "Demo User", email: "demo@explified.com", avatar: null });
  };

  return (
    <div className="min-h-screen relative bg-[#050505]"
      style={{
        color: "#e5e7eb",
      }}>

      {/* Ambient grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(35,181,181,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(35,181,181,0.5) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      <div id="marketplace">
        <MarketplaceExplorer />
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onLogin={handleLogin} />
    </div>
  );
};

export default LandingPage;