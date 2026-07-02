import React from "react";
import {
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  Youtube,
  Mail,
} from "lucide-react";
import { Link } from "react-router";
import { useCMS } from "../../hooks/useCMS.jsx";
import logo from "../../assets/logo.png";
import startupLogo from "../images/startup-logo.png";

// Helper for case-insensitive lookup
const getMenu = (data, menuName) => {
  if (!data) return [];
  const key = Object.keys(data).find(
    (k) => k.toLowerCase() === menuName.toLowerCase(),
  );
  return key ? data[key] : [];
};

const Footer = () => {
  const { data } = useCMS();

  const footerData = data?.footer || {};

  const platformLinks = getMenu(footerData, "Platform");
  const productLinks = getMenu(footerData, "Products");
  const resourceLinks = getMenu(footerData, "Resources");
  const companyLinks = getMenu(footerData, "Company");

  const accentColor = "#23b5b5";

  const socials = [
    { Icon: Youtube, href: "https://youtube.com/@explified" },
    { Icon: Instagram, href: "https://instagram.com/explified" },
    { Icon: Twitter, href: "https://x.com/explified" },
    { Icon: Linkedin, href: "https://linkedin.com/company/explified" },
  ];

  const renderCmsLink = (link, index) => {
    const label = link.label || link.name;
    const isNewTab = link.openInNewTab;
    const target = isNewTab ? "_blank" : "_self";
    const rel = isNewTab ? "noopener noreferrer" : undefined;
    const className =
      "text-base text-gray-400 hover:text-[#23b5b5] bg-transparent transition-colors duration-200";

    if (link.url && (link.url.startsWith("http") || isNewTab)) {
      return (
        <a
          key={index}
          href={link.url}
          target={target}
          rel={rel}
          className={className}
        >
          {label}
        </a>
      );
    }
    return (
      <Link key={index} to={link.url || "#"} className={className}>
        {label}
      </Link>
    );
  };

  return (
    <footer className="relative w-full bg-[#000000] text-white pt-14 pb-20  md:pt-16 md:pb-40 overflow-hidden font-sans">
      {/* Ambient bottom glow */}
      <div
        className="absolute bottom-0 left-0 w-full h-full opacity-40 pointer-events-none z-0"
        style={{
          background: `linear-gradient(to top, ${accentColor} 0%, rgba(35, 181, 181, 0.1) 40%, transparent 100%)`,
        }}
      />

      {/* Giant watermark wordmark */}
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
        {/* --- Top Bar: Logo + Newsletter --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src={logo}
              alt="Explified"
              className="w-6 h-6 object-contain"
            />
            <span className="text-lg font-bold text-white tracking-tight">
              Explified
            </span>
          </Link>

          <div className="relative w-full md:w-[420px]">
            <Mail
              size={16}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <input
              type="email"
              placeholder="Subscribe to our newsletter"
              className="w-full h-12 pl-12 pr-14 rounded-full bg-white/[0.03] border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#23b5b5] transition-all"
            />
            <button className="absolute right-1 top-1 w-10 h-10 rounded-full bg-[#23b5b5] text-black flex items-center justify-center hover:brightness-110 transition-all duration-300">
              <ArrowRight size={18} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-white/10 mb-14" />

        {/* --- Link Columns --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12 mb-6 md:mb-8">
          <div>
            <h4 className="text-xs font-bold text-[#23b5b5] tracking-[0.15em] uppercase mb-6">
              Platform
            </h4>
            <ul className="space-y-3.5">
              {platformLinks.map((link, i) => (
                <li key={i}>{renderCmsLink(link, i)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#23b5b5] tracking-[0.15em] uppercase mb-6">
              Products
            </h4>
            <ul className="space-y-3.5">
              {productLinks.map((link, i) => (
                <li key={i}>{renderCmsLink(link, i)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#23b5b5] tracking-[0.15em] uppercase mb-6">
              Resources
            </h4>
            <ul className="space-y-3.5">
              {resourceLinks.map((link, i) => (
                <li key={i}>{renderCmsLink(link, i)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#23b5b5] tracking-[0.15em] uppercase mb-6">
              Company
            </h4>
            <ul className="space-y-3.5">
              {companyLinks.map((link, i) => (
                <li key={i}>{renderCmsLink(link, i)}</li>
              ))}
            </ul>
          </div>

          {/* Connect Column: Socials + DPIIT badge */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-xs font-bold text-[#23b5b5] tracking-[0.15em] uppercase mb-6">
              Connect
            </h4>
            <div className="flex gap-3 mb-6">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg border border-white/15 flex items-center justify-center text-white transition-all duration-300 group hover:border-[#23b5b5] hover:bg-[#23b5b5] hover:shadow-[0_0_15px_rgba(35,181,181,0.4)]"
                >
                  <social.Icon
                    size={17}
                    className="group-hover:scale-110 transition-transform"
                  />
                </a>
              ))}
            </div>

            {/* Logo */}
            <div className="flex items-center justify-center">
              <img
                src={startupLogo}
                alt="DPIIT Startup India"
                className="h-46 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className="h-px w-full bg-white/10 mb-2" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <span>&copy; 2026 Explified Technologies. All rights reserved.</span>
          <span>Made with intent in India &middot; Shipping to the world.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
