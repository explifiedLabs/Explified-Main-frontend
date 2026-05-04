import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FileText, FileCheck, FileEdit, Users, Edit3, 
  TrendingUp, FolderDot, Search, Filter,
  MonitorSmartphone, PenTool, Briefcase, Coffee, Globe, Trophy, Image as ImageIcon
} from 'lucide-react';

// TODO: Update these import paths to match your project structure
import { getAdminPostsThunk } from '../../features/posts/postSlice'; 
import { fetchMembers } from '../../features/members/memberSlice';

// --- HELPER FUNCTIONS ---
const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const getAvatarColor = (name) => {
  const colors = [
    'bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700',
    'bg-rose-100 text-rose-700', 'bg-amber-100 text-amber-700',
    'bg-cyan-100 text-cyan-700', 'bg-purple-100 text-purple-700'
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const predefinedCategoryIcons = [
  { color: 'bg-[#23b5b5]', icon: MonitorSmartphone },
  { color: 'bg-indigo-400', icon: PenTool },
  { color: 'bg-rose-400', icon: Briefcase },
  { color: 'bg-emerald-400', icon: Coffee },
  { color: 'bg-amber-400', icon: Globe },
];

// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

// --- MODULAR COMPONENTS ---
const StatCard = React.memo(({ title, value, icon: Icon }) => (
  <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-zinc-200/60 p-5 sm:p-6 flex flex-col relative overflow-hidden group hover:shadow-md hover:border-zinc-300 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[#23b5b5] group-hover:bg-[#23b5b5] group-hover:text-white transition-colors duration-300">
        <Icon size={20} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
      </div>
    </div>
    <div>
      <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">{value}</h3>
      <p className="text-xs sm:text-sm font-semibold text-zinc-500 mt-1">{title}</p>
    </div>
  </motion.div>
));

const StatusBadge = ({ status }) => {
  const isPublished = status?.toLowerCase() === 'published';
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wide ${isPublished ? 'bg-[#23b5b5]/10 text-[#23b5b5]' : 'bg-zinc-100 text-zinc-600'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-[#23b5b5]' : 'bg-zinc-400'}`} />
      {(status || 'Draft').toUpperCase()}
    </div>
  );
};

// --- MAIN DASHBOARD ---
export default function Dashboard() {
  const dispatch = useDispatch();

  // 1. Pull data from Redux Store
  const { user: authState } = useSelector((state) => state.auth);
  const { posts, totalPosts } = useSelector((state) => state.posts);
  const { users: members } = useSelector((state) => state.members);

  const currentUser = authState?.user || authState; // Depending on how it's nested

  // 2. Fetch Data on Mount
  useEffect(() => {
    dispatch(getAdminPostsThunk({ page: 1, limit: 100 })); // Fetch enough for accurate stats
    dispatch(fetchMembers());
  }, [dispatch]);

  // 3. Derived State & Calculations
  const stats = useMemo(() => {
    const publishedCount = posts.filter(p => p.status?.toLowerCase() === 'published').length;
    const draftCount = posts.filter(p => p.status?.toLowerCase() !== 'published').length;
    
    return {
      total: totalPosts || posts.length,
      published: publishedCount,
      drafts: draftCount,
      authors: members?.length || 0,
      newDrafts: draftCount // Mapping new drafts to total drafts for display
    };
  }, [posts, totalPosts, members]);

  const recentDynamicPosts = useMemo(() => {
    return posts.slice(0, 5).map(p => ({
      id: p._id,
      title: p.title,
      author: p.author?.fullName || 'Unknown Author',
      initials: getInitials(p.author?.fullName),
      avatar: getAvatarColor(p.author?.fullName),
      status: p.status || 'Draft', 
      category: p.categories?.[0] || 'Uncategorized',
      date: new Date(p.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      reads: p.reads || p.views || '-', // Fallbacks depending on your DB schema
      coverImage: p.coverImage
    }));
  }, [posts]);

  const dynamicCategories = useMemo(() => {
    const catMap = {};
    posts.forEach(p => {
      p.categories?.forEach(c => {
        catMap[c] = (catMap[c] || 0) + 1;
      });
    });

    // Sort by count and map to UI styles
    return Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count], index) => {
        const style = predefinedCategoryIcons[index % predefinedCategoryIcons.length];
        return { id: name, name, count, color: style.color, icon: style.icon };
      });
  }, [posts]);

  const dynamicAuthors = useMemo(() => {
    const authMap = {};
    posts.forEach(p => {
      if (p.author && p.author._id) {
        if (!authMap[p.author._id]) {
          authMap[p.author._id] = {
            id: p.author._id,
            name: p.author.fullName,
            initials: getInitials(p.author.fullName),
            avatar: getAvatarColor(p.author.fullName),
            count: 0
          };
        }
        authMap[p.author._id].count += 1;
      }
    });

    return Object.values(authMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [posts]);

  return (
    <div className="flex flex-col w-full min-h-screen font-sans">
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 pt-20 sm:pt-8 space-y-6 sm:space-y-8"
      >
        
        {/* HEADER */}
        <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-2">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Welcome back, <span className='text-[#23b5b5]'>{currentUser?.fullName || 'Admin'}</span>.
            </h1>
            <p className="text-zinc-500 font-medium text-sm sm:text-base mt-1 sm:mt-2">
              Platform is performing great. <span className="text-[#137171] font-bold">{stats.newDrafts} pending drafts</span> waiting for review.
            </p>
          </div>
          <button className="w-full md:w-auto bg-[#23b5b5] hover:bg-[#016b6b] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 text-sm sm:text-base">
            <Edit3 size={18} strokeWidth={2.5} /> Create New Post
          </button>
        </motion.header>

        {/* STATS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard title="Total Posts" value={stats.total} icon={FileText} />
          <StatCard title="Published" value={stats.published} icon={FileCheck} />
          <StatCard title="Drafts & Pending" value={stats.drafts} icon={FileEdit} />
          <StatCard title="Total Authors" value={stats.authors} icon={Users} />
        </section>

        {/* MAIN CONTENT SPLIT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          
          {/* LEFT: Recent Posts Table */}
          <motion.section variants={itemVariants} className="xl:col-span-2 bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden flex flex-col w-full">
            
            <div className="p-4 sm:p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900">Recent Posts</h2>
                <p className="text-xs sm:text-sm font-medium text-zinc-500 mt-1">Manage and track your latest content.</p>
              </div>
              <div className="flex flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search posts..." 
                    className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/20 focus:border-[#23b5b5] focus:bg-white transition-all"
                  />
                </div>
                <button aria-label="Filter" className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all shrink-0">
                  <Filter size={18} />
                </button>
              </div>
            </div>
            
            <div className="block w-full overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px] border-collapse">
                <thead className="bg-zinc-50/50 border-b border-zinc-100">
                  <tr>
                    <th className="px-5 sm:px-6 py-4 font-bold text-zinc-500 text-[11px] uppercase tracking-wider">Post Details</th>
                    <th className="px-5 sm:px-6 py-4 font-bold text-zinc-500 text-[11px] uppercase tracking-wider hidden sm:table-cell">Author</th>
                    <th className="px-5 sm:px-6 py-4 font-bold text-zinc-500 text-[11px] uppercase tracking-wider">Status</th>
                    <th className="px-5 sm:px-6 py-4 font-bold text-zinc-500 text-[11px] uppercase tracking-wider text-right">Reads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {recentDynamicPosts.length > 0 ? recentDynamicPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-zinc-50 transition-colors group">
                      <td className="px-5 sm:px-6 py-4">
                        <div className="flex items-center gap-4">
                          {/* REAL COVER IMAGE ADDED HERE */}
                          {post.coverImage ? (
                            <img src={post.coverImage} alt={post.title} className="w-12 h-12 rounded-lg object-cover border border-zinc-200 shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 border border-zinc-200 shadow-sm">
                               <ImageIcon size={20} />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-900 text-sm sm:text-[15px] mb-1 group-hover:text-[#23b5b5] transition-colors cursor-pointer line-clamp-1">{post.title}</span>
                            <span className="text-xs font-medium text-zinc-500">
                              {post.category} <span className="mx-1.5">•</span> {post.date}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 sm:px-6 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold border border-black/5 ${post.avatar}`}>
                            {post.initials}
                          </div>
                          <span className="text-sm font-semibold text-zinc-700 whitespace-nowrap">{post.author}</span>
                        </div>
                      </td>
                      <td className="px-5 sm:px-6 py-4">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-5 sm:px-6 py-4 text-right">
                        <span className="text-sm font-bold text-zinc-600">{post.reads}</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-zinc-500 font-medium text-sm">
                        No recent posts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 sm:px-6 py-4 border-t border-zinc-100 bg-white text-center mt-auto">
              <button className="text-sm font-bold text-[#23b5b5] hover:text-[#1c9595] transition-colors">View All Posts &rarr;</button>
            </div>
          </motion.section>

          {/* RIGHT COL: Categories & Authors */}
          <div className="space-y-6 sm:space-y-8 flex flex-col h-full w-full">
            
            {/* Top Categories */}
            <motion.section variants={itemVariants} className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-5 sm:p-6 w-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900">Top Categories</h2>
                  <p className="text-xs sm:text-sm font-medium text-zinc-500 mt-1">Content distribution</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                  <FolderDot size={20} />
                </div>
              </div>
              
              <div className="space-y-5">
                {dynamicCategories.length > 0 ? dynamicCategories.map((cat) => {
                  const maxCategoryCount = Math.max(...dynamicCategories.map(c => c.count));
                  const percentage = (cat.count / maxCategoryCount) * 100;
                  
                  return (
                    <div key={cat.id} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <cat.icon size={16} className="text-zinc-400 group-hover:text-[#23b5b5] transition-colors" />
                          <span className="font-bold text-zinc-700 text-sm group-hover:text-zinc-900 transition-colors">{cat.name}</span>
                        </div>
                        <span className="font-bold text-zinc-900 text-sm">{cat.count}</span>
                      </div>
                      <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full ${cat.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-zinc-500 text-sm font-medium text-center">No categories assigned yet.</p>
                )}
              </div>
            </motion.section>

            {/* Top Authors */}
            <motion.section variants={itemVariants} className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-5 sm:p-6 w-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900">Top Authors</h2>
                  <p className="text-xs sm:text-sm font-medium text-zinc-500 mt-1">Posts by user</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                  <Trophy size={20} />
                </div>
              </div>
              <div className="space-y-4">
                {dynamicAuthors.length > 0 ? dynamicAuthors.map((user) => (
                  <div key={user.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold border border-black/5 ${user.avatar}`}>
                        {user.initials}
                      </div>
                      <span className="text-sm sm:text-base font-semibold text-zinc-700 group-hover:text-zinc-900 transition-colors line-clamp-1">{user.name}</span>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-100 px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-600">
                      {user.count} <span className="text-xs font-medium text-zinc-400 ml-1">posts</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-zinc-500 text-sm font-medium text-center">No author data available.</p>
                )}
              </div>
            </motion.section>

          </div>
          
        </div>
      </motion.main>
    </div>
  );
}