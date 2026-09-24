import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

const ExplifiedCTA = () => {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative w-full py-32 md:py-40 bg-[#050607] overflow-hidden font-sans text-center">
      {/* Ambient teal floor glow — matches the big-cta glow-floor from the redesign */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          bottom: "-46%",
          width: "1000px",
          height: "640px",
          background:
            "radial-gradient(ellipse at center, rgba(35,181,181,0.28), transparent 62%)",
        }}
      />

      {/* Faint blueprint grid — very subtle, fades at the edges */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      {/* Shimmering gradient keyframes — scoped to this section */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes cta-shine {
            to { background-position: 200% center; }
          }
          .cta-shine-text {
            background: linear-gradient(115deg, #4fdede, #23b5b5, #178f8f, #23b5b5, #4fdede);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: cta-shine 5s linear infinite;
          }
        `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.9, 0.3, 1] }}
          className="font-bold tracking-tight leading-[1.05] max-w-[780px] mx-auto"
          style={{ fontSize: "clamp(34px, 5.6vw, 66px)", letterSpacing: "-1.6px" }}
        >
          <span className="text-white">Ready to transform how</span>
          <br />
          <span className="cta-shine-text">your team works?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="text-[16px] text-neutral-400 max-w-[480px] mx-auto mt-6 mb-9 leading-relaxed"
        >
          We try to make magic happen through technology. Visit our labs to
          know more.
        </motion.p>

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
        >
          <Link to="https://explified.com/labs">
            <button className="relative cursor-pointer overflow-hidden bg-[#23b5b5] text-black font-bold text-[15px] px-7 py-3.5 rounded-full flex items-center justify-center w-full sm:w-auto gap-2.5 hover:scale-105 transition-transform shadow-[0_8px_30px_rgba(35,181,181,0.4)] group">
              <span className="relative z-10">Visit Explified Labs</span>
              <ArrowUpRight size={18} className="relative z-10" />
              <div className="absolute inset-0 bg-white/25 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ExplifiedCTA;