import React, { useState } from "react";
import {
  ExternalLink,
  Zap,
  DollarSign,
  Rocket,
  Sparkles,
  ShoppingBag,
  Megaphone,
  Layout,
  Presentation,
  Smartphone,
  Check,
} from "lucide-react";

export default function ZeroBGLanding() {
  // Replace this URL with your deployed Figma Community plugin link
  const DEPLOYED_FIGMA_PLUGIN_URL =
    "https://www.figma.com/community/plugin/1643987146382893434/zerobg-background-remover-and-ai-image-editor";

  // State for interactive before/after preview toggle
  const [showCleanBG, setShowCleanBG] = useState(true);

  const useCases = [
    {
      title: "E-commerce Product Shots",
      description:
        "Instantly isolate products for clean, professional catalog and UI displays.",
      icon: ShoppingBag,
    },
    {
      title: "Marketing Materials",
      description:
        "Quickly extract subjects to create dynamic social media graphics, ads, and banners.",
      icon: Megaphone,
    },
    {
      title: "Web Design Assets",
      description:
        "Seamlessly integrate transparent headshots and hero images into your landing page layouts.",
      icon: Layout,
    },
    {
      title: "Presentation Decks",
      description:
        "Enhance your slides by removing distracting backgrounds from stock photos for a cleaner look.",
      icon: Presentation,
    },
    {
      title: "App UI Elements",
      description:
        "Isolate icons and real-world elements for custom UI components without ever leaving your canvas.",
      icon: Smartphone,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#05090a] text-[#e2e8f0] font-sans selection:bg-[#23b5b5] selection:text-black pt-28 pb-20 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-[#23b5b5]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-[#23b5b5]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-28">
        {/* --- SPLIT HERO SECTION --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#23b5b5]/10 border border-[#23b5b5]/30 text-[#23b5b5] text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Figma Plugin
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              ZeroBG —{" "}
              <span className="text-[#23b5b5]">Background Remover</span> &amp;
              AI Image Editor
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
              Elevate your design workflow with zeroBG, the ultimate AI-powered
              background removal tool built directly for Figma. Stop manually
              tracing paths and let our advanced AI handle the heavy lifting
              with pixel-perfect precision in just one click.
            </p>

            {/* Direct Action Button */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={DEPLOYED_FIGMA_PLUGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-[#23b5b5] text-[#05090a] font-bold text-sm hover:bg-[#1fa1a1] transition-all duration-200 shadow-xl shadow-[#23b5b5]/20 flex items-center gap-2 group"
              >
                Open in Figma
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <span className="text-xs text-slate-400 font-medium">
                Instant 1-Click Cutouts inside Figma Canvas
              </span>
            </div>
          </div>

          {/* Right Visual Interactive Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="p-2 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-2xl">
              <div className="bg-[#0b1214] rounded-xl p-5 border border-white/5">
                {/* Simulated Figma Canvas Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#23b5b5]" />
                    ZeroBG.fig
                  </span>
                  <button
                    onClick={() => setShowCleanBG(!showCleanBG)}
                    className="text-xs px-3 py-1 rounded bg-[#23b5b5]/10 text-[#23b5b5] border border-[#23b5b5]/30 hover:bg-[#23b5b5]/20 transition-all"
                  >
                    Toggle: {showCleanBG ? "Transparent PNG" : "Original Image"}
                  </button>
                </div>

                {/* Canvas Box */}
                <div className="relative h-64 rounded-lg overflow-hidden flex items-center justify-center bg-[#101a1d]">
                  {/* Grid pattern background for transparent mode */}
                  {showCleanBG && (
                    <div
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        backgroundImage:
                          "radial-gradient(#23b5b5 1px, transparent 1px)",
                        backgroundSize: "12px 12px",
                      }}
                    />
                  )}

                  <div className="relative text-center p-6 z-10">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-[#23b5b5]/20 flex items-center justify-center text-[#23b5b5] border border-[#23b5b5]/40 animate-pulse">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {showCleanBG
                        ? "Pixel-Perfect Cutout Applied"
                        : "Original Unedited Photo"}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {showCleanBG
                        ? "Background removed in 0.8s"
                        : "Contains complex background artifacts"}
                    </div>
                  </div>
                </div>

                {/* Action button inside mockup */}
                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-slate-400">
                  <span>AI Precision: 99.8%</span>
                  <span className="text-[#23b5b5] font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Ready for Figma Export
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- WHY ZEROBG (KEY ADVANTAGES BAR) --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#0a1113] border border-white/5 hover:border-[#23b5b5]/30 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#23b5b5]/10 flex items-center justify-center text-[#23b5b5] mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">⚡ Save Time</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cut out complex images in 1 click instead of spending 10 minutes
              on manual masking. Save hours every week.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0a1113] border border-white/5 hover:border-[#23b5b5]/30 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#23b5b5]/10 flex items-center justify-center text-[#23b5b5] mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">💰 Save Money</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reduce your dependency on expensive third-party photo editing
              subscriptions and external apps.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0a1113] border border-white/5 hover:border-[#23b5b5]/30 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#23b5b5]/10 flex items-center justify-center text-[#23b5b5] mb-4">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              🚀 Boost Productivity
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stay in your creative flow state. Never leave Figma to edit an
              image or download external transparent PNGs again.
            </p>
          </div>
        </section>

        {/* --- USE CASES (ASYMMETRICAL SECTION) --- */}
        <section className="space-y-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#23b5b5]">
              Tailored Workflows
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Built for every design use case
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#091012] border border-white/5 hover:border-[#23b5b5]/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#23b5b5] mb-4 group-hover:bg-[#23b5b5]/10 transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- CALL TO ACTION --- */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0d1618] via-[#091012] to-[#0d1618] border border-[#23b5b5]/20 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#23b5b5]/10 flex items-center justify-center text-[#23b5b5] mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Remove backgrounds in seconds.
          </h2>
          <p className="mt-2 text-slate-400 text-sm max-w-lg">
            Try ZeroBG today and bring AI image editing directly into your Figma
            workspace.
          </p>

          <a
            href={DEPLOYED_FIGMA_PLUGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 px-8 py-3.5 rounded-xl bg-[#23b5b5] text-[#05090a] font-bold text-sm hover:bg-[#1fa1a1] transition-all duration-200 shadow-xl shadow-[#23b5b5]/20 flex items-center gap-2"
          >
            Get ZeroBG for Figma
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>
      </div>
    </div>
  );
}
