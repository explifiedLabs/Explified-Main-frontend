import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Zap, Cpu } from 'lucide-react';

const formatTitle = (title) => {
  if (!title) return '';
  const words = title.split(' ');
  if (words.length <= 2) return <span className="text-teal-400">{title}</span>;
  const lastTwo = words.splice(-2).join(' ');
  return <>{words.join(' ')} <span className="text-teal-400">{lastTwo}</span></>;
};

// 🔴 SMARTER PARSER: Gets the cards, but also saves "extra" content
const parseAboutHTML = (html) => {
  if (!html) return null;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const h2s = doc.querySelectorAll('h2');
  const h3s = doc.querySelectorAll('h3');
  const ps = doc.querySelectorAll('p');

  const regularPs = Array.from(ps).filter(p => !p.innerText.includes('Badge:'));
  const badgeP = Array.from(ps).find(p => p.innerText.includes('Badge:'));

  // Get everything AFTER the 4th H2 to render freely at the bottom
  let extraHtml = "";
  if (h2s.length > 4) {
    let isExtra = false;
    Array.from(doc.body.children).forEach(el => {
      if (el === h2s[4]) isExtra = true; // Start capturing at 5th H2
      if (isExtra) extraHtml += el.outerHTML;
    });
  }

  return {
    hero: {
      title: h2s[0]?.innerText || "Driving the Future",
      subtitle: h3s[0]?.innerText || "",
      badge: badgeP ? badgeP.innerText.replace('Badge:', '').trim() : "About Explified"
    },
    mission: {
      title: h2s[1]?.innerText || "Our Mission",
      text: regularPs[0]?.innerText || ""
    },
    vision: {
      title: h2s[2]?.innerText || "Our Vision",
      text: regularPs[1]?.innerText || ""
    },
    team: {
      title: h2s[3]?.innerText || "Built by Innovators",
      text: regularPs[2]?.innerText || ""
    },
    extraContent: extraHtml // Anything else you typed in the editor!
  };
};

  const SITE_ID = "69c67e3f225219428111ab74";
const AboutUs = () => {
  const [data, setData] = useState(null);
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch('https://cmsapi-pf6diz22ka-uc.a.run.app/api/pages/about',{
            headers: {
              "x-site-id": SITE_ID,
            },
          },);
        const json = await response.json();
        
        if (json.success && json.data) {
          setData(parseAboutHTML(json.data.content));
        }
      } catch (error) {
        console.error("Failed to fetch About page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
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
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* HERO */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-teal-400 mb-6 tracking-widest uppercase">
            <Cpu className="w-4 h-4" /> {data.hero?.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            {formatTitle(data.hero?.title)}
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {data.hero?.subtitle}
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="p-8 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors duration-300">
            <Target className="w-8 h-8 text-teal-400 mb-6" />
            <h3 className="text-xl font-semibold mb-3">{data.mission?.title}</h3>
            <p className="text-zinc-400 leading-relaxed">{data.mission?.text}</p>
          </div>
          <div className="p-8 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors duration-300">
            <Zap className="w-8 h-8 text-teal-400 mb-6" />
            <h3 className="text-xl font-semibold mb-3">{data.vision?.title}</h3>
            <p className="text-zinc-400 leading-relaxed">{data.vision?.text}</p>
          </div>
        </div>

        {/* TEAM */}
        <div className="p-10 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-black text-center mb-16">
          <Users className="w-10 h-10 text-teal-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">{data.team?.title}</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-8">{data.team?.text}</p>
          <button className="bg-teal-500 hover:bg-teal-400 text-black font-semibold rounded-full px-8 py-3 transition-colors duration-300">
            Join Our Team
          </button>
        </div>

        {/* 🔴 NEW: ANY EXTRA CONTENT YOU TYPED IN THE EDITOR APPEARS HERE */}
        {data.extraContent && (
          <div 
            className="prose prose-invert max-w-none 
              [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-12 [&>h2]:mb-6
              [&>p]:text-zinc-400 [&>p]:leading-relaxed [&>p]:mb-6
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:text-zinc-400 [&>ul]:marker:text-teal-400"
            dangerouslySetInnerHTML={{ __html: data.extraContent }}
          />
        )}

      </motion.div>
    </div>
  );
};

export default AboutUs;