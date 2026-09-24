import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

/* =====================================================================
   THEME
   ===================================================================== */
const TEAL = "#23b5b5";
const TEAL_LIGHT = "#4fdede";

/* ---------------------------------------------------------------------
   Tech Scroller Logos (PNG-based)
   ------------------------------------------------------------------- */
const ALL_LOGOS = [
  { name: "Chrome", src: "/logos/chrome.png" },
  { name: "Edge", src: "/logos/edge.png" },
  { name: "Figma", src: "/logos/figma.png" },
  { name: "ClickUp", src: "/logos/clickup.png" },
  { name: "OpenAI", src: "/logos/chatgpt.png" },
  { name: "Odoo", src: "/logos/odoo.png" },
  { name: "Penpot", src: "/logos/penpot.png" },
  { name: "HubSpot", src: "/logos/hubspot.png" },
  { name: "Canva", src: "/logos/canva.png" },
  { name: "Webex", src: "/logos/webex.png" },
  { name: "Trello", src: "/logos/trello.png" },
  { name: "Shopify", src: "/logos/shopify.png" },
  { name: "Bubble", src: "/logos/bubble.png" },
];

/* Floating marketplace tags scattered around the hero — decorative texture. */
const FLOATING_TAGS = [
  { name: "Shopify", className: "top-[12%] left-2 sm:left-6 lg:left-[2%]", delay: 0.5 },
  { name: "Figma", className: "top-[16%] right-2 sm:right-6 lg:right-[3%]", delay: 0.65 },
  { name: "Chrome", className: "top-[40%] right-2 sm:right-8 lg:right-[10%]", delay: 0.8 },
  { name: "Framer", className: "top-[48%] right-4 sm:right-12 lg:right-[24%]", delay: 0.95 },
  { name: "Trello", className: "top-[50%] left-2 sm:left-8 lg:left-[8%]", delay: 1.1 },
];

/* Tiny ambient teal dots — starfield / node-graph feel. */
const FLOATING_DOTS = [
  { className: "top-[11%] left-[15%]", size: "w-1.5 h-1.5", delay: 0.3 },
  { className: "top-[3%] left-[58%]", size: "w-1 h-1", delay: 0.5 },
  { className: "top-[8%] left-[61%]", size: "w-1.5 h-1.5", delay: 0.7 },
  { className: "top-[19%] left-[12%]", size: "w-1 h-1", delay: 0.9 },
  { className: "top-[65%] right-[20%]", size: "w-1.5 h-1.5", delay: 1.1 },
  { className: "top-[72%] right-[16%]", size: "w-1 h-1", delay: 1.3 },
  { className: "top-[79%] right-[13%]", size: "w-1 h-1", delay: 1.5 },
];

/* ---------------------------------------------------------------------
   Animation config
   ------------------------------------------------------------------- */
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

/* =====================================================================
   Small decorative sub-components
   ===================================================================== */
const FloatingTag = ({ name, className, delay, floatDuration = 4, floatDistance = 10 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1, y: [0, -floatDistance, 0] }}
    transition={{
      opacity: { duration: 0.7, delay, ease: "easeOut" },
      scale: { duration: 0.7, delay, ease: "easeOut" },
      y: { duration: floatDuration, delay: delay + 0.7, repeat: Infinity, ease: "easeInOut" },
    }}
    className={`hidden sm:flex absolute z-10 items-center px-5 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm ${className}`}
  >
    <span className="text-xs md:text-sm font-medium text-gray-500">{name}</span>
  </motion.div>
);

const FloatingDot = ({ className, size, delay }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0.4, 1, 0.4], scale: 1 }}
    transition={{
      opacity: { duration: 3, delay, repeat: Infinity, ease: "easeInOut" },
      scale: { duration: 0.5, delay },
    }}
    className={`hidden sm:block absolute rounded-full bg-[#23b5b5] shadow-[0_0_8px_rgba(35,181,181,0.8)] pointer-events-none z-10 ${size} ${className}`}
  />
);

/* =====================================================================
   Count-up number — animates 0 → target when it scrolls into view.
   White colored, keeps the original "+" / "K+" suffix.
   ===================================================================== */
const CountUp = ({ to, suffix = "", decimals = 0, duration = 1600 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(to);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span
      ref={ref}
      className="text-white text-[60px] leading-none font-extrabold tracking-tight"
    >
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};

/* =====================================================================
   MAIN HERO
   ===================================================================== */
const Hero = () => {
  return (
    <section className="relative pt-40 pb-10 overflow-hidden min-h-screen flex flex-col items-center bg-[#050607]">
      {/* Blueprint grid */}
      <div
        className="absolute top-0 left-0 right-0 h-[760px] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 78%)",
        }}
      />

      {/* Atmospheric teal glows */}
      <motion.div
        className="absolute top-[-40px] right-[-40px] w-[340px] h-[340px] bg-[#23b5b5]/10 blur-3xl rounded-full pointer-events-none"
        animate={{ x: [-20, 20] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[220px] left-[-40px] w-[480px] h-[480px] bg-[#23b5b5]/10 blur-3xl rounded-full pointer-events-none"
        animate={{ x: [30, -30] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[800px] bg-[#23b5b5]/15 blur-[150px] rounded-full pointer-events-none opacity-70" />

      {/* Ambient dots + marketplace tags */}
      {FLOATING_DOTS.map((dot, i) => (
        <FloatingDot key={i} {...dot} />
      ))}
      {FLOATING_TAGS.map((tag) => (
        <FloatingTag key={tag.name} name={tag.name} className={tag.className} delay={tag.delay} />
      ))}

      {/* ---------- Text block (centered) ---------- */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-20 w-full max-w-4xl px-6 text-center flex flex-col items-center"
      >
        <motion.h1
          variants={fadeUpVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
        >
          <span className="text-white">We Digitally Transform Your Enterprise,</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-gray-700">
            Piece by Piece
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUpVariants}
          className="text-base md:text-lg text-gray-400 max-w-xl mt-6 mb-9 leading-relaxed"
        >
          AI-powered products and automation that modernize how your business runs —
          across every tool your team already uses.
        </motion.p>

        <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="https://explified.com/labs">
            <button className="relative cursor-pointer overflow-hidden bg-[#23b5b5] text-black font-bold text-base px-8 py-3.5 rounded-full flex items-center justify-center w-full sm:w-auto gap-2 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(35,181,181,0.4)] group">
              <span className="relative z-10">Explore Labs</span>
              <ArrowRight size={18} className="relative z-10" />
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* ---------- Trusted platforms strip ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative w-full overflow-hidden mt-20 pt-10 z-20 flex flex-col items-center"
      >
        <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-[0.2em] mb-8 text-center px-4">
          Trusted across major platforms
        </p>

        <div
          className="relative w-full max-w-[100vw] mx-auto z-10"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
        >
          <div className="flex w-max animate-continuous-scroll hover:[animation-play-state:paused] items-center py-4">
            {[...ALL_LOGOS, ...ALL_LOGOS].map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center gap-3 w-[180px] md:w-[240px] shrink-0 group cursor-pointer text-neutral-600 transition-transform duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                  <img
                    src={item.src}
                    alt={item.name}
                    className="w-8 h-8 shrink-0 object-contain drop-shadow-md"
                  />
                </div>
                <span className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300 whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-continuous-scroll { animation: scroll 45s linear infinite; }
        `,
          }}
        />
      </motion.div>

      {/* ---------- Stats ---------- */}
      <section className="relative w-full">
        <div className="max-w-6xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col justify-center md:px-10 py-8">
              <div className="flex items-end gap-3">
                <CountUp to={50} suffix="+" />
                <span className="text-[#23b5b5] text-[22px] font-semibold mb-2">Apps</span>
              </div>
              <p className="mt-2 text-[16px] text-gray-400">Across all major marketplaces</p>
            </div>

            <div className="flex flex-col justify-center md:px-10 py-8 border-t md:border-t-0 md:border-l border-[#23b5b5]/20">
              <div className="flex items-end gap-3">
                <CountUp to={7} suffix="+" />
                <span className="text-[#23b5b5] text-[22px] font-semibold mb-2">Platforms</span>
              </div>
              <p className="mt-2 text-[16px] text-gray-400 leading-relaxed">
                Figma, Shopify, Trello, Chrome,
                <br />
                Framer &amp; more
              </p>
            </div>

            <div className="flex flex-col justify-center md:px-10 py-8 border-t md:border-t-0 md:border-l border-[#23b5b5]/20">
              <div className="flex items-end gap-3">
                <CountUp to={3.5} suffix="K+" decimals={1} />
                <span className="text-[#23b5b5] text-[22px] font-semibold mb-2">Followers</span>
              </div>
              <p className="mt-2 text-[16px] text-gray-400">Across Explified's content channels</p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Hero;