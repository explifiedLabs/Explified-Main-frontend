import React, { useState } from "react";
import {
  ExternalLink,
  Star,
  ShoppingBag,
  Globe2,
  Sliders,
  BarChart3,
  CheckCircle2,
  ThumbsUp,
  Download,
  Video,
  Camera,
  ShieldCheck,
  Layers,
} from "lucide-react";

export default function VerdictLanding() {
  // Replace this URL with your deployed Shopify App link
  const DEPLOYED_SHOPIFY_APP_URL =
    "https://apps.shopify.com/verdict-product-reviews-app";

  const [activeTab, setActiveTab] = useState("photo");

  const featureList = [
    {
      title: "Customizable Storefront Widgets",
      description:
        "Match your brand with custom colors, typography, logos, and live desktop/mobile preview controls.",
      icon: Sliders,
    },
    {
      title: "1-Click Multi-Platform Import",
      description:
        "Seamlessly import existing customer reviews from Amazon, Flipkart, or legacy Shopify review apps.",
      icon: Download,
    },
    {
      title: "Auto-Translation Engine",
      description:
        "Automatically translate incoming reviews into local languages for global, multilingual storefronts.",
      icon: Globe2,
    },
    {
      title: "Unified Multi-Store Dashboard",
      description:
        "Manage multiple store locations, moderate pending submissions, and reply to customer feedback from one hub.",
      icon: Layers,
    },
    {
      title: "Ratings & Sentiment Analytics",
      description:
        "Track long-term rating trends, conversion metrics, and export data with built-in analytical dashboards.",
      icon: BarChart3,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#060a0c] text-[#e2e8f0] font-sans selection:bg-[#23b5b5] selection:text-black pt-28 pb-20 overflow-hidden">
      {/* Background Radial Lights */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[300px] bg-[#23b5b5]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-[#23b5b5]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 space-y-28">
        {/* --- HERO SECTION --- */}
        <section className="text-center max-w-4xl mx-auto flex flex-col items-center">
          {/* Rating Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#23b5b5]/10 border border-[#23b5b5]/30 text-[#23b5b5] text-xs font-semibold uppercase tracking-wider mb-6">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 fill-[#23b5b5] text-[#23b5b5]"
                />
              ))}
            </div>
            <span>Shopify App</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Collect photo &amp; video reviews, boost trust, and{" "}
            <span className="text-[#23b5b5]">convert more shoppers</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            Grow trust and increase sales with authentic customer reviews.
            Verdict lets you collect text, photo, and video reviews, display
            them with fully customizable widgets, and turn happy customers into
            your best marketing asset.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <a
              href={DEPLOYED_SHOPIFY_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-[#23b5b5] text-[#060a0c] font-bold text-sm hover:bg-[#1fa1a1] transition-all duration-200 shadow-xl shadow-[#23b5b5]/20 flex items-center gap-2 group"
            >
              <ShoppingBag className="w-4 h-4" />
              Add App to Shopify
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#widget-preview"
              className="px-6 py-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 font-medium text-sm transition-all"
            >
              See Live Widget Demo
            </a>
          </div>
        </section>

        {/* --- INTERACTIVE REVIEW WIDGET PREVIEW --- */}
        <section
          id="widget-preview"
          className="p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-2xl"
        >
          <div className="bg-[#0a1114] rounded-[22px] p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
              <div>
                <span className="text-xs text-[#23b5b5] font-semibold uppercase tracking-wider">
                  Storefront Widget Preview
                </span>
                <h3 className="text-xl font-bold text-white">
                  How Verdict Looks on Your Store
                </h3>
              </div>

              {/* Media Toggle Pills */}
              <div className="flex gap-2 p-1 rounded-lg bg-[#111a1e] border border-white/5 self-start sm:self-auto">
                <button
                  onClick={() => setActiveTab("photo")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "photo"
                      ? "bg-[#23b5b5] text-[#060a0c]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" /> Photo Review
                </button>
                <button
                  onClick={() => setActiveTab("video")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "video"
                      ? "bg-[#23b5b5] text-[#060a0c]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Video className="w-3.5 h-3.5" /> Video Review
                </button>
              </div>
            </div>

            {/* Simulated Review Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#0e171a] p-6 rounded-2xl border border-white/5">
              {/* Review Media Attachment Box */}
              <div className="md:col-span-5 h-56 rounded-xl bg-[#142125] border border-[#23b5b5]/20 relative overflow-hidden flex items-center justify-center">
                <div className="text-center p-4">
                  {activeTab === "photo" ? (
                    <div className="flex flex-col items-center">
                      <Camera className="w-10 h-10 text-[#23b5b5] mb-2" />
                      <span className="text-xs text-slate-300 font-medium">
                        Customer Photo Attached
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">
                        High-Res Product Showcase
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Video className="w-10 h-10 text-[#23b5b5] mb-2 animate-pulse" />
                      <span className="text-xs text-slate-300 font-medium">
                        UGC Video Review Playing
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">
                        0:24 • Verified Purchase Video
                      </span>
                    </div>
                  )}
                </div>

                <span className="absolute bottom-3 left-3 text-[10px] px-2 py-0.5 rounded bg-black/60 text-emerald-400 font-medium border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Buyer
                </span>
              </div>

              {/* Review Text Content */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#23b5b5] text-[#23b5b5]"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    2 hours ago
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">
                    "Exceeded all my expectations! Unbelievable quality."
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    The material feels premium and setup took less than two
                    minutes. Super impressed with how fast it arrived as well.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">
                    Sarah M. — Verified Customer
                  </span>
                  <div className="flex items-center gap-1 text-[#23b5b5]">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful (24)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Import Badges */}
            <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <span className="font-medium text-slate-300">
                Import reviews seamlessly from:
              </span>
              <div className="flex gap-3">
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px]">
                  Amazon
                </span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px]">
                  Flipkart
                </span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px]">
                  CSV / Shopify Apps
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* --- FEATURES LIST --- */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#23b5b5]">
              Everything Included
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Turn customer praise into sales velocity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureList.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#0a1215] border border-white/5 hover:border-[#23b5b5]/30 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#23b5b5]/10 flex items-center justify-center text-[#23b5b5] mb-5 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-[#23b5b5] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Integrated
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- BOTTOM CTA BANNER --- */}
        <section className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-[#0c1619] via-[#081012] to-[#060a0c] border border-[#23b5b5]/30 text-center flex flex-col items-center">
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#23b5b5] text-[#23b5b5]" />
            ))}
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to build buyer trust on Shopify?
          </h2>
          <p className="mt-3 text-slate-400 text-sm max-w-xl">
            Install Verdict on your store today and start collecting video,
            photo, and text reviews instantly.
          </p>

          <a
            href={DEPLOYED_SHOPIFY_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 px-8 py-4 rounded-xl bg-[#23b5b5] text-[#060a0c] font-bold text-sm hover:bg-[#1fa1a1] transition-all duration-200 shadow-xl shadow-[#23b5b5]/20 flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Get Verdict for Shopify
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>
      </div>
    </div>
  );
}
