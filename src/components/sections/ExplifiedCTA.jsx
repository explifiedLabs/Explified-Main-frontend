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
    /* Changed background from pure black to the dark teal color to match the rest of your page */
    <section className="relative w-full py-24 md:py-32 bg-[#000] overflow-hidden font-sans">
      {/* 1. Subtle Grid Pattern Overlay extending seamlessly across the section */}
      {/* <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      /> */}

      {/* 2. Intense, Brightened "Aurora" Bottom Glow */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[140%] md:w-[110%] h-[350px] bg-gradient-to-t from-[#23b5b5]/60  to-black pointer-events-none mix-blend-screen" />

      {/* --- Content Layout --- */}
      <div className="relative z-10 max-w-[1300px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full flex flex-col items-center justify-center text-center"
        >
          {/* Main Headline */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg leading-tight">
              <span className="text-white">Ready to transform how</span>
              <br />
              <span className="text-[#23b5b5]">your team works?</span>
            </h2>
          </div>

          {/* Sub-headline */}
          <p className="text-base md:text-lg text-gray-400 max-w-3xl mb-12 leading-relaxed">
            We try to make magic happen through technology. Visit our labs to
            know more.
          </p>

          {/* CTA Button */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
          >
            <Link to="https://explified.com/labs">
              <button className="relative cursor-pointer overflow-hidden bg-[#23b5b5] text-black font-bold text-lg px-8 py-3.5 rounded-full flex items-center justify-center w-full sm:w-auto gap-2 hover:scale-105 transition-transform shadow-[0_0_50px_rgba(35,181,181,0.65)]">
                <span className="relative z-10">Visit Explified Labs</span>
                <ArrowUpRight size={20} className="relative z-10" />
                <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExplifiedCTA;
