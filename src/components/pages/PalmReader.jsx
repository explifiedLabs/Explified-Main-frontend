import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload, Camera, Sparkles, KeyRound, RefreshCw, AlertCircle,
  Eye, EyeOff, ChevronRight, Hand
} from "lucide-react";

/**
 * Palm Reader — Explified
 * ------------------------------------------------------------------
 * A BYOK (bring-your-own-key) palmistry web app. The visitor pastes
 * their own Anthropic API key; the browser calls the Messages API
 * directly (vision) and renders a structured, traditional reading
 * over their photo.
 *
 * DEPLOY NOTES (Explified.com/apps/palm-reader):
 *  1. Key persistence: this build keeps the key in React state only
 *     (nothing is stored). To remember it on your own domain, swap
 *     the two `useState` lines marked `// PERSIST:` for a localStorage
 *     -backed hook. (Left out here so it runs cleanly in previews.)
 *  2. Security: BYOK from the browser is fine for a personal / power-
 *     user launch. For a public launch, proxy the call through your
 *     own backend so visitor keys (or your key) are never in client
 *     code — that's the "improve from here" step.
 *  3. Model: defaults to claude-sonnet-5 (vision + good $/quality).
 *     Editable in the UI.
 * ------------------------------------------------------------------
 */

const MODELS = [
  { id: "claude-sonnet-5", label: "Sonnet 5 · balanced (recommended)" },
  { id: "claude-opus-4-8", label: "Opus 4.8 · deepest reading" },
  { id: "claude-haiku-4-5-20251001", label: "Haiku 4.5 · fastest / cheapest" },
];

const LINE_META = {
  heart:    { color: "#FF7EA0", glyph: "♀", planet: "Venus · Jupiter" },
  head:     { color: "#54D6CB", glyph: "☿", planet: "Mercury" },
  life:     { color: "#F6A94A", glyph: "♂", planet: "Mars · Venus" },
  fate:     { color: "#B49BF2", glyph: "♄", planet: "Saturn" },
  sun:      { color: "#FFD36B", glyph: "☉", planet: "Apollo" },
  marriage: { color: "#F5A3C7", glyph: "∞", planet: "Mercury" },
  health:   { color: "#8FD9A8", glyph: "⚕", planet: "Mercury" },
  _default: { color: "#E6B667", glyph: "✦", planet: "—" },
};
const metaFor = (id) => LINE_META[id] || LINE_META._default;

const SYSTEM_PROMPT =
  "You are a warm, articulate palmist trained in classical Western palmistry and Indian Hasta " +
  "Samudrika Shastra. You read a photograph of a person's palm and produce an engaging, specific, " +
  "traditional reading offered for reflection and entertainment — never as prediction, medical, or " +
  "financial fact. Be honest: if the image is unclear or not a palm, say so plainly and do not invent " +
  "lines. Never produce alarming, deterministic, or health-diagnostic claims. Keep a generous, grounded " +
  "tone. Output ONLY valid minified JSON matching the requested schema — no markdown fences, no prose " +
  "outside the JSON.";

const USER_PROMPT = `Read this palm photograph.

Always fill the "the_m" and "wealth" fields — people ask about those most.

For every major line you can see, best-effort estimate its shape as a polyline of [x,y] points, where x = percent of image WIDTH (0-100, left→right) and y = percent of image HEIGHT (0-100, top→bottom). Give 4-8 points tracing the actual crease. If you cannot locate a line confidently, set "points": null. Use these ids where they apply: heart, head, life, fate, sun (also marriage, health if clearly present).

Return JSON with EXACTLY this shape (no extra keys):
{
 "hand": "left" | "right" | "unknown",
 "image_quality": "good" | "fair" | "poor",
 "quality_note": "one short sentence; empty if good",
 "overall": "2-3 sentence headline read of this hand's character",
 "lines": [
   { "id": "heart", "name": "Heart Line", "present": true, "quality": "strong|clear|faint|broken|absent",
     "seen": "short phrase describing what's visible", "reading": "2-3 sentence interpretation",
     "points": [[x,y],[x,y]] }
 ],
 "the_m": { "present": true, "strength": "clear|light|absent", "note": "2 sentences on the M mark and what it traditionally means for this hand" },
 "wealth": {
   "verdict": "3-5 word headline (e.g. 'Self-made, later-blooming')",
   "detail": "3-4 sentences, honest & tradition-based, no guarantees",
   "timing": "one phrase on when prosperity tends to mature",
   "scores": { "vitality": 0-100, "creativity": 0-100, "recognition": 0-100, "fixed_fortune": 0-100 }
 },
 "closing": "1 warm sentence to end on"
}`;

async function readPalm({ key, model, base64, mediaType }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 3000,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
            { type: "text", text: USER_PROMPT },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status}).`;
    try {
      const e = await res.json();
      const detail = e?.error?.message || e?.message;
      if (res.status === 401) msg = "That API key was rejected. Check it and try again.";
      else if (res.status === 429) msg = "Rate limit or quota reached on your key. Wait a moment and retry.";
      else if (res.status === 400 && /model/i.test(detail || "")) msg = "Your account can't access that model — pick another in Advanced.";
      else if (detail) msg = detail;
    } catch { /* keep default */ }
    throw new Error(msg);
  }

  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  const clean = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("The reading came back in an unexpected format. Try again.");
  return JSON.parse(clean.slice(start, end + 1));
}

/* ------------------------------------------------------------------ */

const CSS = `
:root{
  --ink:#0C1030; --panel:rgba(26,33,72,.55); --line:rgba(214,199,150,.16);
  --gold:#E6B667; --gold-deep:#C9962F; --cream:#ECE6D4; --muted:#A6ACCB; --muted2:#7E85AC; --star:#F2C879;
}
.pr *{box-sizing:border-box}
.pr{
  min-height:100%; color:var(--cream);
  font-family:"Cormorant Garamond",Georgia,serif; font-size:19px; line-height:1.55;
  background:#000;
  -webkit-font-smoothing:antialiased;
}
.pr-stars{position:fixed; inset:0; pointer-events:none; opacity:.5; z-index:0;
  background-image:
    radial-gradient(1.4px 1.4px at 22% 26%, rgba(242,200,121,.55), transparent),
    radial-gradient(1.2px 1.2px at 66% 16%, rgba(236,230,212,.5), transparent),
    radial-gradient(1.1px 1.1px at 86% 60%, rgba(180,155,242,.5), transparent),
    radial-gradient(1.3px 1.3px at 34% 80%, rgba(242,200,121,.4), transparent),
    radial-gradient(1px 1px at 52% 48%, rgba(236,230,212,.4), transparent),
    radial-gradient(1px 1px at 12% 64%, rgba(236,230,212,.34), transparent);}
.pr-wrap{position:relative; z-index:1; max-width:680px; margin:0 auto; padding:112px 18px 80px}

.pr-brand{display:flex; align-items:center; justify-content:center; gap:9px; font-family:"Cinzel",serif;
  font-size:11px; letter-spacing:.34em; text-transform:uppercase; color:var(--gold); opacity:.9}
.pr-brand .dotmark{width:5px; height:5px; border-radius:50%; background:var(--gold); box-shadow:0 0 8px var(--gold)}
.pr h1{font-family:"Cinzel",serif; font-weight:600; font-size:clamp(32px,8vw,50px); text-align:center;
  margin:16px 0 0; line-height:1.03; text-shadow:0 0 30px rgba(230,182,103,.22)}
.pr .tag{text-align:center; font-style:italic; color:var(--muted); margin:12px auto 0; max-width:44ch}
.pr .rule{width:74px; height:1px; margin:24px auto 30px; background:linear-gradient(90deg,transparent,var(--gold-deep),transparent)}
.pr .rule::after{content:"✦"; display:block; text-align:center; color:var(--gold); font-size:12px; margin-top:-9px}

.pr-card{border:1px solid var(--line); border-radius:16px; padding:20px;
  background:linear-gradient(180deg, rgba(26,33,72,.5), rgba(18,23,56,.5)); margin:0 0 16px}
.pr-label{font-family:"Cinzel",serif; font-size:10.5px; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); display:flex; align-items:center; gap:7px; margin:0 0 9px}
.pr-input{width:100%; background:rgba(8,11,34,.7); border:1px solid var(--line); border-radius:10px;
  color:var(--cream); font-family:"Cormorant Garamond",serif; font-size:17px; padding:12px 42px 12px 13px}
.pr-input:focus{outline:none; border-color:rgba(230,182,103,.5); box-shadow:0 0 0 3px rgba(230,182,103,.12)}
.pr-keyrow{position:relative}
.pr-eye{position:absolute; right:8px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--muted2); cursor:pointer; padding:6px; display:grid; place-items:center}
.pr-eye:hover{color:var(--gold)}
.pr-note{font-size:14.5px; color:var(--muted2); font-style:italic; margin:8px 2px 0}
.pr-note a{color:var(--gold)}
.pr-select{width:100%; background:rgba(8,11,34,.7); border:1px solid var(--line); border-radius:10px; color:var(--cream); font-family:"Cormorant Garamond",serif; font-size:16px; padding:11px 13px}
.pr-adv{background:none; border:none; color:var(--muted); font-family:"Cinzel",serif; font-size:10.5px; letter-spacing:.16em; text-transform:uppercase; cursor:pointer; display:flex; align-items:center; gap:6px; padding:4px 0; margin-top:4px}
.pr-adv:hover{color:var(--gold)}

.pr-drop{border:1.5px dashed rgba(230,182,103,.34); border-radius:14px; padding:26px 18px; text-align:center; cursor:pointer; transition:.2s; background:rgba(230,182,103,.03)}
.pr-drop:hover,.pr-drop.drag{border-color:var(--gold); background:rgba(230,182,103,.07)}
.pr-drop .ic{color:var(--gold); margin-bottom:10px}
.pr-drop b{font-family:"Cinzel",serif; font-weight:600; font-size:16px; letter-spacing:.03em; display:block; color:var(--cream)}
.pr-drop span{font-style:italic; color:var(--muted); font-size:15.5px}
.pr-actions{display:flex; gap:10px; margin-top:12px}
.pr-mini{flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:11px; border-radius:10px;
  border:1px solid var(--line); background:rgba(255,255,255,.03); color:var(--muted); font-family:"Cinzel",serif;
  font-size:11px; letter-spacing:.12em; text-transform:uppercase; cursor:pointer; transition:.2s}
.pr-mini:hover{border-color:rgba(230,182,103,.5); color:var(--cream)}

.pr-tips{margin:14px 0 0; padding:14px 16px; border-radius:12px; background:rgba(8,11,34,.4); border:1px solid var(--line)}
.pr-tips p{margin:0 0 6px; font-family:"Cinzel",serif; font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:var(--gold)}
.pr-tips ul{margin:0; padding-left:18px; color:var(--muted); font-size:16px}
.pr-tips li{margin:2px 0}

.pr-btn{width:100%; margin-top:16px; border:1px solid var(--gold-deep); border-radius:12px; cursor:pointer;
  font-family:"Cinzel",serif; font-size:14px; letter-spacing:.14em; text-transform:uppercase; font-weight:600; color:var(--ink);
  padding:15px; background:linear-gradient(180deg,#F0C97E,#D8A648); box-shadow:0 8px 24px rgba(230,182,103,.24);
  display:flex; align-items:center; justify-content:center; gap:10px; transition:.2s}
.pr-btn:hover:not(:disabled){transform:translateY(-1px); box-shadow:0 12px 30px rgba(230,182,103,.34)}
.pr-btn:disabled{opacity:.4; cursor:not-allowed; box-shadow:none}
.pr-btn:focus-visible{outline:2px solid var(--gold); outline-offset:3px}

.pr-preview{position:relative; border-radius:14px; overflow:hidden; border:1px solid var(--line); box-shadow:0 18px 46px rgba(0,0,0,.5)}
.pr-preview img{display:block; width:100%}
.pr-preview svg{position:absolute; inset:0; width:100%; height:100%}
.pr-linelabel{position:absolute; transform:translate(-50%,-140%); font-family:"Cinzel",serif; font-size:9px;
  letter-spacing:.1em; text-transform:uppercase; padding:2px 7px; border-radius:20px; white-space:nowrap;
  background:rgba(10,13,38,.82); border:1px solid currentColor; pointer-events:none; text-shadow:0 1px 4px #000}

.pr-overlaychips{display:flex; flex-wrap:wrap; gap:7px; margin:14px 0 2px}
.pr-chip{cursor:pointer; font-family:"Cinzel",serif; font-size:10.5px; letter-spacing:.1em; text-transform:uppercase;
  color:var(--muted); background:rgba(255,255,255,.03); border:1px solid var(--line); border-radius:999px;
  padding:7px 12px; display:inline-flex; align-items:center; gap:7px; transition:.2s}
.pr-chip .dot{width:8px; height:8px; border-radius:50%; background:currentColor; box-shadow:0 0 7px currentColor}
.pr-chip[aria-pressed="false"]{opacity:.45}
.pr-chip[aria-pressed="false"] .dot{opacity:.3}
.pr-chip:hover{border-color:rgba(230,182,103,.5); color:var(--cream)}

.pr-quality{margin:0 0 16px; padding:12px 15px; border-radius:12px; border:1px solid rgba(230,182,103,.3);
  background:rgba(230,182,103,.07); font-style:italic; color:var(--gold); font-size:16px; display:flex; gap:9px; align-items:flex-start}

.pr-lead{font-size:20px; color:var(--muted); margin:6px 2px 22px}
.pr-lead .drop{float:left; font-family:"Cinzel",serif; font-size:50px; line-height:.8; color:var(--gold); margin:6px 12px 0 0; text-shadow:0 0 22px rgba(230,182,103,.3)}

.pr-line{border:1px solid var(--line); border-left:2px solid var(--edge); border-radius:12px; padding:15px 17px; margin:0 0 12px;
  background:linear-gradient(180deg, rgba(26,33,72,.5), rgba(18,23,56,.5)); cursor:pointer; transition:.22s}
.pr-line:hover{transform:translateX(2px); background:linear-gradient(180deg, rgba(34,42,88,.62), rgba(22,28,66,.58))}
.pr-line.active{box-shadow:0 0 0 1px var(--edge), 0 12px 26px rgba(0,0,0,.4)}
.pr-line h3{font-family:"Cinzel",serif; font-weight:600; font-size:16px; margin:0 0 2px; display:flex; align-items:center; gap:10px; color:var(--cream)}
.pr-line h3 .g{width:25px; height:25px; flex:0 0 25px; border-radius:50%; display:grid; place-items:center; font-size:13px; color:var(--edge);
  border:1px solid color-mix(in srgb,var(--edge) 45%, transparent); background:color-mix(in srgb,var(--edge) 12%, transparent)}
.pr-line h3 .q{margin-left:auto; font-family:"Cinzel",serif; font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted2)}
.pr-line .seen{color:var(--gold); font-style:italic; font-size:16px; margin:6px 0 5px}
.pr-line .seen::before{content:"Seen · "; font-style:normal; font-family:"Cinzel",serif; font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted2)}
.pr-line p{margin:0; color:#D6D2E4; font-size:17px}

.pr-feature{border-radius:16px; padding:22px; margin:22px 0 0; border:1px solid rgba(230,182,103,.24);
  background:radial-gradient(560px 200px at 90% -20%, rgba(230,182,103,.12), transparent 70%), linear-gradient(180deg, rgba(30,26,58,.6), rgba(16,16,42,.6))}
.pr-feature .ft{font-family:"Cinzel",serif; font-size:10px; letter-spacing:.24em; text-transform:uppercase; color:var(--gold); margin:0 0 7px}
.pr-feature h2{font-family:"Cinzel",serif; font-weight:600; font-size:clamp(21px,5vw,27px); margin:0 0 11px; color:var(--cream)}
.pr-feature p{margin:0 0 10px; color:#DAD6E6; font-size:17.5px}
.pr-feature p:last-child{margin-bottom:0}
.pr-verdict{display:flex; gap:12px; align-items:baseline; flex-wrap:wrap; margin:2px 0 12px}
.pr-verdict .w{font-family:"Cinzel",serif; font-size:clamp(23px,6vw,34px); color:var(--star); text-shadow:0 0 24px rgba(242,200,121,.3)}
.pr-verdict .q{font-style:italic; color:var(--muted); font-size:16px}
.pr-meter .row{display:flex; align-items:center; gap:11px; margin:8px 0}
.pr-meter .lbl{width:104px; flex:0 0 104px; font-family:"Cinzel",serif; font-size:10px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted)}
.pr-meter .bar{flex:1; height:7px; border-radius:6px; background:rgba(255,255,255,.06); overflow:hidden}
.pr-meter .fill{height:100%; border-radius:6px; background:linear-gradient(90deg,var(--gold-deep),var(--star)); transition:width .9s ease}
.pr-meter .val{width:38px; text-align:right; font-family:"Cinzel",serif; font-size:11px; color:var(--muted2)}

.pr-closing{text-align:center; font-style:italic; font-size:19px; color:var(--gold); margin:26px auto 0; max-width:46ch}
.pr-disc{margin:26px 2px 0; padding-top:16px; border-top:1px solid var(--line); font-style:italic; color:var(--muted2); font-size:14.5px; text-align:center}
.pr-again{margin-top:22px}

.pr-error{border:1px solid rgba(255,120,120,.4); background:rgba(120,30,40,.22); border-radius:12px; padding:15px 16px; color:#ffd9d9; display:flex; gap:10px; align-items:flex-start; margin-top:14px}

.pr-loading{text-align:center; padding:40px 16px}
.pr-orbit{width:96px; height:96px; margin:0 auto 22px; position:relative}
.pr-orbit .ring{position:absolute; inset:0; border-radius:50%; border:1px solid rgba(230,182,103,.25)}
.pr-orbit .ring.r2{inset:16px; border-color:rgba(180,155,242,.3)}
.pr-orbit .planet{position:absolute; top:-4px; left:50%; width:10px; height:10px; margin-left:-5px; border-radius:50%; background:var(--star); box-shadow:0 0 12px var(--star); transform-origin:5px 52px; animation:pr-spin 2.4s linear infinite}
.pr-orbit .planet.p2{background:var(--fate); box-shadow:0 0 12px var(--fate); top:12px; transform-origin:5px 36px; animation-duration:1.7s; animation-direction:reverse}
.pr-orbit .core{position:absolute; inset:38px; border-radius:50%; background:radial-gradient(circle,#F0C97E,#C9962F); box-shadow:0 0 22px rgba(230,182,103,.6)}
@keyframes pr-spin{to{transform:rotate(360deg)}}
.pr-loading .status{font-family:"Cinzel",serif; letter-spacing:.14em; text-transform:uppercase; font-size:12px; color:var(--gold); min-height:16px}
.pr-loading .sub{font-style:italic; color:var(--muted); margin-top:8px}
@media (prefers-reduced-motion: reduce){ .pr-orbit .planet{animation:none} .pr-meter .fill{transition:none} }
`;

const LOAD_MSGS = [
  "Steadying the light over your palm…",
  "Tracing the heart and head lines…",
  "Measuring the mounts of the planets…",
  "Looking for the letter M…",
  "Weighing the marks of fortune…",
  "Composing your reading…",
];

export default function PalmReader() {
  const [apiKey, setApiKey] = useState("");            // PERSIST: swap for localStorage-backed state on deploy
  const [model, setModel] = useState(MODELS[0].id);     // PERSIST:
  const [showKey, setShowKey] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [imgUrl, setImgUrl] = useState(null);
  const [imgB64, setImgB64] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [imgDims, setImgDims] = useState({ w: 1, h: 1 });

  const [status, setStatus] = useState("setup"); // setup | loading | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loadIdx, setLoadIdx] = useState(0);

  const [hidden, setHidden] = useState(() => new Set()); // hidden overlay line ids
  const [active, setActive] = useState(null);

  const fileRef = useRef(null);
  const camRef = useRef(null);
  const [drag, setDrag] = useState(false);

  // fonts
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap";
    document.head.appendChild(l);
    return () => { try { document.head.removeChild(l); } catch {} };
  }, []);

  // rotate loading messages
  useEffect(() => {
    if (status !== "loading") return;
    const t = setInterval(() => setLoadIdx((i) => (i + 1) % LOAD_MSGS.length), 2200);
    return () => clearInterval(t);
  }, [status]);

  const onFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG or WebP).");
      setStatus("error");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setImgUrl(dataUrl);
      setImgB64(dataUrl.split(",")[1]);
      setMediaType(file.type);
      const im = new Image();
      im.onload = () => setImgDims({ w: im.naturalWidth, h: im.naturalHeight });
      im.src = dataUrl;
      if (status !== "setup") setStatus("setup");
    };
    reader.readAsDataURL(file);
  }, [status]);

  const analyze = useCallback(async () => {
    if (!apiKey.trim() || !imgB64) return;
    setStatus("loading");
    setError("");
    setResult(null);
    setLoadIdx(0);
    try {
      const r = await readPalm({ key: apiKey.trim(), model, base64: imgB64, mediaType });
      setResult(r);
      setHidden(new Set());
      setActive(null);
      setStatus("done");
    } catch (err) {
      const isNet = err instanceof TypeError; // fetch/CORS network failure
      setError(isNet
        ? "Couldn't reach the Claude API from the browser. Check your connection — and note that some preview sandboxes block this call; it works on your deployed site."
        : (err.message || "Something went wrong. Try again."));
      setStatus("error");
    }
  }, [apiKey, imgB64, mediaType, model]);

  const reset = () => {
    setStatus("setup");
    setResult(null);
    setError("");
    setImgUrl(null); setImgB64(null); setMediaType(null);
    setActive(null); setHidden(new Set());
  };

  const toggleLine = (id) => {
    setHidden((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const canRun = apiKey.trim() && imgB64 && status !== "loading";

  return (
    <div className="pr">
      <style>{CSS}</style>
      <div className="pr-stars" />
      <div className="pr-wrap">

        <div className="pr-brand"><span className="dotmark" />Explified · Apps</div>
        <h1>Palm Reader</h1>
        <p className="tag">Upload your palm. A star-chart reading of your lines, mounts and marks — traced onto your own hand.</p>
        <div className="rule" />

        {/* ---------------- SETUP ---------------- */}
        {status !== "loading" && (status === "setup" || status === "error") && (
          <>
            <div className="pr-card">
              <div className="pr-label"><KeyRound size={13} /> Your Claude API key</div>
              <div className="pr-keyrow">
                <input
                  className="pr-input"
                  type={showKey ? "text" : "password"}
                  placeholder="sk-ant-…"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  autoComplete="off" spellCheck={false}
                />
                <button className="pr-eye" onClick={() => setShowKey((s) => !s)} aria-label="Toggle key visibility">
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="pr-note">
                Bring-your-own-key. It stays in your browser and is sent only to Anthropic. Get one at{" "}
                <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">console.anthropic.com</a>.
              </p>

              <button className="pr-adv" onClick={() => setShowAdvanced((s) => !s)}>
                <ChevronRight size={12} style={{ transform: showAdvanced ? "rotate(90deg)" : "none", transition: ".2s" }} />
                Advanced · model
              </button>
              {showAdvanced && (
                <select className="pr-select" value={model} onChange={(e) => setModel(e.target.value)} style={{ marginTop: 8 }}>
                  {MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              )}
            </div>

            <div className="pr-card">
              <div className="pr-label"><Hand size={13} /> Your palm photo</div>

              {!imgUrl ? (
                <div
                  className={"pr-drop" + (drag ? " drag" : "")}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files?.[0]); }}
                >
                  <div className="ic"><Upload size={26} /></div>
                  <b>Drop a photo or tap to choose</b>
                  <span>dominant hand, palm to camera, bright even light</span>
                </div>
              ) : (
                <div className="pr-preview">
                  <img src={imgUrl} alt="Your palm" />
                </div>
              )}

              <div className="pr-actions">
                <button className="pr-mini" onClick={() => fileRef.current?.click()}>
                  <Upload size={14} /> {imgUrl ? "Replace" : "Upload"}
                </button>
                <button className="pr-mini" onClick={() => camRef.current?.click()}>
                  <Camera size={14} /> Camera
                </button>
              </div>

              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
              <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => onFile(e.target.files?.[0])} />

              <div className="pr-tips">
                <p>For a clear reading</p>
                <ul>
                  <li>Palm facing the camera, fingers slightly spread</li>
                  <li>Bright, even light — avoid harsh shadows</li>
                  <li>Close enough that the major creases are crisp</li>
                </ul>
              </div>
            </div>

            {status === "error" && (
              <div className="pr-error"><AlertCircle size={18} style={{ flex: "0 0 18px", marginTop: 1 }} /><div>{error}</div></div>
            )}

            <button className="pr-btn" disabled={!canRun} onClick={analyze}>
              <Sparkles size={16} /> Read my palm
            </button>
          </>
        )}

        {/* ---------------- LOADING ---------------- */}
        {status === "loading" && (
          <div className="pr-loading">
            <div className="pr-orbit" aria-hidden="true">
              <div className="ring" /><div className="ring r2" />
              <div className="planet" /><div className="planet p2" />
              <div className="core" />
            </div>
            <div className="status">{LOAD_MSGS[loadIdx]}</div>
            <div className="sub">Reading the lines of your hand</div>
          </div>
        )}

        {/* ---------------- RESULTS ---------------- */}
        {status === "done" && result && (
          <Results
            result={result}
            imgUrl={imgUrl}
            imgDims={imgDims}
            hidden={hidden}
            active={active}
            onToggle={toggleLine}
            onActivate={(id) => setActive((a) => (a === id ? null : id))}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Results({ result, imgUrl, imgDims, hidden, active, onToggle, onActivate, onReset }) {
  const lines = (result.lines || []).filter((l) => l && l.present !== false);
  const drawable = lines.filter((l) => Array.isArray(l.points) && l.points.length > 1);
  const w = result.wealth || {};
  const scores = w.scores || {};
  const m = result.the_m || {};

  const pathFor = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");

  return (
    <>
      {result.image_quality && result.image_quality !== "good" && result.quality_note && (
        <div className="pr-quality"><Eye size={16} style={{ flex: "0 0 16px", marginTop: 2 }} />{result.quality_note}</div>
      )}

      {/* palm with overlay */}
      <div className="pr-preview" style={{ marginBottom: 6 }}>
        <img src={imgUrl} alt="Your palm" />
        {drawable.length > 0 && (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            {drawable.map((l) => {
              const meta = metaFor(l.id);
              const on = !hidden.has(l.id);
              const dim = active && active !== l.id;
              return (
                <g key={l.id} style={{ opacity: on ? (dim ? 0.18 : 1) : 0, transition: ".25s" }}>
                  <path d={pathFor(l.points)} fill="none" stroke={meta.color} strokeWidth={active === l.id ? 3.4 : 2.6}
                    strokeLinecap="round" strokeLinejoin="round" opacity="0.16"
                    style={{ vectorEffect: "non-scaling-stroke", filter: "blur(1px)" }} />
                  <path d={pathFor(l.points)} fill="none" stroke={meta.color} strokeWidth={l.quality === "faint" ? 1.1 : 1.7}
                    strokeLinecap="round" strokeLinejoin="round" style={{ vectorEffect: "non-scaling-stroke" }} />
                </g>
              );
            })}
          </svg>
        )}
        {drawable.filter((l) => !hidden.has(l.id)).map((l) => {
          const meta = metaFor(l.id);
          const p0 = l.points[0];
          return (
            <div key={l.id} className="pr-linelabel"
              style={{ left: `${p0[0]}%`, top: `${p0[1]}%`, color: meta.color }}>
              {meta.glyph} {l.name || l.id}
            </div>
          );
        })}
      </div>

      {drawable.length > 0 && (
        <div className="pr-overlaychips">
          {drawable.map((l) => {
            const meta = metaFor(l.id);
            return (
              <button key={l.id} className="pr-chip" aria-pressed={!hidden.has(l.id)} onClick={() => onToggle(l.id)}>
                <span className="dot" style={{ color: meta.color }} />{(l.name || l.id).replace(/ line/i, "")}
              </button>
            );
          })}
        </div>
      )}

      {result.overall && (
        <p className="pr-lead"><span className="drop">{result.overall.trim().charAt(0)}</span>{result.overall.trim().slice(1)}</p>
      )}

      {/* line cards */}
      {lines.map((l) => {
        const meta = metaFor(l.id);
        return (
          <div key={l.id} className={"pr-line" + (active === l.id ? " active" : "")} style={{ "--edge": meta.color }}
            onClick={() => onActivate(l.id)}>
            <h3><span className="g">{meta.glyph}</span>{l.name || l.id}<span className="q">{l.quality || ""}</span></h3>
            {l.seen && <div className="seen">{l.seen}</div>}
            {l.reading && <p>{l.reading}</p>}
          </div>
        );
      })}

      {/* The M */}
      <section className="pr-feature">
        <p className="ft">The letter</p>
        <h2>Is there an “M”?</h2>
        <p style={{ color: "var(--gold)", fontStyle: "italic" }}>
          {m.present ? (m.strength === "clear" ? "Yes — clearly drawn." : "Yes — softly drawn, but it’s there.") : "Not distinctly on this hand."}
        </p>
        {m.note && <p>{m.note}</p>}
      </section>

      {/* Wealth */}
      <section className="pr-feature">
        <p className="ft">Prosperity</p>
        <h2>Is there wealth, sometime?</h2>
        {w.verdict && (
          <div className="pr-verdict">
            <span className="w">{w.verdict}</span>
            {w.timing && <span className="q">— {w.timing}</span>}
          </div>
        )}
        {w.detail && <p>{w.detail}</p>}
        {Object.keys(scores).length > 0 && (
          <div className="pr-meter" style={{ marginTop: 14 }}>
            {[["Vitality", scores.vitality], ["Creativity", scores.creativity], ["Recognition", scores.recognition], ["Fixed fortune", scores.fixed_fortune]]
              .filter(([, v]) => typeof v === "number")
              .map(([lbl, v]) => (
                <div className="row" key={lbl}>
                  <span className="lbl">{lbl}</span>
                  <span className="bar"><span className="fill" style={{ width: `${Math.max(0, Math.min(100, v))}%` }} /></span>
                  <span className="val">{Math.round(v)}</span>
                </div>
              ))}
          </div>
        )}
      </section>

      {result.closing && <p className="pr-closing">“{result.closing.replace(/^["“]|["”]$/g, "")}”</p>}

      <p className="pr-disc">
        Palmistry is a traditional interpretive art, offered for reflection and enjoyment — not prediction, medical, or financial advice.
        Your hand describes tendencies people have long read into it, not a fixed fate. You hold the pen.
      </p>

      <button className="pr-btn pr-again" onClick={onReset}>
        <RefreshCw size={15} /> Read another palm
      </button>
    </>
  );
}