import React from "react";
import {
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  Youtube,
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

  const socials = [
    { Icon: Youtube, href: "https://youtube.com/@explified", label: "YouTube" },
    { Icon: Instagram, href: "https://instagram.com/explified", label: "Instagram" },
    { Icon: Twitter, href: "https://x.com/explified", label: "Twitter" },
    { Icon: Linkedin, href: "https://linkedin.com/company/explified", label: "LinkedIn" },
  ];

  const renderCmsLink = (link, index) => {
    const label = link.label || link.name;
    const isNewTab = link.openInNewTab;
    const target = isNewTab ? "_blank" : "_self";
    const rel = isNewTab ? "noopener noreferrer" : undefined;
    const className =
      "text-[14px] text-neutral-500 hover:text-white bg-transparent transition-colors duration-200";

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
    <footer className="relative w-full bg-[#050607] text-white overflow-hidden font-sans">
      {/* Faint teal wash behind everything, low intensity */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(35,181,181,0.10), transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 pt-20 pb-10">
        {/* ---------- Top Bar: Logo + Newsletter ---------- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src={logo}
              alt="Explified"
              className="w-6 h-6 object-contain"
            />
            <span className="text-[18px] font-bold text-white tracking-tight">
              Explified
            </span>
          </Link>

          <div className="relative w-full md:w-[420px]">
            <input
              type="email"
              placeholder="Subscribe to our newsletter"
              className="w-full h-12 pl-6 pr-14 rounded-full bg-white/[0.02] border border-white/[0.08] text-[14px] text-white placeholder-neutral-500 focus:outline-none focus:border-[#23b5b5]/50 transition-all"
            />
            <button
              aria-label="Subscribe"
              className="absolute right-1 top-1 w-10 h-10 rounded-full bg-[#23b5b5] text-black flex items-center justify-center hover:bg-[#4fdede] transition-colors duration-200"
            >
              <ArrowRight size={17} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Hairline divider */}
        <div className="h-px w-full bg-white/[0.06] mb-14" />

        {/* ---------- Link Columns ---------- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12 mb-16">
          <div>
            <h4 className="text-[11px] font-bold text-[#23b5b5] tracking-[0.22em] uppercase mb-6">
              Platform
            </h4>
            <ul className="space-y-3.5 flex flex-col">
              {platformLinks.map((link, i) => (
                <li key={i}>{renderCmsLink(link, i)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-[#23b5b5] tracking-[0.22em] uppercase mb-6">
              Products
            </h4>
            <ul className="space-y-3.5 flex flex-col">
              {productLinks.map((link, i) => (
                <li key={i}>{renderCmsLink(link, i)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-[#23b5b5] tracking-[0.22em] uppercase mb-6">
              Resources
            </h4>
            <ul className="space-y-3.5 flex flex-col">
              {resourceLinks.map((link, i) => (
                <li key={i}>{renderCmsLink(link, i)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-[#23b5b5] tracking-[0.22em] uppercase mb-6">
              Company
            </h4>
            <ul className="space-y-3.5 flex flex-col">
              {companyLinks.map((link, i) => (
                <li key={i}>{renderCmsLink(link, i)}</li>
              ))}
            </ul>
          </div>

          {/* Connect Column: Socials + DPIIT */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-[11px] font-bold text-[#23b5b5] tracking-[0.22em] uppercase mb-6">
              Connect
            </h4>
            <div className="flex gap-2.5 mb-7">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-neutral-400 transition-all duration-300 hover:border-[#23b5b5]/50 hover:text-[#4fdede] hover:-translate-y-0.5"
                >
                  <social.Icon size={15} />
                </a>
              ))}
            </div>

            {/* DPIIT badge — image only */}
            <div className="flex items-center">
              <img
                src={startupLogo}
                alt="DPIIT Startup India"
                className="h-36 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* ---------- Giant Watermark ---------- */}
        <div className="w-full flex justify-center pointer-events-none select-none mt-4">
          <span
            className="font-bold leading-[0.78] whitespace-nowrap"
            style={{
              fontSize: "clamp(80px, 21vw, 300px)",
              letterSpacing: "-0.06em",
              background:
                "linear-gradient(180deg, rgba(35,181,181,0.22), rgba(35,181,181,0.02))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Explified
          </span>
        </div>

        {/* Copyright */}
        <div className="text-center text-[12.5px] text-neutral-600 mt-6">
          &copy; 2026 Explified. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;