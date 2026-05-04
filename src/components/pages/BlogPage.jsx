import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link, useNavigate } from "react-router";

const POSTS_PER_PAGE = 9;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=100&w=2564&auto=format&fit=crop";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const PostThumbnail = ({ src, alt, aspect = "aspect-[16/10]" }) => (
  <div className={`w-full ${aspect} rounded-2xl overflow-hidden bg-white/5 relative`}>
    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl z-10 pointer-events-none" />
    <motion.img
      src={src || FALLBACK_IMAGE}
      alt={alt || "Blog thumbnail"}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full object-cover"
      loading="lazy"
      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
    />
  </div>
);

// Highlight matched text in search results
const HighlightMatch = ({ text, query }) => {
  if (!query.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-[#2bc9c9]/30 text-[#2bc9c9] rounded px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default function BlogMainPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(["ALL"]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");       // input value — instant
  const [debouncedQuery, setDebouncedQuery] = useState(""); // dropdown results — 200ms debounce
  const [showDropdown, setShowDropdown] = useState(false);
  const [layoutKey, setLayoutKey] = useState(0);

  const debounceTimer = useRef(null);
  const searchRef = useRef(null); // wrapper ref to detect outside clicks

  const SITE_ID = "69c67e3f225219428111ab74";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://cmsapi-pf6diz22ka-uc.a.run.app/api/posts",
          { headers: { "x-site-id": SITE_ID } }
        );
        const data = await response.json();
        if (data.success && data.posts) {
          const formattedPosts = data.posts.map((post, index) => {
            const postCategory =
              post.categories && post.categories.length > 0
                ? post.categories[0].toUpperCase()
                : "GENERAL";
            return {
              id: post._id || `post-${index}`,
              slug: post.slug || `article-${index}`,
              title: post.title || "Untitled Insight",
              excerpt: post.excerpt || "Read this article to discover more insights.",
              coverImage: post.coverImage || FALLBACK_IMAGE,
              category: postCategory,
              published: post.status !== "draft",
              isPinned: post.isPinned || false,
              pinnedOrder: post.pinnedOrder !== null ? post.pinnedOrder : 999,
            };
          });
          setPosts(formattedPosts);
          const uniqueCategories = ["ALL", ...new Set(formattedPosts.map((p) => p.category))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Close dropdown when clicking outside the search wrapper
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, []);

  // Search across ALL published posts regardless of page or category
  const dropdownResults = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return posts
      .filter((post) =>
        post.published && (
          post.title.toLowerCase().includes(q) ||
          post.category.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q)
        )
      )
      .slice(0, 8); // max 8 results in dropdown
  }, [posts, debouncedQuery]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(true);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(value);
      if (value.trim() === "") {
        setShowDropdown(false);
        setLayoutKey((k) => k + 1);
      }
    }, 200);
  };

  const clearSearch = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSearchQuery("");
    setDebouncedQuery("");
    setShowDropdown(false);
    setLayoutKey((k) => k + 1);
  };

  const handleResultClick = (slug) => {
    setShowDropdown(false);
    setSearchQuery("");
    setDebouncedQuery("");
    navigate(`/blog/${slug}`);
  };

  const heroCarouselPosts = useMemo(() => {
    const pinned = posts.filter((p) => p.isPinned);
    if (pinned.length > 0) return pinned.sort((a, b) => a.pinnedOrder - b.pinnedOrder);
    return posts.slice(0, 4);
  }, [posts]);

  // Grid filtering — unchanged, uses category only (search is now dropdown-only)
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (!post.published) return false;
      if (activeCategory !== "ALL" && post.category !== activeCategory) return false;
      return true;
    });
  }, [activeCategory, posts]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const isFirstPage = currentPage === 1;
  const showAsymmetric = isFirstPage;
  const asymmetricPosts = showAsymmetric ? currentPosts.slice(0, 3) : [];
  const standardGridPosts = showAsymmetric ? currentPosts.slice(3) : currentPosts;

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
    setCurrentHeroIndex(0);
    setLayoutKey((k) => k + 1);
  };

  useEffect(() => {
    if (heroCarouselPosts.length <= 1 || isLoading) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroCarouselPosts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroCarouselPosts.length, isLoading]);

  const activeHeroPost = heroCarouselPosts[currentHeroIndex];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#2bc9c9]/30 selection:text-white relative overflow-x-hidden">

      {/* HERO */}
      {isFirstPage && activeHeroPost && (
        <div className="relative w-full h-[100vh] min-h-[700px] flex flex-col justify-end overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={`hero-img-${activeHeroPost.id}`}
              src={activeHeroPost.coverImage}
              alt={activeHeroPost.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="relative z-20 px-6 md:px-12 pb-24 md:pb-32 w-full max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="flex-1 max-w-4xl">
              <motion.div
                key={`badge-${activeHeroPost.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/20 backdrop-blur-md border border-white/10 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-6 inline-block"
              >
                {activeHeroPost.category}
              </motion.div>
              <motion.h2
                key={`title-${activeHeroPost.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight drop-shadow-lg"
              >
                {activeHeroPost.title}
              </motion.h2>
              {heroCarouselPosts.length > 1 && (
                <div className="flex items-center gap-3 mt-8">
                  {heroCarouselPosts.map((_, idx) => (
                    <button
                      key={`hero-dot-${idx}`}
                      onClick={() => setCurrentHeroIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                        idx === currentHeroIndex
                          ? "bg-[#2bc9c9] w-10 shadow-[0_0_15px_rgba(43,201,201,0.8)]"
                          : "bg-white/40 w-3 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <motion.div
              key={`meta-${activeHeroPost.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col md:items-end gap-3 shrink-0"
            >
              <Link
                to={`/blog/${activeHeroPost.slug}`}
                className="bg-[#2bc9c9] hover:bg-white text-black px-8 py-3.5 rounded-full font-bold text-sm transition-colors shadow-[0_0_20px_rgba(43,201,201,0.3)] mb-4 inline-block text-center"
              >
                Read Blog
              </Link>
            </motion.div>
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pt-20 pb-32">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="animate-pulse space-y-16"
            >
              <div className="h-20 w-full bg-white/5 rounded-2xl mb-12"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-80 bg-white/5 rounded-2xl"></div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`page-${currentPage}-${activeCategory}-layout-${layoutKey}`}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <motion.div variants={fadeUpVariant} className="mb-10">
                <h1 className="text-6xl md:text-[80px] font-extrabold tracking-tight mb-4 text-white leading-none">
                  Blog
                </h1>
                <p className="text-[#64849c] text-lg md:text-xl font-medium max-w-3xl leading-relaxed">
                  Here, we share insights, technology updates, and stories that
                  inspire your next digital venture.
                </p>
              </motion.div>

              {/* CATEGORY FILTERS */}
              <motion.div
                variants={fadeUpVariant}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 py-6 mb-6 overflow-x-auto no-scrollbar"
              >
                <div className="flex flex-wrap items-center gap-3">
                  {categories.map((cat) => {
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={`cat-${cat}`}
                        onClick={() => handleCategorySelect(cat)}
                        className={`px-6 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 whitespace-nowrap ${
                          isActive
                            ? "bg-[#2bc9c9] text-black shadow-[0_0_15px_rgba(43,201,201,0.4)]"
                            : "bg-transparent text-gray-400 border border-white/10 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* SEARCH BAR WITH DROPDOWN */}
              <motion.div variants={fadeUpVariant} className="mb-12">
                <div ref={searchRef} className="relative max-w-2xl">
                  {/* Input */}
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#2bc9c9] transition-colors duration-300 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => { if (searchQuery.trim()) setShowDropdown(true); }}
                      placeholder="Search all articles by title or category…"
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#2bc9c9]/60 focus:bg-white/[0.07] text-white placeholder-gray-600 text-sm rounded-full pl-11 pr-10 py-3.5 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(43,201,201,0.08)]"
                    />
                    <AnimatePresence>
                      {searchQuery && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          transition={{ duration: 0.15 }}
                          onClick={clearSearch}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* DROPDOWN RESULTS */}
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
                          <div className="flex items-center gap-3 px-5 py-5 text-gray-500 text-sm">
                            <Search className="w-4 h-4 shrink-0" />
                            <span>No articles found for "<span className="text-gray-300">{debouncedQuery}</span>"</span>
                          </div>
                        ) : (
                          <>
                            <div className="px-4 pt-3 pb-2 border-b border-white/5">
                              <span className="text-[11px] text-gray-500 font-semibold tracking-widest uppercase">
                                {dropdownResults.length} result{dropdownResults.length !== 1 ? "s" : ""} found
                              </span>
                            </div>
                            <ul className="max-h-[420px] overflow-y-auto overscroll-contain divide-y divide-white/5">
                              {dropdownResults.map((post) => (
                                <li key={`drop-${post.id}`}>
                                  <button
                                    onMouseDown={(e) => {
                                      e.preventDefault(); // prevent input blur before click fires
                                      handleResultClick(post.slug);
                                    }}
                                    className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-white/5 transition-colors text-left group/item"
                                  >
                                    {/* Cover thumbnail */}
                                    <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-white/5 relative">
                                      <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                                      />
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[11px] font-bold tracking-widest text-[#2bc9c9] uppercase mb-0.5">
                                        {post.category}
                                      </p>
                                      <p className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover/item:text-[#2bc9c9] transition-colors">
                                        <HighlightMatch text={post.title} query={debouncedQuery} />
                                      </p>
                                    </div>

                                    {/* Arrow */}
                                    <div className="shrink-0 w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover/item:border-[#2bc9c9]/50 group-hover/item:bg-[#2bc9c9]/10 transition-all">
                                      <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover/item:text-[#2bc9c9] transition-colors" />
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
              </motion.div>

              {/* BLOG GRID — unchanged, driven by category only */}
              {filteredPosts.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <Search className="w-12 h-12 text-gray-600 mb-6" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">No articles found</h3>
                  <button
                    onClick={() => handleCategorySelect("ALL")}
                    className="px-6 py-2.5 bg-[#2bc9c9] text-black font-semibold rounded-full hover:bg-white transition-colors"
                  >
                    View All Articles
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-y-14">
                  {asymmetricPosts.length > 0 && (
                    <motion.div
                      variants={fadeUpVariant}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10"
                    >
                      <Link
                        to={`/blog/${asymmetricPosts[0].slug}`}
                        className="lg:col-span-7 group cursor-pointer flex flex-col block"
                      >
                        <PostThumbnail
                          src={asymmetricPosts[0].coverImage}
                          alt={asymmetricPosts[0].title}
                          aspect="aspect-[4/3] lg:aspect-[4/3.5]"
                        />
                        <div className="mt-5 mb-3">
                          <span className="px-2.5 py-0.5 rounded-full border border-white/20 uppercase tracking-wider text-[10px] text-gray-300">
                            {asymmetricPosts[0].category}
                          </span>
                        </div>
                        <h2 className="text-[38px] md:text-[52px] font-extrabold mb-4 text-[#2bc9c9] group-hover:text-white transition-colors leading-[1.1] tracking-tight">
                          {asymmetricPosts[0].title}
                        </h2>
                        <p className="text-[#8b9fb1] leading-relaxed text-base md:text-[18px] line-clamp-3 font-normal pr-4">
                          {asymmetricPosts[0].excerpt}
                        </p>
                      </Link>

                      {asymmetricPosts.length > 1 && (
                        <div className="lg:col-span-5 flex flex-col gap-10 justify-between">
                          {asymmetricPosts.slice(1, 3).map((post) => (
                            <Link
                              to={`/blog/${post.slug}`}
                              key={`asym-${post.id}`}
                              className="group cursor-pointer flex flex-col block"
                            >
                              <PostThumbnail
                                src={post.coverImage}
                                alt={post.title}
                                aspect="aspect-[16/9]"
                              />
                              <div className="mt-5 mb-3">
                                <span className="px-2.5 py-0.5 rounded-full border border-white/20 uppercase tracking-wider text-[10px] text-gray-300">
                                  {post.category}
                                </span>
                              </div>
                              <h3 className="text-[26px] font-bold mb-2 text-white group-hover:text-[#2bc9c9] transition-colors leading-tight tracking-tight line-clamp-2">
                                {post.title}
                              </h3>
                              <p className="text-[#8b9fb1] text-[15px] line-clamp-2 leading-relaxed font-normal">
                                {post.excerpt}
                              </p>
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {standardGridPosts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
                      {standardGridPosts.map((post) => (
                        <motion.div variants={fadeUpVariant} key={`grid-${post.id}`}>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="group cursor-pointer flex flex-col block"
                          >
                            <PostThumbnail
                              src={post.coverImage}
                              alt={post.title}
                              aspect="aspect-[16/10]"
                            />
                            <div className="mt-5 mb-3">
                              <span className="px-2.5 py-0.5 rounded-full border border-white/20 uppercase tracking-wider text-[10px] text-gray-300">
                                {post.category}
                              </span>
                            </div>
                            <h3 className="text-[22px] font-bold mb-3 text-white group-hover:text-[#2bc9c9] transition-colors leading-snug tracking-tight line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-[#8b9fb1] text-[15px] line-clamp-3 leading-relaxed font-normal">
                              {post.excerpt}
                            </p>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PAGINATION */}
        {!isLoading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-20 pt-8 border-t border-white/10 flex items-center justify-between"
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                const isActive = currentPage === pageNumber;
                return (
                  <button
                    key={`page-${pageNumber}`}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
                      isActive ? "text-[#0a0a0a]" : "text-gray-400 hover:text-white bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePage"
                        className="absolute inset-0 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                      />
                    )}
                    <span className="relative z-10">{pageNumber}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}