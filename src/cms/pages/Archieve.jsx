import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Archive } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmModal, PostsTable, StatsCards } from './Posts';
import { getAdminPostsThunk, softDeletePostThunk, publishPostThunk } from '../../features/posts/postSlice';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function ArchivePage() {
  const dispatch = useDispatch();
  
  // 1. Get posts from Redux store
  const { posts: allPosts, loading } = useSelector((state) => state.posts);
  
  // 2. Fetch only if store is empty
  useEffect(() => {
    if (!allPosts || allPosts.length === 0) {
      dispatch(getAdminPostsThunk({ page: 1, limit: 100 }));
    }
  }, [dispatch, allPosts]);

  // 3. Filter only Archived posts that are NOT deleted
  const archivedPosts = (allPosts || []).filter(p => 
    p.status?.toLowerCase() === 'archived' && !p.isDeleted
  );
  
  const [modalConfig, setModalConfig] = useState({ isOpen: false, action: null, post: null });
  const openActionModal = (action, post) => setModalConfig({ isOpen: true, action, post });

  const executeModalAction = async () => {
    const { action, post } = modalConfig;
    const postId = post._id || post.id;
    try {
      if (action === 'delete') {
        await dispatch(softDeletePostThunk(postId)).unwrap();
      }
    } catch (error) {
      console.error('Failed to perform action: ', error);
    }
  };

  const handleRestore = async (id) => {
    try {
      // Restore from archive by publishing it (or changing status to draft if your API supports it)
      await dispatch(publishPostThunk(id)).unwrap();
    } catch (error) {
      console.error("Failed to restore from archive", error);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f4f5f7] font-sans text-zinc-900 selection:bg-[#23b5b5]/30 selection:text-[#23b5b5]">
      <div className="pt-20 lg:pt-0" />

      <motion.main variants={containerVariants} initial="hidden" animate="show" className="flex-1 w-full max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-10 space-y-8 relative">
        <motion.header variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">Archived Posts</h1>
            <p className="text-zinc-500 text-sm sm:text-base font-medium mt-2">View and restore your safely stored past content.</p>
          </div>
        </motion.header>

        <StatsCards posts={archivedPosts} totalPosts={archivedPosts.length} />
        
        <PostsTable 
          posts={archivedPosts} 
          loading={loading && archivedPosts.length === 0}
          totalPosts={archivedPosts.length}
          openActionModal={openActionModal} 
          handleRestore={handleRestore} 
        />
      </motion.main>

      <ConfirmModal 
        isOpen={modalConfig.isOpen && modalConfig.action === 'delete'}
        onClose={() => setModalConfig({ isOpen: false, action: null, post: null })}
        onConfirm={executeModalAction}
        title="Move to Trash"
        message={`Are you sure you want to move the archived post "${modalConfig.post?.title}" to the trash?`}
        confirmText="Move to Trash" icon={Trash2} colorTheme="red"
      />
    </div>
  );
}