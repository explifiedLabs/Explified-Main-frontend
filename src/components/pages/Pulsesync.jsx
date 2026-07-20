import React, { useEffect, useRef, useState } from "react";

/**
 * PULSE SYNC — React + Canvas mini-game
 * -----------------------------------------------------------
 * Fourth cartridge for the Explified /apps hub. Same visual system
 * as Neon Drift / Orbit Dash (fonts, phone-frame canvas container,
 * menu → HUD → game-over overlay pattern) but a genre shift: this
 * one is a timing game, not a steering or dodging game.
 *
 * Mechanic: a fixed target ring sits at the center. A pulse ring
 * spawns big and shrinks toward it. Tap (or Space) the instant the
 * pulse lands on the target — Perfect/Good/Miss, like a one-note
 * rhythm-game beat. Three misses (early/late taps or pulses left
 * untapped) end the run. Combo raises your score multiplier, and
 * the pulse speeds up as your score climbs.
 *
 * Notes:
 * - No arbitrary Tailwind bracket classes (this build has no JIT);
 *   exact colors/sizes are inline styles, same as the other two.
 * - Score/lives/combo only change on discrete judge events (not
 *   every frame), so they live in React state directly — no need
 *   for the live-score-span-ref trick the continuous-score games use.
 */

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const TAU = Math.PI * 2;

const C = {
  bg: "#0a0d12",
  surface: "#151a24",
  surface2: "#1d2431",
  line: "#2a3446",
  text: "#eef2fb",
  muted: "#7c88a3",
  rose: "#ff6fae",
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

const MAX_LIVES = 3;
const PERFECT_WINDOW = 0.07;
const GOOD_WINDOW = 0.18;

export default function PulseSync() {
  const canvasRef = useRef(null);

  // ---- UI-facing React state (all discrete — updated on judge events) ----
  const [screen, setScreen] = useState("menu"); // 'menu' | 'over'
  const [hudVisible, setHudVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [combo, setCombo] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [finalBest, setFinalBest] = useState(0);
  const [finalCombo, setFinalCombo] = useState(0);
  const [newBest, setNewBest] = useState(false);

  // ---- Mutable game-engine refs ----
  const gameState = useRef("menu"); // 'menu' | 'playing' | 'over'
  const DPR = useRef(Math.min(window.devicePixelRatio || 1, 2.5));
  const dims = useRef({ W: 0, H: 0 });
  const geo = useRef({ cx: 0, cy: 0, rTarget: 0, rMax: 0 });

  const note = useRef(null); // { spawnTime, duration, judged }
  const spawnTimer = useRef(0.5);
  const elapsedTotal = useRef(0);
  const scoreVal = useRef(0);
  const livesVal = useRef(MAX_LIVES);
  const comboVal = useRef(0);
  const maxComboVal = useRef(0);
  const bestRef = useRef(0);

  const popup = useRef(null); // { text, color, life }
  const flash = useRef(0);
  const pulsePhase = useRef(0);

  const rafId = useRef(null);
  const lastT = useRef(performance.now());
  const startGameHandler = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    bestRef.current = Number(store.get("pulsesync_best") || 0);
    setBest(bestRef.current);

    function computeGeo() {
      const { W, H } = dims.current;
      const cx = W / 2;
      const cy = H * 0.52;
      const rMax = Math.min(W, H) * 0.42;
      const rTarget = Math.min(W, H) * 0.15;
      geo.current = { cx, cy, rTarget, rMax };
    }

    function resize() {
      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      DPR.current = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.round(w * DPR.current);
      canvas.height = Math.round(h * DPR.current);
      dims.current = { W: w, H: h };
      computeGeo();
    }

    function reset() {
      note.current = null;
      spawnTimer.current = 0.5;
      elapsedTotal.current = 0;
      scoreVal.current = 0;
      livesVal.current = MAX_LIVES;
      comboVal.current = 0;
      maxComboVal.current = 0;
      popup.current = null;
      flash.current = 0;
      setScore(0);
      setLives(MAX_LIVES);
      setCombo(0);
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
      const s = Math.floor(scoreVal.current);
      setFinalScore(s);
      setFinalCombo(maxComboVal.current);
      const nb = s > bestRef.current;
      if (nb) {
        bestRef.current = s;
        store.set("pulsesync_best", String(bestRef.current));
      }
      setFinalBest(bestRef.current);
      setBest(bestRef.current);
      setNewBest(nb);
      setScreen("over");
    }

    function currentDuration() {
      // pulse gets faster as score climbs, floors out so it stays playable
      return clamp(1.5 - scoreVal.current * 0.0025, 0.62, 1.5);
    }

    function spawnNote() {
      note.current = {
        spawnTime: elapsedTotal.current,
        duration: currentDuration(),
        judged: false,
      };
    }

    function showPopup(text, color) {
      popup.current = { text, color, life: 1 };
    }

    function resolveHit(kind) {
      note.current.judged = true;
      comboVal.current += 1;
      maxComboVal.current = Math.max(maxComboVal.current, comboVal.current);
      const mult = clamp(
        1 + Math.floor((comboVal.current - 1) / 5) * 0.5,
        1,
        3,
      );
      const gained = Math.round((kind === "perfect" ? 100 : 50) * mult);
      scoreVal.current += gained;
      setScore(scoreVal.current);
      setCombo(comboVal.current);
      showPopup(
        kind === "perfect" ? "PERFECT" : "GOOD",
        kind === "perfect" ? C.amber : C.cyan,
      );
      note.current = null;
      spawnTimer.current = clamp(0.75 - scoreVal.current * 0.001, 0.32, 0.75);
    }

    function resolveMiss() {
      if (note.current) note.current.judged = true;
      comboVal.current = 0;
      setCombo(0);
      livesVal.current -= 1;
      setLives(livesVal.current);
      showPopup("MISS", C.coral);
      flash.current = 1;
      note.current = null;
      spawnTimer.current = clamp(0.75 - scoreVal.current * 0.001, 0.32, 0.75);
      if (livesVal.current <= 0) endGame();
    }

    function tap() {
      if (gameState.current !== "playing") return;
      const n = note.current;
      if (!n || n.judged) return;
      const progress = (elapsedTotal.current - n.spawnTime) / n.duration;
      if (progress < 0.5) return; // too early to judge — ignore, no penalty
      const dist = Math.abs(progress - 1);
      if (dist <= PERFECT_WINDOW) resolveHit("perfect");
      else if (dist <= GOOD_WINDOW) resolveHit("good");
      else resolveMiss();
    }

    function update(dt) {
      pulsePhase.current += dt;

      if (gameState.current === "playing") {
        elapsedTotal.current += dt;

        if (!note.current) {
          spawnTimer.current -= dt;
          if (spawnTimer.current <= 0) spawnNote();
        } else {
          const n = note.current;
          const progress = (elapsedTotal.current - n.spawnTime) / n.duration;
          if (progress > 1.3 && !n.judged) resolveMiss();
        }
      }

      if (popup.current) {
        popup.current.life -= dt * 1.1;
        if (popup.current.life <= 0) popup.current = null;
      }
      flash.current = Math.max(0, flash.current - dt * 2.5);
    }

    function render() {
      const { W, H } = dims.current;
      const { cx, cy, rTarget, rMax } = geo.current;

      ctx.save();
      ctx.setTransform(DPR.current, 0, 0, DPR.current, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createRadialGradient(
        cx,
        cy,
        10,
        cx,
        cy,
        Math.max(W, H) * 0.75,
      );
      bg.addColorStop(0, "#1a1220");
      bg.addColorStop(1, "#05070a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      if (flash.current > 0) {
        ctx.fillStyle = `rgba(255,93,93,${flash.current * 0.22})`;
        ctx.fillRect(0, 0, W, H);
      }

      // faint static starfield
      ctx.fillStyle = "rgba(255,255,255,.06)";
      for (let i = 0; i < 30; i++) {
        const sx = (Math.sin(i * 12.9898) * 0.5 + 0.5) * W;
        const sy = (Math.sin(i * 78.233 + 3) * 0.5 + 0.5) * H;
        ctx.fillRect(sx, sy, 1.6, 1.6);
      }

      if (gameState.current !== "menu") {
        // target ring — gentle pulse so it doesn't read as static
        const pulseScale = 1 + Math.sin(pulsePhase.current * 3) * 0.02;
        ctx.save();
        ctx.shadowColor = C.rose;
        ctx.shadowBlur = 18;
        ctx.strokeStyle = C.rose;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(cx, cy, rTarget * pulseScale, 0, TAU);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = "rgba(255,111,174,.25)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.arc(cx, cy, rTarget * 1.35, 0, TAU);
        ctx.stroke();
        ctx.restore();

        // incoming pulse
        const n = note.current;
        if (n) {
          const progress = clamp(
            (elapsedTotal.current - n.spawnTime) / n.duration,
            0,
            1.3,
          );
          const r = rMax + (rTarget - rMax) * Math.min(progress, 1.15);
          const dist = Math.abs(progress - 1);
          let col = C.cyan;
          if (dist <= GOOD_WINDOW) col = C.amber;
          if (progress > 1.15) col = C.coral;

          ctx.save();
          ctx.shadowColor = col;
          ctx.shadowBlur = dist <= GOOD_WINDOW ? 22 : 10;
          ctx.strokeStyle = col;
          ctx.lineWidth = dist <= GOOD_WINDOW ? 5 : 3;
          ctx.globalAlpha = clamp(1.4 - progress * 0.5, 0.35, 1);
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(r, 2), 0, TAU);
          ctx.stroke();
          ctx.restore();
        }

        // judgement popup
        if (popup.current) {
          const p = popup.current;
          ctx.save();
          ctx.globalAlpha = clamp(p.life, 0, 1);
          ctx.fillStyle = p.color;
          ctx.font = `700 26px ${SANS}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 14;
          ctx.fillText(p.text, cx, cy - rTarget - 34 - (1 - p.life) * 22);
          ctx.restore();
        }
      }

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
      e.preventDefault();
      tap();
    };
    const onKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        tap();
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
    color: "#2e0f20",
    background: C.rose,
    border: "none",
    padding: "16px 46px",
    borderRadius: 15,
    boxShadow: "0 12px 34px -10px rgba(255,111,174,.6)",
    cursor: "pointer",
  };

  return (
    <div
      className="ps-root w-full flex items-center justify-center overflow-hidden select-none touch-none"
      style={{ background: "#05070a", color: C.text, fontFamily: SANS }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        .ps-root{ height: 100vh; height: 100dvh; min-height: 320px; }
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
                {score}
              </div>
              {combo > 1 && (
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    color: C.rose,
                    marginTop: 2,
                  }}
                >
                  {combo}x combo
                </div>
              )}
            </div>
            <div className="flex flex-col items-end" style={{ gap: 6 }}>
              <div style={{ display: "flex", gap: 5 }}>
                {Array.from({ length: MAX_LIVES }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 99,
                      background: i < lives ? C.rose : "rgba(255,255,255,.12)",
                      boxShadow:
                        i < lives ? "0 0 8px rgba(255,111,174,.7)" : "none",
                    }}
                  />
                ))}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={labelStyle}>Best</div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 20,
                    lineHeight: 1.05,
                  }}
                >
                  {best}
                </div>
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
                  "linear-gradient(115deg,#ffe8f3,#ff6fae 45%,#ffb020 95%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              PULSE
              <br />
              SYNC
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
              <b style={{ color: C.text, fontWeight: 600 }}>Tap on the beat.</b>{" "}
              The ring shrinks in — catch it right on the target. Three misses
              and it's over.
            </p>
            <button
              onClick={() =>
                startGameHandler.current && startGameHandler.current()
              }
              className="active:translate-y-px active:scale-95 transition-transform"
              style={primaryBtnStyle}
            >
              Start
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
              tap anywhere &nbsp;&middot;&nbsp; space on desktop
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
              Out of sync
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
                <div style={labelStyle}>Best combo</div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 30,
                    marginTop: 2,
                  }}
                >
                  {finalCombo}
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
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
