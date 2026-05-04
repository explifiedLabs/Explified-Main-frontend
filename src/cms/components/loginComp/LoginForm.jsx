import { useState, useEffect } from "react";
import { useNavigate } from "react-router"; // ✅ FIXED
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../features/auth/authSlice";
import { ExplifiedLogo, GoogleIcon } from "./svgAssets";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function LoginForm() {
  const [focusedInput, setFocusedInput] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading } = useSelector((state) => state.auth);

  // ✅ AUTO REDIRECT (prevents flicker)
  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

const onSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.warning("Please fill in all fields");
    return;
  }

  try {
    const response = await dispatch(login({ email, password })).unwrap();

    // ✅ Show backend message
    toast.success(response?.message || "Login successful");

    navigate("/admin/dashboard", { replace: true });

  } catch (errorMessage) {
    toast.error(errorMessage || "Login failed");
  }
};

  return (
    <div className="w-full lg:w-[45%] flex flex-col px-8 sm:px-16 lg:px-20 py-8 lg:py-12 relative z-10 bg-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-auto"
      >
        <ExplifiedLogo />
        <span className="font-extrabold text-xl tracking-tight text-gray-900">
          Explified
        </span>
      </motion.div>

      <motion.div
        className="max-w-[420px] w-full mx-auto flex-1 flex flex-col justify-center mt-12 mb-12"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp} className="mb-8">
          <h1 className="text-[36px] font-extrabold tracking-tight mb-2.5 text-gray-900 leading-tight">
            Get Started Now
          </h1>
          <p className="text-gray-500 text-[15px] font-medium">
            Enter your credentials to access your account.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="mb-6">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-[14px] font-semibold text-gray-700"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-gray-100"></div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            or
          </span>
          <div className="flex-1 h-[1px] bg-gray-100"></div>
        </motion.div>

        <motion.form
          variants={staggerContainer}
          className="space-y-5"
          onSubmit={onSubmit}
        >
          <motion.div variants={fadeUp} className="space-y-1.5">
            <label className="text-[13px] font-semibold text-gray-700 block ml-1">
              Work Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail
                  size={18}
                  className={
                    focusedInput === "email"
                      ? "text-[#23b5b5]"
                      : "text-gray-400"
                  }
                />
              </div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="name@company.com"
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] rounded-xl text-[15px] placeholder-gray-400 focus:border-[#23b5b5] focus:ring-4 focus:ring-[#23b5b5]/10 outline-none transition-all duration-300"
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[13px] font-semibold text-gray-700 block">
                Password
              </label>
              <a
                href="#"
                className="text-[12px] font-semibold text-[#23b5b5] hover:text-[#198f8f] transition-colors"
              >
                Forgot?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock
                  size={18}
                  className={
                    focusedInput === "password"
                      ? "text-[#23b5b5]"
                      : "text-gray-400"
                  }
                />
              </div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="••••••••••••"
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] rounded-xl text-[15px] text-gray-900 placeholder-gray-400 focus:border-[#23b5b5] focus:ring-4 focus:ring-[#23b5b5]/10 outline-none transition-all duration-300"
              />
            </div>
          </motion.div>

          <motion.button
            variants={fadeUp}
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            disabled={isLoading}
            className="w-full h-12 mt-6 bg-gradient-to-r from-[#23b5b5] to-[#1ca1a1] hover:from-[#1ca1a1] hover:to-[#178585] text-white rounded-xl font-semibold text-[15px] shadow-[0_4px_14px_rgba(35,181,181,0.3)] hover:shadow-[0_6px_20px_rgba(35,181,181,0.35)] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Sign In
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </motion.button>
        </motion.form>

        <motion.div variants={fadeUp} className="mt-8 text-center">
          <p className="text-[14px] text-gray-500 font-medium">
            Don't have an account?{" "}
            <a
              href="#"
              className="font-bold text-gray-900 hover:text-[#23b5b5] transition-colors"
            >
              Sign up
            </a>
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-auto flex justify-between items-center text-[13px] text-gray-400 font-medium border-t border-gray-100 pt-6"
      >
        {" "}
        <span>© 2024 Explified Inc.</span>{" "}
        <div className="flex gap-4">
          {" "}
          <a href="#" className="hover:text-gray-900 transition-colors">
            Help
          </a>{" "}
          <a href="#" className="hover:text-gray-900 transition-colors">
            Privacy
          </a>{" "}
          <a href="#" className="hover:text-gray-900 transition-colors">
            Terms
          </a>{" "}
        </div>{" "}
      </motion.div>

    </div>
  );
}
