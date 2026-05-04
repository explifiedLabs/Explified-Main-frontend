import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmModal, PostsTable, StatsCards } from './Posts';
import { getAdminPostsThunk, hardDeletePostThunk, publishPostThunk } from '../../features/posts/postSlice';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function DeletedPage() {
  const dispatch = useDispatch();
  
  // 1. Get posts from Redux store
  const { posts: allPosts, loading } = useSelector((state) => state.posts);
  
  // 2. Fetch only if store is empty
  useEffect(() => {
    if (!allPosts || allPosts.length === 0) {
      dispatch(getAdminPostsThunk({ page: 1, limit: 100 }));
    }
  }, [dispatch, allPosts]);

  // 3. Filter only Deleted posts (soft deleted)
  const deletedPosts = (allPosts || []).filter(p => p.isDeleted);
  
  const [modalConfig, setModalConfig] = useState({ isOpen: false, action: null, post: null });
  const openActionModal = (action, post) => setModalConfig({ isOpen: true, action, post });

  const executeModalAction = async () => {
    const { action, post } = modalConfig;
    const postId = post._id || post.id;
    try {
      if (action === 'delete') {
        // Permanently delete the post from database
        await dispatch(hardDeletePostThunk(postId)).unwrap();
      }
    } catch (error) {
      console.error('Failed to perform hard delete: ', error);
    }
  };

  const handleRestore = async (id) => {
    try {
      // Restore the post (Un-delete). Typically publish or specific restore endpoint
      await dispatch(publishPostThunk(id)).unwrap();
    } catch (error) {
      console.error("Failed to restore deleted post", error);
    }
  };

  const handleEmptyTrash = async () => {
    if (window.confirm("Are you sure you want to permanently delete all items in the trash? This cannot be undone.")) {
      // Loop through and permanently delete all posts in the trash
      for (const post of deletedPosts) {
        await dispatch(hardDeletePostThunk(post._id || post.id)).unwrap();
      }
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f4f5f7] font-sans text-zinc-900 selection:bg-[#23b5b5]/30 selection:text-[#23b5b5]">
      <div className="pt-20 lg:pt-0" />

      <motion.main variants={containerVariants} initial="hidden" animate="show" className="flex-1 w-full max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-10 space-y-8 relative">
        <motion.header variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">Trash</h1>
            <p className="text-zinc-500 text-sm sm:text-base font-medium mt-2">Manage deleted content. Items here will be permanently removed after 30 days.</p>
          </div>
          {deletedPosts.length > 0 && (
            <button 
              onClick={handleEmptyTrash} 
              className="bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Trash2 size={20} strokeWidth={2.5} /> Empty Trash
            </button>
          )}
        </motion.header>

        <StatsCards posts={deletedPosts} totalPosts={deletedPosts.length} />
        
        <PostsTable 
          posts={deletedPosts} 
          loading={loading && deletedPosts.length === 0}
          totalPosts={deletedPosts.length}
          openActionModal={openActionModal} 
          handleRestore={handleRestore} 
        />
      </motion.main>

      <ConfirmModal 
        isOpen={modalConfig.isOpen && modalConfig.action === 'delete'}
        onClose={() => setModalConfig({ isOpen: false, action: null, post: null })}
        onConfirm={executeModalAction}
        title="Permanently Delete"
        message={`Are you sure you want to permanently delete "${modalConfig.post?.title}"? This action cannot be undone.`}
        confirmText="Permanently Delete" icon={Trash2} colorTheme="red"
      />
    </div>
  );
}