import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Rocket, 
  Server, 
  Database, 
  TrendingUp, 
  Droplets, 
  ArrowRight 
} from 'lucide-react';

// Industry Data combining both images
const industries = [
  {
    title: "Automations Eng",
    subtitle: "System logic automation",
    description: "Streamlining complex business logic through intelligent automated workflows and decision engines.",
    icon: <Cpu size={32} />
  },
  {
    title: "Startups",
    subtitle: "Scaling tools",
    description: "Providing the infrastructure and digital tools necessary for rapid growth and market entry.",
    icon: <Rocket size={32} />
  },
  {
    title: "IT Infrastructure",
    subtitle: "Server & Cloud automation",
    description: "Modernizing legacy systems with cloud-native automation and robust server management.",
    icon: <Server size={32} />
  },
  {
    title: "Data Engineering",
    subtitle: "Pipeline orchestration",
    description: "Building scalable data pipelines that ensure information flow is clean, fast, and actionable.",
    icon: <Database size={32} />
  },
  {
    title: "Revenue Ops",
    subtitle: "CRM optimization",
    description: "Optimizing the full revenue stack to ensure maximum ROI and seamless customer journeys.",
    icon: <TrendingUp size={32} />
  },
  {
    title: "Oil and Gas",
    subtitle: "Digital Twins & Process Opt.",
    description: "Digital twins of oil fields and plants, predictive maintenance, and production optimization.",
    icon: <Droplets size={32} />
  }
];

const IndustriesPage = () => {
  return (
    <div className="bg-black text-white font-sans">
      
      {/* INDUSTRIES SECTION (Sticky Scroll) */}
      <section className="relative px-6 py-24 md:px-20 lg:px-32">
        <div className="flex flex-col md:flex-row gap-16">
          
          {/* Left Column: Sticky Header */}
          <div className="md:w-1/2 md:h-screen md:sticky md:top-0 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-[#23b5b5] font-mono tracking-widest uppercase mb-4 text-sm">Industries</h2>
              <h3 className="text-4xl md:text-6xl font-bold mb-6">Expertise for a Digital World.</h3>
              <p className="text-gray-400 text-lg max-w-md">
                We focus on business process automation, help improve information exchange, 
                increase labor productivity and reduce business operating costs.
              </p>
            </motion.div>
          </div>

          {/* Right Column: Scrollable Cards */}
          <div className="md:w-1/2 flex flex-col gap-8">
            {industries.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ 
                    once: false, 
                    amount: 0.4 // Card triggers when 40% is visible
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group bg-[#111111] border border-white/5 p-10 rounded-3xl hover:border-[#23b5b5]/50 transition-all duration-300"
              >
                <div className="text-[#23b5b5] mb-8 bg-[#23b5b5]/10 w-fit p-4 rounded-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-bold mb-1">{item.title}</h4>
                <p className="text-[#23b5b5] text-sm font-medium mb-4 uppercase tracking-wider">
                  {item.subtitle}
                </p>
                <p className="text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
            
            <div className="h-[20vh]" />
          </div>

        </div>
      </section>
    </div>
  );
};

export default IndustriesPage;