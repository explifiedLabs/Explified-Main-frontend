import React from "react";
import { motion } from "framer-motion";
import { Users, Youtube } from "lucide-react";

import ExplifiedLabs from "../../../logo.png";
import AirLogisticsLogo from "../images/AirLogistics.jpg";
import AstroLogo from "../images/Astro.jpg";
import HistoricLogo from "../images/historic.jpg";

const CHANNELS = [
  {
    name: "Explified Labs",
    handle: "@explified",
    subs: "37.6K",
    url: "https://www.youtube.com/@explified",
    color: "#23b5b5",
    logo: ExplifiedLabs,
  },
  {
    name: "Airlogistics",
    handle: "@Airlogisticsanalyzer",
    subs: "70",
    url: "https://www.youtube.com/@Airlogisticsanalyzer",
    color: "#f97316",
    logo: AirLogisticsLogo,
  },
  {
    name: "Astro Visuals",
    handle: "@astro4141official",
    subs: "8",
    url: "https://www.youtube.com/@astro4141official",
    color: "#a855f7",
    logo: AstroLogo,
  },
  {
    name: "Historic Knowledge",
    handle: "@historicknowledgebyexplified",
    subs: "804",
    url: "https://www.youtube.com/@historicknowledgebyexplified",
    color: "#eab308",
    logo: HistoricLogo,
  }
];

const ChannelCard = ({ channel, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="flex-none w-[calc(25%-18px)] min-w-[280px] group relative flex flex-col bg-white/[0.03] rounded-[2.5rem] h-[460px] border border-white/[0.06] hover:border-[#23b5b5]/30 transition-all duration-500 overflow-hidden"
  >
    {/* Per-card channel color glow */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
      style={{ background: `radial-gradient(circle at top, ${channel.color}, transparent)` }}
    />
    {/* Bottom teal gradient line on hover */}
    <div
      className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: 'linear-gradient(to right, transparent, #23b5b5, transparent)' }}
    />

    {/* Avatar */}
    <div className="relative h-48 w-full flex items-center justify-center border-b border-white/[0.05]">
      <div className="relative group-hover:scale-110 transition-transform duration-500">
        <div
          className="absolute inset-0 blur-2xl opacity-20 group-hover:opacity-50 transition-opacity"
          style={{ backgroundColor: channel.color }}
        />
        <div className="w-28 h-28 rounded-full border-[4px] border-[#05070A] bg-black overflow-hidden relative z-10">
          <img src={channel.logo} alt={channel.name} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    {/* Info */}
    <div className="p-8 flex flex-col flex-grow relative z-10 text-center items-center">
      <span className="text-[9px] font-black tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 border border-white/10 uppercase text-gray-400 mb-4">
        {channel.handle}
      </span>
      <h3 className="text-xl font-bold text-white group-hover:text-[#23b5b5] transition-colors leading-tight uppercase tracking-tighter">
        {channel.name}
      </h3>
      <div className="flex items-center gap-2 mt-4 text-gray-400">
        <Users size={14} style={{ color: channel.color }} />
        <span className="text-xs font-bold uppercase tracking-widest">{channel.subs} Subs</span>
      </div>
      <div className="mt-auto w-full pt-6">
        
        <a  href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-black/30 text-white border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-[#23b5b5] hover:text-black hover:border-[#23b5b5] transition-all duration-300"
        >
          Subscribe <Youtube size={14} />
        </a>
      </div>
    </div>
  </motion.div>
);

const ContentStudio = () => (
  <div
    className="py-32 px-6 lg:px-12 font-sans relative overflow-hidden"
    style={{ backgroundColor: '#050505', isolation: 'isolate' }}
  >
    {/* Contained section glow — does not bleed into neighbors */}
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at top, rgba(35,181,181,0.08), transparent 70%)',
        filter: 'blur(60px)'
      }}
    />

    <div className="max-w-[1440px] mx-auto relative z-10">

      {/* Header */}
      <header className="mb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
            Content<span className="text-[#23b5b5]"> Studio</span>
          </h1>
          {/* Gradient underline */}
          <div
            className="mx-auto mt-4 mb-6 h-[2px] w-32 rounded-full"
            style={{ background: 'linear-gradient(to right, transparent, #23b5b5, transparent)' }}
          />
          <p className="text-gray-400 max-w-2xl mx-auto mt-8 text-lg font-medium leading-relaxed">
            The digital media arm of Explified. Exploring automation, history, and global logistics through visual storytelling.
          </p>
        </motion.div>
      </header>

      {/* Channels Section */}
      <section>
        <div className="flex items-start gap-6 mb-12">
          <div
            className="w-14 h-14 rounded-2xl bg-[#23b5b5]/10 border border-[#23b5b5]/20 flex items-center justify-center"
            style={{ boxShadow: '0 0 24px rgba(35,181,181,0.10)' }}
          >
            <Youtube className="text-[#23b5b5]" size={28} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
              Our Channels<span className="text-[#23b5b5]">.</span>
            </h2>
            {/* Section title underline */}
            <div
              className="mt-1 mb-2 h-[1px] w-16"
              style={{ background: 'linear-gradient(to right, #23b5b5, transparent)' }}
            />
            <p className="text-gray-400 text-base font-medium">Educational content across various verticals</p>
          </div>
        </div>

        <div className="flex gap-6 flex-wrap justify-center lg:justify-between">
          {CHANNELS.map((channel, idx) => (
            <ChannelCard key={idx} channel={channel} index={idx} />
          ))}
        </div>
      </section>
    </div>
  </div>
);

export default ContentStudio;