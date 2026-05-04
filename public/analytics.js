(function () {
  const API =
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api/analytics/track"
      : "https://cmsapi-pf6diz22ka-uc.a.run.app/api/analytics/track";

  const FLUSH_INTERVAL = 5000;
  const MAX_QUEUE = 10;

  const script = document.querySelector('script[src*="analytics.js"]');
  const PROJECT_KEY = script?.getAttribute("data-key");
  if (!PROJECT_KEY) return;

  // =============================
  // VISITOR + SESSION
  // =============================
  let visitorId = localStorage.getItem("vid");
  if (!visitorId) {
    visitorId = "v_" + Math.random().toString(36).slice(2);
    localStorage.setItem("vid", visitorId);
  }

  let sessionId = sessionStorage.getItem("sid");
  if (!sessionId) {
    sessionId = "s_" + Math.random().toString(36).slice(2);
    sessionStorage.setItem("sid", sessionId);
  }

  let sessionStart = Date.now();

  // =============================
  // META
  // =============================
  const getDevice = () =>
    /mobile|android|iphone/i.test(navigator.userAgent)
      ? "mobile"
      : "desktop";

  const getBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Chrome")) return "chrome";
    if (ua.includes("Firefox")) return "firefox";
    if (ua.includes("Safari")) return "safari";
    return "other";
  };

  const getSource = () => {
    const ref = document.referrer;
    if (!ref) return "direct";
    if (ref.includes("google")) return "google";
    if (ref.includes("facebook")) return "facebook";
    return "other";
  };

  if (!localStorage.getItem("first_referrer")) {
    localStorage.setItem("first_referrer", document.referrer || "direct");
  }

  // =============================
  // QUEUE
  // =============================
  let queue = [];
  let isFlushing = false;

  function pushEvent(event, data = {}) {
    queue.push({
      event,
      data,
      path: window.location.pathname,
      visitorId,
      sessionId,
      timestamp: Date.now(),
      meta: {
        device: getDevice(),
        browser: getBrowser(),
        source: localStorage.getItem("first_referrer"),
      },
    });

    if (event === "page_view" || event === "session_start") flush();
    if (queue.length >= MAX_QUEUE) flush();
  }

  async function flush() {
    if (!queue.length || isFlushing) return;

    isFlushing = true;
    const payload = [...queue];
    queue = [];

    try {
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-project-key": PROJECT_KEY,
        },
        body: JSON.stringify({ events: payload }),
        keepalive: true,
      });
    } catch {
      queue.unshift(...payload);
    }

    isFlushing = false;
  }

  setInterval(flush, FLUSH_INTERVAL);

  // =============================
  // 🔥 SUPER RELIABLE ROUTE TRACKING
  // =============================
  let lastPath = null;
  let pageStart = Date.now();

  function trackPage(force = false) {
    const path = window.location.pathname;

    if (!force && path === lastPath) return;

    if (lastPath) sendTimeSpent();

    lastPath = path;
    pageStart = Date.now();

    pushEvent("page_view");
  }

  // ✅ INITIAL LOAD (CRITICAL)
  window.addEventListener("load", () => {
    trackPage(true);
  });

  // ✅ PATCH HISTORY (SPA)
  const originalPush = history.pushState;
  history.pushState = function () {
    originalPush.apply(this, arguments);
    setTimeout(() => trackPage(true), 0);
  };

  const originalReplace = history.replaceState;
  history.replaceState = function () {
    originalReplace.apply(this, arguments);
    setTimeout(() => trackPage(true), 0);
  };

  window.addEventListener("popstate", () => {
    setTimeout(() => trackPage(true), 0);
  });

  // ✅ CLICK FALLBACK (VERY IMPORTANT)
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a && a.href && a.origin === location.origin) {
      setTimeout(() => trackPage(true), 100);
    }
  });

  // =============================
  // TIME TRACKING
  // =============================
  function sendTimeSpent() {
    const duration = Date.now() - pageStart;
    if (duration < 1000) return;

    navigator.sendBeacon(
      API,
      JSON.stringify({
        events: [
          {
            event: "time_spent",
            path: lastPath,
            visitorId,
            sessionId,
            timestamp: Date.now(),
            data: { duration },
          },
        ],
      })
    );
  }

  function sendSessionEnd() {
    const duration = Date.now() - sessionStart;

    navigator.sendBeacon(
      API,
      JSON.stringify({
        events: [
          {
            event: "session_end",
            path: window.location.pathname,
            visitorId,
            sessionId,
            timestamp: Date.now(),
            data: { duration },
          },
        ],
      })
    );
  }

  // =============================
  // SESSION START
  // =============================
  if (!sessionStorage.getItem("session_sent")) {
    pushEvent("session_start");
    sessionStorage.setItem("session_sent", "1");
  }

  // =============================
  // VISIBILITY
  // =============================
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) sendTimeSpent();
    else pageStart = Date.now();
  });

  // =============================
  // EXIT
  // =============================
  window.addEventListener("beforeunload", () => {
    sendTimeSpent();
    sendSessionEnd();
  });

  // =============================
  // HEARTBEAT
  // =============================
  setInterval(() => pushEvent("heartbeat"), 20000);

  window.Analytics = { track: pushEvent };
})();