import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Users } from "lucide-react";

// ==========================================
// 1. ORIGINAL YOUTUBE LOGO COMPONENT
// ==========================================
const YoutubeIcon = ({ className = "w-8 h-8" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" 
      fill="#FF0000" 
    />
    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#ffffff" />
  </svg>
);

// ==========================================
// 2. DATA CONFIGURATION
// ==========================================
const CHANNELS = [
  {
    name: "Explified Labs",
    handle: "@explified",
    subs: "37,600",
    url: "https://www.youtube.com/@explified",
  },
  {
    name: "Historic Knowledge",
    handle: "@historicknowledgebyexplified",
    subs: "804",
    url: "https://www.youtube.com/@historicknowledgebyexplified",
  },
  {
    name: "Airlogistics",
    handle: "@Airlogisticsanalyzer",
    subs: "70",
    url: "https://www.youtube.com/@Airlogisticsanalyzer",
  },
  {
    name: "Astro4141",
    handle: "@astro4141official",
    subs: "8",
    url: "https://www.youtube.com/@astro4141official",
  }
];

// ==========================================
// 3. ANIMATION VARIANTS
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

// ==========================================
// 4. MAIN COMPONENT
// ==========================================
const ContentLabs = () => {
  return (
    <div className="min-h-screen bg-black py-32 px-6 lg:px-12 font-sans relative">
      <div className="max-w-[1100px] mx-auto">
        
        {/* --- HEADER --- */}
        <header className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
          
            
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
              Content<span className="text-[#23b5b5]"> Labs</span>
            </h1>
            
            <p className="text-gray-500 max-w-xl mx-auto mt-8 text-lg font-medium leading-relaxed">
                The digital media arm of Explified. Exploring automation, history, and global logistics through visual storytelling.
            </p>
          </motion.div>
        </header>

        {/* --- STAGGERED GRID --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {CHANNELS.map((channel, idx) => (
            <motion.a
              key={idx}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              className="group relative flex items-center gap-6 p-7 bg-[#0A0A0A] border border-white/5 rounded-[2rem] hover:border-[#23b5b5]/50 hover:bg-[#111111] transition-all duration-300"
            >
              {/* Profile Avatar Area */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                   <YoutubeIcon className="w-10 h-10" />
                </div>
              </div>

              {/* Channel Info */}
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-white group-hover:text-[#23b5b5] transition-colors">
                  {channel.name}
                </h3>
                <div className="mt-1">
                    <p className="text-[11px] font-black tracking-widest text-gray-600 uppercase">
                        {channel.handle}
                    </p>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mt-2 font-semibold">
                        <Users size={12} className="text-[#23b5b5]" />
                        <span>{channel.subs} subscribers</span>
                    </div>
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                <ExternalLink size={18} className="text-gray-600" />
              </div>
            </motion.a>
          ))}
        </motion.div>

   
      </div>
    </div>
  );
};

export default ContentLabs;


