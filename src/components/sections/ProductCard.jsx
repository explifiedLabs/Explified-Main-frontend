import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

/* ─── Product Mock Data ─── */
const FEATURED_PRODUCTS = [
  {
    title: "WIREFRAMERAI",
    platform: "FIGMA",
    desc: "Generate production-grade wireframes from a single prompt.",
    link: "https://figma.com/marketplace/wireframerai",
  },
  {
    title: "SUMIFY",
    platform: "CHROME",
    desc: "Summarize anything on the web with one keystroke.",
    link: "https://chromewebstore.google.com/sumify",
  },
  {
    title: "COMMENT AI",
    platform: "FIGMA",
    desc: "Triage, resolve and route design feedback automatically.",
    link: "https://figma.com/marketplace/comment-ai",
    highlighted: true, // Renders with the premium glow border by default
  },
  {
    title: "SMART PREVIEW",
    platform: "SHOPIFY",
    desc: "AI-augmented product previews that lift conversion.",
    link: "https://apps.shopify.com/smart-preview",
  },
  {
    title: "PROGRESS TRACKER",
    platform: "TRELLO",
    desc: "Visualize velocity and unblock teams in real-time.",
    link: "https://trello.com/power-ups/progress-tracker",
  },
  {
    title: "DESIGN TO CODE",
    platform: "FRAMER",
    desc: "Ship pixel-perfect components straight from canvas.",
    link: "https://framer.com/plugins/design-to-code",
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
      className={`group relative flex flex-col justify-between p-8 rounded-xl border bg-gradient-to-b from-[#0a1614] to-[#040a09] transition-all duration-300 min-h-[250px]
        ${
          product.highlighted
            ? "border-[#23b5b5]/50 shadow-[0_0_25px_rgba(35,181,181,0.12)]"
            : "border-white/[0.06] hover:border-[#23b5b5]/40 hover:shadow-[0_0_20px_rgba(35,181,181,0.08)]"
        }`}
    >
      {/* Card Header Layer */}
      <div className="flex items-center justify-between mb-8">
        {/* Custom Icon Wrapper */}
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/[0.08] text-[#23b5b5]">
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
        <p className="text-neutral-400 text-sm leading-relaxed max-w-[90%] font-medium">
          {product.desc}
        </p>
      </div>

      {/* Action Trigger */}
      <div className="mt-auto">
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#23b5b5] transition-colors group-hover:text-white no-underline"
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
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
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
