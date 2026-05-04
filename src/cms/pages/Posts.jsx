
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router'; 
import { getAdminPostsThunk, softDeletePostThunk, archivePostThunk, publishPostThunk } from '../../features/posts/postSlice';
import { 
  Search, Plus, MoreVertical, Image as ImageIcon, 
  Edit3, Eye, Trash2, Archive, RotateCcw, 
  Columns, Filter, ChevronLeft, ChevronRight, Check,
  FileText, CheckCircle2, PenTool, X, Loader2
} from 'lucide-react';

// =====================================================================
// ANIMATION VARIANTS
// =====================================================================
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// =====================================================================
// COMPONENT 1: ConfirmModal
// =====================================================================
export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, icon: Icon, colorTheme = 'red' }) => {
  if (!isOpen) return null;
  const themes = {
    red: { bg: 'bg-rose-100', text: 'text-rose-600', btn: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', btn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500' },
  };
  const theme = themes[colorTheme];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors"><X size={20} /></button>
          <div className="p-8 flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${theme.bg} ${theme.text}`}><Icon size={32} strokeWidth={2} /></div>
            <h2 className="text-xl font-black text-zinc-900 mb-2">{title}</h2>
            <p className="text-sm font-medium text-zinc-500 mb-8">{message}</p>
            <div className="flex gap-3 w-full">
              <button onClick={onClose} className="flex-1 py-3 px-4 bg-white border border-zinc-200 text-zinc-700 font-bold rounded-xl hover:bg-zinc-50">Cancel</button>
              <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 py-3 px-4 text-white font-bold rounded-xl shadow-lg ${theme.btn}`}>{confirmText}</button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// =====================================================================
// COMPONENT 2: StatsCards 
// =====================================================================
export const StatsCards = ({ posts, totalPosts }) => {
  const publishedCount = posts.filter(p => p.status?.toLowerCase() === 'published').length;
  const draftCount = posts.filter(p => p.status?.toLowerCase() === 'draft').length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {[
        { label: 'Total Posts', count: totalPosts || posts.length, icon: FileText, color: 'blue' },
        { label: 'Published', count: publishedCount, icon: CheckCircle2, color: 'emerald' },
        { label: 'Drafts', count: draftCount, icon: PenTool, color: 'amber' }
      ].map((stat, idx) => (
        <motion.div key={idx} variants={itemVariants} className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center gap-5">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center border bg-${stat.color}-50 text-${stat.color}-600 border-${stat.color}-100`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-500">{stat.label}</p>
            <h3 className="text-2xl font-black text-zinc-900">{stat.count}</h3>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// =====================================================================
// COMPONENT 3: PostsTable 
// =====================================================================
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => { if (!ref.current || ref.current.contains(event.target)) return; handler(event); };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

const StatusBadge = ({ status }) => {
  const normalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Draft';
  const styles = { 
    Published: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', 
    Draft: 'bg-zinc-100 text-zinc-700 border-zinc-200/80', 
    Archived: 'bg-amber-50 text-amber-700 border-amber-200/60', 
    Deleted: 'bg-rose-50 text-rose-700 border-rose-200/60' 
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wide border ${styles[normalizedStatus] || styles.Draft}`}>
      {normalizedStatus === 'Published' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />}
      {normalizedStatus}
    </span>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

export const PostsTable = ({ posts, openActionModal, handleRestore, loading }) => {
  const navigate = useNavigate(); 
  const [selectedPosts, setSelectedPosts] = useState([]);
  const[activeMenuId, setActiveMenuId] = useState(null);
  
  // FILTER STATES
  const[searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const [showColumns, setShowColumns] = useState(false);
  const columnsRef = useRef();
  useOnClickOutside(columnsRef, () => setShowColumns(false));

  const[columns, setColumns] = useState({ 
    cover: true, title: true, author: true, categories: true, 
    status: true, publishedAt: true, views: false 
  });

  const toggleColumn = (key) => setColumns(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSelectAll = (e) => setSelectedPosts(e.target.checked ? posts.map(p => p._id || p.id) :[]);
  const handleSelectOne = (id) => setSelectedPosts(prev => prev.includes(id) ? prev.filter(pId => pId !== id) :[...prev, id]);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.slug?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const currentStatus = post.status ? post.status.toLowerCase() : 'draft';
    const matchesStatus = 
      statusFilter === 'All Status' || 
      currentStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden">
      
      {/* TOOLBAR */}
      <div className="p-5 sm:p-6 border-b border-zinc-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-zinc-50/30">
        
        <div className="relative w-full xl:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, or slug..." 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#23b5b5]/20 focus:border-[#23b5b5] shadow-sm transition-all" 
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {selectedPosts.length > 0 && (
            <div className="flex items-center gap-3 mr-2 border-r border-zinc-200 pr-5">
              <span className="text-sm font-bold text-[#23b5b5] bg-[#23b5b5]/10 px-3 py-1 rounded-lg">{selectedPosts.length} selected</span>
              <button className="text-sm font-bold text-rose-600 hover:text-rose-700 px-3 py-1 rounded-lg hover:bg-rose-50 transition-colors">Trash</button>
            </div>
          )}

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2.5 px-4 bg-white border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-700 focus:outline-none focus:border-[#23b5b5] cursor-pointer shadow-sm"
          >
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>

          <div className="relative" ref={columnsRef}>
            <button onClick={() => setShowColumns(!showColumns)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm">
              <Columns size={16} /> <span className="hidden sm:inline">Columns</span>
            </button>
            <AnimatePresence>
              {showColumns && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl p-2 z-50 origin-top-right">
                  <div className="px-3 py-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Toggle Columns</div>
                  {Object.keys(columns).map((key) => (
                    <label key={key} className="flex items-center px-3 py-2 hover:bg-zinc-50 rounded-lg cursor-pointer group transition-colors">
                      <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center mr-3 transition-colors ${columns[key] ? 'bg-[#23b5b5] border-[#23b5b5]' : 'bg-white border-zinc-300 group-hover:border-[#23b5b5]'}`}>
                        {columns[key] && <Check size={12} className="text-white" strokeWidth={3} />}
                      </div>
                      <input type="checkbox" className="hidden" checked={columns[key]} onChange={() => toggleColumn(key)} />
                      <span className="text-sm font-medium text-zinc-700 capitalize group-hover:text-zinc-900">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto min-h-[400px]">
        {loading ? (
           <div className="flex flex-col items-center justify-center h-[300px] text-zinc-400 gap-3">
             <Loader2 className="animate-spin w-8 h-8 text-[#23b5b5]" />
             <p className="font-medium text-sm">Loading posts...</p>
           </div>
        ) : filteredPosts.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-[300px] text-zinc-400 gap-2">
             <FileText className="w-10 h-10 mb-2 opacity-50" />
             <p className="font-medium text-sm text-zinc-500">No posts found matching your filters.</p>
           </div>
        ) : (
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-white border-b border-zinc-200">
            <tr>
              <th className="px-6 py-5 w-12"><input type="checkbox" onChange={handleSelectAll} checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0} className="w-4 h-4 rounded-[4px] border-zinc-300 text-[#23b5b5] focus:ring-[#23b5b5] cursor-pointer" /></th>
              {columns.cover && <th className="px-4 py-5 font-bold text-zinc-400 text-xs uppercase tracking-wider">Cover</th>}
              {columns.title && <th className="px-4 py-5 font-bold text-zinc-400 text-xs uppercase tracking-wider">Title</th>}
              {columns.status && <th className="px-4 py-5 font-bold text-zinc-400 text-xs uppercase tracking-wider">Status</th>}
              {columns.author && <th className="px-4 py-5 font-bold text-zinc-400 text-xs uppercase tracking-wider">Author</th>}
              {columns.categories && <th className="px-4 py-5 font-bold text-zinc-400 text-xs uppercase tracking-wider">Category</th>}
              {columns.publishedAt && <th className="px-4 py-5 font-bold text-zinc-400 text-xs uppercase tracking-wider">Date</th>}
              {columns.views && <th className="px-4 py-5 font-bold text-zinc-400 text-xs uppercase tracking-wider">Views</th>}
              <th className="px-6 py-5 w-20"></th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-zinc-100">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => {
                const id = post._id || post.id;
                
                let authorName = 'System Admin';
                if (typeof post.author === 'string') {
                  authorName = post.author;
                } else if (post.author?.fullName) {
                  authorName = post.author.fullName; 
                } else if (post.author?.name) {
                  authorName = post.author.name;
                } else if (post.author?.firstName) {
                  authorName = `${post.author.firstName} ${post.author.lastName || ''}`.trim();
                }
                
                const authorInitials = authorName.substring(0,2).toUpperCase();
                const dateToShow = formatDate(post.publishedAt || post.createdAt);

                return (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  key={id} 
                  className={`group hover:bg-zinc-50/80 transition-all duration-200 ${selectedPosts.includes(id) ? 'bg-[#23b5b5]/[0.03]' : 'bg-white'} ${post.isDeleted ? 'opacity-60 grayscale-[0.5]' : ''}`}
                >
                  <td className="px-6 py-5 pt-7 align-top"><input type="checkbox" checked={selectedPosts.includes(id)} onChange={() => handleSelectOne(id)} className="w-4 h-4 rounded-[4px] border-zinc-300 text-[#23b5b5] focus:ring-[#23b5b5] cursor-pointer" /></td>
                  
                  {/* ✅ FIXED COVER RENDER WITH FALLBACK */}
                  {columns.cover && (
                    <td className="px-4 py-5 align-top">
                      {post.coverImage ? (
                        <img 
                          src={typeof post.coverImage === 'string' ? post.coverImage : (post.coverImage?.url || '')} 
                          alt="Cover" 
                          className="w-16 h-12 rounded-lg object-cover border border-zinc-200 shadow-sm"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                        />
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-zinc-50 border border-zinc-200 border-dashed flex items-center justify-center text-zinc-300">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>
                  )}
                  
                  {columns.title && (
                    <td className="px-4 py-5 max-w-[400px]">
                      <p 
                        onClick={() => navigate(`/admin/dashboard/edit-blog/${id}`)}
                        className={`font-bold text-base mb-1 truncate cursor-pointer transition-colors ${post.isDeleted ? 'line-through text-zinc-500' : 'text-zinc-900 hover:text-[#23b5b5]'}`}
                      >
                        {post.title}
                      </p>
                      <p className="text-sm font-medium text-zinc-500 truncate">{post.excerpt}</p>
                    </td>
                  )}

                  {columns.status && <td className="px-4 py-5 pt-6 align-top"><StatusBadge status={post.status} /></td>}
                  
                  {columns.author && (
                    <td className="px-4 py-5 pt-6 align-top">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm border border-black/5 bg-indigo-100 text-indigo-700`}>{authorInitials}</div>
                        <span className="text-sm font-semibold text-zinc-700">{authorName}</span>
                      </div>
                    </td>
                  )}

                  {columns.categories && (
                    <td className="px-4 py-5 align-top pt-6">
                      <div className="flex items-center gap-2 flex-wrap w-40">
                        {post.categories && post.categories.length > 0 ? post.categories.map(cat => {
                          const catName = typeof cat === 'object' ? (cat.name || cat.title || cat._id) : cat;
                          return (
                            <span key={catName} className="px-2.5 py-1 bg-zinc-100 border border-zinc-200/60 text-zinc-700 rounded-md text-xs font-bold tracking-wide">{catName}</span>
                          )
                        }) : <span className="text-xs text-zinc-400">None</span>}
                      </div>
                    </td>
                  )}
                  
                  {columns.publishedAt && <td className="px-4 py-5 pt-6 align-top"><span className="text-sm font-semibold text-zinc-600">{dateToShow}</span></td>}

                  {columns.views && (
                    <td className="px-4 py-5 align-top pt-6">
                      <span className="text-sm font-bold text-zinc-700">{post.views || '0'}</span>
                    </td>
                  )}

                  <td className="px-6 py-5 text-right relative pt-6 align-top">
                    <button onClick={() => setActiveMenuId(activeMenuId === id ? null : id)} className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"><MoreVertical size={20} /></button>
                    <AnimatePresence>
                      {activeMenuId === id && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{duration:0.1}} className="absolute right-12 top-10 w-44 bg-white border border-zinc-200 shadow-xl rounded-xl overflow-hidden z-20 text-left py-1.5">
                          
                          <button onClick={() => navigate(`/admin/dashboard/edit-blog/${id}`)} className="w-full px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2.5"><Edit3 size={16} className="text-zinc-400"/> Edit Post</button>
                          
                          <button 
                            onClick={() => navigate(`/admin/dashboard/preview/${id}`)} 
                            className="w-full px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2.5"
                          >
                            <Eye size={16} className="text-zinc-400"/> Preview
                          </button>
                          
                          {!post.isDeleted && post.status !== 'Archived' && (
                            <button onClick={() => { openActionModal('archive', post); setActiveMenuId(null); }} className="w-full px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 flex items-center gap-2.5"><Archive size={16} className="text-amber-400"/> Archive</button>
                          )}

                          {post.isDeleted ? (
                            <button onClick={() => { handleRestore(id); setActiveMenuId(null); }} className="w-full px-4 py-2 text-sm font-semibold text-[#23b5b5] hover:bg-[#23b5b5]/10 flex items-center gap-2.5"><RotateCcw size={16}/> Restore</button>
                          ) : (
                            <button onClick={() => { openActionModal('delete', post); setActiveMenuId(null); }} className="w-full px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 border-t border-zinc-100 mt-1"><Trash2 size={16} className="text-rose-400"/> Move to Trash</button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
        )}
      </div>

      <div className="p-5 sm:p-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
        <p className="text-sm font-medium text-zinc-500">
          Showing <span className="font-bold text-zinc-900">{filteredPosts.length > 0 ? 1 : 0}</span> to <span className="font-bold text-zinc-900">{filteredPosts.length}</span> of <span className="font-bold text-zinc-900">{filteredPosts.length}</span> results
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-zinc-200 rounded-lg bg-white text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-colors disabled:opacity-50" disabled><ChevronLeft size={18} /></button>
          <button className="w-10 h-10 rounded-lg bg-[#23b5b5] text-white text-sm font-bold shadow-md shadow-[#23b5b5]/20">1</button>
          <button className="p-2 border border-zinc-200 rounded-lg bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"><ChevronRight size={18} /></button>
        </div>
      </div>

    </motion.div>
  );
};

// =====================================================================
// MAIN PAGE COMPONENT
// =====================================================================
export default function PostsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  
  const { posts, totalPosts, loading } = useSelector((state) => state.posts);
  const[modalConfig, setModalConfig] = useState({ isOpen: false, action: null, post: null });

  useEffect(() => {
    if (!posts || posts.length === 0) {
      dispatch(getAdminPostsThunk({ page: 1, limit: 100 })); 
    }
  },[dispatch, posts.length]);

  const openActionModal = (action, post) => setModalConfig({ isOpen: true, action, post });

  const executeModalAction = async () => {
    const { action, post } = modalConfig;
    const postId = post._id || post.id;
    try {
      if (action === 'delete') {
        await dispatch(softDeletePostThunk(postId)).unwrap();
      } else if (action === 'archive') {
        await dispatch(archivePostThunk(postId)).unwrap();
      }
    } catch (error) {
      console.error('Failed to perform action: ', error);
    }
  };

  const handleRestore = async (id) => {
     try {
       await dispatch(publishPostThunk(id)).unwrap(); 
     } catch (error) {
       console.error("Failed to restore", error);
     }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f4f5f7] font-sans text-zinc-900 selection:bg-[#23b5b5]/30 selection:text-[#23b5b5]">
      <div className="pt-20 lg:pt-0" />

      <motion.main 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="flex-1 w-full max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-10 space-y-8 relative"
      >
        <motion.header variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">Blog Posts</h1>
            <p className="text-zinc-500 text-sm sm:text-base font-medium mt-2">Manage, create, and organize your content.</p>
          </div>
          <button onClick={() => navigate('/admin/dashboard/create-blog')} className="bg-[#23b5b5] hover:bg-[#1d9898] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#23b5b5]/20 active:scale-95 transition-all">
            <Plus size={20} strokeWidth={2.5} /> Create New Post
          </button>
        </motion.header>

        <StatsCards posts={posts} totalPosts={totalPosts} />
        
        <PostsTable 
          posts={posts} 
          loading={loading && posts.length === 0}
          totalPosts={totalPosts}
          openActionModal={openActionModal} 
          handleRestore={handleRestore} 
        />

      </motion.main>

      <ConfirmModal 
        isOpen={modalConfig.isOpen && modalConfig.action === 'delete'}
        onClose={() => setModalConfig({ isOpen: false, action: null, post: null })}
        onConfirm={executeModalAction}
        title="Move to Trash"
        message={`Are you sure you want to move "${modalConfig.post?.title}" to the trash?`}
        confirmText="Move to Trash" icon={Trash2} colorTheme="red"
      />

      <ConfirmModal 
        isOpen={modalConfig.isOpen && modalConfig.action === 'archive'}
        onClose={() => setModalConfig({ isOpen: false, action: null, post: null })}
        onConfirm={executeModalAction}
        title="Archive Post"
        message={`Are you sure you want to archive "${modalConfig.post?.title}"?`}
        confirmText="Archive Post" icon={Archive} colorTheme="amber"
      />
    </div>
  );
}
