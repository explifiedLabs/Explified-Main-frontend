import React from 'react';
import { Twitter, Linkedin, Instagram, ArrowRight, Youtube } from "lucide-react";
import { Link } from "react-router"; 
import { useCMS } from '../../hooks/useCMS.jsx';
import logo from "../../assets/logo.png";

// Helper for case-insensitive lookup
const getMenu = (data, menuName) => {
  if (!data) return [];
  const key = Object.keys(data).find(k => k.toLowerCase() === menuName.toLowerCase());
  return key ? data[key] : [];
};

const Footer = () => {
  const { data } = useCMS();
  
  const footerData = data?.footer || {};
  
  const platformLinks = getMenu(footerData, 'Platform');
  const productLinks = getMenu(footerData, 'Products');
  const resourceLinks = getMenu(footerData, 'Resources');
  const companyLinks = getMenu(footerData, 'Company');

  const accentColor = "#23b5b5";

  const socials = [
    { Icon: Youtube, href: "https://youtube.com/@explified" },
    { Icon: Instagram, href: "https://instagram.com/explified" },
    { Icon: Twitter, href: "https://x.com/explified" },
    { Icon: Linkedin, href: "https://linkedin.com/company/explified" },
  ];

  // Helper to render links based on CMS data
  const renderCmsLink = (link, index) => {
    const label = link.label || link.name;
    const isNewTab = link.openInNewTab;
    const target = isNewTab ? "_blank" : "_self";
    const rel = isNewTab ? "noopener noreferrer" : undefined;
    const className = "text-base font-medium text-gray-400 hover:text-[#23b5b5] bg-transparent transition-colors duration-200";

    if (link.url && (link.url.startsWith('http') || isNewTab)) {
      return (
        <a key={index} href={link.url} target={target} rel={rel} className={className}>
          {label}
        </a>
      );
    }
    return (
      <Link key={index} to={link.url || '#'} className={className}>
        {label}
      </Link>
    );
  };

  return (
    <footer className="relative w-full bg-[#000000] text-white pt-20 pb-28 md:pt-36 md:pb-52 overflow-hidden font-sans">
      
      {/* Background Gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-[800px] opacity-40 pointer-events-none z-0"
        style={{
          background: `linear-gradient(to top, ${accentColor} 0%, rgba(35, 181, 181, 0.1) 40%, transparent 100%)`,
        }}
      />

      {/* Large Background Text */}
      <div className="absolute bottom-[-5%] left-0 w-full flex justify-center pointer-events-none select-none z-0">
        <span
          className="text-[20vw] font-bold tracking-tighter leading-none whitespace-nowrap"
          style={{
            color: accentColor,
            opacity: 0.15,
            maskImage: "linear-gradient(to bottom, transparent, black)",
          }}
        >
          Explified
        </span>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Newsletter + Socials Column */}
          <div className="sm:col-span-2 lg:col-span-1 lg:pr-6">
            <h4 className="text-lg font-bold text-white mb-6">Newsletter</h4>
            
            <div className="relative w-full max-w-[260px]">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-12 pl-5 pr-14 rounded-full bg-transparent border border-white/15 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#23b5b5] transition-all"
              />
              <button className="absolute right-1 top-1 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#23b5b5] hover:text-white transition-colors duration-300">
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Socials - Hardcoded to always open in New Tab */}
            <h4 className="text-lg font-bold text-white mt-10 mb-5">Socials</h4>
            <div className="flex gap-3">
              {socials.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-300 group hover:border-[#23b5b5] hover:bg-[#23b5b5] hover:shadow-[0_0_15px_rgba(35,181,181,0.4)]"
                >
                  <social.Icon size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold text-white mb-8">Platform</h4>
            <ul className="space-y-4">
              {platformLinks.map((link, i) => (
                <li key={i}>{renderCmsLink(link, i)}</li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold text-white mb-8">Products</h4>
            <ul className="space-y-4">
              {productLinks.map((link, i) => (
                <li key={i}>{renderCmsLink(link, i)}</li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold text-white mb-8">Resources</h4>
            <ul className="space-y-4">
              {resourceLinks.map((link, i) => (
                <li key={i}>{renderCmsLink(link, i)}</li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold text-white mb-8">Company</h4>
            <ul className="space-y-4">
              {companyLinks.map((link, i) => (
                <li key={i}>{renderCmsLink(link, i)}</li>
              ))}
            </ul>
          </div>
          
        </div>

        {/* Footer Bottom Info */}


      </div>
    </footer>
  );
};

export default Footer;