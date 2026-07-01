import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  ListChecks,
  Search,
  FileDown,
  Zap,
  Settings2,
  Users,
  X,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";

const SummifyLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  // Trigger modal on page load with a slight delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = () => {
    navigate("/login");
  };

  const features = [
    {
      title: "The Big Picture, Instantly",
      description:
        "Get an immediate pulse check on your board with our high-visibility stat widgets. Instantly track Total Tasks, Completed Items, and critically, a dedicated counter for tasks Running Late.",
      img: "https://numeriq-one.vercel.app/dashboard.png",
      icon: <BarChart className="w-8 h-8 text-[#23b5b5]" />,
      reverse: false,
    },
    {
      title: "Intelligent List Summaries",
      description:
        "Go deeper than simple board counts. Summify analyzes every list on your board, providing a breakdown of total cards vs. completed cards, and uniquely calculates a Pending Tasks count.",
      img: "https://numeriq-one.vercel.app/list_summery.png",
      icon: <ListChecks className="w-8 h-8 text-[#23b5b5]" />,
      reverse: true,
    },
    {
      title: "Detailed Analysis & Filtering",
      description:
        "Need to drill down? Our exhaustive Task Analysis table shows everything. Statuses are clearly badged based on native Trello logic. Slice and dice data in seconds using our robust filter bar.",
      img: "https://numeriq-one.vercel.app/detailed_summery.png",
      icon: <Search className="w-8 h-8 text-[#23b5b5]" />,
      reverse: false,
    },
    {
      title: "One-Click PDF Reporting",
      description:
        "Need to share progress with stakeholders or management? Generate beautiful, professional PDF reports based on your current filtered view with a single click. No more messy screenshots.",
      img: "https://numeriq-one.vercel.app/download.png",
      icon: <FileDown className="w-8 h-8 text-[#23b5b5]" />,
      reverse: true,
    },
  ];

  // Animation Variants
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const modalListVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1 + 0.3, duration: 0.4 },
    }),
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-200 font-sans selection:bg-[#23b5b5] selection:text-white pb-20 overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#23b5b5]/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[400px] h-[600px] bg-[#23b5b5]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[400px] bg-[#23b5b5]/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Pro Plan Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-zinc-950 border border-[#23b5b5]/40 p-8 rounded-3xl w-full max-w-md relative shadow-[0_0_80px_rgba(35,181,181,0.2)] overflow-hidden"
            >
              {/* Modal internal glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-[#23b5b5]/10 to-transparent pointer-events-none" />

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 bg-[#23b5b5]/10 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-[#23b5b5]/30 shadow-[0_0_30px_rgba(35,181,181,0.3)]"
                >
                  <Zap className="w-8 h-8 text-[#23b5b5] fill-[#23b5b5]/20" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Summify{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#23b5b5] to-teal-200">
                    Pro
                  </span>
                </h3>
                <div className="flex items-baseline justify-center gap-1 text-5xl font-extrabold text-white mb-2">
                  $10{" "}
                  <span className="text-lg text-gray-400 font-medium">
                    / lifetime
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  Unlock the ultimate Trello reporting power.
                </p>
              </div>

              <ul className="space-y-4 mb-8 relative z-10">
                {[
                  "Unlimited PDF Exports",
                  "Advanced Custom Filtering",
                  "Priority Email Support",
                  "All future pro updates",
                ].map((feature, idx) => (
                  <motion.li
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={modalListVariants}
                    key={idx}
                    className="flex items-center gap-3 text-gray-200 font-medium bg-white/5 p-3 rounded-xl border border-white/5"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#23b5b5] shrink-0 drop-shadow-[0_0_8px_rgba(35,181,181,0.8)]" />
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubscribe}
                className="group relative w-full bg-[#23b5b5] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_30px_rgba(35,181,181,0.4)] overflow-hidden z-10 flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                Upgrade to Pro Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-24 text-center z-10">
        <motion.div variants={heroVariants} initial="hidden" animate="visible">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 border border-[#23b5b5]/30 bg-[#23b5b5]/10 text-[#23b5b5] px-5 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(35,181,181,0.2)]"
          >
            <Zap className="w-4 h-4 fill-current" />
            The Ultimate Trello Power-Up
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight"
          >
            Turn Trello Chaos into <br className="hidden md:block" />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#23b5b5] via-teal-300 to-[#23b5b5] animate-[gradient_8s_linear_infinite] bg-[length:200%_auto]">
                Clear Insights
              </span>
              <div className="absolute inset-0 bg-[#23b5b5] blur-[60px] opacity-20 -z-10" />
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Stop digging through endless lists of cards. Summify instantly
            transforms your scattered Trello board into a single, professional
            dashboard.
          </motion.p>

          <motion.div variants={itemVariants}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative bg-white text-black hover:bg-gray-100 font-bold py-4 px-10 rounded-full text-lg transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(35,181,181,0.4)] hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Summify Pro{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Showcase */}
      <div className="relative max-w-6xl mx-auto px-6 py-10 space-y-40 z-10">
        {features.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`flex flex-col gap-12 lg:gap-20 items-center ${item.reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}
          >
            <div className="flex-1 space-y-6">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 bg-gradient-to-br from-[#23b5b5]/20 to-transparent rounded-2xl flex items-center justify-center border border-[#23b5b5]/30 shadow-[0_0_30px_rgba(35,181,181,0.2)]"
              >
                {item.icon}
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                {item.title}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                {item.description}
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.03, rotateY: item.reverse ? -2 : 2 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex-1 w-full relative perspective-1000"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#23b5b5]/30 to-transparent blur-3xl -z-10 rounded-full opacity-60"></div>
              <div className="relative rounded-2xl p-1 bg-gradient-to-b from-white/10 to-white/0 shadow-2xl">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Why Choose Summify Section */}
      <div className="relative max-w-6xl mx-auto px-6 py-32 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose Summify?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            High-level overviews without losing granular details. We are your
            all-in-one solution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Settings2 className="w-8 h-8 text-[#23b5b5]" />,
              title: "Professional UI",
              desc: "Designed to look and feel native, maximized for data density without the clutter.",
            },
            {
              icon: <Zap className="w-8 h-8 text-[#23b5b5]" />,
              title: "Zero Config",
              desc: "Just install and open. Summify reads your board data instantly with absolutely no setup required.",
            },
            {
              icon: <Users className="w-8 h-8 text-[#23b5b5]" />,
              title: "For Managers",
              desc: "Get the clarity you need to keep projects on track, balance workloads, and hit deadlines.",
            },
          ].map((perk, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -10, borderColor: "rgba(35,181,181,0.4)" }}
              className="group bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 transition-all hover:bg-zinc-900 shadow-lg hover:shadow-[0_20px_40px_rgba(35,181,181,0.1)]"
            >
              <div className="bg-black/50 border border-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 group-hover:border-[#23b5b5]/40 group-hover:shadow-[0_0_20px_rgba(35,181,181,0.2)]">
                {perk.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {perk.title}
              </h3>
              <p className="text-gray-400 text-base leading-relaxed">
                {perk.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative max-w-6xl mx-auto px-6 py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 z-10">
        <div className="text-white font-bold text-2xl flex items-center gap-2">
          <div className="bg-[#23b5b5]/20 p-2 rounded-lg">
            <BarChart className="w-6 h-6 text-[#23b5b5]" />
          </div>
          Summify
        </div>
      </footer>

      {/* Embedded CSS for Shimmer and Gradient Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `,
        }}
      />
    </div>
  );
};

export default SummifyLanding;
