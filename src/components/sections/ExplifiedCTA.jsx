import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

const ExplifiedCTA = () => {
  // --- Animations Configuration ---
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative w-full py-20 px-4 md:px-8 bg-black overflow-hidden font-sans">
      <div className="absolute inset-0 bg-black" />

      <div className="relative z-10 max-w-[1300px] mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full overflow-hidden rounded-[40px] border border-white/10 bg-[#050505] group"
        >
          {/* --- Card Visual Effects --- */}

          {/* 1. Subtle Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* 2. The "Aurora" Bottom Glow (Wider & diffuse) */}
          <div className="absolute bottom-0 left-0 right-0 h-[250px] bg-gradient-to-t from-[#23b5b5]/30 via-[#23b5b5]/5 to-transparent blur-[80px] pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-1000" />

          {/* 3. Top Reflection/Sheen */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* --- Content --- */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 py-16 md:py-20">
            {/* Main Headline */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg leading-tight">
                <span className="text-white">Ready to transform how</span>
                <br />
                <span className="text-[#23b5b5]">your team works?</span>
              </h2>
            </div>

            {/* Sub-headline */}
            <p className="text-base md:text-lg text-gray-400 max-w-3xl mb-10 leading-relaxed">
              We try to make magic happen through technology. Visit our labs to
              know more.
            </p>

            {/* CTA Button */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
            >
              <Link to="https://explified.com/labs">
                <button className="relative cursor-pointer overflow-hidden bg-[#23b5b5] text-black font-bold text-lg px-8 py-3.5 rounded-full flex items-center justify-center w-full sm:w-auto gap-2 hover:scale-105 transition-transform shadow-[0_0_40px_rgba(35,181,181,0.55)]">
                  <span className="relative z-10">Visit Explified Labs</span>
                  <ArrowUpRight size={20} className="relative z-10" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExplifiedCTA;
