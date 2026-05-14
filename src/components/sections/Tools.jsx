import React, { useMemo } from "react";
import { motion } from "framer-motion";
import * as Lucide from "lucide-react";
import { useCMS } from "../../hooks/useCMS.jsx";

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
      link: "https://lurph.com",
    },
    {
  title: "Slides",
  desc: "Turn text to slides instantly with AI",
  icon: "Monitor",        // clean screen/display icon
  theme: "cyan",
  link: "https://slides.explified.com",
},
    {
      title: "Stream",
      desc: "Stream turns any app into a live experience — with sub-second latency, built-in analytics, and a drop-in SDK. Private beta is opening soon.",
      icon: "Tv2",                 // ← Netflix/streaming TV icon
      theme: "cyan",
      link: "https://stream.explified.com",
    },
    {
      title: "Beacon",
      desc: "Beacon is a modern browser designed for builders. Fast, minimal, and intelligent — it brings your tools, tabs, and workflows together so you can focus on what matters.",
      icon: "Globe",               // ← browser/web icon
      theme: "cyan",
      link: "https://beacon.explified.com",
    }
  ],
};

const themeColors = {
  cyan: "#23b5b5",
  purple: "#a855f7",
  yellow: "#eab308",
  emerald: "#10b981",
  orange: "#f97316"
};

const EliteCard = ({ item, label, index }) => {
  const Icon = Lucide[item.icon] || Lucide.Zap;
  const activeColor = themeColors[item.theme] || "#23b5b5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="flex-none w-[calc(25%-18px)] min-w-[280px] snap-start group relative flex flex-col bg-white/[0.03] rounded-[2rem] h-[440px] border border-white/[0.06] hover:border-[#23b5b5]/30 transition-all duration-500 overflow-hidden"
    >
      {/* Card hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(35,181,181,0.07), transparent 65%)' }}
      />
      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(to right, transparent, #23b5b5, transparent)' }}
      />

      <div className="relative h-44 w-full flex items-center justify-center border-b border-white/[0.05]">
        <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          {item.icon && (item.icon.startsWith('http') || item.icon.startsWith('/')) ? (
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
          <h3 className="text-xl font-bold text-white group-hover:text-[#23b5b5] transition-colors duration-300 leading-tight">
            {item.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-medium">
            {item.desc || "Optimized automation tool by Explified Labs."}
          </p>
        </div>
        <div className="pt-6">
          
           <a href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-black/30 text-white border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-[#23b5b5] hover:text-black hover:border-[#23b5b5] transition-all duration-300"
          >
            Get Started <Lucide.ArrowRight size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const Marketplace = () => {
  const { data } = useCMS();
  const products = data?.header?.products || {};

  const dynamicSections = useMemo(() => {
    const platforms = [
      { key: "Atlassian", title: "Atlassian Tools", label: "ATLASSIAN", icon: "Layout", sub: "Enterprise productivity and workflow solutions" },
      { key: "Shopify", title: "Shopify Apps", label: "SHOPIFY", icon: "ShoppingBag", sub: "Marketing and store automation utilities" },
      { key: "Chrome", title: "Chrome Extensions", label: "EXTENSION", icon: "Chrome", sub: "Supercharge your browser with AI overlays" },
      { key: "Figma", title: "Figma Plugins", label: "FIGMA", icon: "Figma", sub: "Accelerate your creative design workflow" },
      { key: "ClickUp", title: "ClickUp Apps", label: "CLICKUP", icon: "ClipboardCheck", sub: "Optimize your task management workflow" },
      { key: "Bubble", title: "Bubble Plugins", label: "BUBBLE", icon: "Component", sub: "Visual programming power-ups" },
      { key: "Odoo", title: "Odoo Modules", label: "ODOO", icon: "Settings", sub: "Business process automation" }
    ];

    return platforms.map(p => {
      const platformData = products[p.key];
      const items = (platformData?.items || []).map(item => ({
        title: item.title,
        desc: item.desc,
        icon: item.iconUrl || item.icon,
        link: item.url,
        theme: "cyan"
      }));
      return { id: p.key.toLowerCase(), ...p, items };
    }).filter(s => s.items.length > 0);
  }, [products]);

  const ALL_SECTIONS = [ ...dynamicSections , CORE_PRODUCTS];

  return (
    <div
      className="py-32 px-6 lg:px-12 font-sans relative overflow-hidden"
      style={{ backgroundColor: '#050505', isolation: 'isolate' }}
    >
      {/* Contained section glow — does not bleed into neighbors */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(35,181,181,0.08), transparent 70%)',
          filter: 'blur(60px)'
        }}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="max-w-[1440px] mx-auto relative z-10">

        <header className="mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase">
              Product<span className="text-[#23b5b5]"> Studio</span>
            </h1>
            {/* Gradient underline */}
            <div
              className="mx-auto mt-4 mb-6 h-[2px] w-32 rounded-full"
              style={{ background: 'linear-gradient(to right, transparent, #23b5b5, transparent)' }}
            />
            <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-lg font-medium leading-relaxed">
              Discover our collection of high-performance tools and extensions designed to optimize your creative and technical workflow.
            </p>
          </motion.div>
        </header>

        <div className="space-y-40">
          {ALL_SECTIONS.map((section) => {
            const SectionIcon = Lucide[section.icon] || Lucide.LayoutGrid;
            return (
              <section key={section.id}>
                <div className="flex items-start gap-6 mb-12">
                  <div
                    className="w-14 h-14 rounded-2xl bg-[#23b5b5]/10 border border-[#23b5b5]/20 flex items-center justify-center"
                    style={{ boxShadow: '0 0 24px rgba(35,181,181,0.10)' }}
                  >
                    <SectionIcon className="text-[#23b5b5]" size={28} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
                      {section.title}<span className="text-[#23b5b5]">.</span>
                    </h2>
                    {/* Section title underline */}
                    <div
                      className="mt-1 mb-2 h-[1px] w-16"
                      style={{ background: 'linear-gradient(to right, #23b5b5, transparent)' }}
                    />
                    <p className="text-gray-400 text-base font-medium">{section.subtitle || section.sub}</p>
                  </div>
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