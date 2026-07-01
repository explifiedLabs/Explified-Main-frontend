import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShieldCheck, Loader2, CheckCircle2, Lock,
  Zap, Shield, Info
} from 'lucide-react';

export default function PaymentModal({ app, onClose, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const priceRaw = app?.pricing?.toLowerCase().includes('free') ? 0 : 19.99;
  const tax = priceRaw > 0 ? 2.00 : 0;
  const total = priceRaw + tax;
  const planType = priceRaw === 0 ? 'free' : 'monthly';
  const isFree = priceRaw === 0;

  const resolvedPaymentStatus = 'paid';

  const handlePay = (e) => {
    e.preventDefault();
    if (!agreed) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      onSuccess({
        appId: app.id,
        appName: app.name,
        domain: app.path,
        marketplace: app.category?.toLowerCase() || 'explified',
        planType,
        amount: total,
        paymentStatus: resolvedPaymentStatus,
      });
    }, isFree ? 1200 : 2000);
  };

  const freeFeatures = [
    'All core features included',
    'Unlimited projects',
    'Community support',
    'No hidden charges, ever',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-white rounded-2xl w-full max-w-[1000px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={!isProcessing && !isSuccess ? onClose : undefined}
          className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
          disabled={isProcessing || isSuccess}
        >
          <X size={20} />
        </button>

        {/* PROCESSING / SUCCESS OVERLAY */}
        <AnimatePresence>
          {(isProcessing || isSuccess) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-40 bg-white/97 backdrop-blur-sm flex flex-col items-center justify-center"
            >
              {isProcessing ? (
                <div className="flex flex-col items-center text-center">
                  <Loader2 size={50} className="animate-spin text-[#23b5b5] mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isFree ? 'Activating your plan...' : 'Processing payment...'}
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    {isFree
                      ? 'Just a moment while we set things up.'
                      : 'Please do not close this window.'}
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-24 h-24 bg-[#23b5b5]/10 border border-[#23b5b5]/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={50} className="text-[#23b5b5]" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {isFree ? 'Plan activated!' : 'Payment successful!'}
                  </h3>
                  <p className="text-gray-500 font-medium">Setting up your subscription...</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEFT COLUMN */}
        <div className="w-full md:w-3/5 p-6 md:p-10 lg:p-12 flex flex-col overflow-y-auto max-h-[85vh]">

          {/* Test environment banner */}
          <div className="flex items-start gap-2.5 p-3 mb-6 rounded-xl bg-red-50 border border-red-200">
            <Info size={15} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-xs font-bold text-red-600">Test Environment</p>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-500 border border-red-300">Coming Soon</span>
              </div>
              <p className="text-[11px] text-red-400/80 leading-relaxed">
                This is a <strong>testing payment interface</strong>. No real charges will be made. All transactions are simulated for development purposes only.
              </p>
            </div>
          </div>

          {isFree ? (
            /* FREE PLAN FLOW */
            <form onSubmit={handlePay} className="flex flex-col gap-6 flex-1">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border mb-4 bg-[#23b5b5]/10 text-[#23b5b5] border-[#23b5b5]/30">
                  <Zap size={12} /> Explified plan — free
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Activate your free plan</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#23b5b5]" />
                  No credit card required. No payment needed.
                </p>
              </div>

              {/* Price highlight */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black text-gray-900">$0</span>
                  <span className="text-gray-400 text-base">/ month, forever</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {freeFeatures.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 size={15} className="text-[#23b5b5] shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Zero data notice */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <Shield size={16} className="text-[#23b5b5] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Zero Data Collection</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    We do <strong>not</strong> collect, store, or process any personal or payment information through this interface.
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-semibold text-emerald-600">
                  <Lock size={10} /> SSL Secured
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-[11px] font-semibold text-blue-600">
                  <ShieldCheck size={10} /> GDPR Compliant
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-full text-[11px] font-semibold text-purple-600">
                  <Info size={10} /> No Data Stored
                </span>
              </div>

              <div className="mt-auto">
                <button
                  type="submit"
                  className="w-full bg-[#23b5b5] hover:bg-[#1ca3a3] text-black font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Zap size={20} /> Activate free plan — $0.00
                </button>
                <label className="flex items-start gap-2.5 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#23b5b5] focus:ring-[#23b5b5] bg-white"
                  />
                  <span className="text-[13px] text-gray-400 leading-snug">
                    By clicking this, I agree to Explified's{' '}
                    <span className="text-[#23b5b5] font-medium hover:underline cursor-pointer">Terms & Conditions</span>{' '}
                    and{' '}
                    <span className="text-[#23b5b5] font-medium hover:underline cursor-pointer">Privacy Policy</span>.
                  </span>
                </label>
              </div>
            </form>

          ) : (
            /* PAID PLAN FLOW — Single Explified Payment option */
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Complete your payment</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#23b5b5]" />
                  All transactions are secure and encrypted
                </p>
              </div>

              {/* Zero data notice */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200 mb-5">
                <Shield size={15} className="text-[#23b5b5] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-0.5">Zero Data Collection</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    We do <strong>not</strong> collect or store any payment information. This is a testing interface — no real charges are processed.
                  </p>
                </div>
              </div>

              {/* Compliance badges */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-semibold text-emerald-600">
                  <Lock size={10} /> SSL Secured
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-[11px] font-semibold text-blue-600">
                  <ShieldCheck size={10} /> GDPR Compliant
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-full text-[11px] font-semibold text-purple-600">
                  <Info size={10} /> No Data Stored
                </span>
              </div>

              <form id="payment-form" onSubmit={handlePay} className="flex-1 flex flex-col space-y-4">

                {/* Single Explified Payment Option */}
                <div className="border border-[#23b5b5]/40 ring-1 ring-[#23b5b5]/10 rounded-xl bg-gray-50 shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="p-4 md:p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-[#23b5b5] flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#23b5b5]" />
                      </div>
                      <span className="font-semibold text-gray-800">Explified Payment</span>
                    </div>
                    {/* Explified Logo mark */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gradient-to-br from-[#23b5b5] to-[#167878] flex items-center justify-center text-black font-bold text-xs shadow">E</div>
                      <span className="text-[#23b5b5] font-bold text-sm tracking-tight">Explified</span>
                    </div>
                  </div>

                </div>

                <div className="mt-6 pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#23b5b5] hover:bg-[#1ca3a3] text-black font-bold text-lg py-4 rounded-xl shadow-lg shadow-[#23b5b5]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!agreed}
                  >
                    <Zap size={20} /> Pay ${total.toFixed(2)}
                  </button>
                  <label className="flex items-start gap-2.5 mt-4 cursor-pointer group">
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#23b5b5] focus:ring-[#23b5b5] bg-white"
                      />
                    </div>
                    <span className="text-[13px] text-gray-400 leading-snug">
                      By clicking this, I agree to Explified's{' '}
                      <span className="text-[#23b5b5] font-medium hover:underline">Terms & Conditions</span> and{' '}
                      <span className="text-[#23b5b5] font-medium hover:underline">Privacy Policy</span>.
                    </span>
                  </label>
                </div>
              </form>
            </>
          )}
        </div>

        {/* RIGHT COLUMN - CART SUMMARY */}
        <div className="w-full md:w-2/5 bg-gray-50 p-6 md:p-10 lg:p-12 border-l border-gray-200 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Your cart (1)</h3>

          <div className="bg-white rounded-xl p-4 border border-gray-200 flex gap-4 mb-6">
            <div className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center p-2 shrink-0">
              {app?.iconUrl ? (
                <img src={app.iconUrl} alt={app.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-10 h-10 bg-[#23b5b5] rounded-md flex items-center justify-center font-bold text-black text-xl">E</div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{app?.name} Subscription</h4>
              <p className="text-xs text-gray-400 font-medium mb-2">Qty : 1</p>
              <div className="text-sm font-bold text-gray-900">${priceRaw.toFixed(2)} <span className="text-xs font-normal text-gray-400">/ mo</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4 mb-6">
            <h4 className="font-bold text-gray-900 text-sm mb-4">Order summary</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="font-semibold text-gray-700">${priceRaw.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shipping</span>
              <span className="font-semibold text-gray-700">Digital (Free)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tax</span>
              <span className="font-semibold text-gray-700">${tax.toFixed(2)}</span>
            </div>
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between items-end">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900 leading-none">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-auto pt-4 space-y-3">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold tracking-wide uppercase border border-emerald-200">
                <Lock size={12} /> SSL Secured Checkout
              </div>
            </div>
            <p className="text-[10px] text-gray-300 text-center leading-relaxed px-2">
              This is a <strong>test environment</strong>. No real transactions occur. We do not store any payment or personal data. For support, contact{' '}
              <span className="text-[#23b5b5]">support@explified.com</span>
            </p>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}


