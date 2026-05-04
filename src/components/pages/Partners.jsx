import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const formatTitle = (title) => {
  if (!title) return '';
  const words = title.split(' ');
  if (words.length <= 2) return <span className="text-teal-400">{title}</span>;
  const lastTwo = words.splice(-2).join(' ');
  return <>{words.join(' ')} <span className="text-teal-400">{lastTwo}</span></>;
};

// 🔴 PARSER
const parsePartnersHTML = (html) => {
  if (!html) return {};
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const h2s = doc.querySelectorAll('h2');
  const h3s = doc.querySelectorAll('h3');
  const ps = doc.querySelectorAll('p');

  return {
    hero: {
      title: h2s[0]?.innerText || "Our Partner Ecosystem",
      subtitle: h3s[0]?.innerText || ""
    },
    cta: {
      title: h2s[1]?.innerText || "Ready to become a partner?",
      text: ps[0]?.innerText || ""
    }
  };
};
  const SITE_ID = "69c67e3f225219428111ab74";

const Partners = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const partnersList =[];

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        // Fetch from the PUBLIC endpoint directly by slug
        const response = await fetch('https://cmsapi-pf6diz22ka-uc.a.run.app/api/pages/partners', {
            headers: {
              "x-site-id": SITE_ID,
            },
          },);
        const json = await response.json();
        
        if (json.success && json.data) {
          setData(parsePartnersHTML(json.data.content));
        }
      } catch (error) {
        console.error("Failed to fetch Partners page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  },[]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#23b5b5]/30 border-t-[#23b5b5] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {formatTitle(data.hero?.title)}
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {data.hero?.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {partnersList.map((partner, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-8 rounded-2xl border border-zinc-800 group hover:border-teal-400/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="mb-6 bg-zinc-900 w-12 h-12 rounded-lg flex items-center justify-center border border-zinc-800">
                {partner.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{partner.name}</h3>
              <p className="text-zinc-400 mb-6">{partner.desc}</p>
              <button className="flex items-center text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="border border-zinc-800 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-zinc-900/50 to-black">
          <div className="mb-6 md:mb-0 max-w-xl">
            <h2 className="text-2xl font-bold mb-2">{data.cta?.title}</h2>
            <p className="text-zinc-400">{data.cta?.text}</p>
          </div>
          <button className="bg-teal-500 hover:bg-teal-400 text-black font-semibold rounded-full px-8 py-3 whitespace-nowrap transition-colors duration-300">
            Coming Soon
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Partners;