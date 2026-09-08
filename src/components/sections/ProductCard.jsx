import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ─── Product Mock Data ─── */
const FEATURED_PRODUCTS = [
  {
    title: "ZERO BG",
    platform: "FIGMA",
    desc: "Ship pixel-perfect components straight from canvas.",
    image: "/products/Remove BG.png",
    link: "/zerobg",
  },
  {
    title: "WIREFRAMER AI",
    platform: "FIGMA",
    desc: "Generate production-grade wireframes from a single prompt.",
    image: "/products/Wireframe Ai.png",
    link: "/wireframerai",
  },
  {
    title: "VERDICT",
    platform: "SHOPIFY",
    desc: "AI-augmented product previews that lift conversion.",
    image: "/products/Judge me.jpg",
    link: "/verdict",
  },
  {
    title: "SUMMIFY",
    platform: "TRELLO",
    desc: "Summarize anything on the web with one keystroke.",
    image: "/products/Summmify.png",
    link: "...",
  },
  {
    title: "CARDLYTICS",
    platform: "TRELLO",
    desc: "Triage, resolve and route design feedback automatically.",
    image: "/products/Cardlytics.jpg",
    link: "/cardlytics",
  },
  {
    title: "PROGRESS",
    platform: "TRELLO",
    desc: "Visualize velocity and unblock teams in real-time.",
    image: "/products/Progress.jpg",
    link: "...",
  },
];

/* ─── Framer Motion Variants ─── */
const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Creates the clean cascading wave effect
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
    },
  },
};

/* ─── Individual Card Component ─── */
const ProductCard = ({ product }) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        scale: 1.015,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      className={`group relative flex flex-col justify-between p-8 rounded-xl border bg-gradient-to-b from-[#07221e] to-[#031210] min-h-[250px] transition-shadow duration-300
        ${
          product.highlighted
            ? "border-[#23b5b5]/60 shadow-[0_0_25px_rgba(35,181,181,0.15)]"
            : "border-[#23b5b5]/10 hover:border-[#23b5b5]/50 hover:shadow-[0_15px_30px_rgba(35,181,181,0.08)]"
        }`}
    >
      {/* Card Header Layer */}
      <div className="flex items-center justify-between mb-8">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#23b5b5]/5 border border-[#23b5b5]/20 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
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
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
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
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }} // Triggers reliably when 15% of the grid is visible
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
