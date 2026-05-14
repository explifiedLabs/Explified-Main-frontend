import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Factory,      // Manufacturing
  Home,         // Real Estate
  Calculator,   // Accounting
  GraduationCap // Education
} from 'lucide-react';

const industries = [
  {
    title: "Manufacturing",
    description: "Optimize production lines, supply chains, and predictive maintenance with AI.",
    icon: <Factory size={28} />,
    id: "01",
    link: "#"
  },
  {
    title: "Real Estate",
    description: "Streamline property listings, lead management, and market analysis tools.",
    icon: <Home size={28} />,
    id: "02",
    link: "#"
  },
  {
    title: "Accounting",
    description: "Automate bookkeeping, tax compliance, and financial reporting workflows.",
    icon: <Calculator size={28} />,
    id: "03",
    link: "#"
  },
  {
    title: "Education",
    description: "Personalize learning experiences and automate administrative tasks for educators.",
    icon: <GraduationCap size={28} />,
    id: "04",
    link: "#"
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
    <div
      className="text-white font-sans selection:bg-[#23b5b5]/30 relative overflow-hidden"
      style={{ backgroundColor: '#050505', isolation: 'isolate' }}
    >
      {/* Contained section glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(35,181,181,0.08), transparent 70%)',
          filter: 'blur(60px)'
        }}
      />

      <section className="relative px-6 py-20 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

          {/* Left Column: Sticky */}
          <div className="lg:w-1/2 lg:h-screen lg:sticky lg:top-0 flex flex-col justify-center py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-[1.1] tracking-tight">
                Industries
              </h2>

              <p className="text-gray-400 text-lg md:text-xl max-w-md leading-relaxed mb-10">
                We focus on business process automation, help improve information exchange,
                increase labor productivity and reduce business operating costs
              </p>

              {/* Scroll progress bar with teal gradient */}
              <div className="hidden lg:block relative w-1 h-32 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 right-0 origin-top rounded-full"
                  style={{
                    scaleY,
                    background: 'linear-gradient(to bottom, #23b5b5, rgba(35,181,181,0.4))'
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Cards */}
          <div className="lg:w-1/2 space-y-6 pb-24">
            {industries.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group relative block decoration-transparent"
              >
                <div className="bg-white/[0.03] border border-white/[0.06] p-8 md:p-10 rounded-2xl group-hover:border-[#23b5b5]/30 transition-all duration-500 relative overflow-hidden">
                  {/* Per-card hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: 'radial-gradient(ellipse at top left, rgba(35,181,181,0.07), transparent 70%)' }}
                  />
                  {/* Bottom teal gradient line on hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(to right, transparent, #23b5b5, transparent)' }}
                  />

                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="text-[#23b5b5] transition-transform duration-500 group-hover:scale-110">
                      {item.icon}
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-2xl font-bold mb-4 text-white group-hover:text-[#23b5b5] transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-gray-400 leading-relaxed">
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