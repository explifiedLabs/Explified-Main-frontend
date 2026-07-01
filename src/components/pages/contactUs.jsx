import React from 'react';
import { motion } from 'framer-motion';
import { Mail, LifeBuoy, ArrowUpRight } from 'lucide-react';

const ContactPage = () => {
  const accentColor = "#23B5B5";

  const contactMethods = [
    {
      icon: <LifeBuoy className="w-6 h-6" />,
      title: "Customer Support",
      details: "Support@explified.com",
      description: "For technical issues and account help.",
      link: "mailto:support@explified.com"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Further Queries",
      details: "Hello@explified.com",
      description: "General questions, partnerships, or media.",
      link: "mailto:Hello@explified.com"
    },
  ];

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

        {/* --- UPDATED: CONTACT CARDS SECTION --- */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactMethods.map((method, idx) => (
            <motion.a
              key={idx}
              href={method.link}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="block p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-[#23B5B5]/40 transition-all group relative overflow-hidden backdrop-blur-sm"
            >
              <div className="flex flex-col items-start gap-5 relative z-10">
                <div 
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform"
                >
                  {method.icon}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{method.title}</h3>
                  <p className="text-2xl font-semibold mb-3 group-hover:text-[#23B5B5] transition-colors flex items-center gap-2">
                    {method.details}
                    <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-gray-400 text-base leading-relaxed">{method.description}</p>
                </div>
              </div>
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#23B5B5]/0 to-[#23B5B5]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;