import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Search,
  ChevronRight,
  X,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";

// ==========================================
// CONSTANTS & HELPERS
// ==========================================
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2400&auto=format&fit=crop";

const formatDate = (dateString) => {
  if (!dateString) return "Recently";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "Recently";
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
};

// ==========================================
// HIGHLIGHT MATCH — same as BlogMainPage
// ==========================================
const HighlightMatch = ({ text, query }) => {
  if (!query.trim()) return <span>{text}</span>;
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-[#23b5b5]/30 text-[#23b5b5] rounded px-0.5 not-italic"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

// ==========================================
// SIDEBAR SEARCH WIDGET
// ==========================================
function SidebarSearch({ allPosts, currentSlug }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef(null);
  const searchRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // Search across all posts by title or category
  const dropdownResults = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return allPosts
      .filter(
        (p) =>
          p.slug !== currentSlug &&
          (p.title.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q))
      )
      .slice(0, 7);
  }, [allPosts, debouncedQuery, currentSlug]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(value);
      if (value.trim() === "") setShowDropdown(false);
    }, 200);
  };

  const clearSearch = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSearchQuery("");
    setDebouncedQuery("");
    setShowDropdown(false);
  };

  const handleResultClick = (slug) => {
    setShowDropdown(false);
    setSearchQuery("");
    setDebouncedQuery("");
    navigate(`/blog/${slug}`);
  };

  return (
    <div>
      <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
        Search Articles
      </h3>

      <div ref={searchRef} className="relative">
        {/* Input */}
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-[#23b5b5] transition-colors duration-300 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleChange}
            onFocus={() => {
              if (searchQuery.trim()) setShowDropdown(true);
            }}
            placeholder="Search by title or category…"
            className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#23b5b5]/60 focus:bg-white/[0.07] text-white placeholder-gray-600 text-[13px] rounded-full pl-9 pr-8 py-2.5 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(35,181,181,0.08)]"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {showDropdown && debouncedQuery.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-[#0f1923] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            >
              {dropdownResults.length === 0 ? (
                <div className="flex items-center gap-3 px-4 py-4 text-gray-500 text-[13px]">
                  <Search className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    No articles found for "
                    <span className="text-gray-300">{debouncedQuery}</span>"
                  </span>
                </div>
              ) : (
                <>
                  <div className="px-4 pt-3 pb-2 border-b border-white/5">
                    <span className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase">
                      {dropdownResults.length} result
                      {dropdownResults.length !== 1 ? "s" : ""} found
                    </span>
                  </div>
                  <ul className="max-h-[360px] overflow-y-auto overscroll-contain divide-y divide-white/5">
                    {dropdownResults.map((post) => (
                      <li key={`drop-${post.id}`}>
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleResultClick(post.slug);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left group/item"
                        >
                          {/* Cover thumbnail */}
                          <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-white/5 relative">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = FALLBACK_IMAGE;
                              }}
                            />
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold tracking-widest text-[#23b5b5] uppercase mb-0.5">
                              {post.category}
                            </p>
                            <p className="text-[13px] font-semibold text-white leading-snug line-clamp-2 group-hover/item:text-[#23b5b5] transition-colors">
                              <HighlightMatch
                                text={post.title}
                                query={debouncedQuery}
                              />
                            </p>
                          </div>

                          {/* Arrow */}
                          <div className="shrink-0 w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover/item:border-[#23b5b5]/50 group-hover/item:bg-[#23b5b5]/10 transition-all">
                            <ChevronRight className="w-3 h-3 text-gray-500 group-hover/item:text-[#23b5b5] transition-colors" />
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function BlogPostDetail() {
  const { slug } = useParams();

  // Dynamic States
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]); // ← NEW: full list for search
  const [popularPosts, setPopularPosts] = useState([]);
  const [explorePosts, setExplorePosts] = useState([]);
  const [tocLinks, setTocLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Fetch Post and Related Posts
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const SITE_ID = "69c67e3f225219428111ab74";

        const [postRes, allPostsRes] = await Promise.all([
          fetch(`https://cmsapi-pf6diz22ka-uc.a.run.app/api/posts/${slug}`, {
            headers: { "x-site-id": SITE_ID },
          }),
          fetch(`https://cmsapi-pf6diz22ka-uc.a.run.app/api/posts`, {
            headers: { "x-site-id": SITE_ID },
          }),
        ]);

        const postData = await postRes.json();
        const allPostsData = await allPostsRes.json();

        // 1. Process Main Post
        if (postData.success && postData.post) {
          const p = postData.post;
          const authorName = p.author?.fullName || "Explified Admin";

          let generatedToc = [];
          let rawHtml =
            p.content || "<p>No content available for this post.</p>";

          let contentWithIds = rawHtml.replace(
            /<h2(.*?)>(.*?)<\/h2>/gi,
            (match, attrs, text) => {
              const cleanText = text.replace(/<[^>]+>/g, "").trim();
              const id = cleanText
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
              generatedToc.push({ id, label: cleanText });
              return `<h2 id="${id}"${attrs}>${text}</h2>`;
            }
          );

          setTocLinks(generatedToc);

          setPost({
            title: p.title || "Untitled Article",
            excerpt: p.excerpt || "",
            content: contentWithIds,
            date: formatDate(p.publishedAt || p.createdAt),
            author: {
              name: authorName,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=23b5b5&color=fff&rounded=true`,
            },
            readTime: "5 min read",
            coverImage: p.coverImage || FALLBACK_IMAGE,
            category:
              p.categories && p.categories.length > 0
                ? p.categories[0].toUpperCase()
                : "GENERAL",
            tags: p.tags || [],
          });
        }

        // 2. Process posts
        if (allPostsData.success && allPostsData.posts) {
          const sortedPosts = allPostsData.posts.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.publishedAt || 0).getTime();
            const dateB = new Date(b.createdAt || b.publishedAt || 0).getTime();
            return dateB - dateA;
          });

          const otherPosts = sortedPosts.filter((p) => p.slug !== slug);

          const formattedOthers = otherPosts.map((p) => {
            const authorName = p.author?.fullName || "Explified Admin";
            return {
              id: p._id,
              slug: p.slug,
              title: p.title || "Untitled Article",
              date: formatDate(p.publishedAt || p.createdAt),
              author: authorName,
              coverImage: p.coverImage || FALLBACK_IMAGE,
              category:
                p.categories && p.categories.length > 0
                  ? p.categories[0].toUpperCase()
                  : "GENERAL",
            };
          });

          // ← NEW: store full list for search (including current post for completeness)
          setAllPosts(
            allPostsData.posts.map((p) => ({
              id: p._id,
              slug: p.slug,
              title: p.title || "Untitled Article",
              coverImage: p.coverImage || FALLBACK_IMAGE,
              category:
                p.categories && p.categories.length > 0
                  ? p.categories[0].toUpperCase()
                  : "GENERAL",
            }))
          );

          setPopularPosts(formattedOthers.slice(0, 3));
          setExplorePosts(formattedOthers.slice(3, 6));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  // Smooth scroll handler for Table of Contents
  const handleScrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#23b5b5]/30 relative overflow-hidden">
      {/* TOP READING PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#23b5b5] origin-left z-50 shadow-[0_0_15px_#23b5b5]"
        style={{ scaleX }}
      />

      {/* TOP HERO GRADIENT & GLOW */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-[#23b5b5]/15 via-[#23b5b5]/5 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#23b5b5]/10 blur-[180px] rounded-full pointer-events-none z-0" />

      <main className="relative pt-28 pb-20 z-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            // LOADING SKELETON
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-[1400px] mx-auto px-6 w-full animate-pulse"
            >
              <div className="max-w-[800px] mx-auto text-center mb-12">
                <div className="h-6 w-32 bg-white/10 rounded-md mx-auto mb-6"></div>
                <div className="h-16 w-3/4 bg-white/10 rounded-xl mx-auto mb-6"></div>
                <div className="h-20 w-full bg-white/10 rounded-xl mx-auto mb-8"></div>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                  <div className="h-4 w-24 bg-white/10 rounded-md"></div>
                </div>
              </div>
              <div className="w-full aspect-[16/10] md:aspect-[2/1] bg-white/10 rounded-[24px]"></div>
            </motion.div>
          ) : !post ? (
            // ERROR / NOT FOUND STATE
            <motion.div key="error" className="py-32 text-center">
              <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
              <p className="text-gray-400 mb-8">
                The article you are looking for doesn't exist or has been
                removed.
              </p>
              <Link
                to="/blog"
                className="px-6 py-3 bg-[#23b5b5] text-black font-bold rounded-full hover:bg-white transition-colors"
              >
                Return to Blog
              </Link>
            </motion.div>
          ) : (
            // RENDER FETCHED BLOG CONTENT
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* 1. HERO TEXT SECTION */}
              <div className="max-w-[800px] mx-auto px-6 text-center mb-12 relative z-10">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#23b5b5] mb-10 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                  Back to Articles
                </Link>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#23b5b5]/10 border border-[#23b5b5]/20 text-[#23b5b5] text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#23b5b5]" />
                    {post.category}
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white drop-shadow-lg">
                    {post.title}
                  </h1>

                  <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed mb-8">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full opacity-90 border border-white/10 bg-[#23b5b5]"
                    />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">
                        {post.author.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <span>{post.date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* 2. HERO IMAGE */}
              <div className="w-full max-w-[1400px] mx-auto px-6 mb-16 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-full aspect-[16/10] md:aspect-[2/1] rounded-[24px] overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-black"
                >
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </motion.div>
              </div>

              {/* 3. WIDE 3-COLUMN GRID */}
              <div className="max-w-[1536px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_300px] gap-10 lg:gap-16 items-start">
                {/* LEFT: TABLE OF CONTENTS */}
                <aside className="hidden lg:block sticky top-32">
                  {tocLinks.length > 0 && (
                    <>
                      <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-6">
                        Contents
                      </h3>
                      <ul className="space-y-4 border-l border-white/10 pl-4">
                        {tocLinks.map((link) => (
                          <li key={link.id}>
                            <a
                              href={`#${link.id}`}
                              onClick={(e) => handleScrollToSection(e, link.id)}
                              className="text-[13px] text-gray-400 hover:text-[#23b5b5] transition-colors leading-snug block"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </aside>

                {/* CENTER: MAIN CONTENT */}
                <article className="w-full max-w-[800px] mx-auto">
                  <div
                    className="
                      text-gray-300
                      [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-16 [&_h2]:mb-6 [&_h2]:tracking-tight
                      [&_h3]:text-2xl [&_h3]:font-bold[&_h3]:text-white [&_h3]:mt-10 [&_h3]:mb-4
                      [&_p]:text-[18px] [&_p]:leading-[1.8] [&_p]:font-light [&_p]:mb-8
                      [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-8 [&_ul]:text-gray-300
                      [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-8 [&_ol]:text-gray-300[&_li]:mb-2 [&_li]:text-[18px] [&_li]:leading-[1.8]
                      [&_strong]:text-white [&_strong]:font-semibold
                      [&_a]:text-[#23b5b5] hover:[&_a]:text-[#38e0e0] [&_a]:transition-colors [&_a]:underline
                      [&_blockquote]:border-l-4 [&_blockquote]:border-[#23b5b5] [&_blockquote]:bg-[#23b5b5]/5 [&_blockquote]:py-4 [&_blockquote]:px-6 [&_blockquote]:my-10 [&_blockquote]:rounded-r-2xl [&_blockquote]:not-italic [&_blockquote]:text-xl [&_blockquote]:text-white
                      [&_hr]:border-white/10 [&_hr]:my-12
                      [&_img]:rounded-2xl [&_img]:border [&_img]:border-white/10 [&_img]:shadow-lg [&_img]:w-full [&_img]:my-10
                    "
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-white/10 flex flex-wrap gap-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-5 py-2 rounded-full border border-white/10 text-[11px] text-gray-400 uppercase tracking-widest hover:border-white/30 cursor-pointer transition-colors bg-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>

                {/* RIGHT: SIDEBAR */}
                <aside className="hidden lg:block sticky top-32 space-y-10">

                  {/* ✅ NEW: SEARCH WIDGET — top of sidebar */}
                  <SidebarSearch allPosts={allPosts} currentSlug={slug} />

                  {/* Divider */}
                  <div className="border-t border-white/10" />

                  {/* Share Widget */}
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                      Share this article
                    </h3>
                    <div className="flex gap-3">
                      <button className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <Twitter className="w-4 h-4" />
                      </button>
                      <button className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </button>
                      <button className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors hover:bg-[#23b5b5] hover:border-[#23b5b5]">
                        <LinkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Popular Posts */}
                  {popularPosts.length > 0 && (
                    <div>
                      <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#23b5b5] animate-pulse" />{" "}
                        Popular Posts
                      </h3>

                      <div className="space-y-8">
                        {popularPosts.map((p) => (
                          <Link
                            to={`/blog/${p.slug}`}
                            key={p.id}
                            className="group block"
                          >
                            <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-white/5 mb-3 relative border border-white/5">
                              <img
                                src={p.coverImage}
                                alt={p.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_IMAGE;
                                }}
                              />
                            </div>
                            <div className="text-[10px] text-[#23b5b5] font-bold uppercase tracking-wider mb-2">
                              {p.category}
                            </div>
                            <h4 className="text-[15px] font-bold text-white group-hover:text-[#23b5b5] transition-colors leading-snug mb-1">
                              {p.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 font-medium">
                              {p.date} • {p.author}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* EXPLORE MORE SECTION */}
      {!isLoading && explorePosts.length > 0 && (
        <section className="relative z-10 bg-[#000000] border-t border-white/10 pt-24 pb-32 mt-12">
          <div className="max-w-[1300px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-white">
                  Explore More
                </h2>
                <p className="text-gray-400 text-sm md:text-base font-light max-w-md">
                  Fresh ideas, technology updates, and brilliant insights from
                  our team.
                </p>
              </div>

              <Link
                to="/blog"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors shadow-lg"
              >
                View all articles
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {explorePosts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link to={`/blog/${p.slug}`} className="group block">
                    <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-white/5 mb-4 relative border border-white/10">
                      <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-md text-[9px] font-bold uppercase tracking-widest text-white border border-white/10">
                        {p.category}
                      </div>
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#23b5b5] transition-colors leading-snug">
                      {p.title}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}