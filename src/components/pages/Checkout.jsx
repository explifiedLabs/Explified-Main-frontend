import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [state, setState] = useState("loading"); // "loading" | "opening" | "error" | "closed"
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get("_ptxn");

    if (!transactionId) {
      setState("error");
      setErrorMessage(
        "No transaction found. Please go back to the Figma plugin and try upgrading again.",
      );
      return;
    }

    // Paddle.js loads asynchronously from the <script> tag in
    // index.html — it may not be ready the instant this component
    // mounts. Poll briefly instead of assuming window.Paddle exists.
    let attempts = 0;
    const maxAttempts = 20; // ~4 seconds at 200ms intervals

    const tryOpenCheckout = () => {
      attempts += 1;

      if (window.Paddle) {
        try {
          window.Paddle.Environment.set("sandbox"); // TODO: switch based on real env before production
          window.Paddle.Initialize({
            token: "test_01ad9a049acb85e557cb772d215", // TODO: move to an env var, don't hardcode in source
            eventCallback: (event) => {
              // Paddle.js fires named events as the overlay progresses.
              // checkout.closed covers BOTH a completed purchase and a
              // user-dismissed overlay — we can't fully distinguish
              // here, so we just let them know to check the plugin,
              // where /status will reflect the real outcome either way.
              if (event.name === "checkout.closed") {
                setState("closed");
              }
            },
          });

          window.Paddle.Checkout.open({ transactionId });
          setState("opening");
        } catch (err) {
          setState("error");
          setErrorMessage(
            "Something went wrong opening checkout. Please try again from the plugin.",
          );
        }
        return;
      }

      if (attempts >= maxAttempts) {
        setState("error");
        setErrorMessage(
          "Checkout failed to load. Please check your internet connection and try again.",
        );
        return;
      }

      setTimeout(tryOpenCheckout, 200);
    };

    tryOpenCheckout();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "24px",
        textAlign: "center",
      }}
    >
      {(state === "loading" || state === "opening") && (
        <>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "3px solid #e0e0e0",
              borderTopColor: "#4f46e5",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "#555", fontSize: "15px" }}>
            {state === "loading" ? "Loading checkout..." : "Opening secure checkout..."}
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}

      {state === "error" && (
        <>
          <div style={{ fontSize: "32px" }}>⚠️</div>
          <p style={{ color: "#b91c1c", fontSize: "15px", maxWidth: "360px" }}>
            {errorMessage}
          </p>
        </>
      )}

      {state === "closed" && (
        <>
          <div style={{ fontSize: "32px" }}>✅</div>
          <p style={{ color: "#15803d", fontSize: "15px", maxWidth: "360px" }}>
            You can close this tab and return to the Figma plugin — your plan will update shortly.
          </p>
        </>
      )}
    </div>
  );
}