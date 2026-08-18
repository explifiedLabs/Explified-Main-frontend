import React from "react";
import {
  ExternalLink,
  TrendingUp,
  Clock,
  BarChart2,
  Layers,
  Zap,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function CardlyticsLanding() {
  // Configurable URL for your deployed Trello Power-Up
  const DEPLOYED_POWER_UP_URL =
    "https://trello.com/power-ups/69345803ec5875c4f362fa5e";

  return (
    <div className="relative min-h-screen bg-[#080d0f] text-[#e2e8f0] font-sans selection:bg-[#23b5b5] selection:text-black pt-24 pb-20">
      {/* Background Ambient Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#23b5b5]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 space-y-24">
        {/* --- HERO SECTION --- */}
        <section className="text-center pt-8 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#23b5b5]/10 border border-[#23b5b5]/30 text-[#23b5b5] text-xs font-semibold tracking-wide uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#23b5b5] animate-ping" />
            Trello Power-Up
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Track, Analyze &amp; Visualize Your Trello Boards with{" "}
            <span className="text-[#23b5b5]">Cardlytics</span>
          </h1>

          <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
            Transform your Trello boards into a live analytics hub. Monitor team
            workloads, highlight bottlenecks, and display instant statistic
            cards right inside your workflow.
          </p>

          {/* CTA Link Button */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <a
              href={DEPLOYED_POWER_UP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-[#23b5b5] text-[#080d0f] font-bold text-sm hover:bg-[#1fa1a1] transition-all duration-200 shadow-lg shadow-[#23b5b5]/20 flex items-center gap-2 group"
            >
              Add Power-Up to Trello
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href="#overview"
              className="px-6 py-3.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 font-medium text-sm transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* --- LIVE STATS OVERVIEW GRAPHIC --- */}
        <section
          id="overview"
          className="p-1 rounded-2xl bg-[#0f171a] border border-white/10 shadow-2xl"
        >
          <div className="rounded-xl bg-[#0b1113] p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Live Board Dashboard
                </h3>
                <p className="text-xs text-slate-400">
                  Cardlytics auto-syncing widget
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                Active Board Connection
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-[#121c20] border border-white/5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Cycle Time Avg</span>
                  <Clock className="w-4 h-4 text-[#23b5b5]" />
                </div>
                <div className="text-2xl font-bold text-white">2.4 Days</div>
                <span className="text-[11px] text-emerald-400 font-medium">
                  ↓ 14% improvement
                </span>
              </div>

              <div className="p-5 rounded-xl bg-[#121c20] border border-white/5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Detected Bottlenecks</span>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  1 Card Stalled
                </div>
                <span className="text-[11px] text-amber-400 font-medium">
                  Needs review in QA
                </span>
              </div>

              <div className="p-5 rounded-xl bg-[#121c20] border border-white/5">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Completion Rate</span>
                  <TrendingUp className="w-4 h-4 text-[#23b5b5]" />
                </div>
                <div className="text-2xl font-bold text-white">94.2%</div>
                <span className="text-[11px] text-emerald-400 font-medium">
                  On track for sprint
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* --- KEY VALUE PROPOSITIONS --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#0f171a] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#23b5b5]/10 flex items-center justify-center text-[#23b5b5] mb-4">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Statistic Cards
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Embed live visual counters and dynamic metrics right alongside
                your lists to measure performance instantly.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0f171a] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#23b5b5]/10 flex items-center justify-center text-[#23b5b5] mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Identify Bottlenecks
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automatically highlight stale cards, stuck tasks, and overloaded
                columns before project delivery delays happen.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0f171a] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#23b5b5]/10 flex items-center justify-center text-[#23b5b5] mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Workload Balance
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Get zero-friction visibility into team capacity without
                requiring manual search or external tracking software.
              </p>
            </div>
          </div>
        </section>

        {/* --- BOTTOM CTA --- */}
        <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#0f171a] via-[#0b1113] to-[#080d0f] border border-[#23b5b5]/20 text-center flex flex-col items-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Ready to upgrade your Trello workflow?
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl">
            Add Cardlytics directly to your board and gain actionable insights
            in seconds.
          </p>

          <a
            href={DEPLOYED_POWER_UP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 px-8 py-3.5 rounded-xl bg-[#23b5b5] text-[#080d0f] font-bold text-sm hover:bg-[#1fa1a1] transition-all duration-200 shadow-xl shadow-[#23b5b5]/20 flex items-center gap-2"
          >
            Add Power-Up
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>
      </div>
    </div>
  );
}
