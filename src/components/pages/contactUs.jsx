import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, ArrowUpRight, Sparkles, ArrowRight } from 'lucide-react';
import GetAdvisoryModal from '../common/GetAdvisoryModal';

const ContactPage = () => {
  const accentColor = "#23B5B5";
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#23B5B5] selection:text-black overflow-hidden relative">

      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px]"
          style={{ backgroundColor: accentColor }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[120px]"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10"></div>
      <div
        className="absolute inset-0 opacity-[0.05] -z-10"
        style={{ backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, backgroundSize: '4rem 4rem' }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">

        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: accentColor }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: accentColor }}></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Available for new projects</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter"
          >
            Get in <span style={{ color: accentColor }} className="italic">touch.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-xl text-lg leading-relaxed"
          >
            Whether you have a technical issue or a big idea, our team is ready to help you scale your next big thing.
          </motion.p>
        </div>

        {/* --- CONTACT CARDS SECTION --- */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Support Card */}
          <motion.a
            href="mailto:support@explified.com"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="block p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-[#23B5B5]/40 transition-all group relative overflow-hidden backdrop-blur-sm cursor-pointer"
          >
            <div className="flex flex-col items-start gap-5 relative z-10">
              <div
                style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform"
              >
                <LifeBuoy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Customer Support</h3>
                <p className="text-2xl font-semibold mb-3 group-hover:text-[#23B5B5] transition-colors flex items-center gap-2">
                  Support@explified.com
                  <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-gray-400 text-base leading-relaxed">For technical issues and account help.</p>
              </div>
            </div>
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#23B5B5]/0 to-[#23B5B5]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>

          {/* Get Advisory Card */}
          <motion.button
            type="button"
            onClick={() => setIsModalOpen(true)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="text-left w-full block p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-[#23B5B5]/40 transition-all group relative overflow-hidden backdrop-blur-sm cursor-pointer"
          >
            <div className="flex flex-col items-start gap-5 relative z-10">
              <div
                style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform"
              >
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="w-full">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Advisory</h3>
                <p className="text-2xl font-semibold mb-3 group-hover:text-[#23B5B5] transition-colors flex items-center gap-2 text-white">
                  Get Advisory
                  <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-gray-400 text-base leading-relaxed mb-5">
                  Tell us what you're trying to build and work with our team.
                </p>
                <div
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-black font-bold text-sm shadow-[0_0_20px_rgba(35,181,181,0.35)] group-hover:scale-105 transition-all"
                  style={{ backgroundColor: accentColor }}
                >
                  <span>Get Advisory</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#23B5B5]/0 to-[#23B5B5]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </div>
      </div>

      <GetAdvisoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ContactPage;

