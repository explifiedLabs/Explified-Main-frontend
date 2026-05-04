import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Archive } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmModal, PostsTable, StatsCards } from './Posts';
import { getAdminPostsThunk, softDeletePostThunk, archivePostThunk } from '../../features/posts/postSlice';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function DraftsPage() {
  const dispatch = useDispatch();
  
  // 1. Get posts from Redux store
  const { posts: allPosts, loading, totalPosts } = useSelector((state) => state.posts);
  
  // 2. Fetch only if store is empty
  useEffect(() => {
    if (!allPosts || allPosts.length === 0) {
      dispatch(getAdminPostsThunk({ page: 1, limit: 100 }));
    }
  }, [dispatch, allPosts]);

  // 3. Filter only Drafts that are NOT deleted
  const draftPosts = (allPosts || []).filter(p => 
    p.status?.toLowerCase() === 'draft' && !p.isDeleted
  );
  
  const [modalConfig, setModalConfig] = useState({ isOpen: false, action: null, post: null });
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

  const handleRestore = (id) => {
    // Drafts aren't in a deleted state normally, but passed just in case
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f4f5f7] font-sans text-zinc-900 selection:bg-[#23b5b5]/30 selection:text-[#23b5b5]">
      <div className="pt-20 lg:pt-0" />

      <motion.main variants={containerVariants} initial="hidden" animate="show" className="flex-1 w-full max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-10 space-y-8 relative">
        <motion.header variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">Drafts</h1>
            <p className="text-zinc-500 text-sm sm:text-base font-medium mt-2">Manage your unpublished content and work-in-progress.</p>
          </div>
          <button className="bg-[#23b5b5] hover:bg-[#1d9898] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#23b5b5]/20 active:scale-95 transition-all">
            <Plus size={20} strokeWidth={2.5} /> Continue Writing
          </button>
        </motion.header>

        {/* Pass filtered draftPosts to the table */}
        <StatsCards posts={draftPosts} totalPosts={draftPosts.length} />
        
        <PostsTable 
          posts={draftPosts} 
          loading={loading && draftPosts.length === 0}
          totalPosts={draftPosts.length}
          openActionModal={openActionModal} 
          handleRestore={handleRestore} 
        />
      </motion.main>

      <ConfirmModal 
        isOpen={modalConfig.isOpen && modalConfig.action === 'delete'}
        onClose={() => setModalConfig({ isOpen: false, action: null, post: null })}
        onConfirm={executeModalAction}
        title="Move to Trash"
        message={`Are you sure you want to move the draft "${modalConfig.post?.title}" to the trash?`}
        confirmText="Move to Trash" icon={Trash2} colorTheme="red"
      />

      <ConfirmModal 
        isOpen={modalConfig.isOpen && modalConfig.action === 'archive'}
        onClose={() => setModalConfig({ isOpen: false, action: null, post: null })}
        onConfirm={executeModalAction}
        title="Archive Draft"
        message={`Are you sure you want to archive "${modalConfig.post?.title}"?`}
        confirmText="Archive Draft" icon={Archive} colorTheme="amber"
      />
    </div>
  );
}