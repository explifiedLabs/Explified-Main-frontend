import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, Globe, Zap, Sparkles, 
  MessageSquare, ArrowRight 
} from 'lucide-react';

// --- Custom "Real" App Icons (SVG Paths) ---
const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const MessengerIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.55 5.4 3.95 7.05.15.1.25.27.25.45v2.75c0 .55.6.89 1.05.6l2.95-1.9c.15-.1.32-.13.5-.1.97.23 2.02.35 3.1.35 5.52 0 10-4.03 10-9S17.52 2 12 2zm1.2 11.2l-2.45-2.6-4.8 2.6 5.3-5.6 2.45 2.6 4.8-2.6-5.3 5.6z"/>
  </svg>
);

const SlackIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52 2.521 2.527 2.527 0 0 1 2.52-2.521V2.522A2.527 2.527 0 0 1 17.688 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.521 2.523A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.52h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52 2.527 2.527 0 0 1 2.52 2.52v6.312A2.527 2.527 0 0 1 15.165 17.688z"/>
  </svg>
);

// --- Visual Sub-Components ---

// 1. Connection Tree
const ConnectionVisual = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-start pt-10">
    
    {/* Central Hub */}
    <div className="relative z-10 mb-8">
      <div className="w-16 h-16 rounded-2xl bg-[#050505] border border-white/10 flex items-center justify-center">
         <div className="w-9 h-9 bg-[#23b5b5] rounded-xl flex items-center justify-center text-black shadow-lg shadow-[#23b5b5]/20">
            <Globe size={20} />
         </div>
      </div>
      {/* Subtle Ping */}
      <div className="absolute inset-0 rounded-2xl border border-[#23b5b5]/40 animate-ping opacity-20" />
    </div>

    {/* Connected Labels */}
    <div className="flex flex-col items-center gap-3 mb-8 relative z-10">
        <div className="px-5 py-2 rounded-full bg-[#0F0F0F] border border-white/10 text-xs font-medium text-gray-400">
           Teams & Customer Connect
        </div>
        <div className="px-6 py-2.5 rounded-xl bg-[#050505] border border-[#23b5b5]/30 flex items-center gap-2">
            <Mic size={15} className="text-white" />
            <span className="text-xs font-semibold text-white">Voice & Message</span>
        </div>
    </div>

    {/* Connecting Lines */}
    <div className="relative w-full max-w-[320px] h-20">
        <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* Smooth Bezier Curves */}
            <path d="M160,0 V12 Q160,30 70,30 V50" fill="none" stroke="#23b5b5" strokeWidth="1" strokeOpacity="0.3" />
            <path d="M160,0 V50" fill="none" stroke="#23b5b5" strokeWidth="1" strokeOpacity="0.3" />
            <path d="M160,0 V12 Q160,30 250,30 V50" fill="none" stroke="#23b5b5" strokeWidth="1" strokeOpacity="0.3" />
            
            {/* Animated Particles */}
            <circle r="2" fill="#23b5b5">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M160,0 V12 Q160,30 70,30 V50" />
            </circle>
            <circle r="2" fill="#23b5b5">
                <animateMotion dur="2.5s" repeatCount="indefinite" begin="1.25s" path="M160,0 V12 Q160,30 250,30 V50" />
            </circle>
        </svg>

        {/* Real App Icons (Bottom Row) */}
        <div className="absolute bottom-[-10px] w-full flex justify-between px-6">
            {/* WhatsApp */}
            <div className="w-12 h-12 rounded-2xl bg-[#050505] border border-white/10 flex items-center justify-center group/icon transition-colors hover:border-[#25D366]/40">
                <WhatsAppIcon className="w-6 h-6 text-gray-500 group-hover/icon:text-[#25D366] transition-colors duration-300" />
            </div>
            
            {/* Messenger */}
            <div className="w-12 h-12 rounded-2xl bg-[#050505] border border-white/10 flex items-center justify-center transform -translate-y-2 group/icon transition-colors hover:border-[#0084FF]/40">
                <MessengerIcon className="w-6 h-6 text-gray-500 group-hover/icon:text-[#0084FF] transition-colors duration-300" />
            </div>

            {/* Slack */}
            <div className="w-12 h-12 rounded-2xl bg-[#050505] border border-white/10 flex items-center justify-center group/icon transition-colors hover:border-[#E01E5A]/40">
                <SlackIcon className="w-6 h-6 text-gray-500 group-hover/icon:text-[#E01E5A] transition-colors duration-300" />
            </div>
        </div>
    </div>
  </div>
);

// 2. Task Automation
const AutomationVisual = () => (
  <div className="flex flex-col items-center w-full px-8 pt-4">
    <div className="w-12 h-12 rounded-full bg-[#050505] border border-[#23b5b5]/30 flex items-center justify-center mb-3 relative z-10">
        <Zap size={22} className="text-[#23b5b5]" />
    </div>

    <div className="h-6 w-[1px] bg-gradient-to-b from-[#23b5b5]/50 to-transparent mb-3"></div>

    <div className="w-full flex flex-col gap-3 relative">
        {/* Task 1 */}
        <div className="w-full p-4 rounded-xl bg-[#080808] border border-white/5 flex items-center justify-between">
            <div className="flex -space-x-2">
                <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Robert" className="w-7 h-7 rounded-full border border-[#080808] bg-gray-800" alt="avatar" />
                <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Jude" className="w-7 h-7 rounded-full border border-[#080808] bg-gray-800" alt="avatar" />
            </div>
            <span className="px-3 py-1 rounded text-[10px] font-medium bg-white/5 text-gray-400 border border-white/5">Started</span>
        </div>

        {/* Task 2 */}
        <div className="w-full p-4 rounded-xl bg-[#080808] border border-[#23b5b5]/30 flex items-center justify-between">
            <div className="flex -space-x-2">
                 <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Nala" className="w-7 h-7 rounded-full border border-[#080808] bg-gray-800" alt="avatar" />
                 <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Christian" className="w-7 h-7 rounded-full border border-[#080808] bg-gray-800" alt="avatar" />
                 <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Eden" className="w-7 h-7 rounded-full border border-[#080808] bg-gray-800" alt="avatar" />
            </div>
            <span className="px-3 py-1 rounded text-[10px] font-medium bg-[#23b5b5]/5 text-[#23b5b5] border border-[#23b5b5]/20">Completed</span>
        </div>
    </div>
  </div>
);

// 3. Virtual Agents
const AgentsVisual = () => (
  <div className="w-full h-full flex flex-col justify-end pb-2 px-6 gap-4">
    {/* Agent 1 */}
    <motion.div 
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-full bg-[#080808] border border-white/5 p-4 rounded-2xl flex items-center gap-3"
    >
        <div className="w-10 h-10 rounded-full bg-[#121212] border border-white/5 overflow-hidden flex-shrink-0">
            <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Jessica" alt="Bitmoji" className="w-full h-full scale-110" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-gray-300">Jessica Doe</span>
                <span className="text-[9px] text-gray-600">Now</span>
            </div>
            <div className="h-1.5 w-16 bg-white/10 rounded-full mb-1.5" />
            <div className="h-1.5 w-24 bg-white/5 rounded-full" />
        </div>
    </motion.div>

    {/* Agent 2 (Active) */}
    <motion.div 
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-full bg-[#080808] border border-[#23b5b5]/30 p-4 rounded-2xl flex items-center gap-3 relative"
    >
        {/* Active Indicator Line */}
        <div className="absolute -left-[1px] top-8 bottom-8 w-[2px] bg-[#23b5b5]" />
        
        <div className="w-10 h-10 rounded-full bg-[#121212] border border-[#23b5b5]/20 overflow-hidden flex-shrink-0">
             <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" alt="Bitmoji" className="w-full h-full scale-110" />
        </div>
        <div className="flex-1 min-w-0">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-white">Felix The Cat</span>
                <MessageSquare size={12} className="text-[#23b5b5]" />
            </div>
             <div className="h-1.5 w-3/4 bg-[#23b5b5]/20 rounded-full" />
        </div>
    </motion.div>
  </div>
);

// 4. Autopilot
const AutopilotVisual = () => (
  <div className="w-full h-full flex flex-col justify-end pb-8 px-6">
    <div className="flex flex-col items-center">
        {/* Brain Node */}
        <div className="mb-4 relative">
            <div className="w-12 h-12 rounded-full bg-[#080808] border border-[#23b5b5]/40 flex items-center justify-center">
                <Sparkles size={20} className="text-[#23b5b5]" />
            </div>
        </div>

        {/* Split Tasks */}
        <div className="flex gap-3 w-full justify-center mb-3">
            <div className="flex-1 p-3 rounded-xl bg-[#080808] border border-white/10 flex flex-col gap-1.5 items-center text-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#23b5b5]" />
                <span className="text-[10px] text-gray-300 font-medium">Design System</span>
                <span className="text-[9px] text-gray-600">08:45 AM</span>
            </div>
            <div className="flex-1 p-3 rounded-xl bg-[#080808] border border-white/10 flex flex-col gap-1.5 items-center text-center">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span className="text-[10px] text-gray-300 font-medium">Founder Meet</span>
                <span className="text-[9px] text-gray-600">09:30 AM</span>
            </div>
        </div>

        {/* Dotted Lines */}
        <svg className="w-full h-8 mb-1 overflow-visible">
             <path d="M70,0 Q70,12 140,12" fill="none" stroke="#23b5b5" strokeWidth="1" strokeDasharray="3 3" className="opacity-30" />
             <path d="M210,0 Q210,12 140,12" fill="none" stroke="#23b5b5" strokeWidth="1" strokeDasharray="3 3" className="opacity-30" />
             <path d="M140,12 V25" fill="none" stroke="#23b5b5" strokeWidth="1" strokeDasharray="3 3" className="opacity-30" />
             <circle cx="140" cy="12" r="2" fill="#23b5b5" />
        </svg>

        {/* Master Execution Card */}
        <div className="w-full p-4 rounded-xl bg-[#080808] border border-[#23b5b5]/30">
            <div className="flex items-center justify-between mb-3">
                 <div className="flex -space-x-2">
                     <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Scooby" className="w-6 h-6 rounded-full border border-[#080808] bg-gray-800" alt="avatar" />
                     <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Shaggy" className="w-6 h-6 rounded-full border border-[#080808] bg-gray-800" alt="avatar" />
                     <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Velma" className="w-6 h-6 rounded-full border border-[#080808] bg-gray-800" alt="avatar" />
                 </div>
                 <span className="text-[9px] bg-[#23b5b5]/5 text-[#23b5b5] px-2 py-0.5 rounded border border-[#23b5b5]/20 font-medium">Processing</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#23b5b5] w-[70%] rounded-full animate-pulse" />
            </div>
        </div>
    </div>
  </div>
);

// --- Main Section ---

const WhyChooseExplified = () => {
  return (
    <section className="relative w-full py-16 px-4 md:px-8 bg-black overflow-hidden font-sans">
      
      {/* Background Ambience - Clean Black */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle Noise Overlay for texture, no color */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Why Choose <span className="text-[#23b5b5]">Explified</span>
          </motion.h2>
          <p className="text-gray-500 max-w-lg mx-auto text-lg">
             Experience the future of automation with our premium AI-driven solutions.
          </p>
        </div>

        {/* 2-Column Masonry Layout with Improved Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left Column */}
            <div className="flex flex-col gap-8">
                
                {/* Card 1: Connection (Tall) */}
                <GlassCard 
                    title="Explified Enables Human-Like Conversations" 
                    desc="Effortlessly connect customers and teams through intelligent voice and messaging on web, mobile, and beyond."
                    height="h-[520px]"
                    delay={0.1}
                >
                    <ConnectionVisual />
                </GlassCard>

                {/* Card 3: Agents (Medium) */}
                <GlassCard 
                    title="AI’s Human-Like Virtual Agents" 
                    desc="Explified creates virtual agents that adapt to your style and deliver tailored customer experiences."
                    height="h-[420px]"
                    delay={0.3}
                >
                    <AgentsVisual />
                </GlassCard>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-8 md:pt-12">
                
                {/* Card 2: Automation (Medium) */}
                <GlassCard 
                    title="Task Automation Powered by AI" 
                    desc="End-to-end task automation powered by Explified for greater accuracy, speed, and control."
                    height="h-[420px]"
                    delay={0.2}
                >
                    <AutomationVisual />
                </GlassCard>

                {/* Card 4: Autopilot (Tall) */}
                <GlassCard 
                    title="Full Autopilot for Smarter Operations" 
                    desc="Explified automates routine work so your team can focus on high-value, strategic initiatives."
                    height="h-[520px]"
                    delay={0.4}
                >
                    <AutopilotVisual />
                </GlassCard>
            </div>

        </div>
      </div>
    </section>
  );
};

// Reusable Card Wrapper - Kept exactly as requested (Black Glass)
const GlassCard = ({ title, desc, children, height, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: delay }}
        className={`relative w-full ${height} rounded-[32px] border border-white/10 bg-[#080808] overflow-hidden group hover:border-[#23b5b5]/30 transition-colors duration-500`}
    >
        {/* Internal Glow Effect from previous version (Kept as requested) */}
        <div className="absolute top-[120px] left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-[#23b5b5] opacity-0 blur-[80px] group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" />

        {/* Text Content */}
        <div className="relative z-20 p-8">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[90%]">{desc}</p>
        </div>

        {/* Visual Container */}
        <div className="absolute bottom-0 left-0 right-0 top-32 flex flex-col justify-end">
             {/* Subtle internal gradient at bottom */}
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#23b5b5]/5 pointer-events-none" />
             {children}
        </div>
    </motion.div>
);

export default WhyChooseExplified;