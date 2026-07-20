import { useNavigate } from "react-router";
import { Gamepad2, Hand, ArrowUpRight, Sparkles } from "lucide-react";

/**
 * GamesApp — Explified / Apps hub
 * ------------------------------------------------------------------
 * Lives at explified.com/apps. Shows every mini-app as a "cartridge"
 * tile; tapping one routes straight to that app's own page:
 *
 *   /apps               -> this hub (GamesApp)
 *   /apps/neon-drift     -> NeonDrift.jsx
 *   /apps/palm-reader    -> PalmReader.jsx
 *
 * Add a new app by adding one entry to APPS below — the grid and the
 * card markup are fully data-driven, nothing else needs to change.
 * Assumes the page header/nav is rendered by the parent layout
 * (LandingLayout) and is fixed/sticky — pt-28/pt-36 below exists to
 * clear it, adjust if your header height differs.
 * ------------------------------------------------------------------
 */

const APPS = [
  {
    id: "neon-drift",
    path: "/apps/neon-drift",
    eyebrow: "Arcade · Racer",
    name: "Neon Drift",
    tagline: "Drag to steer. Dodge the traffic — it comes faster the further you get.",
    meta: "60s reflex run",
    icon: Gamepad2,
    accent: "#37f0a0",
    accentSoft: "rgba(55,240,160,.14)",
    ring: "rgba(55,240,160,.35)",
  },
  {
    id: "palm-reader",
    path: "/apps/palm-reader",
    eyebrow: "Oracle · Vision",
    name: "Palm Reader",
    tagline: "Upload your palm. A star-chart reading of your lines, mounts and marks.",
    meta: "BYOK · vision reading",
    icon: Hand,
    accent: "#E6B667",
    accentSoft: "rgba(230,182,103,.14)",
    ring: "rgba(230,182,103,.35)",
  },
];

export default function GamesApp() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div className="mx-auto max-w-5xl px-5 pt-28 pb-24 sm:pt-32">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_theme(colors.emerald.400)]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-400">
            Explified · Apps
          </span>
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-center text-4xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl">
          Pick something to <span className="text-amber-300">play</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-center text-base leading-relaxed text-slate-400">
          Small, self-contained experiments — a game, a reading, whatever's next.
          Tap a cartridge to launch it.
        </p>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {APPS.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => navigate(app.path)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition-all duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = app.ring)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                {/* Marquee */}
                <div
                  className="relative flex h-32 items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${app.accentSoft}, rgba(0,0,0,0) 70%)` }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <Icon
                    strokeWidth={1.4}
                    size={64}
                    className="relative z-10 transition-transform duration-200 group-hover:scale-110"
                    style={{ color: app.accent }}
                  />
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span
                    className="font-mono text-[10.5px] uppercase tracking-[0.18em]"
                    style={{ color: app.accent }}
                  >
                    {app.eyebrow}
                  </span>
                  <h2 className="text-xl font-bold tracking-tight text-white">{app.name}</h2>
                  <p className="flex-1 text-sm leading-relaxed text-slate-400">{app.tagline}</p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-wide text-slate-500">
                      {app.meta}
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-black transition-transform duration-200 group-hover:translate-x-0.5"
                      style={{ background: app.accent }}
                    >
                      Play
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Coming soon */}
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.015] px-5 py-8 text-center text-slate-500">
            <Sparkles size={22} className="opacity-50" />
            <b className="text-sm font-semibold text-slate-400">More on the way</b>
            <span className="max-w-[26ch] text-xs leading-relaxed">
              New apps land here as they ship — no need to hunt for a link.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}