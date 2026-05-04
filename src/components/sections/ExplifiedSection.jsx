import React from 'react';
import { motion } from 'framer-motion';

// --- Real Brand Icons (SVG Paths) ---
const BrandIcons = {
  Salesforce: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M16.1 9.3c-.8 0-1.5.1-2.1.3-.7-2.3-3.2-4.1-6.1-4.1-3.7 0-6.7 3-6.7 6.7 0 .3 0 .6.1.9C.5 13.5 0 14.1 0 14.8c0 3.1 2.5 5.7 5.7 5.7h10.9c3.4 0 6.2-2.8 6.2-6.2 0-2.8-2-5.1-4.7-5.9-.2.5-1.1.9-2 .9z" />
    </svg>
  ),
  HubSpot: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="6" x2="12" y2="9" stroke="currentColor" strokeWidth="2"/><line x1="16.24" y1="7.76" x2="14.12" y2="9.88" stroke="currentColor" strokeWidth="2"/><line x1="18" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="16.24" y1="16.24" x2="14.12" y2="14.12" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="18" x2="12" y2="15" stroke="currentColor" strokeWidth="2"/><line x1="7.76" y1="16.24" x2="9.88" y2="14.12" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="7.76" y1="7.76" x2="9.88" y2="9.88" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Asana: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="5" cy="12" r="2.5" />
      <circle cx="19" cy="12" r="2.5" />
    </svg>
  ),
  ClickUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 10l9-9 9 9" />
      <path d="M12 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="currentColor" stroke="none" />
    </svg>
  ),
  Zapier: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M4 12h16M12 4v16M6.3 6.3l11.4 11.4M6.3 17.7L17.7 6.3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  Slack: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
       <path d="M6 15a2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-5zM11 6a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2v2h-2zm0 1a2 2 0 0 1 2 2 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 1 2-2h5zM18 9a2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5zM13 18a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2 2 2 0 0 1 2-2h5a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-5z"/>
    </svg>
  ),
  Notion: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M4 4v16h16V4H4zm2 2h12v12H6V6zm3 2v8h2l4-6v6h2V8h-2l-4 6V8H9z"/>
    </svg>
  ),
  Vercel: (
    <svg viewBox="0 0 512 512" fill="currentColor" className="w-full h-full">
      <path d="M256 48L496 464H16L256 48z"/>
    </svg>
  ),
};

const ExplifiedSection = () => {
  // Positioning system based on a smoother quadratic curve
  const tools = [
    { id: 1, name: "Salesforce", icon: BrandIcons.Salesforce, x: "2%", y: "90%", delay: 0 },
    { id: 2, name: "HubSpot", icon: BrandIcons.HubSpot, x: "15%", y: "55%", delay: 0.5 },
    { id: 3, name: "Asana", icon: BrandIcons.Asana, x: "28%", y: "30%", delay: 1 },
    { id: 4, name: "ClickUp", icon: BrandIcons.ClickUp, x: "40%", y: "12%", delay: 1.5 },
    // Center: Zapier (Automation Core)
    { id: 5, name: "Zapier", icon: BrandIcons.Zapier, x: "50%", y: "2%", delay: 0, isCenter: true },
    { id: 6, name: "Slack", icon: BrandIcons.Slack, x: "60%", y: "12%", delay: 1.5 },
    { id: 7, name: "Notion", icon: BrandIcons.Notion, x: "72%", y: "30%", delay: 1 },
    { id: 8, name: "Vercel", icon: BrandIcons.Vercel, x: "85%", y: "55%", delay: 0.5 },
  ];

  return (
    // MAIN CONTAINER: Set to bg-black (Pure Black)
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden flex flex-col items-center justify-center py-20 px-4 selection:bg-[#23b5b5] selection:text-black">
      
      {/* --- Ambient Background Effects --- */}
      
      {/* Textured Grid - Low Opacity */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
        }}
      />
      
      {/* Central Radial Glow - Teal on Black */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[#23b5b5] opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />

      {/* --- Content --- */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">

        {/* Top Label */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#23b5b5]/30 bg-[#23b5b5]/5 backdrop-blur-md shadow-[0_0_15px_rgba(35,181,181,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#23b5b5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#23b5b5]"></span>
            </span>
            <span className="text-[#23b5b5] text-[10px] font-bold uppercase tracking-[0.2em] pt-[1px]">Integration</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-7xl font-bold text-center text-white tracking-tight mb-6"
        >
          Connect, Automate, and Scale
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#9CA3AF] text-lg text-center max-w-[650px] mb-24 leading-relaxed font-light"
        >
          Explified integrates effortlessly with your favorite tools, ensuring a smooth and intelligent automated workflow.
        </motion.p>

        {/* --- Arc Section --- */}
        <div className="relative w-full max-w-5xl h-[320px] mb-12 hidden md:block">
          
          {/* SVG Arc */}
          <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 320">
              <defs>
                <linearGradient id="arcStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#23b5b5" stopOpacity="0" />
                  <stop offset="10%" stopColor="#23b5b5" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#23b5b5" stopOpacity="0.6" />
                  <stop offset="90%" stopColor="#23b5b5" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#23b5b5" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Base Arc */}
              <motion.path 
                d="M 50,320 Q 500,-100 950,320" 
                fill="none" 
                stroke="url(#arcStroke)" 
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              {/* Moving "Data" Light on the line */}
              <motion.path 
                d="M 50,320 Q 500,-100 950,320" 
                fill="none" 
                stroke="#23b5b5" 
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 0.15, 0], opacity: [0, 1, 0], pathOffset: [0, 1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
              />
            </svg>
          </div>

          {/* Icons */}
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: tool.x, top: tool.y }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut", 
                  delay: tool.delay 
                }}
              >
                {/* Icon Container - Glass effect adapted for black bg */}
                <div 
                  className={`
                    relative flex items-center justify-center rounded-full backdrop-blur-xl transition-all duration-300 group cursor-pointer
                    ${tool.isCenter 
                      ? 'w-24 h-24 bg-[#111] border border-[#23b5b5] shadow-[0_0_50px_rgba(35,181,181,0.25)] z-20' 
                      : 'w-16 h-16 bg-white/[0.02] border border-white/10 hover:border-[#23b5b5]/50 hover:bg-[#23b5b5]/10 hover:shadow-[0_0_30px_rgba(35,181,181,0.2)] z-10'
                    }
                  `}
                >
                  {/* Icon Sizing & Color */}
                  <div className={`
                    ${tool.isCenter ? 'w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-7 h-7 text-[#9CA3AF] group-hover:text-white group-hover:scale-110 transition-all duration-300'}
                  `}>
                    {tool.icon}
                  </div>

                  {/* Pulsing rings for center icon */}
                  {tool.isCenter && (
                     <>
                        <motion.div 
                          className="absolute inset-0 rounded-full border border-[#23b5b5]"
                          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        <motion.div 
                          className="absolute inset-0 rounded-full border border-[#23b5b5]"
                          animate={{ scale: [1, 1.2], opacity: [0.8, 0] }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                        />
                     </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* --- Testimonial --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-10 mt-12 max-w-2xl mx-auto text-center"
        >
          {/* Quote */}
          <div className="relative mb-10 px-6">
             <div className="absolute top-0 left-0 text-[#23b5b5] opacity-20 transform -translate-x-1/2 -translate-y-1/2">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" /></svg>
             </div>
             <p className="text-2xl md:text-3xl font-medium text-white leading-normal tracking-wide">
              "Explified has transformed how we work saving us <span className="text-[#23b5b5]">15+ hours</span> per week. The best automation tool!"
             </p>
             <div className="absolute bottom-0 right-0 text-[#23b5b5] opacity-20 transform translate-x-1/2 translate-y-1/2">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="rotate-180"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" /></svg>
             </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-b from-[#23b5b5] to-transparent">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-black">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                  alt="John Drove" 
                  className="w-full h-full object-cover grayscale contrast-125"
                />
              </div>
            </div>
            
            {/* Name/Title */}
            <div className="text-center">
              <h4 className="text-white font-bold text-lg tracking-wide">John Drove</h4>
              <p className="text-[#9CA3AF] text-sm font-medium tracking-wide uppercase">CEO, GrowthHub</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ExplifiedSection;