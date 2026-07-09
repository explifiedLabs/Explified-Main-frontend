import { motion } from "framer-motion";
import { CheckCircle2, Diamond } from "lucide-react";
import logo from "../../assets/logo.png";

const accentColor = "#23b5b5";

const checklistItems = [
  "Ship on any major marketplace in days, not months",
  "AI-native tools built for real team workflows",
  "Unified under one brand your clients can trust",
  "Backed by DPIIT, Startup India",
];

// Custom SVG Icons matching the screenshots precisely

const ShopifyIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const FramerIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 16h14L5 2h14v7H5l14 7H5v5l7-7 7 7v-5z" />
  </svg>
);

const FigmaIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Figma logo built using clean geometric strokes */}
    <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H12v5H7.5A2.5 2.5 0 0 1 5 5.5z" />
    <path d="M12 3h4.5A2.5 2.5 0 0 1 19 5.5 2.5 2.5 0 0 1 16.5 8H12V3z" />
    <path d="M5 12.5A2.5 2.5 0 0 1 7.5 10H12v5H7.5A2.5 2.5 0 0 1 5 12.5z" />
    <path d="M12 10h4.5a2.5 2.5 0 0 1 0 5H12v-5z" />
    <path d="M5 19.5A2.5 2.5 0 0 0 7.5 22H12v-5H7.5A2.5 2.5 0 0 0 5 19.5z" />
  </svg>
);

const TrelloIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Outer Board */}
    <rect x="3" y="3" width="18" height="18" rx="2.5" ry="2.5" />
    {/* Left Column (Longer) */}
    <rect x="7" y="7" width="3.5" height="9" rx="1" />
    {/* Right Column (Shorter) */}
    <rect x="13.5" y="7" width="3.5" height="5" rx="1" />
  </svg>
);
const ChromeIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

const PuzzleIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 3H19L12 10H5V3Z" />
    <path d="M5 10H12L19 17H12L5 10Z" />
    <path d="M5 17H12V24L5 17Z" />
  </svg>
);

const ZapIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// Balanced absolute coordinate nodes matching the visual target grid layout
const satelliteIcons = [
  { Icon: FigmaIcon, top: "12%", left: "12%", delay: 0 },
  { Icon: ShopifyIcon, top: "12%", left: "88%", delay: 0.4 },
  { Icon: TrelloIcon, top: "88%", left: "12%", delay: 0.8 },
  { Icon: ChromeIcon, top: "88%", left: "88%", delay: 1.2 },
  { Icon: PuzzleIcon, top: "35%", left: "50%", delay: 0.2 },
  { Icon: ZapIcon, top: "80%", left: "50%", delay: 0.6 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.12 },
  }),
};

const WhyExplified = () => {
  return (
    <section className="relative w-full bg-black py-24 md:py-32 px-4 md:px-8 font-sans overflow-hidden">
      <div className="relative z-10 max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        {/* --- Left Content Pane --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            custom={0}
            variants={fadeUp}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-6 h-px bg-[#23b5b5]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#23b5b5]">
              Why Explified
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-8">
            <motion.span
              custom={1}
              variants={fadeUp}
              className="block text-white"
            >
              Apps that work
            </motion.span>
            <motion.span
              custom={2}
              variants={fadeUp}
              className="block text-gray-500"
            >
              where your team
            </motion.span>
            <motion.span
              custom={3}
              variants={fadeUp}
              className="block text-white"
            >
              works.
            </motion.span>
          </h2>

          <ul className="space-y-4">
            {checklistItems.map((item, i) => (
              <motion.li
                key={i}
                custom={4 + i * 0.5}
                variants={fadeUp}
                className="flex items-start gap-3"
              >
                <CheckCircle2
                  size={20}
                  className="text-[#23b5b5] shrink-0 mt-0.5"
                  strokeWidth={2}
                />
                <span className="text-base md:text-lg text-gray-300">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* --- Right Dynamic Visualization --- */}
        {/* --- Right: Orbit Visual --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          <div className="relative w-full max-w-[560px] mx-auto aspect-square rounded-[32px] border border-white/10 bg-[#040808] overflow-hidden">
            {/* Enhanced Spread-out Ambient Glow */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
          radial-gradient(
            circle at center,
            rgba(35,181,181,0.28) 0%,
            rgba(35,181,181,0.18) 35%,
            rgba(35,181,181,0.08) 60%,
            rgba(35,181,181,0.02) 80%,
            transparent 100%
          )
        `,
                filter: "blur(40px)", // Increased blur to diffuse the light further out
              }}
              animate={{
                opacity: [0.85, 1, 0.85],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Secondary underlying wide glow for maximum dispersion */}
            <div
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(35,181,181,0.12), transparent 75%)",
                filter: "blur(80px)",
              }}
            />

            {/* Subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Dashed circular track ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[82%] h-[82%] rounded-full border border-dashed border-[#23b5b5]/15 pointer-events-none" />

            {/* Center glowing diamond container */}
            <motion.div
              className="absolute w-24 h-24 rounded-2xl bg-[#060a0a] border border-[#23b5b5]/40 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                top: "50%",
                left: "50%",
                boxShadow: `0 0 35px ${accentColor}40`,
              }}
              animate={{
                boxShadow: [
                  `0 0 25px ${accentColor}30`,
                  `0 0 45px ${accentColor}60`,
                  `0 0 25px ${accentColor}30`,
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Slightly larger central diamond graphic */}
              <img
                src={logo}
                alt="Explified"
                className="w-6 h-6 object-contain"
              />
            </motion.div>

            {/* Larger, floating marketplace icons */}
            {satelliteIcons.map(({ Icon, top, left, delay }, i) => (
              <motion.div
                key={i}
                className="absolute w-14 h-14 rounded-xl bg-[#060909] border border-white/10 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 shadow-lg"
                style={{ top, left }}
                animate={{
                  y: [0, -8, 0],
                  x: [0, 2, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay,
                }}
              >
                {/* Rendered individual SVGs automatically inherit this larger layout size */}
                <div className="text-gray-400 scale-[1.25] flex items-center justify-center">
                  <Icon />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Caption row */}
          <div className="w-full max-w-[420px] mx-auto flex items-center justify-between mt-4 px-1">
            <span className="text-xs text-gray-500">
              One platform &middot; Every surface
            </span>
            <span className="text-xs text-gray-600 font-mono">v.2026</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyExplified;
