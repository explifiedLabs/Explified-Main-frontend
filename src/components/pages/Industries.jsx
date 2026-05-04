import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Cpu, 
  Rocket, 
  Server, 
  Database, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';

const industries = [
  {
    title: "Automations Eng",
    subtitle: "System logic automation",
    description: "Streamlining complex business logic through intelligent automated workflows and decision engines to eliminate manual bottlenecks.",
    icon: <Cpu size={28} />,
    id: "01",
    link: "https://explified.com/automations-engineering"
  },
  {
    title: "Startups",
    subtitle: "Scaling tools",
    description: "Providing the high-velocity infrastructure and digital tools necessary for rapid growth and aggressive market entry.",
    icon: <Rocket size={28} />,
    id: "02",
    link: "https://explified.com/startups"
  },
  {
    title: "IT Infrastructure",
    subtitle: "Server & Cloud automation",
    description: "Modernizing legacy systems with cloud-native automation, containerization, and robust server management.",
    icon: <Server size={28} />,
    id: "03",
    link: "https://explified.com/it-infrastructure"
  },
  {
    title: "Data Engineering",
    subtitle: "Pipeline orchestration",
    description: "Building scalable data pipelines that ensure information flow is clean, fast, and instantly actionable for stakeholders.",
    icon: <Database size={28} />,
    id: "04",
    link: "https://explified.com/data-engineering"
  },
  {
    title: "Revenue Ops",
    subtitle: "CRM optimization",
    description: "Optimizing the full revenue stack to ensure maximum ROI, data integrity, and seamless customer lifecycles.",
    icon: <TrendingUp size={28} />,
    id: "05",
    link: "https://explified.com/revenue-ops"
  }
];

const IndustriesPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="bg-[#050505] text-white font-sans selection:bg-[#23b5b5]/30 relative overflow-hidden">
      
      {/* --- BRAND BACKGROUND GRADIENTS --- */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top Left Glow */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#23b5b5]/10 blur-[120px]" />
        {/* Bottom Right Glow */}
        <div className="absolute bottom-[10%] right-[0%] w-[30%] h-[30%] rounded-full bg-[#23b5b5]/15 blur-[100px]" />
        {/* Subtle Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>
      </div>

      <section className="relative px-6 py-20 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column: Sticky Content */}
          <div className="lg:w-1/2 lg:h-screen lg:sticky lg:top-0 flex flex-col justify-center py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-[2px] bg-[#23b5b5]"></span>
                <span className="text-[#23b5b5] font-mono text-sm tracking-[0.2em] uppercase font-bold">
                  Industries
                </span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                Expertise for a <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#23b5b5] to-emerald-400">
                  Digital World.
                </span>
              </h2>
              
              <p className="text-gray-400 text-lg md:text-xl max-w-md leading-relaxed mb-10">
                We focus on business process automation, improving information exchange, 
                and reducing operating costs through technical excellence.
              </p>

              {/* Scroll Progress Indicator (Desktop) */}
              <div className="hidden lg:block relative w-1 h-32 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 right-0 bg-[#23b5b5] origin-top shadow-[0_0_15px_#23b5b5]"
                  style={{ scaleY }}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Clickable Cards */}
          <div className="lg:w-1/2 space-y-6 pb-24">
            {industries.map((item, index) => (
              <motion.a
                key={index}
                href={item.link} // Redirects in the same tab
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group relative block decoration-transparent"
              >
                {/* Card Container */}
                <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-sm border border-white/10 p-8 md:p-10 rounded-[2rem] group-hover:border-[#23b5b5]/40 transition-all duration-500 overflow-hidden">
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute -inset-px bg-gradient-to-br from-[#23b5b5]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="flex justify-between items-start mb-8">
                    {/* Icon Box */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#23b5b5]/20 blur-xl rounded-full group-hover:bg-[#23b5b5]/40 transition-colors" />
                      <div className="relative text-[#23b5b5] bg-[#111] border border-white/5 p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-[0_0_20px_rgba(35,181,181,0.1)]">
                        {item.icon}
                      </div>
                    </div>
                    {/* ID Number */}
                    <span className="text-white/10 font-mono text-4xl font-bold group-hover:text-[#23b5b5]/20 transition-colors">
                      {item.id}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold mb-2 text-white group-hover:text-[#23b5b5] transition-colors flex items-center gap-2">
                      {item.title}
                      <ArrowUpRight size={20} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </h4>
                    <p className="text-[#23b5b5] text-xs font-bold uppercase tracking-[0.15em] mb-4 opacity-80">
                      {item.subtitle}
                    </p>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default IndustriesPage;