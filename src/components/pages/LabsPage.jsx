import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Cpu,
  Database,
  Activity,
  X,
  LayoutGrid,
  FlaskConical,
  GitBranch,
  Send,
  Landmark,
  Plane,
  Orbit,
  Layers,
} from "lucide-react";

// --- CONFIG ---
const BRAND_COLOR = "#23b5b5";

// --- ANIMATION HELPERS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

// --- COMPONENT: ANIMATED GRADIENT BACKGROUND ---
const BackgroundMesh = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-black">
    <motion.div
      animate={{
        x: [0, 100, 0],
        y: [0, -50, 0],
        opacity: [0.1, 0.2, 0.1],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full blur-[140px]"
      style={{
        background: `radial-gradient(circle, ${BRAND_COLOR}44 0%, transparent 70%)`,
      }}
    />
    <motion.div
      animate={{
        x: [0, -80, 0],
        y: [0, 100, 0],
        opacity: [0.05, 0.15, 0.05],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[120px]"
      style={{
        background: `radial-gradient(circle, ${BRAND_COLOR}33 0%, transparent 70%)`,
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.15]"
      style={{
        backgroundImage: `radial-gradient(${BRAND_COLOR} 0.5px, transparent 0.5px)`,
        backgroundSize: "30px 30px",
      }}
    />
  </div>
);

// --- COMPONENT: GET ADVISORY MODAL UI ---
const emptyForm = {
  name: "",
  email: "",
  contactNumber: "",
  companyName: "",
  companyWebsite: "",
  projectDescription: "",
  scheduleCall: false,
};

const GetAdvisoryModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const close = () => {
    setForm(emptyForm);
    setError("");
    setDone(false);
    setLoading(false);
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const name = form.name.trim();
    const email = form.email.trim();
    const companyName = form.companyName.trim();
    const projectDescription = form.projectDescription.trim();

    if (!name || !email || !companyName || !projectDescription) {
      setError(
        "Name, email, company name and project description are required",
      );
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "https://cmsapi-pf6diz22ka-uc.a.run.app/api/advisory",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            contactNumber: form.contactNumber.trim(),
            companyName,
            companyWebsite: form.companyWebsite.trim(),
            projectDescription,
            scheduleCall: form.scheduleCall === true,
          }),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Could not submit. Try again.");
      }
      setDone(true);
    } catch (err) {
      setError(err.message || "Could not submit. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-[#0a1213] border border-[#23b5b5]/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(35,181,181,0.15)] z-10 overflow-hidden text-white"
          >
            <button
              onClick={close}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
            >
              <X size={16} />
            </button>

            <div className="mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
                Advisory
              </h2>
              <p className="text-sm text-gray-400">
                {done
                  ? "We'll get back to you shortly."
                  : "Thank you for contacting Explified Labs."}
              </p>
            </div>

            {done ? (
              <button
                type="button"
                onClick={close}
                className="w-full py-3.5 font-bold rounded-2xl text-black transition-all hover:opacity-90 active:scale-[0.99] shadow-[0_10px_25px_-5px_#23b5b566]"
                style={{ backgroundColor: BRAND_COLOR }}
              >
                Close
              </button>
            ) : (
              <form className="space-y-4" onSubmit={submit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Name <span className="text-[#23b5b5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      className="w-full bg-[#070d0e] border border-white/10 focus:border-[#23b5b5] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Email <span className="text-[#23b5b5]">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      className="w-full bg-[#070d0e] border border-white/10 focus:border-[#23b5b5] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Contact number
                    </label>
                    <input
                      type="tel"
                      value={form.contactNumber}
                      onChange={(e) =>
                        setField("contactNumber", e.target.value)
                      }
                      className="w-full bg-[#070d0e] border border-white/10 focus:border-[#23b5b5] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Company name <span className="text-[#23b5b5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) => setField("companyName", e.target.value)}
                      className="w-full bg-[#070d0e] border border-white/10 focus:border-[#23b5b5] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Company website
                  </label>
                  <input
                    type="text"
                    placeholder="yourcompany.com"
                    value={form.companyWebsite}
                    onChange={(e) => setField("companyWebsite", e.target.value)}
                    className="w-full bg-[#070d0e] border border-white/10 focus:border-[#23b5b5] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Describe your project{" "}
                    <span className="text-[#23b5b5]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.projectDescription}
                    onChange={(e) =>
                      setField("projectDescription", e.target.value)
                    }
                    className="w-full bg-[#070d0e] border border-white/10 focus:border-[#23b5b5] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all resize-none"
                  />
                </div>

                <div
                  onClick={() => setField("scheduleCall", !form.scheduleCall)}
                  className="flex items-center justify-between bg-[#070d0e] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 cursor-pointer transition-all select-none"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={form.scheduleCall}
                      onChange={() => {}}
                      className="w-4 h-4 rounded accent-[#23b5b5] cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-gray-200">
                      Also schedule a call
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Optional • 30 min
                  </span>
                </div>

                {error && (
                  <p className="text-xs text-red-400 font-medium">{error}</p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 font-bold rounded-2xl text-black transition-all hover:opacity-90 active:scale-[0.99] shadow-[0_10px_25px_-5px_#23b5b566] disabled:opacity-60"
                    style={{ backgroundColor: BRAND_COLOR }}
                  >
                    {loading ? "Sending…" : "Advisory"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- COMPONENT: HERO SECTION ---
const HeroSection = ({ onOpenModal }) => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-24 overflow-hidden bg-black">
      <BackgroundMesh />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center z-10 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={fadeInUp}>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#23b5b533] bg-[#23b5b50a] backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#23b5b5] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#23b5b5]"></span>
              </span>
              <span className="text-[#23b5b5] text-[10px] font-black uppercase tracking-[0.3em]">
                Trusted by 100+ creators & businesses
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tighter text-white"
          >
            The Lab Behind
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[#23b5b5]">
              Everything We Ship
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-400 max-w-xl leading-relaxed"
          >
            Every Explified app and brand is built here, with one process that
            turns ideas into shipped work, again and again. Bring us your
            complex builds and R&D, and we'll run them the same way.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-5">
            <button
              onClick={onOpenModal}
              className="relative group px-10 py-5 font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_-10px_#23b5b566] inline-block cursor-pointer"
              style={{ backgroundColor: BRAND_COLOR, color: "#000" }}
            >
              <span className="relative z-10">Advisory</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </motion.div>
        </motion.div>

        {/* Hero Visual: The Flowbox */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#23b5b5] to-blue-500 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-[#050505] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0%,#23b5b5_50%,transparent_100%)] opacity-10 pointer-events-none"
            />

            <div className="flex justify-between items-center mb-12 relative z-10">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#23b5b5]">
                <Activity size={14} className="animate-pulse" /> LIVE SYSTEM
                FLOW
              </div>
              <div className="px-3 py-1 bg-[#23b5b51a] border border-[#23b5b533] rounded-full text-[9px] font-black text-[#23b5b5] uppercase tracking-tighter">
                ● All Systems Active
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 relative z-10">
              <SystemNode icon={Database} label="Input" sub="Data Source" />
              <SystemNode
                icon={Cpu}
                label="AI Processing"
                sub="Neural Engine"
                active
              />
              <SystemNode icon={Zap} label="Output" sub="Delivered" />

              <div className="col-span-3 grid grid-cols-3 gap-4 mt-6">
                <StatusPill t="Content Engine" tag="Active" />
                <StatusPill t="Automation" tag="Running" />
                <StatusPill t="Analytics" tag="Live" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- SUB-COMPONENTS ---
const SystemNode = ({ icon: Icon, label, sub, active }) => (
  <div className="flex flex-col items-center gap-4 relative">
    <motion.div
      animate={
        active
          ? {
              boxShadow: [
                "0 0 0px #23b5b500",
                "0 0 30px #23b5b544",
                "0 0 0px #23b5b500",
              ],
            }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity }}
      className={`p-5 rounded-2xl border transition-all duration-500 ${active ? "bg-[#23b5b51a] border-[#23b5b5]" : "bg-white/5 border-white/10 opacity-40"}`}
    >
      <Icon size={24} style={{ color: active ? BRAND_COLOR : "#555" }} />
    </motion.div>
    <div className="text-center">
      <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className="text-[8px] text-gray-600 font-black uppercase">{sub}</div>
    </div>
  </div>
);

const StatusPill = ({ t, tag }) => (
  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#23b5b533] transition-all">
    <div className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-2">
      {t}
    </div>
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-[#23b5b5] animate-pulse" />
      <span className="text-[8px] font-black text-[#23b5b5] uppercase tracking-widest">
        {tag}
      </span>
    </div>
  </div>
);

// --- SHARED: SECTION EYEBROW + GRID BACKDROP ---
const Eyebrow = ({ children }) => (
  <div className="flex items-center gap-4 mb-6">
    <span className="h-px w-10 bg-[#23b5b5]" />
    <span className="text-[#23b5b5] text-xs font-black uppercase tracking-[0.3em]">
      {children}
    </span>
  </div>
);

const GridBackdrop = () => (
  <div
    className="absolute inset-0 opacity-[0.07] pointer-events-none"
    style={{
      backgroundImage: `linear-gradient(${BRAND_COLOR} 1px, transparent 1px), linear-gradient(90deg, ${BRAND_COLOR} 1px, transparent 1px)`,
      backgroundSize: "64px 64px",
    }}
  />
);

const viewportOnce = { once: true, margin: "-80px" };

// --- SECTION 1: OUR PROCESS ---
const processSteps = [
  {
    n: "01",
    title: "Spot",
    body: "Find the real gap: a task people repeat, a tool that's missing, a story no one tells well.",
  },
  {
    n: "02",
    title: "Build",
    body: "Build on what already works, so the effort goes into what's new.",
  },
  {
    n: "03",
    title: "Ship",
    body: "Get it live and approved where people already are.",
  },
  {
    n: "04",
    title: "Learn",
    body: "Let real usage decide what to improve, double down on or retire.",
  },
];

const ProcessSection = () => (
  <section className="relative bg-black px-6 py-28 overflow-hidden">
    <GridBackdrop />
    <div className="relative z-10 max-w-6xl mx-auto">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.div variants={fadeInUp}>
          <Eyebrow>Our Process</Eyebrow>
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-white"
        >
          A Process That{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#23b5b5]">
            Holds Up at Scale
          </span>
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mt-6 text-lg text-gray-400 max-w-md leading-relaxed"
        >
          68+ apps across 13 marketplaces don't happen by accident. The same
          loop runs behind everything we ship, and it's what you get when you
          work with us.
        </motion.p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {processSteps.map((s) => (
          <motion.div
            key={s.n}
            variants={fadeInUp}
            className="p-7 rounded-3xl bg-[#050c0d] border border-white/10 hover:border-[#23b5b566] transition-colors min-h-[216px]"
          >
            <div className="text-[#23b5b5] text-xs font-black tracking-[0.3em] mb-8">
              {s.n}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{s.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{s.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// --- SECTION 2: HIRE THE LAB ---
const hireCards = [
  {
    icon: LayoutGrid,
    title: "Complex Builds",
    points: [
      "Apps and integrations across several platforms",
      "Software that has to pass marketplace review",
    ],
  },
  {
    icon: FlaskConical,
    title: "R&D and Prototypes",
    points: [
      "Proofs of concept before you commit a team",
      "AI tried on a real workflow, not a demo",
    ],
  },
  {
    icon: GitBranch,
    title: "Process and Delivery",
    points: [
      "Structure for teams shipping many products",
      "Planning, QA and release that repeat cleanly",
    ],
  },
];

const HireSection = () => (
  <section className="relative bg-black px-6 py-28">
    <div className="max-w-6xl mx-auto">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.div variants={fadeInUp}>
          <Eyebrow>Hire the Lab</Eyebrow>
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-white"
        >
          Built for <span className="text-[#5c6b6b]">Complex Work.</span>
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mt-6 text-lg text-gray-400 max-w-lg leading-relaxed"
        >
          If one process can run 68+ apps and 5 brands, it can take on hard
          problems for you. You get working results, not slide decks.
        </motion.p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-14 grid md:grid-cols-3 gap-5"
      >
        {hireCards.map(({ icon: Icon, title, points }) => (
          <motion.div
            key={title}
            variants={fadeInUp}
            className="p-7 rounded-3xl border border-[#23b5b533] bg-gradient-to-b from-[#0d2527] to-[#070e0f] hover:border-[#23b5b566] transition-colors"
          >
            <div className="w-13 h-13 p-3.5 mb-10 inline-flex rounded-xl border border-[#23b5b544] bg-[#23b5b50f]">
              <Icon size={22} style={{ color: BRAND_COLOR }} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
            <ul>
              {points.map((p) => (
                <li
                  key={p}
                  className="py-3 border-t border-white/10 text-sm text-gray-300"
                >
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// --- SECTION 3: PRODUCTS AND BRANDS ---
const stats = [
  { value: "68+", unit: "Apps", note: "Approved and live" },
  {
    value: "13",
    unit: "Marketplaces",
    note: "Figma, Shopify, Trello, Chrome, Framer & more",
  },
  { value: "5", unit: "Brands", note: "39K+ subscribers" },
];

const products = [
  { letter: "F", name: "Figma Plugins", count: 30 },
  { letter: "T", name: "Trello Power-Ups", count: 16 },
  { letter: "A", name: "Atlassian Tools", count: 16 },
  { letter: "S", name: "Shopify Apps", count: 13 },
  { letter: "C", name: "Chrome Extensions", count: 12 },
];

const brands = [
  {
    name: "Explified Labs",
    channel: "YouTube",
    icon: Send,
    bg: "from-teal-600 to-teal-900",
  },
  {
    name: "Steraclub",
    channel: "Instagram",
    icon: Layers,
    bg: "from-red-500 to-red-800",
  },
  {
    name: "Historic Knowledge",
    channel: "YouTube",
    icon: Landmark,
    bg: "from-amber-500 to-amber-800",
  },
  {
    name: "Airlogistics",
    channel: "YouTube",
    icon: Plane,
    bg: "from-blue-500 to-blue-800",
  },
  {
    name: "Astro4141",
    channel: "YouTube",
    icon: Orbit,
    bg: "from-purple-500 to-purple-800",
  },
];

const PanelHeader = ({ title, pill }) => (
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-2xl font-bold text-white">{title}</h3>
    <span className="px-3 py-1 rounded-full border border-[#23b5b544] text-[10px] font-black uppercase tracking-[0.2em] text-[#23b5b5]">
      {pill}
    </span>
  </div>
);

const ProductsBrandsSection = () => (
  <section className="relative bg-black px-6 py-28">
    <div className="max-w-6xl mx-auto">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.div variants={fadeInUp}>
          <Eyebrow>What the Lab Has Made</Eyebrow>
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-white"
        >
          Products and Brands,{" "}
          <span className="text-[#5c6b6b]">From One Lab.</span>
        </motion.h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-12 grid md:grid-cols-3 md:divide-x divide-white/10"
      >
        {stats.map((s) => (
          <motion.div
            key={s.unit}
            variants={fadeInUp}
            className="px-0 md:px-10 py-5 first:md:pl-10"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-bold text-white tracking-tighter">
                {s.value}
              </span>
              <span className="text-xl font-semibold text-[#23b5b5]">
                {s.unit}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-400">{s.note}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-12 grid md:grid-cols-2 gap-5"
      >
        <motion.div
          variants={fadeInUp}
          className="p-8 rounded-3xl border border-[#23b5b533] bg-gradient-to-b from-[#0d2527] to-[#070e0f]"
        >
          <PanelHeader title="Products" pill="68+ Apps" />
          <ul>
            {products.map((p) => (
              <li
                key={p.name}
                className="flex items-center justify-between py-4 border-t border-white/10"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                    {p.letter}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {p.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-[#23b5b5]">
                  {p.count}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="p-8 rounded-3xl border border-[#23b5b533] bg-gradient-to-b from-[#0d2527] to-[#070e0f]"
        >
          <PanelHeader title="Brands" pill="39K+ Subscribers" />
          <ul>
            {brands.map(({ name, channel, icon: Icon, bg }) => (
              <li
                key={name}
                className="flex items-center justify-between py-4 border-t border-white/10"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${bg} flex items-center justify-center`}
                  >
                    <Icon size={16} className="text-white" />
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {name}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#23b5b5]">
                  {channel}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// --- SECTION 4: CLOSING CTA ---
const CtaSection = ({ onOpenModal }) => (
  <section className="relative bg-black px-6 py-36 overflow-hidden">
    <GridBackdrop />
    <div
      className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[120px] pointer-events-none"
      style={{
        background: `radial-gradient(circle, ${BRAND_COLOR}44 0%, transparent 70%)`,
      }}
    />
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="relative z-10 max-w-2xl mx-auto text-center"
    >
      <motion.h2
        variants={fadeInUp}
        className="text-5xl lg:text-6xl font-bold tracking-tighter text-white"
      >
        Have Something{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#23b5b5]">
          Complex?
        </span>
      </motion.h2>
      <motion.p
        variants={fadeInUp}
        className="mt-5 text-base text-gray-400 max-w-sm mx-auto leading-relaxed"
      >
        Tell us what you're trying to build. Advisory is how companies work with
        the lab.
      </motion.p>
      <motion.div variants={fadeInUp} className="mt-9">
        <button
          onClick={onOpenModal}
          className="px-9 py-4 font-bold text-sm rounded-full text-black cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_#23b5b566]"
          style={{ backgroundColor: BRAND_COLOR }}
        >
          Advisory
        </button>
      </motion.div>
    </motion.div>
  </section>
);

export default function ExplifiedLabs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);

  return (
    <div className="bg-black text-white selection:bg-[#23b5b544] selection:text-[#23b5b5]">
      <HeroSection onOpenModal={openModal} />
      <ProcessSection />
      <HireSection />
      <ProductsBrandsSection />
      <CtaSection onOpenModal={openModal} />
      <GetAdvisoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
