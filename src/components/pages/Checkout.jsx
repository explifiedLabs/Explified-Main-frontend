import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [state, setState]         = useState("loading");
  const [errorMessage, setError]  = useState("");
  const [isTopup, setIsTopup]     = useState(false);

  useEffect(() => {
    const params            = new URLSearchParams(window.location.search);
    const dodoSession       = params.get("session");
    const status            = params.get("status");
    const subscriptionId    = params.get("subscription_id");
    const paymentId         = params.get("payment_id");
    const paddleTransaction = params.get("_ptxn");

    if (status === "success" || status === "succeeded" || status === "active") {
      // Dodo passes subscription_id for subscription payments.
      // If it's missing on success, it's a one-time top-up purchase.
      const topup = !!paymentId && !subscriptionId;
      setIsTopup(topup);
      setState("closed");
      return;
    }

    if (dodoSession) {
      window.location.href = decodeURIComponent(dodoSession);
      return;
    }

    if (paddleTransaction) {
      handlePaddleCheckout(paddleTransaction);
      return;
    }

    setError("No checkout session found. Please go back to the Figma plugin and try again.");
    setState("error");
  }, []);

  function handlePaddleCheckout(transactionId) {
    let attempts = 0;
    const tryOpen = () => {
      attempts += 1;
      if (window.Paddle) {
        try {
          window.Paddle.Environment.set(import.meta.env.VITE_PADDLE_ENV || "production");
          window.Paddle.Initialize({
            token: import.meta.env.VITE_PADDLE_TOKEN,
            eventCallback: (e) => { if (e.name === "checkout.closed") setState("closed"); },
          });
          window.Paddle.Checkout.open({ transactionId });
          setState("opening");
        } catch {
          setError("Something went wrong. Please try again from the plugin.");
          setState("error");
        }
        return;
      }
      if (attempts >= 20) {
        setError("Checkout failed to load. Please check your connection and try again.");
        setState("error");
        return;
      }
      setTimeout(tryOpen, 200);
    };
    tryOpen();
  }

  // Checklist items — different for subscription vs top-up
  const successItems = isTopup
    ? [
        { icon: "✦", text: "Credits added to your account" },
        { icon: "✦", text: "Ready to use immediately" },
        { icon: "✦", text: "Receipt sent to your email" },
      ]
    : [
        { icon: "✦", text: "Credits added to your account" },
        { icon: "✦", text: "All features unlocked" },
        { icon: "✦", text: "Receipt sent to your email" },
      ];

  const successTitle = isTopup ? "Credits added" : "Payment complete";
  const successSubtitle = isTopup
    ? "Close this tab and return to the Figma plugin — your credits are ready to use."
    : "Close this tab and return to the Figma plugin — your plan will update in a few seconds.";

  return (
    <>
      <style>{`
        @keyframes co-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes co-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes co-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.12); }
        }
        .co-card {
          animation: co-in 0.45s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .co-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6366f1;
          animation: co-pulse 1.4s ease-in-out infinite;
        }
        .co-dot:nth-child(2) { animation-delay: 0.2s; background: #818cf8; }
        .co-dot:nth-child(3) { animation-delay: 0.4s; background: #a5b4fc; }
      `}</style>

      <div style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>

        <div className="co-card" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0px",
          textAlign: "center",
          maxWidth: "380px",
          width: "100%",
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
        }}>

          {/* TOP ACCENT BAR */}
          <div style={{
            width: "100%",
            height: "3px",
            background: "linear-gradient(90deg, #4f46e5, #6366f1, #818cf8, #6366f1, #4f46e5)",
          }} />

          <div style={{
            padding: "40px 36px 36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "18px",
          }}>

            {/* ── LOADING ──────────────────────────────────── */}
            {(state === "loading" || state === "opening") && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <div className="co-dot" />
                  <div className="co-dot" />
                  <div className="co-dot" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "17px", fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>
                    Opening checkout
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                    You'll be redirected in a moment
                  </p>
                </div>
              </>
            )}

            {/* ── SUCCESS ──────────────────────────────────── */}
            {state === "closed" && (
              <>
                {/* Glow + check circle */}
                <div style={{ position: "relative", width: "72px", height: "72px", marginBottom: "4px" }}>
                  <div style={{
                    position: "absolute", inset: "-8px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
                  }} />
                  <div style={{
                    width: "72px", height: "72px",
                    borderRadius: "50%",
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="#818cf8" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Title + subtitle */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "20px", fontWeight: 700, margin: 0, letterSpacing: "-0.03em" }}>
                    {successTitle}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13.5px", lineHeight: 1.7, margin: 0, maxWidth: "260px" }}>
                    {successSubtitle}
                  </p>
                </div>

                {/* Divider */}
                <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.06)", margin: "2px 0" }} />

                {/* Checklist */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                  {successItems.map(({ icon, text }) => (
                    <div key={text} style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      textAlign: "left",
                    }}>
                      <span style={{ color: "#6366f1", fontSize: "10px" }}>{icon}</span>
                      <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Secured badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "100px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1L8.5 2.5V5C8.5 7 6.5 8.5 5 9C3.5 8.5 1.5 7 1.5 5V2.5L5 1Z"
                      stroke="rgba(255,255,255,0.22)" strokeWidth="0.9"/>
                  </svg>
                  <span style={{ color: "rgba(255,255,255,0.22)", fontSize: "11px", letterSpacing: "0.02em" }}>
                    Secured by Explified
                  </span>
                </div>
              </>
            )}

            {/* ── ERROR ────────────────────────────────────── */}
            {state === "error" && (
              <>
                <div style={{
                  width: "64px", height: "64px",
                  borderRadius: "50%",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "4px",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8v5M12 16h.01" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "17px", fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>
                    Something went wrong
                  </p>
                  <p style={{ color: "rgba(248,113,113,0.7)", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                    {errorMessage}
                  </p>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Brand note below card */}
        {state === "closed" && (
          <p style={{ color: "rgba(255,255,255,0.12)", fontSize: "11px", marginTop: "20px", letterSpacing: "0.02em" }}>
            explified.com · RemoveBG for Figma
          </p>
        )}

      </div>
    </>
  );
}