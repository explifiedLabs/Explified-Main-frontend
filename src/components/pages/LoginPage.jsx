import React, { useState } from "react";
import { useNavigate } from "react-router"; // Adjust router import if needed
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

// REDUX IMPORTS
import { useSelector, useDispatch } from "react-redux";
// Adjust this import path to your actual authSlice location
import { loginUser, registerUser, loginWithGoogle } from "../../redux/authSlice.js"; 

import logo from "../../assets/logo.png"; // Replace with your actual logo path

// --- BRAND ICONS (Inline SVGs for high performance and no external requests) ---
const BrandIcons = {
  Google: () => (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.3 35 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.5 39.5 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6.2 7.1l6.2 5.2C39.1 36.7 44 31 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  ),
  Shopify: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <path d="M18.7 5.9L16 3H7.3L4.6 5.9C4.2 6.3 4 6.8 4 7.4V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V7.4C20 6.8 19.8 6.3 18.7 5.9Z" fill="#95BF47"/>
      <path d="M15 9.5C15 11.4 13.4 13 11.5 13C9.6 13 8 11.4 8 9.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Figma: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <path d="M8 7C8 4.79086 9.79086 3 12 3H16V7C16 9.20914 14.2091 11 12 11H8V7Z" fill="#F24E1E"/>
      <path d="M8 11H12V15H8V11Z" fill="#A259FF"/>
      <path d="M12 11H16C18.2091 11 20 9.20914 20 7V7C20 4.79086 18.2091 3 16 3H12V11Z" fill="#1ABCFE"/>
      <path d="M8 15C8 12.7909 9.79086 11 12 11V15C12 17.2091 10.2091 19 8 19C5.79086 19 4 17.2091 4 15C4 12.7909 5.79086 11 8 11V15Z" fill="#0ACF83"/>
      <path d="M12 15V19C12 21.2091 10.2091 23 8 23C5.79086 23 4 21.2091 4 19C4 16.7909 5.79086 15 8 15H12Z" fill="#FF7262"/>
    </svg>
  ),
  Atlassian: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <path d="M12 22C11.5 22 11 21.5 11 21V3C11 2.5 11.5 2 12 2C12.5 2 13 2.5 13 3V21C13 21.5 12.5 22 12 22Z" fill="#2684FF"/>
      <path d="M6 16C5.5 16 5 15.5 5 15V9C5 8.5 5.5 8 6 8C6.5 8 7 8.5 7 9V15C7 15.5 6.5 16 6 16Z" fill="#2684FF"/>
      <path d="M18 18C17.5 18 17 17.5 17 17V7C17 6.5 17.5 6 18 6C18.5 6 19 6.5 19 7V17C19 17.5 18.5 18 18 18Z" fill="#2684FF"/>
    </svg>
  ),
  Trello: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#0079BF"/>
      <rect x="6" y="6" width="5" height="10" rx="1" fill="white"/>
      <rect x="13" y="6" width="5" height="6" rx="1" fill="white"/>
    </svg>
  ),
  Chrome: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <circle cx="12" cy="12" r="10" fill="#F0CD4B"/>
      <path d="M12 2C15.6 2 18.8 3.9 20.6 6.8L12 22C6.5 22 2 17.5 2 12C2 10 2.5 8.1 3.4 6.5L12 2Z" fill="#E8403D"/>
      <path d="M12 22L20.6 6.8C21.5 8.4 22 10.1 22 12C22 17.5 17.5 22 12 22Z" fill="#4B9C56"/>
      <circle cx="12" cy="12" r="4.5" fill="white"/>
      <circle cx="12" cy="12" r="3.5" fill="#3676DD"/>
    </svg>
  )
};

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use Redux state
  const { user } = useSelector((state) => state.auth);

  const [authMode, setAuthMode] = useState("signup");
  const [authLoading, setAuthLoading] = useState(false);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setAuthForm({
      ...authForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      setAuthLoading(true);

      if (authMode === "signup") {
        if (authForm.password !== authForm.confirmPassword) {
          return alert("Passwords do not match");
        }
        await dispatch(registerUser({
          name: authForm.name,
          email: authForm.email,
          password: authForm.password,
        })).unwrap();
      } else {
        await dispatch(loginUser({
          email: authForm.email,
          password: authForm.password,
        })).unwrap();
      }

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert(error || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      setAuthLoading(true);
      await dispatch(loginWithGoogle()).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    } finally {
      setAuthLoading(false);
    }
  };

  // Framer Motion staggered reveal for the right side
  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" }
    })
  };

  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center p-4 sm:p-6 relative font-sans text-gray-200">
      
      {/* Subtle Background Glows (Optimized) */}
      <div className="fixed top-0 left-1/4 w-[40vw] h-[40vw] bg-[#23b5b5]/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="fixed bottom-0 right-1/4 w-[30vw] h-[30vw] bg-[#23b5b5]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />

      {/* Main Card Container */}
      <div className="w-full max-w-[1200px] bg-[#0C0E12] rounded-[24px] border border-white/5 shadow-2xl flex flex-col-reverse lg:flex-row overflow-hidden relative z-10 min-h-[700px]">
        
        {/* LEFT PANE: AUTH FORM */}
        <div className="w-full lg:w-[42%] p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-lg bg-[#14161A] border border-white/10 flex items-center justify-center overflow-hidden">
              <img src={logo} alt="Explified" className="w-5 h-5 object-contain" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <LucideIcons.Layers size={18} className="text-[#23b5b5] hidden" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Explified</span>
          </div>

          {/* Segmented Toggle Control */}
          <div className="flex p-1 rounded-xl bg-[#14161A] border border-white/5 mb-10 max-w-[280px]">
            <button 
              onClick={() => setAuthMode("signin")} 
              className={`flex-1 h-9 rounded-lg text-[11px] font-bold tracking-[0.1em] uppercase transition-all duration-200 ${authMode === "signin" ? "bg-[#23b5b5] text-black shadow-md" : "text-gray-400 hover:text-white"}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setAuthMode("signup")} 
              className={`flex-1 h-9 rounded-lg text-[11px] font-bold tracking-[0.1em] uppercase transition-all duration-200 ${authMode === "signup" ? "bg-[#23b5b5] text-black shadow-md" : "text-gray-400 hover:text-white"}`}
            >
              Sign Up
            </button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[28px] font-extrabold text-white tracking-tight leading-tight">
              {authMode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              {authMode === "signin" ? "Sign in to your centralized workspace" : "Start automating in minutes — it's free"}
            </p>
          </div>

          {/* Google Auth Button */}
          <button 
            onClick={handleGoogleLogin} 
            disabled={authLoading} 
            className="w-full h-12 rounded-xl border border-white/10 bg-[#14161A] hover:bg-[#1A1C22] transition-colors flex items-center justify-center gap-3 text-white font-medium text-sm mb-6"
          >
            <BrandIcons.Google />
            {authMode === "signin" ? "Sign in with Google" : "Sign up with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">Or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* CSS-only Form (Snappy, No lag) */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Conditional fields without heavy JS layout animations to fix lag */}
            <div className={`overflow-hidden transition-all duration-300 ${authMode === "signup" ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="relative flex items-center">
                <LucideIcons.User size={16} className="absolute left-4 text-gray-500" />
                <input 
                  type="text" name="name" 
                  value={authForm.name} 
                  onChange={handleInputChange} 
                  required={authMode === "signup"} 
                  placeholder="Full name" 
                  className="w-full h-12 bg-transparent border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#23b5b5] focus:bg-[#23b5b5]/5 transition-colors" 
                />
              </div>
            </div>

            <div className="relative flex items-center">
              <LucideIcons.Mail size={16} className="absolute left-4 text-gray-500" />
              <input 
                type="email" name="email" 
                value={authForm.email} 
                onChange={handleInputChange} 
                required 
                placeholder="hello@explified.com" 
                className="w-full h-12 bg-transparent border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#23b5b5] focus:bg-[#23b5b5]/5 transition-colors" 
              />
            </div>

            <div className="relative flex items-center">
              <LucideIcons.Lock size={16} className="absolute left-4 text-gray-500" />
              <input 
                type="password" name="password" 
                value={authForm.password} 
                onChange={handleInputChange} 
                required 
                placeholder="••••••••••••••••" 
                className="w-full h-12 bg-transparent border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#23b5b5] focus:bg-[#23b5b5]/5 transition-colors" 
              />
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${authMode === "signup" ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="relative flex items-center">
                <LucideIcons.Lock size={16} className="absolute left-4 text-gray-500" />
                <input 
                  type="password" name="confirmPassword" 
                  value={authForm.confirmPassword} 
                  onChange={handleInputChange} 
                  required={authMode === "signup"} 
                  placeholder="Confirm password" 
                  className="w-full h-12 bg-transparent border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#23b5b5] focus:bg-[#23b5b5]/5 transition-colors" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={authLoading} 
              className="w-full h-12 mt-2 rounded-xl bg-[#23b5b5] hover:bg-[#1fa1a1] active:scale-[0.98] disabled:opacity-50 text-black text-[14px] font-bold transition-all flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <LucideIcons.Loader2 size={16} className="animate-spin" />
              ) : authMode === "signin" ? (
                <>Sign In <LucideIcons.ArrowRight size={16} /></>
              ) : (
                <>Create Account <LucideIcons.ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Footer Text */}
          <div className="mt-6 text-center text-xs text-gray-500">
            {authMode === "signin" ? (
              <>No account? <button onClick={() => setAuthMode("signup")} className="text-[#23b5b5] font-semibold hover:underline">Sign up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setAuthMode("signin")} className="text-[#23b5b5] font-semibold hover:underline">Sign in</button></>
            )}
          </div>
        </div>

        {/* RIGHT PANE: SHOWCASE / MARKETPLACE */}
        <div className="hidden lg:flex flex-col flex-1 bg-[#090A0D] border-l border-white/5 relative p-14 justify-between">
          
          <div className="relative z-10 flex flex-col max-w-lg mx-auto w-full flex-1 justify-center">
            
            {/* Tagline Header */}
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#23b5b5]/10 border border-[#23b5b5]/20 text-[#23b5b5] text-[10px] font-bold tracking-[0.15em] uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#23b5b5] animate-pulse" />
                Explified Suite
              </div>
              <h1 className="text-4xl leading-[1.1] font-extrabold text-white tracking-tight">
                Discover our collection of <br/><span className="text-[#23b5b5]">high-performance tools</span> <br/>and extensions.
              </h1>
              <p className="text-gray-400 mt-5 text-[15px] leading-relaxed max-w-md">
                Designed to optimize your creative and technical workflow, all in one centralized hub.
              </p>
            </motion.div>

            {/* Marketplace Grid Showcase */}
            <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="w-full">
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Available natively on</h3>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Integration Card 1 */}
                <div className="bg-[#14161A] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-[#1A1D23] transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BrandIcons.Shopify />
                  </div>
                  <span className="text-xs font-semibold text-gray-300">Shopify</span>
                </div>

                {/* Integration Card 2 */}
                <div className="bg-[#14161A] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-[#1A1D23] transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BrandIcons.Figma />
                  </div>
                  <span className="text-xs font-semibold text-gray-300">Figma</span>
                </div>

                {/* Integration Card 3 */}
                <div className="bg-[#14161A] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-[#1A1D23] transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BrandIcons.Atlassian />
                  </div>
                  <span className="text-xs font-semibold text-gray-300">Jira</span>
                </div>

                {/* Integration Card 4 */}
                <div className="bg-[#14161A] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-[#1A1D23] transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BrandIcons.Trello />
                  </div>
                  <span className="text-xs font-semibold text-gray-300">Trello</span>
                </div>

                {/* Integration Card 5 */}
                <div className="bg-[#14161A] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-[#1A1D23] transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BrandIcons.Chrome />
                  </div>
                  <span className="text-xs font-semibold text-gray-300">Chrome</span>
                </div>

                {/* Integration Card 6 (More) */}
                <div className="bg-transparent border border-dashed border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:border-[#23b5b5]/50 transition-colors group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                    <LucideIcons.Plus size={24} className="text-gray-500 group-hover:text-[#23b5b5] transition-colors" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 group-hover:text-[#23b5b5] transition-colors">40+ More</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Stats (Matched to reference) */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="mt-auto pt-10 border-t border-white/5 grid grid-cols-3 gap-6 max-w-lg mx-auto w-full">
            <div>
              <div className="text-[26px] font-black text-white">10K+</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Active Users</div>
            </div>
            <div>
              <div className="text-[26px] font-black text-white">99.9%</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Uptime SLA</div>
            </div>
            <div>
              <div className="text-[26px] font-black text-[#23b5b5]">{'<'} 1s</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Response Time</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;