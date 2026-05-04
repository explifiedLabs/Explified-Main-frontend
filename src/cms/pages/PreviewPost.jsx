import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { ArrowLeft, Eye } from 'lucide-react';

export default function PreviewPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { posts } = useSelector((state) => state.posts);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const foundPost = posts.find((p) => (p._id || p.id) === id);
    if (foundPost) setPost(foundPost);
  }, [id, posts]);

  const title = post?.title || 'Untitled Post';
  
  // Safe string author extraction
  let authorName = 'System Admin';
  if (post?.author) {
    if (typeof post.author === 'string') authorName = post.author;
    else if (post.author.name) authorName = post.author.name;
    else if (post.author.firstName) authorName = `${post.author.firstName} ${post.author.lastName || ''}`.trim();
  }

  // Format date precisely like "24 Feb 2026"
  const dateStr = post?.publishedAt || post?.createdAt || new Date();
  const formattedDate = new Intl.DateTimeFormat('en-GB', { 
    day: 'numeric', month: 'short', year: 'numeric' 
  }).format(new Date(dateStr));

  // Safe extract array to string mapped categories
  const categories = (post?.categories || []).map(cat => typeof cat === 'object' ? (cat.name || cat.title || cat._id) : cat);
  const content = post?.content || post?.body || '';
  const coverImageUrl = post?.coverImage ? (post.coverImage.url || post.coverImage) : null;

  return (
    /* ✅ fixed inset-0 z-[9999] makes it cover the ENTIRE screen over the sidebar */
    <div className="fixed inset-0 z-[9999] bg-white font-sans text-slate-900 overflow-y-auto w-full h-full">
      
      {/* --- TOP NAVBAR --- */}
      <header className="flex items-center justify-between px-6 lg:px-10 py-5 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-[100]">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2.5 text-[15px] font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={18} strokeWidth={2.5} /> Back to Editor
        </button>
        
        <div className="flex items-center gap-2 text-[13px] font-bold text-[#23b5b5] uppercase tracking-widest">
          <Eye size={16} strokeWidth={2.5} /> LIVE VIEW
        </div>
      </header>

      {/* --- PREVIEW CONTENT CONTAINER --- */}
      <main className="max-w-[768px] mx-auto pt-20 px-6 pb-32 w-full flex flex-col items-start">
        
        {/* Cover Image */}
        {coverImageUrl && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100">
            <img src={coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Date & Author (Formatted exactly like the image) */}
        <div className="flex items-center gap-2.5 text-[14px] font-semibold text-slate-500 mb-3">
          <span>{formattedDate}</span>
          <span className="text-slate-300 font-light">|</span>
          <span>by {authorName}</span>
        </div>

        {/* Title */}
        <h1 className="text-[3.25rem] sm:text-[4rem] font-extrabold text-[#111827] mb-6 tracking-tight leading-[1.05]">
          {title}
        </h1>

        {/* Categories / Tags */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {categories.length > 0 ? (
            categories.map((cat, i) => (
              <span key={i} className="px-4 py-1.5 border border-gray-200 rounded-full text-[13px] font-bold text-slate-600 bg-white shadow-sm">
                {cat}
              </span>
            ))
          ) : (
             <span className="px-4 py-1.5 border border-gray-200 rounded-full text-[13px] font-bold text-slate-400 bg-white shadow-sm">
               Uncategorized
             </span>
          )}
        </div>

        {/* Post Body/Content */}
        <div className="prose prose-lg prose-slate max-w-none custom-editor w-full">
          {content && content !== '<p></p>' ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p className="italic text-slate-400 font-medium text-lg">
              No content written yet...
            </p>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-editor { color: #334155; line-height: 1.8; font-size: 1.125rem; }
        .custom-editor > * + * { margin-top: 1.5em; }
        .custom-editor h1, .custom-editor h2, .custom-editor h3, .custom-editor h4 { color: #0f172a; margin-bottom: 0.5em; line-height: 1.3;}
        .custom-editor h1 { font-size: 2.5em; font-weight: 800; }
        .custom-editor h2 { font-size: 2em; font-weight: 700; }
        .custom-editor p { margin-top: 0; margin-bottom: 1.25rem; }
        .custom-editor ul { list-style-type: disc !important; padding-left: 1.5rem !important; }
        .custom-editor ol { list-style-type: decimal !important; padding-left: 1.5rem !important; }
        .custom-editor blockquote { border-left: 4px solid #23b5b5 !important; padding-left: 1.5rem !important; font-style: italic; background: #f4f7f6; padding: 1.25rem;}
        .custom-editor img { border-radius: 12px; max-width: 100%; height: auto; margin: 2.5rem 0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);}
      `}} />
    </div>
  );
}