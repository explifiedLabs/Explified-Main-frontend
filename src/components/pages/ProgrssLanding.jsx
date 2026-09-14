import React, { useState } from "react";
import {
  ExternalLink,
  Clock,
  Kanban,
  Hourglass,
  AlertCircle,
  DollarSign,
  Calendar,
  Lock,
  BarChart,
  CheckCircle2,
  Play,
  Square,
  ShieldCheck,
  PlusCircle,
  FileText,
  Activity,
} from "lucide-react";

export default function ProgrssLanding() {
  const TRELLO_POWERUP_URL = "#"; // Replace with actual Power-Up URL
  const [activeTab, setActiveTab] = useState("tracker");

  const featureList = [
    {
      title: "Flexible Time Units",
      description:
        "Track and estimate your work in Hours, Days, Weeks, or Months directly inside your cards.",
      icon: Hourglass,
    },
    {
      title: "Overtime Warnings",
      description:
        "Get flagged the moment a card runs past its estimate so you can stay on schedule.",
      icon: AlertCircle,
    },
    {
      title: "Automated Billing",
      description:
        "Assign hourly rates. Progress calculates billable amounts automatically per card.",
      icon: DollarSign,
    },
    {
      title: "Deadline Achievement",
      description:
        "Track how often you're hitting due dates with weekly visual performance reports.",
      icon: Calendar,
    },
    {
      title: "Secure Access Code",
      description:
        "Protect sensitive billing information. Only authorized members can update hourly rates.",
      icon: Lock,
    },
    {
      title: "Track, Visualize, Export",
      description:
        "Switch between Weekly and Monthly views, see productive days, and export to CSV.",
      icon: BarChart,
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
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#23b5b5]/10 border border-[#23b5b5]/30 text-[#23b5b5] text-xs font-semibold uppercase tracking-wider mb-6">
            <div className="flex items-center gap-1">
              <Kanban className="w-3.5 h-3.5" />
            </div>
            <span>Trello Power-Up</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Real-Time Time Tracking &amp; Billing for{" "}
            <span className="text-[#23b5b5]">Every Trello Card</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            Stop guessing how much time your tasks take. Progress reads your
            cards and turns tracked time into clear numbers — hours worked,
            deadlines hit, and money owed — ready the moment you need them.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <a
              href={TRELLO_POWERUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-[#23b5b5] text-[#060a0c] font-bold text-sm hover:bg-[#1fa1a1] transition-all duration-200 shadow-xl shadow-[#23b5b5]/20 flex items-center gap-2 group"
            >
              <PlusCircle className="w-4 h-4" />
              Add Power-Up
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#widget-preview"
              className="px-6 py-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 font-medium text-sm transition-all"
            >
              See Live Integration
            </a>
          </div>
        </section>

        {/* --- INTERACTIVE WIDGET PREVIEW --- */}
        <section
          id="widget-preview"
          className="p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-2xl"
        >
          <div className="bg-[#0a1114] rounded-[22px] p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
              <div>
                <span className="text-xs text-[#23b5b5] font-semibold uppercase tracking-wider">
                  Card Integration Preview
                </span>
                <h3 className="text-xl font-bold text-white">
                  Built Right Into Your Workflow
                </h3>
              </div>

              {/* Media Toggle Pills */}
              <div className="flex gap-2 p-1 rounded-lg bg-[#111a1e] border border-white/5 self-start sm:self-auto">
                <button
                  onClick={() => setActiveTab("tracker")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "tracker"
                      ? "bg-[#23b5b5] text-[#060a0c]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" /> Time Tracker
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "billing"
                      ? "bg-[#23b5b5] text-[#060a0c]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" /> Secure Billing
                </button>
              </div>
            </div>

            {/* Simulated Trello Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#0e171a] p-6 rounded-2xl border border-white/5">
              {/* Card Main Content */}
              <div className="md:col-span-5 h-56 rounded-xl bg-[#142125] border border-[#23b5b5]/20 relative overflow-hidden p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-2 rounded-full bg-blue-500"></span>
                    <span className="w-8 h-2 rounded-full bg-orange-500"></span>
                  </div>
                  <h4 className="text-lg font-bold text-white leading-tight">
                    Design Landing Page Concept
                  </h4>
                  <p className="text-xs text-slate-400 mt-2">
                    in list <strong>In Progress</strong>
                  </p>
                </div>

                <div className="mt-4">
                  {activeTab === "tracker" && (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium border border-amber-500/20">
                      <AlertCircle className="w-3 h-3" /> Nearing Estimate
                    </span>
                  )}
                  {activeTab === "billing" && (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> Access Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Power-Up Section */}
              <div className="md:col-span-7 space-y-4 bg-[#111a1e] p-5 rounded-xl border border-white/5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#23b5b5]" />
                    Progress Power-Up
                  </h4>
                </div>

                {activeTab === "tracker" ? (
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">
                          Time Tracked
                        </p>
                        <p className="text-2xl font-mono text-white">
                          03:45
                          <span className="text-sm text-slate-500">.12</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 mb-1">Estimate</p>
                        <p className="text-sm font-semibold text-slate-200">
                          4.0 Hours
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-black/50 rounded-full h-2 mt-2 overflow-hidden">
                      <div className="bg-[#23b5b5] h-2 rounded-full w-[94%]"></div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 border border-red-500/20">
                        <Square className="w-3 h-3 fill-current" /> Stop Timer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                          Hourly Rate
                        </p>
                        <p className="text-lg font-bold text-white">$45.00</p>
                      </div>
                      <div className="p-3 rounded-lg bg-black/30 border border-[#23b5b5]/20">
                        <p className="text-[10px] text-[#23b5b5] uppercase tracking-wider mb-1">
                          Total Owed
                        </p>
                        <p className="text-lg font-bold text-[#23b5b5]">
                          $168.75
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 p-2.5 rounded-lg border border-white/5">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Rates protected by optional access code.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS --- */}
        <section className="border-t border-white/10 pt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#23b5b5]">
              Simple Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              How to Use Progress
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "1",
                title: "Add Power-Up",
                desc: "Install Progress from the Trello Power-Ups menu.",
                icon: PlusCircle,
              },
              {
                step: "2",
                title: "Set Estimate",
                desc: "Open a card, select Hours, Days, Weeks, or Months.",
                icon: Clock,
              },
              {
                step: "3",
                title: "Track Time",
                desc: "Hit Start. The timer logs automatically when you stop.",
                icon: Play,
              },
              {
                step: "4",
                title: "Review & Bill",
                desc: "Set rates, check reports, and see your total payable.",
                icon: FileText,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0a1215] border border-white/5 relative"
              >
                <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#23b5b5] text-[#060a0c] flex items-center justify-center font-bold text-sm border-4 border-[#060a0c]">
                  {item.step}
                </span>
                <item.icon className="w-6 h-6 text-[#23b5b5] mb-3 mt-2" />
                <h4 className="text-sm font-bold text-white mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- FEATURES LIST --- */}
        <section className="space-y-12 pt-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#23b5b5]">
              Everything Included
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Transform tracked time into clear numbers
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
                    <CheckCircle2 className="w-3.5 h-3.5" /> Built-in
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- BOTTOM CTA BANNER --- */}
        <section className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-[#0c1619] via-[#081012] to-[#060a0c] border border-[#23b5b5]/30 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 text-[#23b5b5]">
            <Kanban className="w-6 h-6" />
            <Clock className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to track time effectively?
          </h2>
          <p className="mt-3 text-slate-400 text-sm max-w-xl">
            Add Progress to your Trello boards today to monitor estimates,
            visualize productivity, and automate your billing process.
          </p>

          <a
            href={TRELLO_POWERUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 px-8 py-4 rounded-xl bg-[#23b5b5] text-[#060a0c] font-bold text-sm hover:bg-[#1fa1a1] transition-all duration-200 shadow-xl shadow-[#23b5b5]/20 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Progress to Trello
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>
      </div>
    </div>
  );
}
