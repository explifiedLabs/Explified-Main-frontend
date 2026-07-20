import React, { useEffect, useRef, useState } from "react";

/**
 * ORBIT DASH — React + Canvas mini-game
 * -----------------------------------------------------------
 * Third cartridge for the Explified /apps hub, built to match the
 * Neon Drift visual system (same fonts, same "phone frame" canvas
 * container, same menu/HUD/game-over overlay pattern) but with its
 * own mechanic and its own accent color so it reads as a distinct
 * cartridge on the grid.
 *
 * Mechanic: a marker sits fixed at the top of a two-ring orbit.
 * Blocks sweep in from the bottom, alternating which ring they
 * land on. Tap (or press Space) to swap the marker between the
 * inner and outer ring before a block completes its sweep. Survive
 * — score climbs continuously and jumps on every dodge, and the
 * sweep gets faster the longer you last.
 *
 * Notes:
 * - No arbitrary Tailwind bracket classes (this build has no JIT),
 *   so all exact colors/sizes are inline styles, same as NeonDrift.
 * - Canvas render loop writes the live score straight to a ref'd
 *   span to avoid a React re-render every frame.
 */

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;

const C = {
  bg: "#0a0d12",
  surface: "#151a24",
  surface2: "#1d2431",
  line: "#2a3446",
  text: "#eef2fb",
  muted: "#7c88a3",
  violet: "#b98bff",
  violetDim: "rgba(185,139,255,.28)",
  cyan: "#35e0e0",
  coral: "#ff5d5d",
  amber: "#ffb020",
};
const SANS =
  "'Space Grotesk',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
const MONO = "'Space Mono',ui-monospace,Menlo,monospace";

const store = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
};

export default function OrbitDash() {
  const canvasRef = useRef(null);
  const scoreRef = useRef(null);

  // ---- UI-facing React state ----
  const [screen, setScreen] = useState("menu"); // 'menu' | 'over'
  const [hudVisible, setHudVisible] = useState(false);
  const [best, setBest] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [finalBest, setFinalBest] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const [dodges, setDodges] = useState(0);

  // ---- Mutable game-engine refs (kept out of React render cycle) ----
  const gameState = useRef("menu"); // 'menu' | 'playing' | 'crashing' | 'over'
  const DPR = useRef(Math.min(window.devicePixelRatio || 1, 2.5));
  const dims = useRef({ W: 0, H: 0 });
  const geo = useRef({ cx: 0, cy: 0, rInner: 0, rOuter: 0 });
  const topAngle = -Math.PI / 2;

  const player = useRef({ ring: "outer", visualR: 0, targetR: 0 });
  const obstacle = useRef(null); // { ring, progress, duration, dir, resolved }
  const spawnTimer = useRef(0.6);
  const elapsed = useRef(0);
  const score = useRef(0);
  const dodgeCount = useRef(0);
  const bestRef = useRef(0);

  const particles = useRef([]);
  const shake = useRef(0);
  const crashTimer = useRef(0);
  const ringSpin = useRef(0);

  const rafId = useRef(null);
  const lastT = useRef(performance.now());
  const startGameHandler = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    bestRef.current = Number(store.get("orbitdash_best") || 0);
    setBest(bestRef.current);

    function computeGeo() {
      const { W, H } = dims.current;
      const cx = W / 2;
      const cy = H * 0.54;
      const rOuter = Math.min(W, H) * 0.27;
      const rInner = rOuter * 0.56;
      geo.current = { cx, cy, rInner, rOuter };
    }

    function resize() {
      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      DPR.current = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.round(w * DPR.current);
      canvas.height = Math.round(h * DPR.current);
      dims.current = { W: w, H: h };
      computeGeo();
      const target =
        player.current.ring === "outer"
          ? geo.current.rOuter
          : geo.current.rInner;
      player.current.visualR = target;
      player.current.targetR = target;
    }

    function reset() {
      player.current.ring = "outer";
      player.current.visualR = geo.current.rOuter;
      player.current.targetR = geo.current.rOuter;
      obstacle.current = null;
      spawnTimer.current = 0.7;
      elapsed.current = 0;
      score.current = 0;
      dodgeCount.current = 0;
      particles.current = [];
      shake.current = 0;
      crashTimer.current = 0;
    }

    function startGame() {
      setScreen(null);
      setHudVisible(true);
      reset();
      gameState.current = "playing";
    }
    startGameHandler.current = startGame;

    function endGame() {
      gameState.current = "over";
      setHudVisible(false);
      const s = Math.floor(score.current);
      setFinalScore(s);
      setDodges(dodgeCount.current);
      const nb = s > bestRef.current;
      if (nb) {
        bestRef.current = s;
        store.set("orbitdash_best", String(bestRef.current));
      }
      setFinalBest(bestRef.current);
      setBest(bestRef.current);
      setNewBest(nb);
      setScreen("over");
    }

    function swapRing() {
      if (gameState.current !== "playing") return;
      const { rInner, rOuter } = geo.current;
      if (player.current.ring === "outer") {
        player.current.ring = "inner";
        player.current.targetR = rInner;
      } else {
        player.current.ring = "outer";
        player.current.targetR = rOuter;
      }
    }

    function spawnObstacle() {
      const ring = Math.random() < 0.5 ? "inner" : "outer";
      const dir = Math.random() < 0.5 ? 1 : -1;
      const t = elapsed.current;
      const duration = clamp(1.55 - t * 0.018, 0.62, 1.55);
      obstacle.current = { ring, progress: 0, duration, dir, resolved: false };
    }

    function burst(x, y, color) {
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * TAU;
        const sp = 60 + Math.random() * 160;
        particles.current.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          color,
        });
      }
    }

    function update(dt) {
      ringSpin.current += dt * 0.25;

      if (gameState.current === "playing") {
        elapsed.current += dt;
        score.current += dt * 12;

        // smooth ring-swap motion
        player.current.visualR = lerp(
          player.current.visualR,
          player.current.targetR,
          clamp(dt * 14, 0, 1),
        );

        // spawn logic — one obstacle in flight at a time, gap shrinks with time
        if (!obstacle.current) {
          spawnTimer.current -= dt;
          if (spawnTimer.current <= 0) {
            spawnObstacle();
            const gap = clamp(1.05 - elapsed.current * 0.012, 0.42, 1.05);
            spawnTimer.current = gap;
          }
        } else {
          const o = obstacle.current;
          const prevProgress = o.progress;
          o.progress += dt / o.duration;

          if (prevProgress < 1 && o.progress >= 1 && !o.resolved) {
            o.resolved = true;
            if (o.ring === player.current.ring) {
              // collision
              gameState.current = "crashing";
              crashTimer.current = 0.5;
              shake.current = 1;
              const ang = topAngle;
              const r =
                o.ring === "outer" ? geo.current.rOuter : geo.current.rInner;
              burst(
                geo.current.cx + Math.cos(ang) * r,
                geo.current.cy + Math.sin(ang) * r,
                C.coral,
              );
            } else {
              dodgeCount.current += 1;
              score.current += 25;
            }
          }

          if (o.progress > 1.25) {
            obstacle.current = null;
            spawnTimer.current = clamp(
              1.05 - elapsed.current * 0.012,
              0.42,
              1.05,
            );
          }
        }

        if (scoreRef.current)
          scoreRef.current.textContent = Math.floor(score.current);
      }

      if (gameState.current === "crashing") {
        crashTimer.current -= dt;
        shake.current = Math.max(0, shake.current - dt * 2.2);
        if (crashTimer.current <= 0) endGame();
      }

      // particles always integrate so the burst finishes even after 'over'
      particles.current.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life -= dt * 1.6;
      });
      particles.current = particles.current.filter((p) => p.life > 0);
    }

    function drawDashedCircle(cx, cy, r, color, width, dashLen, offset, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.setLineDash([dashLen, dashLen * 1.4]);
      ctx.lineDashOffset = offset;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }

    function render() {
      const { W, H } = dims.current;
      const { cx, cy, rInner, rOuter } = geo.current;

      ctx.save();
      ctx.setTransform(DPR.current, 0, 0, DPR.current, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // shake offset
      let ox = 0,
        oy = 0;
      if (shake.current > 0) {
        ox = (Math.random() - 0.5) * 10 * shake.current;
        oy = (Math.random() - 0.5) * 10 * shake.current;
      }
      ctx.translate(ox, oy);

      // background
      const bg = ctx.createRadialGradient(
        cx,
        cy,
        10,
        cx,
        cy,
        Math.max(W, H) * 0.75,
      );
      bg.addColorStop(0, "#12182a");
      bg.addColorStop(1, "#05070a");
      ctx.fillStyle = bg;
      ctx.fillRect(-20, -20, W + 40, H + 40);

      // faint static starfield dots (deterministic-ish via sin)
      ctx.fillStyle = "rgba(255,255,255,.06)";
      for (let i = 0; i < 36; i++) {
        const sx = (Math.sin(i * 12.9898) * 0.5 + 0.5) * W;
        const sy = (Math.sin(i * 78.233 + 3) * 0.5 + 0.5) * H;
        ctx.fillRect(sx, sy, 1.6, 1.6);
      }

      // core glow
      const coreGrad = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        rInner * 0.55,
      );
      coreGrad.addColorStop(0, "rgba(185,139,255,.35)");
      coreGrad.addColorStop(1, "rgba(185,139,255,0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, rInner * 0.55, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "rgba(238,242,251,.9)";
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, TAU);
      ctx.fill();

      // rings
      drawDashedCircle(
        cx,
        cy,
        rInner,
        "#3a4560",
        2,
        7,
        ringSpin.current * 40,
        0.9,
      );
      drawDashedCircle(
        cx,
        cy,
        rOuter,
        "#3a4560",
        2,
        9,
        -ringSpin.current * 34,
        0.9,
      );
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = C.violet;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, rInner, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter, 0, TAU);
      ctx.stroke();
      ctx.restore();

      // obstacle
      if (obstacle.current && gameState.current !== "menu") {
        const o = obstacle.current;
        const spawnAngle = topAngle + Math.PI;
        const p = clamp(o.progress, 0, 1);
        const ang = spawnAngle + o.dir * p * Math.PI;
        const r = o.ring === "outer" ? rOuter : rInner;
        const bx = cx + Math.cos(ang) * r;
        const by = cy + Math.sin(ang) * r;
        const danger = o.progress > 0.78;
        const col = danger ? C.coral : C.cyan;

        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(ang + Math.PI / 2);
        ctx.shadowColor = col;
        ctx.shadowBlur = danger ? 20 : 12;
        ctx.fillStyle = col;
        const bw = 22,
          bh = 9;
        ctx.beginPath();
        ctx.moveTo(-bw / 2, -bh / 2);
        ctx.lineTo(bw / 2, -bh / 2);
        ctx.lineTo(bw / 2, bh / 2);
        ctx.lineTo(-bw / 2, bh / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // player marker (fixed at top, radius animates between rings)
      if (gameState.current !== "menu") {
        const pr = player.current.visualR;
        const px = cx + Math.cos(topAngle) * pr;
        const py = cy + Math.sin(topAngle) * pr;
        ctx.save();
        ctx.translate(px, py);
        ctx.shadowColor = C.violet;
        ctx.shadowBlur = 22;
        ctx.fillStyle = C.violet;
        ctx.beginPath();
        ctx.moveTo(0, -11);
        ctx.lineTo(9, 0);
        ctx.lineTo(0, 11);
        ctx.lineTo(-9, 0);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(6,10,16,.55)";
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, TAU);
        ctx.fill();
        ctx.restore();
      }

      // particles
      particles.current.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = clamp(p.life, 0, 1);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.6, 0, TAU);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();
    }

    function loop(t) {
      const dt = Math.min(0.033, (t - lastT.current) / 1000);
      lastT.current = t;
      update(dt);
      render();
      rafId.current = requestAnimationFrame(loop);
    }

    resize();
    render();
    rafId.current = requestAnimationFrame(loop);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const onPointerDown = (e) => {
      if (gameState.current === "playing") {
        e.preventDefault();
        swapRing();
      }
    };
    const onKeyDown = (e) => {
      if (
        e.code === "Space" ||
        e.code === "ArrowUp" ||
        e.code === "ArrowDown"
      ) {
        e.preventDefault();
        if (gameState.current === "playing") swapRing();
      }
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const labelStyle = {
    fontFamily: MONO,
    fontSize: 10,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: C.muted,
  };
  const primaryBtnStyle = {
    fontFamily: SANS,
    fontWeight: 600,
    fontSize: 18,
    color: "#1a0f2e",
    background: C.violet,
    border: "none",
    padding: "16px 46px",
    borderRadius: 15,
    boxShadow: "0 12px 34px -10px rgba(185,139,255,.6)",
    cursor: "pointer",
  };

  return (
    <div
      className="od-root w-full flex items-center justify-center overflow-hidden select-none touch-none"
      style={{ background: "#05070a", color: C.text, fontFamily: SANS }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        .od-root{ height: 100vh; height: 100dvh; min-height: 320px; }
      `}</style>

      <div
        className="relative w-full h-full overflow-hidden"
        style={{ maxWidth: 480, maxHeight: 920, background: C.bg }}
      >
        <canvas ref={canvasRef} className="block w-full h-full touch-none" />

        {/* HUD */}
        {hudVisible && (
          <div
            className="absolute top-0 left-0 right-0 flex justify-between items-start pointer-events-none"
            style={{ padding: "calc(14px + env(safe-area-inset-top)) 16px 0" }}
          >
            <div>
              <div style={labelStyle}>Score</div>
              <div
                style={{
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 24,
                  lineHeight: 1.05,
                }}
              >
                <span ref={scoreRef}>0</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={labelStyle}>Best</div>
              <div
                style={{
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 24,
                  lineHeight: 1.05,
                }}
              >
                {best}
              </div>
            </div>
          </div>
        )}

        {/* Menu overlay */}
        {screen === "menu" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{
              gap: 22,
              padding: 24,
              background: "rgba(6,9,14,.94)",
              zIndex: 5,
            }}
          >
            <h1
              style={{
                fontWeight: 700,
                fontSize: "clamp(40px,12vw,60px)",
                letterSpacing: "-0.03em",
                lineHeight: 0.92,
                margin: 0,
                backgroundImage:
                  "linear-gradient(115deg,#f3ecff,#b98bff 45%,#35e0e0 95%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              ORBIT
              <br />
              DASH
            </h1>
            <p
              style={{
                color: C.muted,
                fontSize: 15,
                lineHeight: 1.5,
                maxWidth: 280,
                margin: 0,
              }}
            >
              <b style={{ color: C.text, fontWeight: 600 }}>
                Tap to swap rings.
              </b>{" "}
              Blocks sweep in from below — land on the ring they're not hitting.
            </p>
            <button
              onClick={() =>
                startGameHandler.current && startGameHandler.current()
              }
              className="active:translate-y-px active:scale-95 transition-transform"
              style={primaryBtnStyle}
            >
              Launch
            </button>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 13,
                color: C.muted,
                letterSpacing: "0.04em",
              }}
            >
              {best > 0 && (
                <>
                  Best <b style={{ color: C.amber }}>{best}</b>
                </>
              )}
            </div>
            <div
              className="absolute left-0 right-0 text-center"
              style={{
                fontFamily: MONO,
                fontSize: 10,
                color: "#41506b",
                letterSpacing: "0.05em",
                bottom: "calc(14px + env(safe-area-inset-bottom))",
              }}
            >
              tap anywhere &nbsp;&middot;&nbsp; space / ↑ ↓ on desktop
            </div>
          </div>
        )}

        {/* Game over overlay */}
        {screen === "over" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{
              gap: 22,
              padding: 24,
              background: "rgba(6,9,14,.94)",
              zIndex: 5,
            }}
          >
            <h2
              style={{
                fontWeight: 700,
                fontSize: 34,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Collided
            </h2>
            {newBest && (
              <div
                style={{
                  color: C.amber,
                  fontFamily: MONO,
                  fontSize: 13,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                ★ New best ★
              </div>
            )}
            <div className="flex justify-center" style={{ gap: 38 }}>
              <div style={{ textAlign: "center", minWidth: 70 }}>
                <div style={labelStyle}>Score</div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 30,
                    marginTop: 2,
                  }}
                >
                  {finalScore}
                </div>
              </div>
              <div style={{ textAlign: "center", minWidth: 70 }}>
                <div style={labelStyle}>Dodges</div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 30,
                    marginTop: 2,
                  }}
                >
                  {dodges}
                </div>
              </div>
              <div style={{ textAlign: "center", minWidth: 70 }}>
                <div style={labelStyle}>Best</div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 30,
                    marginTop: 2,
                  }}
                >
                  {finalBest}
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                startGameHandler.current && startGameHandler.current()
              }
              className="active:translate-y-px active:scale-95 transition-transform"
              style={primaryBtnStyle}
            >
              Relaunch
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
