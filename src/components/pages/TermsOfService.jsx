import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

// 🔴 PARSER
const parseSectionsHTML = (html) => {
  if (!html) return { sections:[] };
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const sections =[];
  let currentSection = null;
  let lastUpdated = null;

  Array.from(doc.body.children).forEach(el => {
    if (el.tagName === 'P' && el.innerText.includes('LastUpdated:')) {
      lastUpdated = el.innerText.replace('LastUpdated:', '').trim();
    } else if (el.tagName === 'H2') {
      if (currentSection) sections.push(currentSection);
      currentSection = { title: el.innerText, text: '', list:[] };
    } else if (el.tagName === 'P' && currentSection) {
      currentSection.text += (currentSection.text ? '\n' : '') + el.innerText;
    } else if ((el.tagName === 'UL' || el.tagName === 'OL') && currentSection) {
      Array.from(el.children).forEach(li => currentSection.list.push(li.innerText));
    }
  });
  if (currentSection) sections.push(currentSection);
  return { lastUpdated, sections };
};
 const SITE_ID = "69c67e3f225219428111ab74";
const TermsOfService = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch('https://cmsapi-pf6diz22ka-uc.a.run.app/api/pages/terms-of-service',{
            headers: {
              "x-site-id": SITE_ID,
            },
          },);
        const json = await response.json();
        
        if (json.success && json.data) {
          setData({
            title: json.data.title,
            content: parseSectionsHTML(json.data.content)
          });
        }
      } catch (error) {
        console.error("Failed to fetch Terms of Service:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  },[]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#23b5b5]/30 border-t-[#23b5b5] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-300 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 border-b border-zinc-800 pb-8">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-6">
            <FileText className="w-6 h-6 text-teal-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{data.title}</h1>
          <p className="text-zinc-500">Last updated: {data.content?.lastUpdated}</p>
        </div>

        <div className="space-y-8 text-base leading-relaxed">
          {data.content?.sections?.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-semibold text-white mb-4">
                {idx + 1}. {section.title}
              </h2>
              {section.text && <p className={section.list?.length > 0 ? "mb-4" : ""}>{section.text}</p>}
              
              {section.list && section.list.length > 0 && (
                <ul className="list-disc pl-6 space-y-2 text-zinc-400 marker:text-teal-400">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfService;