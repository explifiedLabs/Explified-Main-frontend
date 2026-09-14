import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ─── Product Mock Data ─── */
const FEATURED_PRODUCTS = [
  {
    title: "VERDICT",
    platform: "SHOPIFY",
    desc: "AI-augmented product previews that lift conversion.",
    long: "Verdict turns your product page into a live, personalized preview — smart badges, dynamic reviews, and social proof placed where it actually converts.",
    image: "/products/Judge me.jpg",
    link: "/verdict",
  },
  {
    title: "ZERO BG",
    platform: "FIGMA",
    desc: "Ship pixel-perfect components straight from canvas.",
    long: "Turn Figma and Framer designs into clean, production-ready output — no manual cleanup, no lost fidelity. Just export and go.",
    image: "/products/Remove BG.png",
    link: "/zerobg",
  },
  {
    title: "WIREFRAMER AI",
    platform: "FIGMA",
    desc: "Generate production-grade wireframes from a single prompt.",
    long: "Describe what you need and Wireframer AI drafts a full, editable layout in seconds — with auto-layout, smart placeholders, and clean typography, ready to iterate on.",
    image: "/products/Wireframe Ai.png",
    link: "/wireframerai",
  },
  {
    title: "SUMMIFY",
    platform: "TRELLO",
    desc: "Summarize anything on the web with one keystroke.",
    long: "Long articles, videos, threads — Summify distills them into the essentials instantly, right where you're working. Save hours every week.",
    image: "/products/Summmify.png",
    link: "/summify",
  },
  {
    title: "CARDLYTICS",
    platform: "TRELLO",
    desc: "Triage, resolve and route design feedback automatically.",
    long: "Every comment lands in the right place with the right owner. Cardlytics reads, sorts, and assigns feedback so nothing slips through the cracks.",
    image: "/products/Cardlytics.jpg",
    link: "/cardlytics",
  },
  {
    title: "PROGRESS",
    platform: "TRELLO",
    desc: "Visualize velocity and unblock teams in real-time.",
    long: "Live dashboards show exactly where work stands and what's stuck — so you can act before momentum stalls. Clarity, without the standup.",
    image: "/products/Progress.jpg",
    link: "/progress",
  },
];

/* ─── Main Component ─── */
const FeaturedProducts = () => {
  const [active, setActive] = useState(0);
  const product = FEATURED_PRODUCTS[active];

  return (
    <section className="w-full bg-[#050505] text-white font-sans py-24 relative overflow-hidden">
      {/* Ambient teal glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(35,181,181,0.06), transparent 75%)",
          filter: "blur(90px)",
        }}
      />

      <div className="max-w-[1340px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="mb-12 text-left"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-6 h-[1px] bg-[#23b5b5]" />
            <span className="text-[12px] text-[#23b5b5] font-extrabold tracking-[0.24em] uppercase">
              Featured Products
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] text-white">
            Built for scale.
          </h2>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mt-1 text-neutral-500">
            Designed for teams.
          </h2>
        </motion.div>

        {/* ---------- TABS ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex gap-2.5 flex-wrap mb-7"
        >
          {FEATURED_PRODUCTS.map((p, i) => (
            <button
              key={p.title}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold font-sans transition-all duration-300 border ${
                active === i
                  ? "bg-[#23b5b5] text-black border-[#23b5b5] shadow-[0_6px_22px_rgba(35,181,181,0.35)]"
                  : "bg-white/[0.03] text-neutral-400 border-white/[0.08] hover:border-[#23b5b5]/40 hover:text-white"
              }`}
            >
              {p.title
                .toLowerCase()
                .split(" ")
                .map((w) => w[0].toUpperCase() + w.slice(1))
                .join(" ")}
            </button>
          ))}
        </motion.div>

        {/* ---------- SPLIT PANEL ---------- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={product.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative rounded-[24px] overflow-hidden border border-white/[0.07] p-8 md:p-12"
            style={{
              background:
                "linear-gradient(160deg, rgba(35,181,181,0.06) 0%, rgba(5,5,5,0.6) 40%)",
            }}
          >
            {/* subtle radial accent */}
            <div
              className="absolute inset-0 opacity-60 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 8% 0%, rgba(35,181,181,0.14), transparent 55%)",
              }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
              {/* ---------- LEFT: copy ---------- */}
              <div>
                <div className="text-[13px] font-black tracking-[0.22em] text-[#23b5b5] mb-4 uppercase">
                  {product.title}
                </div>

                <h3 className="text-white text-3xl md:text-4xl font-bold tracking-tight leading-[1.15] mb-5">
                  {product.desc}
                </h3>

                <p className="text-neutral-400 text-[15px] leading-relaxed max-w-lg mb-8">
                  {product.long}
                </p>

                <div className="flex items-center gap-3 mb-8">
                  <span className="text-[10px] font-bold tracking-widest text-[#23b5b5] px-2.5 py-1 rounded-full border border-[#23b5b5]/30 bg-[#23b5b5]/5">
                    {product.platform}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Product · Live
                  </span>
                </div>

                <a
                  href={product.link}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#23b5b5] hover:text-white transition-colors no-underline group/cta"
                >
                  Get Started
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover/cta:translate-x-1"
                  />
                </a>
              </div>

              {/* ---------- RIGHT: product visual ---------- */}
              <div className="relative w-full h-[260px] md:h-[320px] rounded-2xl border border-white/[0.08] overflow-hidden bg-gradient-to-br from-[#0b1516] to-[#060d0e] flex items-center justify-center">
                {/* label chip */}
                <span className="absolute top-4 left-4 z-10 text-[11px] text-neutral-400 bg-black/40 border border-white/[0.08] px-2.5 py-1 rounded-md">
                  {product.title}
                </span>

                {/* soft teal wash */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 60% 40%, rgba(35,181,181,0.18), transparent 60%)",
                  }}
                />

                {/* the actual product image, on a floating tile */}
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden border border-[#23b5b5]/25 shadow-[0_0_50px_rgba(35,181,181,0.25)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#23b5b5]/12 to-transparent pointer-events-none z-10" />
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturedProducts;