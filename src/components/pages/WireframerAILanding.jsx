import React, { useState } from "react";
import {
  ExternalLink,
  Sparkles,
  Wand2,
  Maximize2,
  Image as ImageIcon,
  Type,
  Users,
  Send,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function WireframerAILanding() {
  // Configurable URL for your deployed Figma plugin
  const DEPLOYED_FIGMA_PLUGIN_URL =
    "https://www.figma.com/community/plugin/1607779209963334185/wireframer-ai";

  // Prompt simulator options
  const samplePrompts = [
    "A modern e-commerce storefront with a hero split and a 3-column product grid",
    "Analytics dashboard with a sidebar navigation, metric cards, and a weekly activity chart",
    "SaaS pricing page with a toggle for annual billing and 3 comparison tiers",
  ];

  const [activePrompt, setActivePrompt] = useState(samplePrompts[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePromptSelect = (prompt) => {
    setIsGenerating(true);
    setActivePrompt(prompt);
    setTimeout(() => setIsGenerating(false), 600);
  };

  return (
    <div className="relative min-h-screen bg-[#070c0e] text-[#e2e8f0] font-sans selection:bg-[#23b5b5] selection:text-black pt-28 pb-20 overflow-hidden">
      {/* Background Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#23b5b5]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[50%] -left-32 w-[400px] h-[400px] bg-[#23b5b5]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 space-y-28">
        {/* --- HERO SECTION --- */}
        <section className="text-center max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#23b5b5]/10 border border-[#23b5b5]/30 text-[#23b5b5] text-xs font-semibold uppercase tracking-wider mb-6">
            <Wand2 className="w-3.5 h-3.5" />
            Figma AI Plugin
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Stop staring at a blank canvas. <br />
            Meet <span className="text-[#23b5b5]">Wireframer AI</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            Your intelligent design assistant that instantly generates
            structured, high-fidelity wireframes directly in Figma based on
            simple text descriptions.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <a
              href={DEPLOYED_FIGMA_PLUGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-[#23b5b5] text-[#070c0e] font-bold text-sm hover:bg-[#1fa1a1] transition-all duration-200 shadow-xl shadow-[#23b5b5]/20 flex items-center gap-2 group"
            >
              Open in Figma
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#features"
              className="px-6 py-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 font-medium text-sm transition-all"
            >
              Explore Capabilities
            </a>
          </div>
        </section>

        {/* --- INTERACTIVE PROMPT-TO-WIREFRAME SIMULATOR --- */}
        <section className="p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-2xl">
          <div className="bg-[#0b1215] rounded-[22px] p-6 md:p-8">
            <div className="text-xs text-[#23b5b5] font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Live Plugin Demo
            </div>
            <h3 className="text-xl font-bold text-white mb-6">
              Try generating a frame concept
            </h3>

            {/* Simulated Prompt Bar */}
            <div className="relative mb-6">
              <div className="flex items-center gap-3 bg-[#111a1d] border border-[#23b5b5]/30 rounded-xl p-3 sm:p-4">
                <Wand2 className="w-5 h-5 text-[#23b5b5] shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={activePrompt}
                  className="bg-transparent text-sm text-slate-200 w-full focus:outline-none cursor-default font-mono"
                />
                <button className="px-4 py-2 rounded-lg bg-[#23b5b5] text-[#070c0e] text-xs font-bold shrink-0 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Generate
                </button>
              </div>

              {/* Sample Prompt Quick Selectors */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="text-slate-500 py-1 font-medium">
                  Try prompts:
                </span>
                {samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptSelect(prompt)}
                    className={`px-3 py-1 rounded-md border transition-all truncate max-w-[260px] ${
                      activePrompt === prompt
                        ? "bg-[#23b5b5]/20 border-[#23b5b5] text-[#23b5b5]"
                        : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Output Display */}
            <div className="relative h-72 rounded-xl bg-[#121d20] border border-white/5 p-6 flex flex-col justify-between overflow-hidden">
              {isGenerating ? (
                <div className="absolute inset-0 bg-[#0b1215]/80 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="flex items-center gap-3 text-[#23b5b5] font-medium text-sm">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Synthesizing Auto-Layout Components...
                  </div>
                </div>
              ) : null}

              {/* Top Navigation Bar Wireframe */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#23b5b5]/30" />
                  <div className="w-20 h-3 rounded bg-white/20" />
                </div>
                <div className="flex gap-3">
                  <div className="w-12 h-3 rounded bg-white/10" />
                  <div className="w-12 h-3 rounded bg-white/10" />
                  <div className="w-16 h-6 rounded bg-[#23b5b5] opacity-80" />
                </div>
              </div>

              {/* Dynamic Wireframe Body */}
              <div className="grid grid-cols-12 gap-4 my-auto">
                <div className="col-span-7 space-y-3">
                  <div className="w-3/4 h-6 rounded bg-white/30" />
                  <div className="w-full h-3 rounded bg-white/10" />
                  <div className="w-5/6 h-3 rounded bg-white/10" />
                  <div className="w-28 h-8 rounded-lg bg-[#23b5b5]/40 mt-2" />
                </div>
                <div className="col-span-5 h-28 rounded-lg bg-[#1a282c] border border-[#23b5b5]/20 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-[#23b5b5]/40" />
                </div>
              </div>

              {/* Bottom Wireframe Footer Bar */}
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono border-t border-white/5 pt-3">
                <span>Auto-Layout: Enabled</span>
                <span>Figma Tokens: Applied</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section id="features" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#23b5b5]">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Everything you need to skip the box-drawing phase
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-[#0d1618] border border-white/5 hover:border-[#23b5b5]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#23b5b5]/10 flex items-center justify-center text-[#23b5b5] mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Instant Generation
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Turn text prompts into structured UI layouts in seconds. Go from
                a product concept directly to editable Figma frames.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0d1618] border border-white/5 hover:border-[#23b5b5]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#23b5b5]/10 flex items-center justify-center text-[#23b5b5] mb-6">
                <Maximize2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Auto-Layout Ready
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every generated frame uses native Figma auto-layout. Resize,
                drag, and reorder components seamlessly without breaking design
                rules.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0d1618] border border-white/5 hover:border-[#23b5b5]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#23b5b5]/10 flex items-center justify-center text-[#23b5b5] mb-6">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Smart Object Handling
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automatically sources and crops high-quality placeholder images
                for hero sections, product grids, and avatars.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0d1618] border border-white/5 hover:border-[#23b5b5]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#23b5b5]/10 flex items-center justify-center text-[#23b5b5] mb-6">
                <Type className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Clean Typographic Scales
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Out-of-the-box styling with calculated spacing, font size
                hierarchies, and contrast ratios tailored for design iteration.
              </p>
            </div>
          </div>
        </section>

        {/* --- WHO IS THIS FOR --- */}
        <section className="p-8 md:p-12 rounded-2xl bg-[#0a1214] border border-white/5">
          <div className="flex items-center gap-3 text-[#23b5b5] font-semibold text-xs tracking-wider uppercase mb-3">
            <Users className="w-4 h-4" /> Who it's built for
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-8">
            Designed for high-speed product teams
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#101b1e] border border-white/5">
              <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#23b5b5]" /> Product
                Managers
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quickly validate specs and visualize user flows visually before
                handing off to design teams.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#101b1e] border border-white/5">
              <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#23b5b5]" /> Founders
                &amp; Builders
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prototype pitch deck visuals and landing page concepts in
                minutes without spending days learning design software.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#101b1e] border border-white/5">
              <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#23b5b5]" /> UI/UX
                Designers
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Skip repetitive layout scaffolding and jump straight into
                high-level visual polish and UX iteration.
              </p>
            </div>
          </div>
        </section>

        {/* --- BOTTOM CTA --- */}
        <section className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-[#0e191c] via-[#091113] to-[#070c0e] border border-[#23b5b5]/30 text-center flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Transform ideas into wireframes in seconds
          </h2>
          <p className="mt-3 text-slate-400 text-sm max-w-xl">
            Add Wireframer AI to your Figma plugins and accelerate your product
            development workflow today.
          </p>

          <a
            href={DEPLOYED_FIGMA_PLUGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 px-8 py-4 rounded-xl bg-[#23b5b5] text-[#070c0e] font-bold text-sm hover:bg-[#1fa1a1] transition-all duration-200 shadow-xl shadow-[#23b5b5]/20 flex items-center gap-2"
          >
            Open Wireframer AI in Figma
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>
      </div>
    </div>
  );
}
