import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit, Color } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify'; // ✅ Added Toastify
import { createPostThunk, fetchMediaThunk } from '../../features/posts/postSlice'; 
import {
  X, UploadCloud, Bold, Italic, Underline as UnderlineIcon,
  Link as LinkIcon, List, ListOrdered, Quote, AlignLeft, AlignCenter,
  AlignRight, Eye, ChevronDown, Strikethrough, Hash, FolderTree, 
  ImagePlus, Check, ArrowLeft, Settings, Type, Unlink, Images,
  Undo, Redo, Code as CodeIcon, Minus, Highlighter, Palette,
  Search, Monitor, Wand2, Map as MapIcon, Share2, Video as VideoIcon,
  Image as ImageIcon, Crop, ZoomIn, Settings2, Loader2, Linkedin, Twitter
} from 'lucide-react';
import { useNavigate } from 'react-router';

const CURRENT_USER = { name: 'Joshua Nash', role: 'Author' };
const BRAND_COLOR = '#23b5b5';
const MODAL_KEYWORDS = ['Mountain', 'Nature', 'Sky', 'Landscape', 'Technology', 'Business'];

// ==========================================
// 🔴 CLOUDINARY CONFIGURATION 🔴
// ==========================================
const CLOUDINARY_CLOUD_NAME = 'dsyrfjdnk';
const CLOUDINARY_UPLOAD_PRESET = 'Unsigned';

// --- CUSTOM FONT SIZE EXTENSION ---
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() { return { types: ['textStyle'] } },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: element => element.style.fontSize?.replace(/['"]+/g, ''),
          renderHTML: attributes => {
            if (!attributes.fontSize) return {};
            return { style: `font-size: ${attributes.fontSize}` };
          }
        }
      }
    }];
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => chain().setMark('textStyle', { fontSize }).run(),
      unsetFontSize: () => ({ chain }) => chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    };
  }
});

const FONT_FAMILIES = [
  { name: 'Inter / Sans', value: 'Inter, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Courier New', value: '"Courier New", monospace' }
];

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px'];

export default function CreatePostPage() {
  const dispatch = useDispatch();
  const { media, loading, mediaLoading } = useSelector((state) => state.posts);

  const [post, setPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categories: ['Invest', 'News'],
    tags: ['Finance'],
    status: 'draft',
    coverImage: null, 
    author: CURRENT_USER,
  });
  
  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false); // ✅ Added state to track manual slug edits
  
  // Upload States
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingEditorMedia, setIsUploadingEditorMedia] = useState(false);

  // Gallery Modal State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeModalSidebar, setActiveModalSidebar] = useState('Stock Photos');
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [stockImages, setStockImages] = useState([]);
  const [isFetchingStock, setIsFetchingStock] = useState(false);
  
  // Image Customizer / Edit State
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [cropAspect, setCropAspect] = useState('auto');
  const [cropZoom, setCropZoom] = useState(100);

  const imageUploadRef = useRef(null);
  const titleTextareaRef = useRef(null);
    const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchMediaThunk());
    fetchStockPhotos('abstract'); 
  }, [dispatch]);

  useEffect(() => {
    if (!isGalleryOpen) {
      setIsEditingImage(false);
      setCropAspect('auto');
      setCropZoom(100);
      setSelectedGalleryImage(null);
    }
  }, [isGalleryOpen]);

  const saveImageToYourBackendGallery = async (cloudinaryUrl) => {
    try {
      await axios.post('https://cmsapi-pf6diz22ka-uc.a.run.app/api/media/upload', 
        { url: cloudinaryUrl },
        { withCredentials: true }
      );
      dispatch(fetchMediaThunk());
    } catch (error) {
      console.error("Could not save to backend gallery, but it was uploaded to Cloudinary.", error);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.secure_url) {
        await saveImageToYourBackendGallery(data.secure_url);
        return data.secure_url; 
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (err) {
      console.error("Cloudinary upload failed", err);
      toast.error(`Image upload failed: ${err.message}`);
      return null;
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingCover(true);
    const uploadedUrl = await uploadToCloudinary(file);
    if (uploadedUrl) setPost(prev => ({ ...prev, coverImage: uploadedUrl }));
    e.target.value = null; 
    setIsUploadingCover(false);
  };

  const handleEditorImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !editor) return;
    setIsUploadingEditorMedia(true);
    const uploadedUrl = await uploadToCloudinary(file);
    if (uploadedUrl) editor.chain().focus().setImage({ src: uploadedUrl }).run();
    e.target.value = null;
    setIsUploadingEditorMedia(false);
  };

  const fetchStockPhotos = async (query) => {
    setIsFetchingStock(true);
    try {
      const res = await fetch(`https://picsum.photos/v2/list?page=${Math.floor(Math.random()*10)}&limit=12`);
      const data = await res.json();
      setStockImages(data.map(img => img.download_url));
      setIsFetchingStock(false);
    } catch (error) {
      console.error("Failed to fetch stock images", error);
      setIsFetchingStock(false);
    }
  };

  const handleSearchStock = (e) => {
    if (e.key === 'Enter' && stockSearchQuery.trim()) fetchStockPhotos(stockSearchQuery.trim());
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ 
        heading: { levels: [1, 2, 3, 4, 5] },
        dropcursor: { color: BRAND_COLOR, width: 2 },
      }),
      Underline,
      TextStyleKit,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      FontSize,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: true, HTMLAttributes: { class: 'tiptap-image' } }),
      Link.configure({ 
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: 'editor-link' }
      }),
      Placeholder.configure({ placeholder: 'Start writing your amazing content here...' }),
    ],
    content: `<p></p>`,
    onUpdate: ({ editor }) => {
      setPost(prev => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: { class: 'custom-editor focus:outline-none min-h-[600px] w-full max-w-none' },
    },
  });

  // ✅ Updated Slug Generator (Stops auto-generating if user manually typed a slug)
  useEffect(() => {
    if (post.title && !isSlugManuallyEdited) {
      const generatedSlug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setPost(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [post.title, isSlugManuallyEdited]);

  const handleTitleChange = (e) => {
    setPost({ ...post, title: e.target.value });
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = 'auto';
      titleTextareaRef.current.style.height = titleTextareaRef.current.scrollHeight + 'px';
    }
  };

  // ✅ New handler for manual slug edits
  const handleSlugChange = (e) => {
    setIsSlugManuallyEdited(true);
    const formattedSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    setPost(prev => ({ ...prev, slug: formattedSlug }));
  };

  // ✅ Updated handlePublish using React Toastify with backend messages
  const handlePublish = async () => {
    if (!post.title) return toast.warning("Please enter a title.");
    try {
      const response = await dispatch(createPostThunk({
        title: post.title,
        slug: post.slug, 
        excerpt: post.excerpt,
        content: post.content, 
        categories: post.categories,
        tags: post.tags,
        status: post.status,
        coverImage: post.coverImage, 
      })).unwrap();
      
      toast.success(response?.message || 'Post created successfully ✅');
      navigate('/admin/dashboard/posts'); 
    } catch (error) {
      toast.error(error?.message || error || 'Error publishing post');
    }
  };

  const handleAddItem = (e, type, input, setInput) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!post[type].includes(input.trim())) {
        setPost(prev => ({ ...prev, [type]: [...prev[type], input.trim()] }));
      }
      setInput('');
    }
  };

  const removeItem = (type, itemToRemove) => {
    setPost(prev => ({ ...prev, [type]: prev[type].filter(item => item !== itemToRemove) }));
  };

  const insertSelectedGalleryImage = () => {
    if (selectedGalleryImage && editor) {
      editor.chain().focus().setImage({ src: selectedGalleryImage }).run();
      setIsGalleryOpen(false);
      setSelectedGalleryImage(null);
    }
  };

  const handleFontSizeChange = (e) => {
    const val = e.target.value;
    if (val === 'custom') {
      const customSize = window.prompt('Enter custom font size (e.g., 22px):');
      if (customSize) editor.chain().focus().setFontSize(customSize).run();
    } else {
      editor.chain().focus().setFontSize(val).run();
    }
  };

  const tableOfContents = useMemo(() => {
    if (!isPreviewMode || !post.content) return [];
    const doc = new DOMParser().parseFromString(post.content, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3'));
    return headings.map((heading, index) => ({
      id: `toc-${index}`,
      text: heading.innerText,
      level: heading.tagName.toLowerCase()
    }));
  }, [post.content, isPreviewMode]);

  const EditorToolbar = () => {
    if (!editor) return null;

    const ToolbarBtn = ({ action, isActive, icon, title }) => (
      <button
        onClick={(e) => { e.preventDefault(); action(); }}
        title={title}
        className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
          isActive ? `bg-[${BRAND_COLOR}] text-white` : `text-gray-400 hover:bg-[#252525] hover:text-[${BRAND_COLOR}]`
        }`}
      >
        {icon}
      </button>
    );

    return (
      <div className="sticky top-[80px] z-50 bg-white pt-4 pb-3 px-4 sm:px-6 lg:px-8 rounded-t-xl border-b border-gray-100">
        <div className="bg-[#0a0a0a] border border-[#222] px-4 py-2.5 flex flex-wrap items-center gap-1.5 shadow-2xl w-full rounded-xl overflow-x-auto no-scrollbar">
          <ToolbarBtn action={() => editor.chain().focus().undo().run()} isActive={false} icon={<Undo size={16} />} title="Undo" />
          <ToolbarBtn action={() => editor.chain().focus().redo().run()} isActive={false} icon={<Redo size={16} />} title="Redo" />
          <div className="w-px h-5 bg-gray-700 mx-1"></div>

          <div className="relative flex items-center">
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'p') editor.chain().focus().setParagraph().run();
                else editor.chain().focus().toggleHeading({ level: parseInt(val) }).run();
              }}
              className={`appearance-none bg-[#1a1a1a] hover:bg-[#252525] text-gray-200 border border-[#333] text-sm font-medium outline-none cursor-pointer py-1.5 pl-3 pr-7 rounded-md transition-all focus:border-[${BRAND_COLOR}]`}
            >
              <option value="p">Normal Text</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
              <option value="5">Heading 5</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 text-gray-400 pointer-events-none" />
          </div>

          <div className="w-px h-5 bg-gray-700 mx-1"></div>

          <div className="relative items-center hidden sm:flex">
            <Type size={14} className="absolute left-2 text-gray-400 pointer-events-none" />
            <select
              onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
              className={`appearance-none bg-[#1a1a1a] hover:bg-[#252525] text-gray-200 border border-[#333] text-sm outline-none cursor-pointer py-1.5 pl-7 pr-7 rounded-md transition-all w-[130px] truncate focus:border-[${BRAND_COLOR}]`}
            >
              <option value="">Default Font</option>
              {FONT_FAMILIES.map(font => <option key={font.name} value={font.value}>{font.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative flex items-center ml-1">
            <select
              onChange={handleFontSizeChange}
              className={`appearance-none bg-[#1a1a1a] hover:bg-[#252525] text-gray-200 border border-[#333] text-sm outline-none cursor-pointer py-1.5 pl-3 pr-7 rounded-md transition-all focus:border-[${BRAND_COLOR}]`}
            >
              <option value="">Size</option>
              {FONT_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
              <option value="custom">Custom...</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 text-gray-400 pointer-events-none" />
          </div>

          <div className="w-px h-5 bg-gray-700 mx-1"></div>

          <div className="relative flex items-center group" title="Text Color">
            <Palette size={16} className="text-gray-400 absolute pointer-events-none left-1.5 group-hover:text-white transition-colors" />
            <input
              type="color"
              onInput={event => editor.chain().focus().setColor(event.target.value).run()}
              value={editor.getAttributes('textStyle').color || '#000000'}
              className="w-8 h-8 p-0 border-0 rounded-md cursor-pointer opacity-0"
            />
          </div>

          <ToolbarBtn action={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={<Bold size={16} />} title="Bold" />
          <ToolbarBtn action={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={<Italic size={16} />} title="Italic" />
          <ToolbarBtn action={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={<UnderlineIcon size={16} />} title="Underline" />
          <ToolbarBtn action={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} icon={<Highlighter size={16} />} title="Highlight" />
          <ToolbarBtn action={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} icon={<CodeIcon size={16} />} title="Inline Code" />
          
          <div className="w-px h-5 bg-gray-700 mx-1"></div>
          <ToolbarBtn action={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={<AlignLeft size={16} />} title="Left" />
          <ToolbarBtn action={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={<AlignCenter size={16} />} title="Center" />
          <div className="w-px h-5 bg-gray-700 mx-1"></div>
          <ToolbarBtn action={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={<List size={16} />} title="Bullets" />
          <ToolbarBtn action={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={<Quote size={16} />} title="Quote" />
          <ToolbarBtn action={() => editor.chain().focus().setHorizontalRule().run()} isActive={false} icon={<Minus size={16} />} title="Separator" />

          <div className="flex-1"></div>

          <button
            onClick={(e) => { e.preventDefault(); imageUploadRef.current?.click(); }}
            title="Upload Local Image"
            disabled={isUploadingEditorMedia}
            className={`p-1.5 px-3 rounded-md text-gray-400 hover:bg-[#252525] hover:text-[${BRAND_COLOR}] transition-all flex items-center gap-2 text-sm font-medium border border-transparent disabled:opacity-50`}
          >
            {isUploadingEditorMedia ? <Loader2 size={16} className={`text-[${BRAND_COLOR}] animate-spin`} /> : <ImagePlus size={16} className={`text-[${BRAND_COLOR}]`} />} 
            <span className="hidden sm:inline">{isUploadingEditorMedia ? 'Uploading...' : 'Add Media'}</span>
          </button>
          <input type="file" ref={imageUploadRef} onChange={handleEditorImageUpload} accept="image/*" className="hidden" />

          <button
            onClick={(e) => { e.preventDefault(); setIsGalleryOpen(true); }}
            title="Open Media Gallery"
            className={`px-3 py-1.5 mr-1 rounded-md bg-[#252525] hover:bg-[#333] text-white transition-all flex items-center gap-2 text-sm font-medium border border-[#444] hover:border-[${BRAND_COLOR}]`}
          >
            <Images size={16} className={`text-[${BRAND_COLOR}]`} /> Gallery
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-[#f4f7f6] text-slate-900 font-sans selection:bg-[${BRAND_COLOR}]/20 selection:text-[${BRAND_COLOR}]`}>
      
      {/* 🔝 CLEAN TOP NAV */}
      <header className="bg-white px-8 h-[80px] flex items-center justify-between sticky top-0 z-[60] shadow-sm">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-[${BRAND_COLOR}] flex items-center justify-center text-white font-extrabold text-lg shadow-sm shadow-[${BRAND_COLOR}]/30`}>C</div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Create Post</h1>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <button 
            onClick={() => setIsPreviewMode(true)}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md shadow-sm transition-all flex items-center gap-2"
          >
            <Eye size={16} /> Preview
          </button>
          <button 
            onClick={handlePublish}
            disabled={loading}
            className={`px-6 py-2 text-sm font-semibold text-white bg-[${BRAND_COLOR}] hover:bg-[#1d9797] disabled:opacity-70 disabled:cursor-not-allowed rounded-md shadow-sm shadow-[${BRAND_COLOR}]/20 transition-all flex items-center gap-2`}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </motion.div>
      </header>

      {/* 🧱 MAIN EDITOR LAYOUT */}
      <main className={`max-w-[1600px] mx-auto p-4 md:px-8 pb-20 flex flex-col lg:flex-row gap-8 items-start relative ${isPreviewMode ? 'hidden' : 'flex'}`}>
        
        <div className="w-full lg:flex-1 flex flex-col gap-6 relative min-w-0">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-5"
          >
            <label className={`text-[11px] font-bold text-[${BRAND_COLOR}] uppercase tracking-widest mb-1.5 flex items-center gap-2`}>
              <Type size={13}/> Post Title
            </label>
            <textarea
              ref={titleTextareaRef}
              rows={1}
              value={post.title}
              onChange={handleTitleChange}
              placeholder="Enter your blog title here..."
              className="w-full bg-transparent text-slate-900 text-2xl sm:text-3xl lg:text-4xl font-extrabold placeholder-gray-300 outline-none border-none focus:ring-0 p-0 tracking-tight leading-[1.2] resize-none overflow-hidden"
            />
            
            {/* ✅ NEW SLUG EDITING FUNCTIONALITY ADDED HERE */}
            <div className="mt-4 flex items-center gap-2 text-[13px] text-gray-500 bg-gray-50/80 px-3 py-2.5 rounded-lg border border-gray-100 max-w-full overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[#23b5b5]/20 focus-within:border-[#23b5b5]">
              <LinkIcon size={14} className="text-gray-400 flex-shrink-0" />
              <span className="flex-shrink-0 font-medium">https://explified.com/</span>
              <input
                type="text"
                value={post.slug}
                onChange={handleSlugChange}
                placeholder="your-custom-slug"
                className="bg-transparent border-none outline-none text-[13px] text-[#23b5b5] font-semibold p-0 focus:ring-0 w-full min-w-[150px]"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm relative flex flex-col w-full"
          >
            <EditorToolbar />
            <div className="p-6 lg:p-10 lg:pt-6 flex flex-col w-full">
              <div className="cursor-text w-full flex-1">
                <EditorContent editor={editor} className="w-full max-w-none" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="w-full lg:w-[350px] flex-shrink-0 flex flex-col gap-6 lg:sticky lg:top-[100px]"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-gray-100 flex items-center gap-2 uppercase tracking-wide">
              <Settings size={16} className="text-slate-400"/> Details
            </h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Status</label>
              <select 
                value={post.status} 
                onChange={(e) => setPost({...post, status: e.target.value})}
                className={`w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[${BRAND_COLOR}]/30 focus:border-[${BRAND_COLOR}] transition-colors`}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 flex justify-between">
                Excerpt <span className="text-slate-400 font-normal">{post.excerpt.length}/200</span>
              </label>
              <textarea
                rows="4" maxLength={200} value={post.excerpt} onChange={e => setPost({ ...post, excerpt: e.target.value })}
                placeholder="Brief summary shown under the title..."
                className={`w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg p-2.5 outline-none resize-none focus:ring-2 focus:ring-[${BRAND_COLOR}]/30 focus:border-[${BRAND_COLOR}] transition-colors`}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-5">
             <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-gray-100 flex items-center gap-2 uppercase tracking-wide">
              <FolderTree size={16} className="text-slate-400"/> Organization
            </h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Categories</label>
              <div className={`w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus-within:ring-2 focus-within:ring-[${BRAND_COLOR}]/30 focus-within:border-[${BRAND_COLOR}] min-h-[48px] transition-all`}>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {post.categories.map(cat => (
                      <motion.span 
                        key={cat} 
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} 
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-1 bg-[${BRAND_COLOR}]/10 text-[${BRAND_COLOR}] border border-[${BRAND_COLOR}]/20 text-xs font-bold rounded-md flex items-center gap-1.5 shadow-sm`}
                      >
                        {cat} 
                        <button onClick={() => removeItem('categories', cat)} className={`text-[${BRAND_COLOR}] hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-50`}><X size={12} strokeWidth={3}/></button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  <input
                    type="text" value={categoryInput} onChange={e => setCategoryInput(e.target.value)} onKeyDown={(e) => handleAddItem(e, 'categories', categoryInput, setCategoryInput)}
                    placeholder="Type & enter..." className="flex-1 min-w-[80px] bg-transparent text-sm text-slate-800 outline-none p-1 font-medium"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Tags</label>
              <div className={`w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus-within:ring-2 focus-within:ring-[${BRAND_COLOR}]/30 focus-within:border-[${BRAND_COLOR}] min-h-[48px] transition-all`}>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {post.tags.map(tag => (
                      <motion.span 
                        key={tag} 
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} 
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold rounded-md flex items-center gap-1.5 shadow-sm"
                      >
                        #{tag} 
                        <button onClick={() => removeItem('tags', tag)} className="text-slate-500 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-50"><X size={12} strokeWidth={3}/></button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  <input
                    type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={(e) => handleAddItem(e, 'tags', tagInput, setTagInput)}
                    placeholder="Type & enter..." className="flex-1 min-w-[80px] bg-transparent text-sm text-slate-800 outline-none p-1 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-5">
             <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-gray-100 flex items-center gap-2 uppercase tracking-wide">
              <ImagePlus size={16} className="text-slate-400"/> Cover Image
            </h3>
            {post.coverImage ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-video group shadow-inner">
                <img src={post.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <motion.div 
                  initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-slate-900/60 transition-opacity flex items-center justify-center backdrop-blur-sm"
                >
                  <button onClick={() => setPost({ ...post, coverImage: null })} className="text-white bg-red-500/90 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg">
                    <X size={16} /> Remove Cover
                  </button>
                </motion.div>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center w-full aspect-video border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-[${BRAND_COLOR}]/5 hover:border-[${BRAND_COLOR}]/50 transition-all group relative overflow-hidden`}>
                {isUploadingCover ? (
                   <div className="flex flex-col items-center justify-center text-[13px] font-bold text-slate-500 gap-3">
                     <Loader2 className={`animate-spin text-[${BRAND_COLOR}] w-8 h-8`} />
                     Uploading to Cloudinary...
                   </div>
                ) : (
                  <>
                    <div className={`p-4 bg-white rounded-full shadow-sm mb-3 text-slate-400 group-hover:text-[${BRAND_COLOR}] transition-colors group-hover:scale-110 transform duration-300`}>
                      <UploadCloud size={24} />
                    </div>
                    <p className={`text-sm font-bold text-slate-600 group-hover:text-[${BRAND_COLOR}]`}>Click to upload image</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                  </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleCoverImageUpload} disabled={isUploadingCover} />
              </label>
            )}
          </div>
        </motion.div>
      </main>

      {/* 🖼️ GALLERY MODAL */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10 font-sans"
          >
            <motion.div 
              initial={{ scale: 0.97, y: 10, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.97, y: 10, opacity: 0 }} 
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              className="bg-white rounded-[24px] w-full max-w-[1100px] flex flex-col shadow-2xl overflow-hidden border border-gray-200/60"
            >
              
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${isEditingImage ? 'bg-indigo-100 text-indigo-600' : `bg-[${BRAND_COLOR}]/10 text-[${BRAND_COLOR}]`} flex items-center justify-center shadow-inner transition-colors`}>
                    {isEditingImage ? <Crop size={18} strokeWidth={2.5}/> : <Images size={18} strokeWidth={2.5} />}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 leading-tight">
                      {isEditingImage ? 'Customize Image' : 'Select Media'}
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">
                      {isEditingImage ? 'Adjust size and crop' : 'Choose a background type'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsGalleryOpen(false)} 
                  className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-800 rounded-full transition-colors"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {isEditingImage ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row h-[600px] bg-slate-100/50">
                   <div className="flex-1 p-8 flex items-center justify-center border-r border-gray-200 relative overflow-hidden">
                      <div className="absolute top-4 left-4 flex gap-2">
                         <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 shadow-sm border border-slate-200">
                           {cropZoom}% Zoom
                         </span>
                         <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 shadow-sm border border-slate-200">
                           {cropAspect === 'auto' ? 'Original Ratio' : `${cropAspect} Ratio`}
                         </span>
                      </div>

                      <div className={`relative w-full max-w-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out border-2 border-transparent hover:border-[${BRAND_COLOR}]/50 ${
                         cropAspect === '16/9' ? 'aspect-video' :
                         cropAspect === '4/3' ? 'aspect-[4/3]' :
                         cropAspect === '1/1' ? 'aspect-square' :
                         'aspect-auto h-full max-h-[500px]'
                      }`}>
                         <img 
                           src={selectedGalleryImage} 
                           alt="Crop preview"
                           className="w-full h-full object-cover cursor-move origin-center"
                           style={{ transform: `scale(${cropZoom / 100})` }}
                           draggable={false}
                         />
                         <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none mix-blend-overlay opacity-40">
                            <div className="border-r border-b border-white"></div>
                            <div className="border-r border-b border-white"></div>
                            <div className="border-b border-white"></div>
                            <div className="border-r border-b border-white"></div>
                            <div className="border-r border-b border-white"></div>
                            <div className="border-b border-white"></div>
                            <div className="border-r border-white"></div>
                            <div className="border-r border-white"></div>
                            <div></div>
                         </div>
                      </div>
                   </div>

                   <div className="w-[320px] bg-white p-6 flex flex-col gap-8 overflow-y-auto shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
                      <div className="flex items-center gap-2 text-slate-800 font-bold uppercase tracking-wider text-sm border-b border-slate-100 pb-3">
                        <Settings2 size={18} className="text-slate-400" /> Image Adjustments
                      </div>

                      <div className="flex flex-col gap-3">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Aspect Ratio</label>
                         <div className="grid grid-cols-2 gap-2">
                            {['auto', '16/9', '4/3', '1/1'].map(ratio => (
                               <button 
                                 key={ratio}
                                 onClick={() => setCropAspect(ratio)}
                                 className={`py-2.5 px-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                                   cropAspect === ratio 
                                   ? `bg-[${BRAND_COLOR}]/5 border-[${BRAND_COLOR}] text-[${BRAND_COLOR}]`
                                   : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                 }`}
                               >
                                 {ratio === 'auto' ? 'Original' : ratio}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div className="flex flex-col gap-4">
                         <label className="text-xs font-bold text-slate-500 flex justify-between uppercase tracking-wide">
                            <span className="flex items-center gap-1"><ZoomIn size={14}/> Scale</span>
                         </label>
                         <input 
                            type="range" 
                            min="100" max="250" 
                            value={cropZoom} 
                            onChange={e => setCropZoom(e.target.value)}
                            className={`w-full accent-[${BRAND_COLOR}] cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none`}
                         />
                         <p className="text-xs text-slate-400 leading-relaxed font-medium">
                           Drag the slider to zoom in. You can click and drag the image on the left to reposition the subject.
                         </p>
                      </div>
                   </div>

                </motion.div>
              ) : (
                <div className="flex flex-row h-[600px] bg-white">
                  
                  <div className="w-[240px] border-r border-gray-100 p-4 flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
                    {[
                      { id: 'Images', icon: ImageIcon, label: 'My Uploads' },
                      { id: 'Stock Photos', icon: Images, label: 'Unsplash / Pexels' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveModalSidebar(item.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative overflow-hidden ${
                          activeModalSidebar === item.id 
                            ? `bg-[${BRAND_COLOR}]/5 text-[${BRAND_COLOR}] font-bold` 
                            : 'text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {activeModalSidebar === item.id && (
                          <motion.div 
                            layoutId="activeSidebarIndicator" 
                            className={`absolute left-0 top-0 bottom-0 w-1 bg-[${BRAND_COLOR}] rounded-r-full`} 
                          />
                        )}
                        <item.icon size={18} className={activeModalSidebar === item.id ? `text-[${BRAND_COLOR}]` : 'text-gray-400'} strokeWidth={activeModalSidebar === item.id ? 2.5 : 2} />
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 flex flex-col bg-white">
                    <div className="p-5 pb-3 flex flex-col gap-4 border-b border-gray-50">
                      {activeModalSidebar === 'Stock Photos' && (
                        <div className="relative w-full max-w-md">
                          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            value={stockSearchQuery}
                            onChange={(e) => setStockSearchQuery(e.target.value)}
                            onKeyDown={handleSearchStock}
                            placeholder="Search high-quality stock images... (Press Enter)" 
                            className={`w-full pl-10 pr-4 py-2 bg-gray-100/80 border-transparent rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-[${BRAND_COLOR}] focus:ring-2 focus:ring-[${BRAND_COLOR}]/20 transition-all`}
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 mr-1 font-semibold uppercase tracking-wider">Keywords:</span>
                        {MODAL_KEYWORDS.map(kw => (
                          <button 
                            key={kw} 
                            onClick={() => { setStockSearchQuery(kw); fetchStockPhotos(kw); }}
                            className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-[13px] font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
                          >
                            {kw}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 pt-4">
                      {(activeModalSidebar === 'Images' && mediaLoading) || (activeModalSidebar === 'Stock Photos' && isFetchingStock) ? (
                        <div className="flex justify-center items-center h-full text-slate-400">
                          <Loader2 className={`animate-spin w-8 h-8 mr-2 text-[${BRAND_COLOR}]`} /> Loading images...
                        </div>
                      ) : (
                        <motion.div 
                          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                          initial="hidden"
                          animate="show"
                          variants={{
                            hidden: { opacity: 0 },
                            show: { opacity: 1, transition: { staggerChildren: 0.05 } }
                          }}
                        >
                          {(activeModalSidebar === 'Images' ? media : stockImages)?.map((imgObj, i) => {
                            const url = typeof imgObj === 'string' ? imgObj : imgObj?.url || imgObj?.secure_url;
                            return url ? (
                              <motion.div 
                                key={i} 
                                variants={{
                                  hidden: { opacity: 0, scale: 0.9 },
                                  show: { opacity: 1, scale: 1 }
                                }}
                                onClick={() => setSelectedGalleryImage(url)}
                                className={`relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 group ${
                                  selectedGalleryImage === url 
                                    ? `border-[${BRAND_COLOR}] shadow-lg shadow-[${BRAND_COLOR}]/20 scale-[0.98]` 
                                    : 'border-transparent hover:border-gray-200 hover:shadow-md'
                                }`}
                              >
                                <img src={url} alt={`Media ${i}`} className="w-full h-full object-cover" />
                                
                                <AnimatePresence>
                                  {selectedGalleryImage === url && (
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                      className={`absolute top-2 right-2 bg-[${BRAND_COLOR}] text-white p-1 rounded-full shadow-md`}
                                    >
                                      <Check size={14} strokeWidth={3} />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                                <div className={`absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity ${selectedGalleryImage === url ? 'hidden' : ''}`} />
                              </motion.div>
                            ) : null;
                          })}

                          {activeModalSidebar === 'Images' && (!media || media.length === 0) && (
                            <div className="col-span-full text-center text-slate-400 py-10">
                              <ImagePlus size={40} className="mx-auto mb-3 opacity-30" />
                              <p>No uploads found in your Redux state.</p>
                            </div>
                          )}

                        </motion.div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              <div className="border-t border-gray-100 p-4 px-6 flex justify-between items-center bg-gray-50/50">
                {isEditingImage ? (
                  <button 
                    onClick={() => setIsEditingImage(false)}
                    className="px-5 py-2 flex items-center gap-2 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                  >
                    <ArrowLeft size={16}/> Back to Gallery
                  </button>
                ) : (
                  <div></div>
                )}
                
                <div className="flex gap-3">
                  {!isEditingImage && (
                    <>
                      <button 
                        onClick={() => setIsGalleryOpen(false)}
                        className="px-5 py-2 rounded-xl text-sm font-bold text-gray-600 bg-transparent hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => setIsEditingImage(true)}
                        disabled={!selectedGalleryImage}
                        className={`px-5 py-2 flex items-center gap-2 rounded-xl text-sm font-bold border transition-colors shadow-sm ${
                          selectedGalleryImage 
                            ? 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300' 
                            : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-70'
                        }`}
                      >
                        <Crop size={16}/> Customize
                      </button>
                    </>
                  )}
                  <button 
                    onClick={insertSelectedGalleryImage}
                    disabled={!selectedGalleryImage}
                    className={`px-6 py-2 rounded-xl text-sm font-bold text-white transition-all shadow-sm ${
                      selectedGalleryImage 
                        ? `bg-[${BRAND_COLOR}] hover:bg-[#1d9797] shadow-[${BRAND_COLOR}]/20 hover:shadow-md` 
                        : 'bg-gray-300 cursor-not-allowed opacity-70 text-gray-500'
                    }`}
                  >
                    {isEditingImage ? 'Insert Custom Image' : 'Insert Image'}
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 👁️ FRAMER MOTION LIVE PREVIEW (UPDATED SLEEK DARK LAYOUT) */}
      <AnimatePresence>
        {isPreviewMode && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-[#050505] overflow-y-auto w-full h-full text-gray-300 font-sans"
          >
            {/* Minimal Top Nav */}
            <div className="max-w-[1200px] mx-auto px-6 py-8 flex justify-center relative">
              <button onClick={() => setIsPreviewMode(false)} className="absolute left-6 flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[13px] font-semibold tracking-wide uppercase">
                <ArrowLeft size={14} /> Back to Articles
              </button>
            </div>

            <article className="max-w-[1200px] mx-auto px-6 pb-32">
              
              {/* HEADER SECTION */}
              <div className="max-w-3xl mx-auto text-center mb-12 flex flex-col items-center">
                {post.categories.length > 0 && (
                  <span className="inline-block px-3 py-1 bg-[#23b5b5]/10 text-[#23b5b5] text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-[#23b5b5]/20">
                    {post.categories[0]}
                  </span>
                )}
                
                <h1 className="text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-[1.1] tracking-tight mb-6">
                  {post.title || 'Untitled Post'}
                </h1>
                
                {post.excerpt && (
                  <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8 max-w-2xl mx-auto">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 overflow-hidden">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Author" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">{post.author.name}</div>
                    <div className="text-xs text-gray-500">{format(new Date(), 'MMM dd, yyyy')} • 5 min read</div>
                  </div>
                </div>
              </div>

              {/* HERO IMAGE */}
              {post.coverImage && (
                <div className="w-full mb-16 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-[#0a0a0a]">
                  <img src={post.coverImage} alt="Cover" className="w-full h-auto max-h-[600px] object-cover opacity-90 hover:opacity-100 transition-opacity" />
                </div>
              )}

              {/* 3-COLUMN LAYOUT (ALIGNED PROPERLY WITH 12-COL GRID) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 w-full">
                
                {/* LEFT SIDEBAR: DYNAMIC CONTENTS */}
                <div className="hidden lg:block lg:col-span-3">
                   <div className="sticky top-10">
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Contents</h4>
                      <ul className="space-y-4 text-[13px] font-medium text-gray-400">
                         {tableOfContents.length > 0 ? tableOfContents.map(item => (
                           <li 
                             key={item.id} 
                             className={`${item.level === 'h1' ? 'text-gray-300 font-bold' : 'pl-3 text-gray-500'} hover:text-[#23b5b5] cursor-pointer transition-colors leading-snug`}
                           >
                             {item.text}
                           </li>
                         )) : (
                           <li className="text-gray-600 italic">Add headings (H1, H2) to generate contents...</li>
                         )}
                      </ul>
                   </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="lg:col-span-6">
                  <div 
                    className="preview-dark-mode"
                    dangerouslySetInnerHTML={{ __html: post.content || '<p class="text-gray-600 italic">No content written yet...</p>' }} 
                  />

                  {/* TAGS FOOTER */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-16 pt-8 border-t border-gray-800">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-4 py-1.5 border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white cursor-pointer text-xs font-bold uppercase tracking-wider rounded-full transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT SIDEBAR: SHARE & POPULAR */}
                <div className="hidden lg:block lg:col-span-3">
                  <div className="sticky top-10">
                     <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Share this article</h4>
                     <div className="flex gap-3 mb-12">
                        <button className="w-10 h-10 rounded-full border border-gray-800 bg-gray-900/50 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all"><Twitter size={16} /></button>
                        <button className="w-10 h-10 rounded-full border border-gray-800 bg-gray-900/50 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all"><Linkedin size={16} /></button>
                        <button className="w-10 h-10 rounded-full border border-gray-800 bg-gray-900/50 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all"><LinkIcon size={16} /></button>
                     </div>

                     <h4 className="text-[10px] font-bold text-[#23b5b5] flex items-center gap-2 uppercase tracking-widest mb-6">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#23b5b5]"></span> Popular Posts
                     </h4>
                     
                     {/* Dummy Popular Posts to match UI */}
                     <div className="space-y-6">
                       <div className="group cursor-pointer">
                          <div className="w-full h-24 bg-gray-800 rounded-lg mb-3 overflow-hidden border border-gray-800 group-hover:border-gray-600 transition-colors">
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Thumb"/>
                          </div>
                          <div className="text-[10px] font-bold text-[#23b5b5] uppercase tracking-wider mb-1">Finance</div>
                          <div className="text-sm font-bold text-white leading-snug mb-1 group-hover:text-[#23b5b5] transition-colors">From Traditional Banking to Digital Disruption</div>
                          <div className="text-xs text-gray-500">Jun 29, 2024 • John Wright</div>
                       </div>
                       
                       <div className="group cursor-pointer">
                          <div className="w-full h-24 bg-gray-800 rounded-lg mb-3 overflow-hidden border border-gray-800 group-hover:border-gray-600 transition-colors">
                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Thumb"/>
                          </div>
                          <div className="text-[10px] font-bold text-[#23b5b5] uppercase tracking-wider mb-1">Security</div>
                          <div className="text-sm font-bold text-white leading-snug mb-1 group-hover:text-[#23b5b5] transition-colors">Securing LLMs in Enterprise Production</div>
                          <div className="text-xs text-gray-500">Jul 15, 2024 • Sarah Jenkins</div>
                       </div>
                     </div>
                  </div>
                </div>

              </div>
            </article>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        /* LIGHT MODE EDITOR STYLES */
        .custom-editor { color: #334155; line-height: 1.8; font-size: 1.125rem; }
        .custom-editor > * + * { margin-top: 1.5em; }
        .custom-editor h1, .custom-editor h2, .custom-editor h3, .custom-editor h4, .custom-editor h5 { color: #0f172a; font-family: ui-sans-serif, system-ui, sans-serif; margin-bottom: 0.5em; line-height: 1.3;}
        .custom-editor h1 { font-size: 2.5em; font-weight: 800; margin-top: 1.5em; letter-spacing: -0.02em; }
        .custom-editor h2 { font-size: 2em; font-weight: 700; margin-top: 1.5em; letter-spacing: -0.01em; }
        .custom-editor h3 { font-size: 1.5em; font-weight: 600; margin-top: 1.5em; }
        .custom-editor h4 { font-size: 1.25em; font-weight: 600; margin-top: 1.2em; }
        .custom-editor h5 { font-size: 1.1em; font-weight: 600; margin-top: 1.2em; text-transform: uppercase; letter-spacing: 0.05em; color: #475569;}
        .custom-editor p { margin-top: 0; margin-bottom: 1.25rem; }
        .custom-editor ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin: 1.25rem 0; }
        .custom-editor ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin: 1.25rem 0; }
        .custom-editor li { margin-bottom: 0.5rem; }
        .custom-editor blockquote { border-left: 4px solid ${BRAND_COLOR} !important; padding-left: 1.5rem !important; margin: 1.5rem 0; font-style: italic; color: #475569; background: #f4f7f6; padding: 1.25rem; border-radius: 0 0.5rem 0.5rem 0;}
        .custom-editor hr { border: none; border-top: 2px solid #e2e8f0; margin: 2rem 0;}
        .custom-editor code { background-color: #f1f5f9; color: ${BRAND_COLOR}; padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.9em; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;}
        .custom-editor mark { background-color: #fef08a; border-radius: 2px; padding: 0.1em 0.2em; }
        .editor-link { color: ${BRAND_COLOR}; text-decoration: underline; text-underline-offset: 4px; cursor: pointer; font-weight: 600;}
        .editor-link:hover { color: #188585; }
        .tiptap-image { border-radius: 12px; max-width: 100%; height: auto; margin: 2.5rem 0; display: block; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);}
        .custom-editor p.is-editor-empty:first-child::before { color: #cbd5e1; content: attr(data-placeholder); float: left; height: 0; pointer-events: none;}
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* PREVIEW DARK MODE STYLES */
        .preview-dark-mode { color: #9ca3af; line-height: 1.8; font-size: 1rem; }
        .preview-dark-mode > * + * { margin-top: 1.5em; }
        .preview-dark-mode h1, .preview-dark-mode h2, .preview-dark-mode h3, .preview-dark-mode h4, .preview-dark-mode h5 { color: #ffffff; font-family: ui-sans-serif, system-ui, sans-serif; margin-bottom: 0.5em; line-height: 1.3;}
        .preview-dark-mode h1 { font-size: 2em; font-weight: 800; margin-top: 1.5em; letter-spacing: -0.02em; }
        .preview-dark-mode h2 { font-size: 1.5em; font-weight: 700; margin-top: 1.5em; letter-spacing: -0.01em; }
        .preview-dark-mode h3 { font-size: 1.25em; font-weight: 600; margin-top: 1.5em; }
        .preview-dark-mode h4 { font-size: 1.1em; font-weight: 600; margin-top: 1.2em; }
        .preview-dark-mode h5 { font-size: 1em; font-weight: 600; margin-top: 1.2em; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af;}
        .preview-dark-mode p { margin-top: 0; margin-bottom: 1.25rem; }

        /* DROP CAP EFFECT FOR FIRST PARAGRAPH */
        .preview-dark-mode > p:first-of-type::first-letter {
          font-size: 4.5rem;
          font-weight: 900;
          color: ${BRAND_COLOR};
          float: left;
          line-height: 1;
          margin-right: 0.15em;
          margin-top: -0.1em;
        }

        .preview-dark-mode ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin: 1.25rem 0; color: #d1d5db; }
        .preview-dark-mode ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin: 1.25rem 0; color: #d1d5db; }
        .preview-dark-mode li { margin-bottom: 0.5rem; }
        
        /* CUSTOM DARK BLOCKQUOTE */
        .preview-dark-mode blockquote { 
          border-left: 4px solid ${BRAND_COLOR} !important; 
          padding: 1.5rem 2rem !important; 
          margin: 2.5rem 0; 
          font-size: 1.15rem;
          font-weight: 500;
          font-style: normal; 
          color: #ffffff; 
          background: rgba(35, 181, 181, 0.05); 
          border-radius: 0 0.5rem 0.5rem 0;
        }
        
        .preview-dark-mode hr { border: none; border-top: 1px solid #1f2937; margin: 3rem 0;}
        .preview-dark-mode code { background-color: #111827; color: ${BRAND_COLOR}; padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.9em; border: 1px solid #374151;}
        .preview-dark-mode mark { background-color: rgba(254, 240, 138, 0.2); color: #fef08a; border-radius: 2px; padding: 0.1em 0.2em; }
        .preview-dark-mode .editor-link { color: ${BRAND_COLOR}; text-decoration: underline; text-underline-offset: 4px; cursor: pointer; font-weight: 600;}
        .preview-dark-mode .editor-link:hover { color: #4fd1d1; }
        .preview-dark-mode .tiptap-image { border-radius: 12px; max-width: 100%; height: auto; margin: 2.5rem 0; display: block; border: 1px solid #1f2937;}
      `}} />
    </div>
  );
}