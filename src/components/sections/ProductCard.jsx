import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

/* ─── Product Mock Data ─── */
const FEATURED_PRODUCTS = [
  {
    title: "BG REMOVER",
    platform: "FIGMA",
    desc: "Ship pixel-perfect components straight from canvas.",
    link: "https://www.figma.com/community/plugin/1643987146382893434/removebg",
  },
  {
    title: "WIREFRAMERAI",
    platform: "FIGMA",
    desc: "Generate production-grade wireframes from a single prompt.",
    link: "https://www.figma.com/community/plugin/1607779209963334185/wireframer-ai",
  },
  {
    title: "JUDGE ME",
    platform: "SHOPIFY",
    desc: "AI-augmented product previews that lift conversion.",
    link: "https://apps.shopify.com/judgeme-1?st_source=autocomplete&surface_detail=autocomplete_apps",
  },
  {
    title: "SUMMIFY",
    platform: "TRELLO",
    desc: "Summarize anything on the web with one keystroke.",
    link: "https://trello.com/power-ups/69b424a01952fa85643762dd",
  },
  {
    title: "CARDLYTICS",
    platform: "TRELLO",
    desc: "Triage, resolve and route design feedback automatically.",
    link: "https://trello.com/power-ups/69345803ec5875c4f362fa5e",
    highlighted: false, // Renders with the premium glow border by default
  },

  {
    title: "PROGRESS",
    platform: "TRELLO",
    desc: "Visualize velocity and unblock teams in real-time.",
    link: "https://trello.com/power-ups/697e0da3633afc7009edebc2",
  },
];

/* ─── Individual Card Component ─── */
const ProductCard = ({ product, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group relative flex flex-col justify-between p-8 rounded-xl border bg-gradient-to-b from-[#07221e] to-[#031210] transition-all duration-300 min-h-[250px]
        ${
          product.highlighted
            ? "border-[#23b5b5]/60 shadow-[0_0_25px_rgba(35,181,181,0.15)]"
            : "border-[#23b5b5]/10 hover:border-[#23b5b5]/50 hover:shadow-[0_0_20px_rgba(35,181,181,0.1)]"
        }`}
    >
      {/* Card Header Layer */}
      <div className="flex items-center justify-between mb-8">
        {/* Custom Icon Wrapper - Increased green tint behind the icon */}
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#23b5b5]/5 border border-[#23b5b5]/20 text-[#23b5b5]">
          <Sparkles size={18} strokeWidth={1.5} />
        </div>

        {/* Platform Badge */}
        <span className="text-[10px] font-bold tracking-wider text-[#23b5b5] px-2.5 py-0.5 rounded-full border border-[#23b5b5]/30 bg-[#23b5b5]/5">
          {product.platform}
        </span>
      </div>

      {/* Card Content Layer */}
      <div className="flex flex-col grow mb-6">
        <h3 className="text-white text-lg font-black tracking-wider uppercase mb-3">
          {product.title}
        </h3>
        <p className="text-neutral-300 text-sm leading-relaxed max-w-[90%] font-medium">
          {product.desc}
        </p>
      </div>

      {/* Action Trigger */}
      <div className="mt-auto">
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-md font-bold text-[#23b5b5] transition-colors group-hover:text-white no-underline"
        >
          Get Started
          <ArrowRight
            size={14}
            className="transform transition-transform duration-300 group-hover:translate-x-1 text-[#23b5b5]"
          />
        </a>
      </div>
    </motion.div>
  );
};

/* ─── Main Featured Products Section ─── */
const FeaturedProducts = () => {
  return (
    <section className="w-full bg-[#050505] text-white font-sans py-24 relative overflow-hidden">
      <div className="max-w-[1340px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-left"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-4 h-[1px] bg-[#23b5b5]" />
            <span className="text-[13px] text-[#23b5b5] font-extrabold tracking-[0.2em] uppercase">
              Featured Products
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Built for scale.
          </h2>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mt-1 text-neutral-500">
            Designed for teams.
          </h2>
        </motion.div>

        {/* Dynamic Products Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PRODUCTS.map((product, idx) => (
            <ProductCard key={product.title} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
