import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

const pageCache = {};
const SITE_ID = "69c67e3f225219428111ab74";

export default function DynamicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchPageContent = async () => {
      if (pageCache[slug]) {
        setPage(pageCache[slug]);
        updateMetaTags(pageCache[slug]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setPage(null);
      setError(false);

      try {
        const response = await fetch(
          `https://cmsapi-pf6diz22ka-uc.a.run.app/api/pages/${slug}`,
          {
            signal: abortController.signal,
            headers: { "x-site-id": SITE_ID },
          }
        );
        const result = await response.json();

        if (result.success && result.data) {
          pageCache[slug] = result.data;
          setPage(result.data);
          updateMetaTags(result.data);
        } else {
          setError(true);
        }

        setLoading(false);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Failed to fetch page:", err);
        setError(true);
        setLoading(false);
      }
    };

    if (slug) fetchPageContent();

    return () => {
      abortController.abort();
      document.title = "Explified";
    };
  }, [slug]);

  const updateMetaTags = (data) => {
    document.title = data.metaTitle || data.title || "Explified";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = data.metaDescription || "";
  };

  // =========================================
  // RENDER: SKELETON LOADER
  // =========================================
  if (loading) {
    return (
      <div className="min-h-screen w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="animate-pulse flex flex-col gap-6">
          <div className="h-14 bg-[#27272a] rounded-xl w-3/4 mb-6"></div>
          <div className="space-y-4 mb-8">
            <div className="h-4 bg-[#27272a]/60 rounded-md w-full"></div>
            <div className="h-4 bg-[#27272a]/60 rounded-md w-full"></div>
            <div className="h-4 bg-[#27272a]/60 rounded-md w-5/6"></div>
          </div>
          <div className="h-8 bg-[#27272a] rounded-lg w-1/3 mt-6 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-[#27272a]/60 rounded-md w-full"></div>
            <div className="h-4 bg-[#27272a]/60 rounded-md w-11/12"></div>
            <div className="h-4 bg-[#27272a]/60 rounded-md w-full"></div>
            <div className="h-4 bg-[#27272a]/60 rounded-md w-4/5"></div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // RENDER: 404 NOT FOUND
  // =========================================
  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-zinc-800">
          <span className="text-4xl font-black text-[#23b5b5]">?</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-zinc-400 text-lg mb-8 max-w-md">
          The page you are looking for does not exist, has been removed, or is
          currently unavailable.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3.5 bg-[#23b5b5] text-white font-bold rounded-xl hover:bg-[#1ca3a3] transition-all shadow-lg hover:-translate-y-1"
        >
          Return Home
        </button>
      </div>
    );
  }

  // =========================================
  // RENDER: LOADED PAGE CONTENT
  // =========================================
  const contentStr = (page.content || "").trim();
  const isBuilderPage =
    page.pageType === "builder" ||
    contentStr.startsWith("<link") ||
    (contentStr.startsWith("<div") && contentStr.includes("font-family:"));

  // ── BUILDER PAGES ──────────────────────────────────────────────────────────
  if (isBuilderPage) {
    return (
      <div className="min-h-screen w-full builder-page-transition">
        <div
          style={{ width: "100%" }}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        <style
          dangerouslySetInnerHTML={{
            __html: `
            .builder-page-transition {
              animation: smoothFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              opacity: 0;
              transform: translateY(12px);
            }
            @keyframes smoothFade {
              to { opacity: 1; transform: translateY(0); }
            }
            .builder-page-transition *,
            .builder-page-transition *::before,
            .builder-page-transition *::after {
              box-sizing: border-box;
            }
            .builder-page-transition img {
              max-width: 100%;
              height: auto;
            }
            .builder-page-transition button {
              font-family: inherit;
              cursor: pointer;
            }

            /*
              KEY FIX: Each .explified-section goes full-width for backgrounds.
              The section's root element (from SectionRenderer) keeps its own
              background full-width. The section's built-in padding (48px sides)
              already contains the content. For very wide screens, we add
              calc-based padding so content never exceeds ~1200px.
            */
            .explified-section {
              width: 100%;
            }

            /* Section root elements with backgrounds: stay full-width,
               use dynamic padding to contain inner content on wide screens */
            .explified-section > div > div[style*="padding"],
            .explified-section > div > nav[style*="padding"] {
              padding-left: max(48px, calc((100% - 1200px) / 2 + 48px)) !important;
              padding-right: max(48px, calc((100% - 1200px) / 2 + 48px)) !important;
            }

            /* Sections without background that are just structural wrappers */
            .explified-section > div > div:not([style*="background"]):not([style*="padding"]) {
              max-width: 1200px;
              margin-left: auto;
              margin-right: auto;
              width: 100%;
            }

            /* Links inside buttons should inherit styling */
            .explified-builder a { text-decoration: none; color: inherit; }

            @media (max-width: 768px) {
              /* Collapse grids */
              .explified-builder div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
              .explified-builder div[style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }
              .explified-builder div[style*="grid-template-columns: 1fr 1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }
              .explified-builder div[style*="grid-template-columns: 160px 1fr"] { grid-template-columns: 1fr !important; }
              .explified-builder div[style*="grid-template-columns: 1fr 200px"] { grid-template-columns: 1fr !important; }
              .explified-builder div[style*="grid-template-columns: 2fr 1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }
              .explified-builder div[style*="grid-template-columns: 2fr 1fr 1fr"] { grid-template-columns: 1fr !important; }

              /* Stack heavy flex layouts */
              .explified-builder div[style*="display: flex"][style*="gap: 64px"],
              .explified-builder div[style*="display: flex"][style*="gap: 80px"],
              .explified-builder div[style*="display: flex"][style*="gap: 72px"],
              .explified-builder div[style*="display: flex"][style*="gap: 56px"] {
                flex-direction: column !important;
                gap: 32px !important;
              }

              /* Override hardcoded padding for mobile */
              .explified-builder div[style*="padding: 80px 48px"] { padding: 48px 20px !important; }
              .explified-builder div[style*="padding: 88px 48px"] { padding: 48px 20px !important; }
              .explified-builder div[style*="padding: 96px 48px"] { padding: 56px 20px !important; }
              .explified-builder div[style*="padding: 104px 48px"] { padding: 56px 20px !important; }
              .explified-builder div[style*="padding: 64px 48px"] { padding: 40px 20px !important; }
              .explified-builder div[style*="padding: 56px 48px"] { padding: 36px 20px !important; }
              .explified-builder div[style*="padding: 36px 48px"] { padding: 28px 20px !important; }
              .explified-builder div[style*="padding: 32px 48px"] { padding: 28px 20px !important; }
              .explified-builder div[style*="padding: 40px 48px"] { padding: 32px 20px !important; }
              .explified-builder div[style*="padding: 24px 48px"] { padding: 20px 20px !important; }
              .explified-builder div[style*="padding: 84px 48px"] { padding: 48px 20px !important; }
              .explified-builder nav[style*="padding: 0 48px"],
              .explified-builder nav[style*="padding: 0px 48px"] { padding-left: 20px !important; padding-right: 20px !important; }

              /* Dynamic padding containment reset on mobile */
              .explified-section > div > div[style*="padding"] {
                padding-left: 20px !important;
                padding-right: 20px !important;
              }

              /* Scale down large typography */
              .explified-builder *[style*="font-size: 88px"] { font-size: 42px !important; }
              .explified-builder *[style*="font-size: 68px"] { font-size: 38px !important; }
              .explified-builder *[style*="font-size: 64px"] { font-size: 36px !important; }
              .explified-builder *[style*="font-size: 60px"] { font-size: 34px !important; }
              .explified-builder *[style*="font-size: 56px"] { font-size: 32px !important; }
              .explified-builder *[style*="font-size: 54px"] { font-size: 30px !important; }
              .explified-builder *[style*="font-size: 52px"] { font-size: 30px !important; }
              .explified-builder *[style*="font-size: 48px"] { font-size: 28px !important; }
              .explified-builder *[style*="font-size: 44px"] { font-size: 26px !important; }
              .explified-builder *[style*="font-size: 42px"] { font-size: 26px !important; }
              .explified-builder *[style*="font-size: 40px"] { font-size: 24px !important; }

              /* Flex children with fixed widths go full-width */
              .explified-builder div[style*="flex: 0 0"] { flex: 1 1 100% !important; }

              /* Min-height resets */
              .explified-builder div[style*="min-height: 500px"],
              .explified-builder div[style*="min-height: 480px"] { min-height: auto !important; }

              /* Button flex wrap */
              .explified-builder div[style*="display: flex"][style*="gap: 12px"],
              .explified-builder div[style*="display: flex"][style*="gap: 10px"] {
                flex-wrap: wrap !important;
              }
            }

            @media (max-width: 480px) {
              .explified-builder *[style*="font-size: 88px"] { font-size: 32px !important; }
              .explified-builder *[style*="font-size: 68px"] { font-size: 28px !important; }
              .explified-builder *[style*="font-size: 64px"] { font-size: 28px !important; }
              .explified-builder *[style*="font-size: 60px"] { font-size: 26px !important; }
              .explified-builder *[style*="font-size: 56px"] { font-size: 26px !important; }
              .explified-builder *[style*="font-size: 54px"] { font-size: 24px !important; }
              .explified-builder *[style*="font-size: 52px"] { font-size: 24px !important; }
              .explified-builder *[style*="font-size: 48px"] { font-size: 22px !important; }
              .explified-builder *[style*="font-size: 44px"] { font-size: 20px !important; }
              .explified-builder *[style*="font-size: 42px"] { font-size: 20px !important; }
            }
          `,
          }}
        />
      </div>
    );
  }

  // ── REGULAR PAGES (blog, articles, etc.) ──────────────────────────────────
  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto px-6 py-16 md:py-24 text-white page-transition">
      <div
        className="dynamic-content w-full"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .page-transition {
            animation: smoothFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(12px);
          }
          @keyframes smoothFade {
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: smoothFade 0.5s ease-out forwards;
          }

          /* ── BASE ── */
          .dynamic-content {
            color: #d4d4d8;
            line-height: 1.85;
            font-size: 1.15rem;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }

          /* ── SPACING: all elements at every nesting level ── */

          /* Paragraphs */
          .dynamic-content p {
            margin-top: 1.1em;
            margin-bottom: 1.1em;
          }
          .dynamic-content p:first-child { margin-top: 0; }
          .dynamic-content p:last-child  { margin-bottom: 0; }

          /* KEY FIX: <li><p>text</p></li> pattern from rich-text editors —
             strip the <p> margin so the <li> controls spacing, not the inner <p> */
          .dynamic-content li > p {
            margin-top: 0;
            margin-bottom: 0;
          }

          /* Lists */
          .dynamic-content ul,
          .dynamic-content ol {
            margin-top: 1.1em;
            margin-bottom: 1.1em;
          }

          /* Headings */
          .dynamic-content h1 { margin-top: 1.5em;  margin-bottom: 0.5em; }
          .dynamic-content h2 { margin-top: 1.75em; margin-bottom: 0.5em; }
          .dynamic-content h3 { margin-top: 1.5em;  margin-bottom: 0.4em; }
          .dynamic-content h4 { margin-top: 1.2em;  margin-bottom: 0.4em; }

          /* ── TYPOGRAPHY ── */
          .dynamic-content h1 { font-size: 3rem;    font-weight: 900; color: #ffffff; line-height: 1.15; letter-spacing: -0.03em; }
          .dynamic-content h2 { font-size: 2.25rem; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; }
          .dynamic-content h3 { font-size: 1.5rem;  font-weight: 700; color: #f4f4f5; letter-spacing: -0.01em; }
          .dynamic-content h4 { font-size: 1.25rem; font-weight: 600; color: #e4e4e7; }

          /* ── LINKS ── */
          .dynamic-content a {
            color: #23b5b5;
            text-decoration: none;
            border-bottom: 2px solid rgba(35, 181, 181, 0.3);
            transition: all 0.2s;
            font-weight: 500;
          }
          .dynamic-content a:hover { color: #1ca3a3; border-bottom-color: #1ca3a3; }

          /* ── LISTS ── */
          .dynamic-content ul { list-style-type: disc;    padding-left: 1.75rem; color: #d4d4d8; }
          .dynamic-content ol { list-style-type: decimal; padding-left: 1.75rem; color: #d4d4d8; }
          .dynamic-content li { margin-bottom: 0.5rem; padding-left: 0.25rem; }
          .dynamic-content li::marker { color: #23b5b5; }

          /* Nested lists */
          .dynamic-content li > ul,
          .dynamic-content li > ol {
            margin-top: 0.4em;
            margin-bottom: 0.4em;
          }

          /* ── BLOCKQUOTE ── */
          .dynamic-content blockquote {
            border-left: 4px solid #23b5b5;
            margin: 2rem 0;
            font-style: italic;
            color: #a1a1aa;
            background: rgba(255, 255, 255, 0.03);
            padding: 1.5rem 2rem;
            border-radius: 0 0.75rem 0.75rem 0;
          }

          /* ── IMAGES ── */
          .dynamic-content img {
            border-radius: 0.75rem;
            max-width: 100%;
            height: auto;
            margin: 2.5rem 0;
            box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.05);
          }

          /* ── DIVIDER ── */
          .dynamic-content hr { border-color: rgba(255, 255, 255, 0.1); margin: 3rem 0; }

          /* ── CODE ── */
          .dynamic-content pre {
            background: #18181b;
            padding: 1.25rem;
            border-radius: 0.75rem;
            overflow-x: auto;
            border: 1px solid #27272a;
            margin: 1.5rem 0;
          }
          .dynamic-content code {
            background: rgba(35, 181, 181, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-size: 0.875em;
            color: #23b5b5;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          }
          .dynamic-content pre code { background: transparent; padding: 0; color: #e4e4e7; }
        `,
        }}
      />
    </div>
  );
}