import React, { useState } from "react";
import {
  ExternalLink,
  Kanban,
  LayoutDashboard,
  FileText,
  Filter,
  Download,
  ListTodo,
  PieChart,
  CheckCircle2,
  AlertCircle,
  Clock,
  PlusCircle,
  BarChart3,
  Layers,
  Zap,
} from "lucide-react";

export default function SummifyLandingNew() {
  const TRELLO_POWERUP_URL = "#"; // Replace with actual Power-Up URL
  const [activeTab, setActiveTab] = useState("dashboard");

  const featureList = [
    {
      title: "The Big Picture, Instantly",
      description:
        "High-visibility stat widgets track Total Tasks, Completed Items, and tasks Running Late.",
      icon: PieChart,
    },
    {
      title: "Intelligent List Summaries",
      description:
        "Analyze every list with breakdowns of total, completed, and pending tasks to spot bottlenecks.",
      icon: ListTodo,
    },
    {
      title: "Detailed Task Analysis",
      description:
        "View an exhaustive table showing Task Name, List, Members, Due Dates, and Labels.",
      icon: BarChart3,
    },
    {
      title: "Powerful Filtering",
      description:
        "Slice and dice data by Status, Member, Custom Label, or Due Date in seconds.",
      icon: Filter,
    },
    {
      title: "One-Click PDF Reporting",
      description:
        "Generate professional PDF reports based on filtered views to share with stakeholders.",
      icon: Download,
    },
    {
      title: "Zero Configuration",
      description:
        "Designed to look like a native Atlassian tool. Just install and open — it reads data instantly.",
      icon: Zap,
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
            Turn Trello Chaos into{" "}
            <span className="text-[#23b5b5]">Clear Insights</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            Stop digging through endless lists of cards. Summify instantly
            transforms your scattered Trello board into a single, professional
            dashboard for immediate visibility into project health and
            workloads.
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
              Explore the Dashboard
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
                  Live Interface Preview
                </span>
                <h3 className="text-xl font-bold text-white">
                  Compact &amp; Professional UI
                </h3>
              </div>

              {/* Media Toggle Pills */}
              <div className="flex gap-2 p-1 rounded-lg bg-[#111a1e] border border-white/5 self-start sm:self-auto">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "dashboard"
                      ? "bg-[#23b5b5] text-[#060a0c]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Insights
                </button>
                <button
                  onClick={() => setActiveTab("report")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "report"
                      ? "bg-[#23b5b5] text-[#060a0c]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> PDF Export
                </button>
              </div>
            </div>

            {/* Simulated Summify Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-[#0e171a] p-6 rounded-2xl border border-white/5">
              {/* Left Column - Key Metrics & Summaries */}
              <div className="lg:col-span-4 space-y-4">
                {activeTab === "dashboard" ? (
                  <>
                    {/* Stat Widgets */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#142125] border border-white/5 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 mb-1">
                          Total Tasks
                        </p>
                        <p className="text-2xl font-bold text-white">124</p>
                      </div>
                      <div className="bg-[#142125] border border-white/5 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 mb-1">Completed</p>
                        <p className="text-2xl font-bold text-[#23b5b5]">82</p>
                      </div>
                      <div className="col-span-2 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs text-red-400/80 mb-1 font-medium">
                            Running Late
                          </p>
                          <p className="text-2xl font-bold text-red-400">7</p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-red-500/40" />
                      </div>
                    </div>

                    {/* List Summaries */}
                    <div className="bg-[#142125] border border-white/5 p-4 rounded-xl">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" /> List Breakdown
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">To Do</span>
                          <span className="text-slate-200 font-medium">
                            24 Pending
                          </span>
                        </div>
                        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-slate-500 h-full w-[40%]"></div>
                        </div>

                        <div className="flex justify-between items-center text-sm pt-2">
                          <span className="text-slate-400">In Progress</span>
                          <span className="text-slate-200 font-medium">
                            11 Pending
                          </span>
                        </div>
                        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#23b5b5] h-full w-[65%]"></div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full bg-[#142125] border border-white/5 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-[#23b5b5]/10 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-[#23b5b5]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">
                        Weekly Status.pdf
                      </h4>
                      <p className="text-xs text-slate-400">
                        Contains 42 filtered items
                      </p>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-[#23b5b5] text-[#060a0c] text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-[#1fa1a1] transition-colors">
                      <Download className="w-3.5 h-3.5" /> Download Report
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column - Detailed Analysis Table */}
              <div className="lg:col-span-8 bg-[#111a1e] rounded-xl border border-white/5 overflow-hidden flex flex-col h-full">
                {/* Toolbar */}
                <div className="p-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 bg-black/20">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#23b5b5]" />
                    Detailed Analysis
                  </h4>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-slate-400">
                      Status: All
                    </span>
                    <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-slate-400">
                      Member: You
                    </span>
                  </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-[#0a1114]/50">
                  <div className="col-span-5">Task Name</div>
                  <div className="col-span-3">List</div>
                  <div className="col-span-4 text-right">Status</div>
                </div>

                {/* Table Rows */}
                <div className="flex-1 p-2 space-y-1">
                  {[
                    {
                      task: "Update Q3 Financials",
                      list: "Review",
                      status: "DONE",
                      color:
                        "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
                    },
                    {
                      task: "Draft Marketing Copy",
                      list: "In Progress",
                      status: "PENDING",
                      color:
                        "text-amber-400 bg-amber-400/10 border-amber-400/20",
                    },
                    {
                      task: "Server Migration Prep",
                      list: "To Do",
                      status: "OVERDUE",
                      color: "text-red-400 bg-red-400/10 border-red-400/20",
                    },
                    {
                      task: "Client Onboarding",
                      list: "In Progress",
                      status: "PENDING",
                      color:
                        "text-amber-400 bg-amber-400/10 border-amber-400/20",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-4 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors items-center"
                    >
                      <div className="col-span-5 text-sm text-slate-200 font-medium truncate">
                        {row.task}
                      </div>
                      <div className="col-span-3 text-xs text-slate-400 truncate">
                        {row.list}
                      </div>
                      <div className="col-span-4 text-right flex justify-end">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold border ${row.color}`}
                        >
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS --- */}
        <section className="border-t border-white/10 pt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#23b5b5]">
              Seamless Integration
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Insight in 4 Simple Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "1",
                title: "Add Power-Up",
                desc: "Install Summify natively from the Trello directory.",
                icon: PlusCircle,
              },
              {
                step: "2",
                title: "Open Dashboard",
                desc: "Zero config required. Board data is read instantly.",
                icon: LayoutDashboard,
              },
              {
                step: "3",
                title: "Filter Data",
                desc: "Slice by status, member, label, or due date.",
                icon: Filter,
              },
              {
                step: "4",
                title: "Export to PDF",
                desc: "Share professional reports with one click.",
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
              Feature Packed
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Everything you need for project tracking
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
            <PieChart className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to master your Trello boards?
          </h2>
          <p className="mt-3 text-slate-400 text-sm max-w-xl">
            Add Summify today for a high-level overview without losing the
            granular details. Perfect for managers and teams.
          </p>

          <a
            href={TRELLO_POWERUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 px-8 py-4 rounded-xl bg-[#23b5b5] text-[#060a0c] font-bold text-sm hover:bg-[#1fa1a1] transition-all duration-200 shadow-xl shadow-[#23b5b5]/20 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Summify to Trello
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>
      </div>
    </div>
  );
}
