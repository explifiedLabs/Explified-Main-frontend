import React, { useRef, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import * as Lucide from "lucide-react";
import { useCMS } from "../../hooks/useCMS.jsx";

// ==========================================
// 1. DATA CONFIGURATION
// ==========================================
const CORE_PRODUCTS = {
  id: "core-products",
  title: "Core Products",
  subtitle: "Powerful utilities that work beyond any single platform",
  label: "PRODUCTS",
  icon: "Package",
  items: [
    {
      title: "Lurph",
      desc: "The AI-native engine that connects your tools and automates your entire stack.",
      icon: "Zap",
      theme: "yellow",
      btnText: "Visit Lurph",
      link: "https://lurph.com",
    }
  ],
};

const AI_TOOLS = {
  id: "ai-tools",
  title: "AI Content Tools",
  subtitle: "Write, summarize, and structure content with AI",
  label: "CONTENT",
  icon: "BrainCircuit",
  items: [
    { title: "AI Subtitle Generator", desc: "Transcribe audio and generate precise subtitles for your videos.", icon: "PenLine", theme: "cyan", btnText: "Try now", link: "https://app.explified.com/ai-subtitler" },
    { title: "AI Image Styler", desc: "Transform your photos into artistic masterpieces with style transfer.", icon: "FileText", theme: "purple", btnText: "Open App", link: "https://app.explified.com/login" },
    { title: "Meme Generator", desc: "Turn text prompts into viral memes by automatically pairing images.", icon: "Layers", theme: "emerald", btnText: "Generate", link: "https://app.explified.com/text-to-meme" },
    { title: "Video Creator", desc: "Create high-quality video content from simple text descriptions.", icon: "Circle", theme: "orange", btnText: "Create", link: "https://app.explified.com/text-to-video" },
  ],
};

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

const EliteCard = ({ item, label, index }) => {
  const Icon = Lucide[item.icon] || Lucide.Zap;
  
  const themeColors = {
    cyan: "#23b5b5",
    purple: "#a855f7",
    yellow: "#eab308",
    emerald: "#10b981",
    orange: "#f97316"
  };
  const activeColor = themeColors[item.theme] || "#23b5b5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="flex-none w-[calc(25%-18px)] min-w-[280px] snap-start group relative flex flex-col bg-[#080B10]/80 backdrop-blur-md rounded-[2rem] h-[440px] border border-white/5 hover:border-[#23b5b5]/40 transition-all duration-500 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#23b5b5]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative h-44 w-full flex items-center justify-center border-b border-white/5">
        <div className="w-16 h-16 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
          {item.icon && item.icon.startsWith('http') ? (
            <img src={item.icon} alt={item.title} className="w-14 h-14 object-contain" />
          ) : (
            <Icon style={{ color: activeColor }} size={32} strokeWidth={1.5} />
          )}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow relative z-10">
        <div className="flex-grow space-y-4">
          <span className="text-[9px] font-black tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 uppercase text-[#23b5b5]">
            {label}
          </span>
          <h3 className="text-xl font-bold text-white group-hover:text-[#23b5b5] transition-colors leading-tight">
            {item.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-medium">
            {item.desc || "Optimized automation tool by Explified Labs."}
          </p>
        </div>

        <div className="pt-6">
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-black/40 text-white border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-[#23b5b5] hover:text-black hover:border-[#23b5b5] transition-all duration-300">
            Get Started <Lucide.ArrowRight size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// 3. MAIN MARKETPLACE COMPONENT
// ==========================================

const Marketplace = () => {
  const { data } = useCMS();
  const products = data?.header?.products || {};

  const dynamicSections = useMemo(() => {
    const platforms = [
      { key: "Chrome", title: "Chrome Extensions", label: "EXTENSION", icon: "Chrome", sub: "Supercharge your browser with AI overlays" },
      { key: "Shopify", title: "Shopify Apps", label: "SHOPIFY", icon: "ShoppingBag", sub: "Marketing and store automation utilities" },
      { key: "Figma", title: "Figma Plugins", label: "FIGMA", icon: "Figma", sub: "Accelerate your creative design workflow" }
    ];

    return platforms.map(p => ({
      id: p.key.toLowerCase(),
      ...p,
      items: (products[p.key]?.items || []).map(item => ({
        title: item.title, desc: item.desc, icon: item.iconUrl || item.icon, link: item.url, theme: "cyan"
      }))
    })).filter(s => s.items.length > 0);
  }, [products]);

  const ALL_SECTIONS = [CORE_PRODUCTS, ...dynamicSections, AI_TOOLS];

  return (
    <div className="min-h-screen bg-[#05070A] py-32 px-6 lg:px-12 font-sans relative overflow-hidden">
      
      {/* --- ENHANCED BRAND BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#23b5b5]/20 blur-[140px] rounded-full opacity-50" />
        <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-[#23b5b5]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-[#23b5b5]/10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#05070A_100%)] opacity-70" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* --- ADDED HEADER SECTION --- */}
        <header className="mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
           
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase">
              Product<span className="text-[#23b5b5]"> Studio</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-lg font-medium leading-relaxed">
              Discover our collection of high-performance tools and extensions designed to optimize your creative and technical workflow.
            </p>
          </motion.div>
        </header>

        {/* --- MAIN SECTIONS --- */}
        <div className="space-y-40">
          {ALL_SECTIONS.map((section) => {
            const SectionIcon = Lucide[section.icon] || Lucide.LayoutGrid;
            return (
              <section key={section.id} className="group/section">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#23b5b5]/10 border border-[#23b5b5]/20 flex items-center justify-center shadow-[0_0_20px_rgba(35,181,181,0.15)]">
                      <SectionIcon className="text-[#23b5b5]" size={28} />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
                          {section.title}<span className="text-[#23b5b5]">.</span>
                      </h2>
                      <p className="text-gray-400 text-base mt-1 font-medium">{section.subtitle || section.sub}</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-[#23b5b5] flex items-center gap-4 transition-all group/btn">
                    View All <Lucide.MoveRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>

                <div className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4">
                  {section.items.map((item, idx) => (
                    <EliteCard key={idx} item={item} label={section.label} index={idx} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;