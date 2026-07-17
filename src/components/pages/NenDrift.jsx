import React, { useEffect, useRef, useState } from "react";

/**
 * NEON DRIFT — React + Tailwind conversion
 * -----------------------------------------------------------
 * Original: single-file HTML/Canvas game.
 * This version keeps the exact same game engine (canvas rendering,
 * physics, spawning, admin panel, localStorage best-score/billing),
 * but rebuilds the DOM/CSS layer with React state + Tailwind classes.
 *
 * Notes:
 * - The canvas render loop still talks to the DOM directly for the
 *   live score number (to avoid a React re-render 60x/sec) via a ref.
 * - Google Fonts (Space Grotesk / Space Mono) are pulled in with a
 *   <style> @import so this file works as a drop-in component. If you
 *   already load fonts globally, feel free to delete that block and
 *   add the <link> tags to your index.html instead.
 */

const ADMIN_PASSCODE = "explified";
const CAR_COLORS = ["#ff5d5d", "#ffb020", "#c78bff", "#5db8ff", "#ff8fce"];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// Design tokens — this environment's Tailwind build only ships the
// predefined utility classes (no JIT compiler), so arbitrary bracket
// values like `bg-[#0a0d12]` or `text-[30px]` are silently dropped.
// Everything custom (exact neon colors, exact px sizes, gradients) is
// applied via inline style objects instead; Tailwind is only used for
// plain structural classes (flex, absolute, gap-*, p-*, etc).
const C = {
  bg: "#0a0d12",
  surface: "#151a24",
  surface2: "#1d2431",
  line: "#2a3446",
  text: "#eef2fb",
  muted: "#7c88a3",
  mint: "#37f0a0",
  cyan: "#35e0e0",
  coral: "#ff5d5d",
  amber: "#ffb020",
};
const SANS = "'Space Grotesk',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
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

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCar(ctx, x, y, w, h, color, isPlayer) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = isPlayer ? 22 : 12;
  ctx.fillStyle = color;
  roundRect(ctx, x, y, w, h, w * 0.24);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(6,10,16,.55)";
  roundRect(ctx, x + w * 0.16, y + (isPlayer ? h * 0.16 : h * 0.5), w * 0.68, h * 0.26, w * 0.12);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.14)";
  roundRect(ctx, x + w * 0.16, y + h * 0.5, w * 0.68, h * 0.2, w * 0.1);
  ctx.fill();
  ctx.fillStyle = isPlayer ? "rgba(255,255,255,.9)" : "rgba(255,220,160,.9)";
  const ly = isPlayer ? y + 3 : y + h - 6;
  ctx.fillRect(x + w * 0.14, ly, w * 0.16, 4);
  ctx.fillRect(x + w * 0.7, ly, w * 0.16, 4);
  ctx.restore();
}

export default function NeonDrift() {
  const canvasRef = useRef(null);
  const scoreRef = useRef(null);
  const passInputRef = useRef(null);

  // ---- UI-facing React state ----
  const [screen, setScreen] = useState("menu"); // 'menu' | 'over'
  const [hudVisible, setHudVisible] = useState(false);
  const [muted, setMuted] = useState(false);
  const [best, setBest] = useState(0);
  const [finalDist, setFinalDist] = useState(0);
  const [finalBest, setFinalBest] = useState(0);
  const [newBest, setNewBest] = useState(false);

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminView, setAdminView] = useState("gate"); // 'gate' | 'panel'
  const [passValue, setPassValue] = useState("");
  const [passErr, setPassErr] = useState("");
  const [instName, setInstName] = useState("Hansraj Complex Fun Zone");
  const [billingActive, setBillingActive] = useState(false);
  const [pubLive, setPubLive] = useState(true);
  const [toast, setToast] = useState({ show: false, msg: "" });

  // ---- Mutable game-engine refs (kept out of React render cycle) ----
  const gameState = useRef("menu"); // 'menu' | 'playing' | 'crashing' | 'over'
  const mutedRef = useRef(false);
  const DPR = useRef(Math.min(window.devicePixelRatio || 1, 2.5));
  const dims = useRef({ W: 0, H: 0 });
  const road = useRef({ x: 0, w: 0 });
  const player = useRef({ x: 0, y: 0, tx: 0, w: 44, h: 74 });
  const obstacles = useRef([]);
  const particles = useRef([]);
  const worldSpeed = useRef(0);
  const distance = useRef(0);
  const dashOffset = useRef(0);
  const spawnTimer = useRef(0);
  const shake = useRef(0);
  const crashTimer = useRef(0);
  const keys = useRef({ left: false, right: false });
  const dragging = useRef(false);
  const ac = useRef(null);
  const toastTimer = useRef(null);
  const pressTimer = useRef(null);
  const bestRef = useRef(0);
  const rafId = useRef(null);
  const lastT = useRef(performance.now());

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast({ show: true, msg });
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    bestRef.current = Number(store.get("neondrift_best") || 0);
    setBest(bestRef.current);

    function computeRoad() {
      const { W } = dims.current;
      road.current.w = Math.min(W * 0.82, 380);
      road.current.x = (W - road.current.w) / 2;
      const cw = Math.max(34, road.current.w * 0.155);
      player.current.w = cw;
      player.current.h = cw * 1.7;
    }

    function resize() {
      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      DPR.current = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.round(w * DPR.current);
      canvas.height = Math.round(h * DPR.current);
      dims.current = { W: w, H: h };
      computeRoad();
      player.current.y = h - Math.max(90, h * 0.16);
      player.current.x = clamp(
        player.current.x,
        road.current.x + player.current.w / 2,
        road.current.x + road.current.w - player.current.w / 2
      );
      player.current.tx = player.current.x;
    }

    function reset() {
      obstacles.current = [];
      particles.current = [];
      worldSpeed.current = 250;
      distance.current = 0;
      dashOffset.current = 0;
      spawnTimer.current = 0;
      shake.current = 0;
      crashTimer.current = 0;
      player.current.x = road.current.x + road.current.w / 2;
      player.current.tx = player.current.x;
    }

    function startGame() {
      setScreen(null);
      setHudVisible(true);
      reset();
      gameState.current = "playing";
    }
    // expose to component scope for JSX handlers
    startGameHandler.current = startGame;

    function endGame() {
      gameState.current = "over";
      setHudVisible(false);
      const d = Math.floor(distance.current);
      setFinalDist(d);
      const nb = d > bestRef.current;
      if (nb) {
        bestRef.current = d;
        store.set("neondrift_best", String(bestRef.current));
      }
      setFinalBest(bestRef.current);
      setBest(bestRef.current);
      setNewBest(nb);
      setScreen("over");
    }

    function pointerX(e) {
      const r = canvas.getBoundingClientRect();
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      return cx;
    }

    function onPointerDown(e) {
      if (gameState.current !== "playing") return;
      dragging.current = true;
      player.current.tx = pointerX(e);
    }
    function onPointerMove(e) {
      if (dragging.current && gameState.current === "playing") player.current.tx = pointerX(e);
    }
    function onPointerUp() {
      dragging.current = false;
    }
    function onKeyDown(e) {
      if (e.key === "ArrowLeft") {
        keys.current.left = true;
        e.preventDefault();
      }
      if (e.key === "ArrowRight") {
        keys.current.right = true;
        e.preventDefault();
      }
    }
    function onKeyUp(e) {
      if (e.key === "ArrowLeft") keys.current.left = false;
      if (e.key === "ArrowRight") keys.current.right = false;
    }

    function sfx(kind) {
      if (mutedRef.current) return;
      try {
        ac.current = ac.current || new (window.AudioContext || window.webkitAudioContext)();
        if (ac.current.state === "suspended") ac.current.resume();
        const t = ac.current.currentTime;
        if (kind === "crash") {
          const o = ac.current.createOscillator(),
            g = ac.current.createGain();
          o.type = "sawtooth";
          o.frequency.setValueAtTime(220, t);
          o.frequency.exponentialRampToValueAtTime(50, t + 0.4);
          g.gain.setValueAtTime(0.25, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
          o.connect(g);
          g.connect(ac.current.destination);
          o.start(t);
          o.stop(t + 0.46);
        } else {
          const o = ac.current.createOscillator(),
            g = ac.current.createGain();
          o.type = "sine";
          o.frequency.setValueAtTime(660, t);
          g.gain.setValueAtTime(0.05, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          o.connect(g);
          g.connect(ac.current.destination);
          o.start(t);
          o.stop(t + 0.11);
        }
      } catch {}
    }

    function spawn() {
      const margin = 6;
      const minX = road.current.x + margin,
        maxX = road.current.x + road.current.w - player.current.w - margin;
      const pair = distance.current > 500 && Math.random() < 0.28;
      const mk = (x) =>
        obstacles.current.push({
          x,
          y: -player.current.h - 10,
          w: player.current.w,
          h: player.current.h,
          color: CAR_COLORS[(Math.random() * CAR_COLORS.length) | 0],
          vy: 60 + Math.random() * 120,
          passed: false,
        });
      if (pair) {
        const gap = player.current.w * 1.7;
        const gx = minX + Math.random() * Math.max(1, maxX - minX - gap);
        mk(clamp(minX + (gx - minX) * Math.random(), minX, maxX));
        const rx = gx + gap;
        if (maxX - rx > player.current.w) mk(clamp(rx + (maxX - rx) * Math.random(), minX, maxX));
      } else {
        mk(minX + Math.random() * (maxX - minX));
      }
    }

    function boom(cx, cy) {
      for (let i = 0; i < 22; i++) {
        const a = Math.random() * Math.PI * 2,
          s = 60 + Math.random() * 220;
        particles.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 0.5 + Math.random() * 0.4,
          max: 0.9,
          color: Math.random() < 0.5 ? "#ffb020" : "#ff5d5d",
          r: 2 + Math.random() * 3,
        });
      }
    }

    function update(dt) {
      const { H } = dims.current;
      if (gameState.current === "playing") {
        worldSpeed.current = Math.min(760, 250 + distance.current * 0.05);
        distance.current += (worldSpeed.current * dt) / 11;
        dashOffset.current = (dashOffset.current + worldSpeed.current * dt) % 60;

        const kb = worldSpeed.current * 1.15;
        if (keys.current.left) player.current.tx -= kb * dt;
        if (keys.current.right) player.current.tx += kb * dt;
        const half = player.current.w / 2;
        player.current.tx = clamp(player.current.tx, road.current.x + half, road.current.x + road.current.w - half);
        player.current.x += (player.current.tx - player.current.x) * Math.min(1, dt * 16);

        spawnTimer.current -= dt;
        const interval = Math.max(0.42, 0.95 - distance.current * 0.00035);
        if (spawnTimer.current <= 0) {
          spawn();
          spawnTimer.current = interval;
        }

        const px = player.current.x - player.current.w / 2,
          py = player.current.y - player.current.h / 2;
        for (const o of obstacles.current) {
          o.y += (worldSpeed.current + o.vy) * dt;
          if (!o.passed && o.y > player.current.y) {
            o.passed = true;
            sfx("pass");
          }
          const pad = 7;
          if (
            px + pad < o.x + o.w - pad &&
            px + player.current.w - pad > o.x + pad &&
            py + pad < o.y + o.h - pad &&
            py + player.current.h - pad > o.y + pad
          ) {
            gameState.current = "crashing";
            crashTimer.current = 0.55;
            shake.current = 16;
            boom(player.current.x, player.current.y);
            sfx("crash");
          }
        }
        obstacles.current = obstacles.current.filter((o) => o.y < H + o.h);
      } else if (gameState.current === "crashing") {
        crashTimer.current -= dt;
        dashOffset.current = (dashOffset.current + worldSpeed.current * dt * 0.3) % 60;
        if (crashTimer.current <= 0) endGame();
      }

      for (const p of particles.current) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 320 * dt;
        p.life -= dt;
      }
      particles.current = particles.current.filter((p) => p.life > 0);
      shake.current *= Math.pow(0.001, dt);
      if (shake.current < 0.3) shake.current = 0;
    }

    function render() {
      const { W, H } = dims.current;
      ctx.setTransform(DPR.current, 0, 0, DPR.current, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      if (shake.current) ctx.translate((Math.random() - 0.5) * shake.current, (Math.random() - 0.5) * shake.current);

      ctx.fillStyle = "#0a0d12";
      ctx.fillRect(-20, -20, W + 40, H + 40);

      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#1a1f28");
      g.addColorStop(1, "#141821");
      ctx.fillStyle = g;
      ctx.fillRect(road.current.x, -20, road.current.w, H + 40);

      ctx.save();
      ctx.shadowBlur = 14;
      ctx.lineWidth = 3;
      ctx.shadowColor = "#35e0e0";
      ctx.strokeStyle = "#35e0e0";
      ctx.beginPath();
      ctx.moveTo(road.current.x, -20);
      ctx.lineTo(road.current.x, H + 20);
      ctx.moveTo(road.current.x + road.current.w, -20);
      ctx.lineTo(road.current.x + road.current.w, H + 20);
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = "rgba(232,237,245,.35)";
      ctx.lineWidth = 4;
      ctx.setLineDash([26, 34]);
      ctx.lineDashOffset = -dashOffset.current;
      for (let i = 1; i <= 2; i++) {
        const lx = road.current.x + (road.current.w / 3) * i;
        ctx.beginPath();
        ctx.moveTo(lx, -20);
        ctx.lineTo(lx, H + 20);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      const spd = worldSpeed.current / 760;
      if (spd > 0.15 && gameState.current !== "over") {
        ctx.strokeStyle = "rgba(55,240,160," + (0.06 + spd * 0.12) + ")";
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
          const sx = road.current.x - 10 - i * 4,
            ey = ((dashOffset.current * 4 + i * 140) % (H + 120)) - 60;
          ctx.beginPath();
          ctx.moveTo(sx, ey);
          ctx.lineTo(sx, ey + 50 * spd + 16);
          ctx.stroke();
          const sx2 = road.current.x + road.current.w + 10 + i * 4;
          ctx.beginPath();
          ctx.moveTo(sx2, ey);
          ctx.lineTo(sx2, ey + 50 * spd + 16);
          ctx.stroke();
        }
      }

      for (const o of obstacles.current) drawCar(ctx, o.x, o.y, o.w, o.h, o.color, false);

      for (const p of particles.current) {
        ctx.globalAlpha = Math.max(0, p.life / p.max);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (gameState.current !== "crashing" || Math.floor(crashTimer.current * 12) % 2 === 0) {
        drawCar(ctx, player.current.x - player.current.w / 2, player.current.y - player.current.h / 2, player.current.w, player.current.h, "#37f0a0", true);
      }

      ctx.restore();
      if (gameState.current === "playing" && scoreRef.current) {
        scoreRef.current.textContent = Math.floor(distance.current);
      }
    }

    function loop(now) {
      let dt = (now - lastT.current) / 1000;
      lastT.current = now;
      if (dt > 0.05) dt = 0.05;
      update(dt);
      render();
      rafId.current = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    if (window.location.hash === "#admin") {
      setTimeout(() => openAdminHandler.current && openAdminHandler.current(), 300);
    }

    rafId.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      clearTimeout(toastTimer.current);
      clearTimeout(pressTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handlers exposed from the effect above (so JSX buttons can call them)
  const startGameHandler = useRef(null);
  const openAdminHandler = useRef(null);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // ---- Admin panel ----
  const openAdmin = () => {
    setAdminView("gate");
    setPassValue("");
    setPassErr("");
    setAdminOpen(true);
    setTimeout(() => passInputRef.current && passInputRef.current.focus(), 60);
  };
  openAdminHandler.current = openAdmin;

  const closeAdmin = () => setAdminOpen(false);

  const tryEnter = () => {
    if (passValue.trim() === ADMIN_PASSCODE) {
      setAdminView("panel");
      setBillingActive(store.get("neondrift_billing") === "active");
    } else {
      setPassErr("Wrong passcode.");
    }
  };

  const onActivateBilling = () => {
    if (billingActive) {
      showToast("Opens billing portal in production.");
      return;
    }
    store.set("neondrift_billing", "active");
    setBillingActive(true);
    showToast("In production this opens Dodo / Razorpay checkout.");
  };

  const onTogglePublic = () => setPubLive((v) => !v);

  const onSignOut = () => {
    closeAdmin();
    showToast("Signed out.");
  };

  // ---- Title long-press → admin ----
  const startPress = () => {
    pressTimer.current = setTimeout(openAdmin, 1000);
  };
  const cancelPress = () => clearTimeout(pressTimer.current);

  // Ghost buttons (Cancel / Close / Sign out / Pause) share one look
  const ghostBtnStyle = {
    flex: 1,
    fontFamily: SANS,
    fontWeight: 600,
    fontSize: 14,
    borderRadius: 11,
    padding: "11px 16px",
    cursor: "pointer",
    background: "transparent",
    border: `1px solid ${C.line}`,
    color: C.muted,
  };
  const mintBtnStyle = {
    flex: 1,
    fontFamily: SANS,
    fontWeight: 600,
    fontSize: 14,
    borderRadius: 11,
    padding: "11px 16px",
    cursor: "pointer",
    background: C.mint,
    color: "#04231a",
    border: "none",
  };
  const fieldStyle = {
    background: C.surface2,
    border: `1px solid ${C.line}`,
    borderRadius: 11,
    color: C.text,
    fontFamily: SANS,
    fontSize: 15,
    padding: "12px 14px",
    width: "100%",
    outline: "none",
  };
  const labelStyle = {
    fontFamily: MONO,
    fontSize: 10,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: C.muted,
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center overflow-hidden select-none touch-none"
      style={{ background: "#05070a", color: C.text, fontFamily: SANS }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
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
              <div style={labelStyle}>Distance</div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, lineHeight: 1.05 }}>
                <span ref={scoreRef}>0</span>m
              </div>
            </div>
            <div className="flex items-start" style={{ gap: 14 }}>
              <div style={{ textAlign: "right" }}>
                <div style={labelStyle}>Best</div>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, lineHeight: 1.05 }}>{best}</div>
              </div>
              <button
                onClick={() => setMuted((m) => !m)}
                className="pointer-events-auto grid place-items-center active:scale-95 transition-transform"
                style={{
                  background: "rgba(21,26,36,.7)",
                  border: `1px solid ${C.line}`,
                  color: C.muted,
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  fontSize: 15,
                }}
              >
                {muted ? "🔇" : "🔊"}
              </button>
            </div>
          </div>
        )}

        {/* Menu overlay */}
        {screen === "menu" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{ gap: 22, padding: 24, background: "rgba(6,9,14,.94)", zIndex: 5 }}
          >
            <h1
              onPointerDown={startPress}
              onPointerUp={cancelPress}
              onPointerLeave={cancelPress}
              onPointerMove={cancelPress}
              className="cursor-pointer"
              style={{
                fontWeight: 700,
                fontSize: "clamp(40px,12vw,60px)",
                letterSpacing: "-0.03em",
                lineHeight: 0.92,
                margin: 0,
                backgroundImage: "linear-gradient(115deg,#eafff7,#37f0a0 45%,#35e0e0 95%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              NEON
              <br />
              DRIFT
            </h1>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.5, maxWidth: 280, margin: 0 }}>
              <b style={{ color: C.text, fontWeight: 600 }}>Drag to steer.</b> Dodge the traffic — it comes faster the
              further you get.
            </p>
            <button
              onClick={() => startGameHandler.current && startGameHandler.current()}
              className="cursor-pointer active:translate-y-px active:scale-95 transition-transform"
              style={{
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 18,
                color: "#04231a",
                background: C.mint,
                border: "none",
                padding: "16px 46px",
                borderRadius: 15,
                boxShadow: "0 12px 34px -10px rgba(55,240,160,.6)",
              }}
            >
              Drive
            </button>
            <div style={{ fontFamily: MONO, fontSize: 13, color: C.muted, letterSpacing: "0.04em" }}>
              {best > 0 && (
                <>
                  Best <b style={{ color: C.amber }}>{best}m</b>
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
              drag anywhere &nbsp;&middot;&nbsp; ← → on desktop
            </div>
          </div>
        )}

        {/* Game over overlay */}
        {screen === "over" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{ gap: 22, padding: 24, background: "rgba(6,9,14,.94)", zIndex: 5 }}
          >
            <h2 style={{ fontWeight: 700, fontSize: 34, margin: 0, letterSpacing: "-0.02em" }}>Wrecked</h2>
            {newBest && (
              <div style={{ color: C.amber, fontFamily: MONO, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                ★ New best ★
              </div>
            )}
            <div className="flex justify-center" style={{ gap: 38 }}>
              <div style={{ textAlign: "center", minWidth: 70 }}>
                <div style={labelStyle}>Distance</div>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, marginTop: 2 }}>{finalDist}m</div>
              </div>
              <div style={{ textAlign: "center", minWidth: 70 }}>
                <div style={labelStyle}>Best</div>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, marginTop: 2 }}>{finalBest}</div>
              </div>
            </div>
            <button
              onClick={() => startGameHandler.current && startGameHandler.current()}
              className="cursor-pointer active:translate-y-px active:scale-95 transition-transform"
              style={{
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 18,
                color: "#04231a",
                background: C.mint,
                border: "none",
                padding: "16px 46px",
                borderRadius: 15,
                boxShadow: "0 12px 34px -10px rgba(55,240,160,.6)",
              }}
            >
              Drive again
            </button>
          </div>
        )}

        {/* Admin overlay */}
        {adminOpen && (
          <div className="absolute inset-0 flex justify-end" style={{ padding: 0, background: "rgba(4,6,10,.9)", zIndex: 9 }}>
            <div
              className="w-full flex flex-col text-left"
              style={{
                maxWidth: 480,
                background: C.surface,
                borderTop: `1px solid ${C.line}`,
                borderRadius: "22px 22px 0 0",
                padding: "26px 22px calc(28px + env(safe-area-inset-bottom))",
                gap: 16,
                boxShadow: "0 -20px 60px -20px #000",
              }}
            >
              {adminView === "gate" ? (
                <div>
                  <h3 className="flex items-center" style={{ margin: 0, fontSize: 19, fontWeight: 700, gap: 8 }}>
                    🔒 Owner access
                  </h3>
                  <p style={{ margin: "-8px 0 4px", color: C.muted, fontSize: 13 }}>
                    Instance admins only. This is what unlocks the paid SaaS controls.
                  </p>
                  <div className="flex flex-col" style={{ gap: 6, marginTop: 14 }}>
                    <label style={labelStyle}>Passcode</label>
                    <input
                      ref={passInputRef}
                      style={fieldStyle}
                      type="password"
                      inputMode="text"
                      placeholder="••••••••"
                      autoComplete="off"
                      value={passValue}
                      onChange={(e) => setPassValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && tryEnter()}
                    />
                  </div>
                  <div style={{ color: C.coral, fontFamily: MONO, fontSize: 12, minHeight: 14 }}>{passErr}</div>
                  <div className="flex" style={{ gap: 10, marginTop: 4 }}>
                    <button onClick={closeAdmin} style={ghostBtnStyle}>
                      Cancel
                    </button>
                    <button onClick={tryEnter} style={mintBtnStyle}>
                      Enter
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col" style={{ gap: 16 }}>
                  <div>
                    <h3 className="flex items-center" style={{ margin: 0, fontSize: 19, fontWeight: 700, gap: 8 }}>
                      ⚙️ Instance control
                    </h3>
                    <p style={{ margin: "-8px 0 4px", color: C.muted, fontSize: 13 }}>
                      Neon Drift &middot; explified.com/apps/neon-drift
                    </p>
                  </div>

                  <div className="flex flex-col" style={{ gap: 6 }}>
                    <label style={labelStyle}>Instance name</label>
                    <input style={fieldStyle} value={instName} onChange={(e) => setInstName(e.target.value)} />
                  </div>

                  <div
                    className="flex items-center justify-between"
                    style={{ gap: 12, background: C.surface2, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14 }}
                  >
                    <div>
                      <div style={{ fontSize: 14 }}>Billing</div>
                      <div style={{ fontFamily: MONO, fontSize: 12, color: billingActive ? C.mint : C.coral }}>
                        {billingActive ? "Active — paid instance" : "Inactive — locked"}
                      </div>
                    </div>
                    <button onClick={onActivateBilling} style={{ ...mintBtnStyle, flex: "none" }}>
                      {billingActive ? "Manage" : "Activate"}
                    </button>
                  </div>

                  <div
                    className="flex items-center justify-between"
                    style={{ gap: 12, background: C.surface2, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14 }}
                  >
                    <div>
                      <div style={{ fontSize: 14 }}>Public play</div>
                      <div style={{ fontFamily: MONO, fontSize: 12, color: pubLive ? C.mint : C.coral }}>
                        {pubLive ? "Live" : "Paused"}
                      </div>
                    </div>
                    <button onClick={onTogglePublic} style={{ ...ghostBtnStyle, flex: "none" }}>
                      {pubLive ? "Pause" : "Resume"}
                    </button>
                  </div>

                  <div className="flex" style={{ gap: 10, marginTop: 4 }}>
                    <button onClick={closeAdmin} style={ghostBtnStyle}>
                      Close
                    </button>
                    <button onClick={onSignOut} style={ghostBtnStyle}>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toast */}
        <div
          className="absolute left-1/2 pointer-events-none text-center transition-all duration-300"
          style={{
            bottom: 80,
            transform: toast.show ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(20px)",
            background: C.surface2,
            border: `1px solid ${C.line}`,
            color: C.text,
            fontSize: 13,
            padding: "11px 18px",
            borderRadius: 12,
            opacity: toast.show ? 1 : 0,
            zIndex: 20,
            maxWidth: "88%",
          }}
        >
          {toast.msg}
        </div>
      </div>
    </div>
  );
}
