import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Command } from "lucide-react";
import { Link } from 'react-router'; 

const ExplifiedCTA = () => {
  // --- Animations Configuration ---
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
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

          {/* --- Content Content (Less Vertical Padding) --- */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 py-16 md:py-20">
            {/* Logo / Icon Area (Slightly smaller to save height) */}
            <motion.div
              animate={{
                y: [0, -4, 0],
                boxShadow: [
                  "0 0 0px rgba(35,181,181,0)",
                  "0 0 25px rgba(35,181,181,0.3)",
                  "0 0 0px rgba(35,181,181,0)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 mb-6 rounded-2xl bg-[#0A0A0A] border border-[#23b5b5]/30 flex items-center justify-center shadow-2xl relative"
            >
              {/* Inner Glow Dot */}
              <div className="absolute inset-0 bg-[#23b5b5] opacity-10 blur-md rounded-2xl" />
              <Command size={28} className="text-[#23b5b5] relative z-10" />
            </motion.div>

            {/* Brand Tag */}
       

            {/* Main Headline (Wider container to prevent wrapping, reducing height) */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 drop-shadow-lg leading-tight">
                To digitally transform{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                  your business visit our labs
                </span>
              </h2>
            </div>

            {/* Sub-headline (Wider container) */}
            <p className="text-base md:text-lg text-gray-400 max-w-3xl mb-10 leading-relaxed">
              We try to make magic happen through technology.
              Visit our lab to know more.
            </p>
        <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <Link to="https://explified.com/labs">
            <button className="relative cursor-pointer overflow-hidden bg-brand text-black font-bold text-lg px-8 py-3.5 rounded-full flex items-center justify-center w-full sm:w-auto gap-2 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(35,181,181,0.4)]">
               <span className="relative z-10">Explified Labs</span>
               <ArrowRight size={18} className="relative z-10" />
               <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>
            {/* CTA Button */}
            <div className="relative group/btn">
              {/* Button Glow Behind */}
              <div className="absolute -inset-1 bg-[#23b5b5] rounded-full blur opacity-25 group-hover/btn:opacity-60 transition duration-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExplifiedCTA;
