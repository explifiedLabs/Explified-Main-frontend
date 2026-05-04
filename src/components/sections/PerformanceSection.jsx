import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const PerformanceSection = () => {
  const cards = [
    {
      id: "01",
      title: "Configure",
      subtitle: "Tasks & Integrations",
      description: "Connect your systems instantly. Explified handles the complex logic from task creation to completion."
    },
    {
      id: "02",
      title: "Automate",
      subtitle: "Effortless Conversations",
      description: "Engage customers 24/7 with AI-driven responses that sound human and solve problems."
    },
    {
      id: "03",
      title: "Personalize",
      subtitle: "Shape Your AI",
      description: "Build virtual assistants that mirror your team's unique voice, style, and operational workflows."
    },
    {
      id: "04",
      title: "Scale",
      subtitle: "Service Excellence",
      description: "Set a new standard with fast, high-quality automated responses for consistently exceptional service."
    }
  ];

  return (
    <section className="relative w-full py-32 px-6 bg-[#020202] overflow-hidden font-sans">
      
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 bg-[#020202]" />
      
      {/* Cinematic Top Glow (Teal Source) */}
      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[60%] h-[500px] bg-[#23b5b5] opacity-[0.08] blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col items-center">
        
        {/* --- Heading --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#23b5b5]/30 bg-[#23b5b5]/5 mb-6">
            <Sparkles size={12} className="text-[#23b5b5]" />
            <span className="text-[10px] uppercase tracking-widest text-[#23b5b5] font-semibold">Workflow Automation</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Next-Level Performance <br />
            Driven by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#23b5b5] to-[#5ffbfb]">Explified</span>
          </h2>
          <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Orchestrate your entire operation with a unified AI layer that connects, automates, and scales with your business.
          </p>
        </motion.div>

        {/* --- THE CONNECTED CARDS SYSTEM --- */}
        <div className="relative w-full flex flex-col lg:flex-row items-stretch justify-center mb-24">
          
          {cards.map((card, index) => (
            <React.Fragment key={index}>
              
              {/* CARD ITEM */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="relative flex-1 group min-w-0"
              >
                {/* The Card */}
                <div className="h-full flex flex-col p-8 rounded-[24px] border border-white/5 bg-[#0A0A0A] relative z-10 overflow-hidden transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#23b5b5]/30 group-hover:shadow-[0_20px_80px_-20px_rgba(35,181,181,0.15)]">
                  
                  {/* Glass Reflection Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                  
                  {/* Top: Number & Icon */}
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-mono text-[#23b5b5] px-2 py-1 rounded border border-[#23b5b5]/20 bg-[#23b5b5]/5">
                      {card.id}/
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-[#23b5b5] transition-all duration-300">
                        <CheckCircle2 size={14} />
                    </div>
                  </div>

                  {/* Middle: Titles */}
                  <div className="mb-4">
                    <h4 className="text-[#23b5b5] text-sm font-semibold uppercase tracking-wider mb-1 opacity-80">
                      {card.title}
                    </h4>
                    <h3 className="text-xl font-bold text-white leading-snug">
                      {card.subtitle}
                    </h3>
                  </div>

                  {/* Bottom: Description */}
                  <p className="text-[#8890A0] text-sm leading-relaxed mt-auto">
                    {card.description}
                  </p>

                  {/* Hover Glow (Bottom) */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#23b5b5] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />
                </div>
              </motion.div>

              {/* --- THE CONNECTOR (Desktop Only) --- */}
              {index < cards.length - 1 && (
                <div className="hidden lg:flex flex-col justify-center relative w-12 z-0 -mx-1">
                  {/* Connector Line */}
                  <div className="h-[2px] w-full bg-[#1A1A1A] relative overflow-hidden">
                    {/* Animated Beam flowing through the connector */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#23b5b5] to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                  
                  {/* Connector Node (The "Joint") */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#020202] border border-[#23b5b5]/30 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(35,181,181,0.2)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#23b5b5]" />
                  </div>
                </div>
              )}

              {/* --- THE CONNECTOR (Mobile Only) --- */}
              {index < cards.length - 1 && (
                 <div className="lg:hidden h-8 w-[2px] bg-gradient-to-b from-[#23b5b5]/20 to-[#23b5b5]/5 mx-auto my-[-5px] relative z-0"></div>
              )}

            </React.Fragment>
          ))}
        </div>



      </div>
      
      {/* CSS for Shimmer Animation */}
 {/* CSS for Shimmer Animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
};

export default PerformanceSection;