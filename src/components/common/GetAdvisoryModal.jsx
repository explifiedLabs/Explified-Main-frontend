import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const BRAND_COLOR = "#23b5b5";

const emptyForm = {
  name: "",
  email: "",
  contactNumber: "",
  companyName: "",
  companyWebsite: "",
  projectDescription: "",
  scheduleCall: false,
};

const GetAdvisoryModal = ({
  isOpen,
  onClose,
  title = "Advisory",
  subtitle,
  buttonText,
}) => {
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
            className="relative w-full max-w-lg bg-[#0a1213] border border-[#23b5b5]/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(35,181,181,0.15)] z-10 overflow-y-auto max-h-[90vh] text-white"
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
                {title}
              </h2>
              <p className="text-sm text-gray-400">
                {done
                  ? "We'll get back to you shortly."
                  : subtitle || "Thank you for contacting Explified Labs."}
              </p>
            </div>

            {done ? (
              <button
                type="button"
                onClick={close}
                className="w-full py-3.5 font-bold rounded-2xl text-black transition-all hover:opacity-90 active:scale-[0.99] shadow-[0_10px_25px_-5px_#23b5b566] cursor-pointer"
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
                    className="w-full py-3.5 font-bold rounded-2xl text-black transition-all hover:opacity-90 active:scale-[0.99] shadow-[0_10px_25px_-5px_#23b5b566] disabled:opacity-60 cursor-pointer"
                    style={{ backgroundColor: BRAND_COLOR }}
                  >
                    {loading ? "Sending…" : buttonText || title}
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

export default GetAdvisoryModal;
