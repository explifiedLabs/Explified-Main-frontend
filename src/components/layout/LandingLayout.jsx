import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

/* ─── Layered background scenography ──────────────────────────────────
   Fixed behind every page — three drifting teal aurora blobs, a faint
   grid that fades at the top edge, and a subtle film-grain overlay.
   Matches the Explified redesign HTML exactly.
   ------------------------------------------------------------------ */
const Scenography = () => (
  <>
    {/* CSS keyframes for the slow-drifting aurora blobs */}
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @keyframes aurora-drift-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50%      { transform: translate(60px, 40px) scale(1.12); }
          }
          @keyframes aurora-drift-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50%      { transform: translate(-50px, 60px) scale(1.15); }
          }
          @media (prefers-reduced-motion: reduce) {
            .aurora-blob { animation: none !important; }
          }
        `,
      }}
    />

    {/* Aurora blobs — z-index below all content */}
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      <span
        className="aurora-blob absolute rounded-full opacity-50"
        style={{
          top: "-180px",
          left: "-120px",
          width: "620px",
          height: "620px",
          background:
            "radial-gradient(circle, rgba(35,181,181,0.28), transparent 65%)",
          filter: "blur(90px)",
          animation: "aurora-drift-1 20s ease-in-out infinite",
        }}
      />
      <span
        className="aurora-blob absolute rounded-full opacity-50"
        style={{
          top: "8%",
          right: "-140px",
          width: "520px",
          height: "520px",
          background:
            "radial-gradient(circle, rgba(124,140,248,0.18), transparent 65%)",
          filter: "blur(90px)",
          animation: "aurora-drift-2 24s ease-in-out infinite",
        }}
      />
      <span
        className="aurora-blob absolute rounded-full opacity-50"
        style={{
          bottom: "-260px",
          left: "30%",
          width: "700px",
          height: "700px",
          background:
            "radial-gradient(circle, rgba(35,181,181,0.14), transparent 65%)",
          filter: "blur(90px)",
          animation: "aurora-drift-1 28s ease-in-out infinite reverse",
        }}
      />
    </div>

    {/* Faint grid — very subtle, fades toward the bottom */}
    <div
      className="fixed inset-0 -z-10 pointer-events-none opacity-40"
      style={{
        backgroundImage:
          "linear-gradient(rgba(120,200,200,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(120,200,200,0.035) 1px, transparent 1px)",
        backgroundSize: "70px 70px",
        maskImage:
          "radial-gradient(ellipse 90% 60% at 50% 0%, black 30%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 60% at 50% 0%, black 30%, transparent 75%)",
      }}
    />

    {/* Film grain — tiny inline SVG turbulence, blended in */}
    <div
      className="fixed inset-0 -z-10 pointer-events-none opacity-[0.04] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  </>
);

export default function LandingLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen overflow-x-hidden selection:bg-primary selection:text-black bg-[#050607] text-white"
      style={{ isolation: "isolate" }}
    >
      {/* Layered background — sits behind all sections */}
      <Scenography />

      <div className="relative">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}