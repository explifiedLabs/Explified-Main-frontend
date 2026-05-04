import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit , Color } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import { format } from 'date-fns';
import {
  X, UploadCloud, Bold, Italic, Underline as UnderlineIcon,
  Link as LinkIcon, List, ListOrdered, Quote, AlignLeft, AlignCenter,
  AlignRight, Eye, ChevronDown, Strikethrough, Hash, FolderTree, 
  ImagePlus, Check, ArrowLeft, Settings, Type, Unlink, Images,
  Undo, Redo, Code as CodeIcon, Minus, Highlighter, Palette,
  Search, Monitor, Wand2, Map as MapIcon, Share2, Video as VideoIcon,
  Image as ImageIcon, Crop, ZoomIn, Settings2
} from 'lucide-react';

const CURRENT_USER = { name: 'Joshua Nash', role: 'Author' };
const BRAND_COLOR = '#23b5b5';

// Expanded Hardcoded High-Quality Images to fill the grid nicely
const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80",
  "https://images.unsplash.com/photo-1444464666168-49b626426095?w=800&q=80",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80",
  "https://images.unsplash.com/photo-1506744626753-143b665609d5?w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80"
];

const MODAL_KEYWORDS = ['Mountain', 'Nature', 'Sky', 'Landscape'];

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
  const [post, setPost] = useState({
    title: 'The Power of Compound Interest: Watch Your Savings Grow',
    slug: 'power-of-compound-interest',
    excerpt: 'Compound interest is often referred to as the "eighth wonder of the world" due to its remarkable ability to accelerate the growth of your savings over time.',
    content: '',
    categories: ['Invest', 'Blockchain', 'News'],
    tags: ['Finance', 'Growth'],
    status: 'draft',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
    author: CURRENT_USER,
  });

  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Gallery Modal State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeModalSidebar, setActiveModalSidebar] = useState('Stock Photos');
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  
  // Image Customizer / Edit State
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [cropAspect, setCropAspect] = useState('auto');
  const [cropZoom, setCropZoom] = useState(100);

  const imageUploadRef = useRef(null);
  const titleTextareaRef = useRef(null);

  // Reset editing state when gallery opens/closes
  useEffect(() => {
    if (!isGalleryOpen) {
      setIsEditingImage(false);
      setCropAspect('auto');
      setCropZoom(100);
    }
  }, [isGalleryOpen]);

  // --- TIPTAP EDITOR INITIALIZATION ---
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
    content: `
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.</p>
      <h2>What is Compound Interest?</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.</p>
      <h2>Why it matters?</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    `,
    onUpdate: ({ editor }) => {
      setPost(prev => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: { class: 'custom-editor focus:outline-none min-h-[600px] w-full max-w-none' },
    },
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (post.title && !post.slug.includes('-modified')) {
      const generatedSlug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setPost(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [post.title]);

  // Auto-resize title textarea
  const handleTitleChange = (e) => {
    setPost({ ...post, title: e.target.value });
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = 'auto';
      titleTextareaRef.current.style.height = titleTextareaRef.current.scrollHeight + 'px';
    }
  };

  // --- HANDLERS ---
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

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPost(prev => ({ ...prev, coverImage: URL.createObjectURL(file) }));
  };

  const handleEditorImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && editor) {
      const imageUrl = URL.createObjectURL(file);
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
  };

  const insertSelectedGalleryImage = () => {
    if (selectedGalleryImage && editor) {
      // In a real app, you'd apply the cropAspect and cropZoom via Canvas here before inserting.
      // For this UI mockup, we insert the original URL simulating the process completion.
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

  // --- EXTREME BLACK STICKY TOOLBAR ---
  const EditorToolbar = () => {
    if (!editor) return null;

    const ToolbarBtn = ({ action, isActive, icon, title }) => (
      <button
        onClick={(e) => { e.preventDefault(); action(); }}
        title={title}
        className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
          isActive
            ? `bg-[${BRAND_COLOR}] text-white`
            : `text-gray-400 hover:bg-[#252525] hover:text-[${BRAND_COLOR}]`
        }`}
      >
        {icon}
      </button>
    );

    return (
      // FIX: Added bg-white and pt-4 px-4/8 padding block to create a gap between Top Nav and Toolbar
      // This stops scrolling text from showing through the margin space.
      <div className="sticky top-[80px] z-50 bg-white pt-4 pb-3 px-4 sm:px-6 lg:px-8 rounded-t-xl border-b border-gray-100">
        <div className="bg-[#0a0a0a] border border-[#222] px-4 py-2.5 flex flex-wrap items-center gap-1.5 shadow-2xl w-full rounded-xl overflow-x-auto no-scrollbar">
          
          {/* Undo / Redo */}
          <ToolbarBtn action={() => editor.chain().focus().undo().run()} isActive={false} icon={<Undo size={16} />} title="Undo" />
          <ToolbarBtn action={() => editor.chain().focus().redo().run()} isActive={false} icon={<Redo size={16} />} title="Redo" />
          <div className="w-px h-5 bg-gray-700 mx-1"></div>

          {/* Headings */}
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

          {/* Font Family */}
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

          {/* Font Size */}
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

          {/* Text Color Picker */}
          <div className="relative flex items-center group" title="Text Color">
            <Palette size={16} className="text-gray-400 absolute pointer-events-none left-1.5 group-hover:text-white transition-colors" />
            <input
              type="color"
              onInput={event => editor.chain().focus().setColor(event.target.value).run()}
              value={editor.getAttributes('textStyle').color || '#000000'}
              className="w-8 h-8 p-0 border-0 rounded-md cursor-pointer opacity-0"
            />
          </div>

          {/* Formatting Tools */}
          <ToolbarBtn action={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={<Bold size={16} />} title="Bold" />
          <ToolbarBtn action={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={<Italic size={16} />} title="Italic" />
          <ToolbarBtn action={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={<UnderlineIcon size={16} />} title="Underline" />
          <ToolbarBtn action={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} icon={<Highlighter size={16} />} title="Highlight" />
          <ToolbarBtn action={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} icon={<CodeIcon size={16} />} title="Inline Code" />
          
          {/* Alignment & Lists */}
          <div className="w-px h-5 bg-gray-700 mx-1"></div>
          <ToolbarBtn action={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={<AlignLeft size={16} />} title="Left" />
          <ToolbarBtn action={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={<AlignCenter size={16} />} title="Center" />
          <div className="w-px h-5 bg-gray-700 mx-1"></div>
          <ToolbarBtn action={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={<List size={16} />} title="Bullets" />
          <ToolbarBtn action={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={<Quote size={16} />} title="Quote" />
          <ToolbarBtn action={() => editor.chain().focus().setHorizontalRule().run()} isActive={false} icon={<Minus size={16} />} title="Separator" />

          <div className="flex-1"></div>

          {/* Fast Add Local Media */}
          <button
            onClick={(e) => { e.preventDefault(); imageUploadRef.current?.click(); }}
            title="Upload Local Image"
            className={`p-1.5 px-3 rounded-md text-gray-400 hover:bg-[#252525] hover:text-[${BRAND_COLOR}] transition-all flex items-center gap-2 text-sm font-medium border border-transparent`}
          >
            <ImagePlus size={16} className={`text-[${BRAND_COLOR}]`} /> <span className="hidden sm:inline">Add Media</span>
          </button>
          <input type="file" ref={imageUploadRef} onChange={handleEditorImageUpload} accept="image/*" className="hidden" />

          {/* Advanced Gallery Modal Button */}
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
          <button className={`px-6 py-2 text-sm font-semibold text-white bg-[${BRAND_COLOR}] hover:bg-[#1d9797] rounded-md shadow-sm shadow-[${BRAND_COLOR}]/20 transition-all flex items-center gap-2`}>
            <Check size={16} /> Publish Post
          </button>
        </motion.div>
      </header>

      {/* 🧱 MAIN EDITOR LAYOUT */}
      <main className={`max-w-[1600px] mx-auto p-4 md:px-8 pb-20 flex flex-col lg:flex-row gap-8 items-start relative ${isPreviewMode ? 'hidden' : 'flex'}`}>
        
        {/* ✍️ LEFT COLUMN: SPLIT TITLE & EDITOR */}
        <div className="w-full lg:flex-1 flex flex-col gap-6 relative min-w-0">
          
          {/* --- 1. SEPARATED TITLE SECTION --- */}
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
          </motion.div>

          {/* --- 2. SEPARATED EDITOR SECTION --- */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm relative flex flex-col w-full"
          >
            {/* The Toolbar handles its own gap and padding now */}
            <EditorToolbar />
            
            <div className="p-6 lg:p-10 lg:pt-6 flex flex-col w-full">
              <div className="cursor-text w-full flex-1">
                <EditorContent editor={editor} className="w-full max-w-none" />
              </div>
            </div>
          </motion.div>
          
        </div>

        {/* ⚙️ RIGHT COLUMN: SETTINGS SIDEBAR */}
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
              <label className={`flex flex-col items-center justify-center w-full aspect-video border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-[${BRAND_COLOR}]/5 hover:border-[${BRAND_COLOR}]/50 transition-all group`}>
                <div className={`p-4 bg-white rounded-full shadow-sm mb-3 text-slate-400 group-hover:text-[${BRAND_COLOR}] transition-colors group-hover:scale-110 transform duration-300`}>
                  <UploadCloud size={24} />
                </div>
                <p className={`text-sm font-bold text-slate-600 group-hover:text-[${BRAND_COLOR}]`}>Click to upload image</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleCoverImageUpload} />
              </label>
            )}
          </div>
        </motion.div>
      </main>

      {/* 🖼️ NEW SLEEK GALLERY MODAL UI & EDIT WORKFLOW */}
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
              
              {/* --- MODAL HEADER --- */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${isEditingImage ? 'bg-indigo-100 text-indigo-600' : `bg-[${BRAND_COLOR}]/10 text-[${BRAND_COLOR}]`} flex items-center justify-center shadow-inner transition-colors`}>
                    {isEditingImage ? <Crop size={18} strokeWidth={2.5}/> : <Images size={18} strokeWidth={2.5} />}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 leading-tight">
                      {isEditingImage ? 'Customize Image' : 'Add background'}
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

              {/* --- MODAL BODY SWITCHER (EDITING VS GALLERY) --- */}
              {isEditingImage ? (
                /* --- CROP / EDIT STUDIO VIEW --- */
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row h-[600px] bg-slate-100/50">
                   
                   {/* Left: Preview Canvas */}
                   <div className="flex-1 p-8 flex items-center justify-center border-r border-gray-200 relative overflow-hidden">
                      <div className="absolute top-4 left-4 flex gap-2">
                         <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 shadow-sm border border-slate-200">
                           {cropZoom}% Zoom
                         </span>
                         <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 shadow-sm border border-slate-200">
                           {cropAspect === 'auto' ? 'Original Ratio' : `${cropAspect} Ratio`}
                         </span>
                      </div>

                      {/* Mock Cropping Container */}
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
                         {/* Rule of thirds grid overlay */}
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

                   {/* Right: Controls Sidebar */}
                   <div className="w-[320px] bg-white p-6 flex flex-col gap-8 overflow-y-auto shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
                      
                      <div className="flex items-center gap-2 text-slate-800 font-bold uppercase tracking-wider text-sm border-b border-slate-100 pb-3">
                        <Settings2 size={18} className="text-slate-400" /> Image Adjustments
                      </div>

                      {/* Aspect Ratio Controls */}
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

                      {/* Zoom Slider */}
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
                /* --- DEFAULT GALLERY VIEW --- */
                <div className="flex flex-row h-[600px] bg-white">
                  
                  {/* --- SIDEBAR --- */}
                  <div className="w-[240px] border-r border-gray-100 p-4 flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
                    {[
                      { id: 'Images', icon: ImageIcon },
                      { id: 'Stock Photos', icon: Images },
                      { id: 'Video', icon: VideoIcon },
                      { id: 'Solid color', icon: Palette },
                      { id: 'Map', icon: MapIcon },
                      { id: 'Social Media', icon: Share2 },
                      { id: 'WWW Screenshot', icon: Monitor },
                      { id: 'Generate Image', icon: Wand2 }
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
                        {/* Active Indicator Line */}
                        {activeModalSidebar === item.id && (
                          <motion.div 
                            layoutId="activeSidebarIndicator" 
                            className={`absolute left-0 top-0 bottom-0 w-1 bg-[${BRAND_COLOR}] rounded-r-full`} 
                          />
                        )}
                        <item.icon size={18} className={activeModalSidebar === item.id ? `text-[${BRAND_COLOR}]` : 'text-gray-400'} strokeWidth={activeModalSidebar === item.id ? 2.5 : 2} />
                        {item.id}
                      </button>
                    ))}
                  </div>

                  {/* --- MAIN CONTENT AREA --- */}
                  <div className="flex-1 flex flex-col bg-white">
                    
                    {/* Top Search & Tags Bar */}
                    <div className="p-5 pb-3 flex items-center justify-between gap-4 border-b border-gray-50">
                      <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Search backgrounds..." 
                          className={`w-full pl-10 pr-4 py-2 bg-gray-100/80 border-transparent rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-[${BRAND_COLOR}] focus:ring-2 focus:ring-[${BRAND_COLOR}]/20 transition-all`}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 mr-1 font-semibold uppercase tracking-wider">Keywords:</span>
                        {MODAL_KEYWORDS.map(kw => (
                          <button key={kw} className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-[13px] font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors">
                            {kw}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image Grid Area */}
                    <div className="flex-1 overflow-y-auto p-6 pt-4">
                      <motion.div 
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: { opacity: 0 },
                          show: { opacity: 1, transition: { staggerChildren: 0.05 } }
                        }}
                      >
                        {GALLERY_IMAGES.map((url, i) => (
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
                            <img src={url} alt={`Stock ${i}`} className="w-full h-full object-cover" />
                            
                            {/* Selection Indicator */}
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

                            {/* Hover Overlay */}
                            <div className={`absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity ${selectedGalleryImage === url ? 'hidden' : ''}`} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>

                  </div>
                </div>
              )}

              {/* --- MODAL FOOTER --- */}
              <div className="border-t border-gray-100 p-4 px-6 flex justify-between items-center bg-gray-50/50">
                {isEditingImage ? (
                  <button 
                    onClick={() => setIsEditingImage(false)}
                    className="px-5 py-2 flex items-center gap-2 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                  >
                    <ArrowLeft size={16}/> Back to Gallery
                  </button>
                ) : (
                  <div>
                     {/* Empty div for spacing if we don't have left actions */}
                  </div>
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

      {/* 👁️ FRAMER MOTION LIVE PREVIEW */}
      <AnimatePresence>
        {isPreviewMode && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-white overflow-y-auto w-full h-full"
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center z-50 shadow-sm">
               <button onClick={() => setIsPreviewMode(false)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold px-4 py-2 rounded-md hover:bg-slate-100 transition-colors">
                 <ArrowLeft size={18} /> Back to Editor
               </button>
               <span className={`text-sm font-bold text-[${BRAND_COLOR}] uppercase tracking-widest flex items-center gap-2`}>
                 <Eye size={16}/> Live View
               </span>
            </div>

            <article className="max-w-[850px] mx-auto px-6 py-16 pb-32">
               <div className="text-sm font-semibold text-gray-500 mb-5 flex items-center gap-2">
                 {format(new Date(), 'dd MMM yyyy')} <span className="text-gray-300">|</span> by {post.author.name}
               </div>
               
               <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-8">
                 {post.title || 'Untitled Post'}
               </h1>

               {post.excerpt && (
                 <p className="text-xl text-gray-600 font-medium leading-relaxed mb-10 border-l-4 border-gray-200 pl-6">
                   {post.excerpt}
                 </p>
               )}

               {post.coverImage && (
                 <div className="w-full mb-10 rounded-2xl overflow-hidden shadow-md">
                   <img src={post.coverImage} alt="Cover" className="w-full h-auto object-cover max-h-[600px]" />
                 </div>
               )}
               
               {post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-12">
                    {post.categories.map(cat => (
                      <span key={cat} className="px-4 py-1.5 border border-gray-200 bg-gray-50 text-gray-600 text-sm font-bold rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
               )}
               
               <div 
                 className="custom-editor preview-mode"
                 dangerouslySetInnerHTML={{ __html: post.content || '<p class="text-gray-400 italic">No content written yet...</p>' }} 
               />
            </article>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor & Content Custom Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-editor { 
          color: #334155; 
          line-height: 1.8; 
          font-size: 1.125rem; 
        }
        
        .custom-editor > * + * { margin-top: 1.5em; }
        
        .custom-editor h1, .custom-editor h2, .custom-editor h3, .custom-editor h4, .custom-editor h5 { 
          color: #0f172a; 
          font-family: ui-sans-serif, system-ui, sans-serif; 
          margin-bottom: 0.5em;
          line-height: 1.3;
        }
        
        .custom-editor h1 { font-size: 2.5em; font-weight: 800; margin-top: 1.5em; letter-spacing: -0.02em; }
        .custom-editor h2 { font-size: 2em; font-weight: 700; margin-top: 1.5em; letter-spacing: -0.01em; }
        .custom-editor h3 { font-size: 1.5em; font-weight: 600; margin-top: 1.5em; }
        .custom-editor h4 { font-size: 1.25em; font-weight: 600; margin-top: 1.2em; }
        .custom-editor h5 { font-size: 1.1em; font-weight: 600; margin-top: 1.2em; text-transform: uppercase; letter-spacing: 0.05em; color: #475569;}
        
        .custom-editor p { margin-top: 0; margin-bottom: 1.25rem; }
        
        .custom-editor ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin: 1.25rem 0; }
        .custom-editor ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin: 1.25rem 0; }
        .custom-editor li { margin-bottom: 0.5rem; }
        
        .custom-editor blockquote { 
          border-left: 4px solid ${BRAND_COLOR} !important; 
          padding-left: 1.5rem !important; 
          margin: 1.5rem 0; 
          font-style: italic; 
          color: #475569; 
          background: #f4f7f6;
          padding: 1.25rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }

        .custom-editor hr {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 2rem 0;
        }

        .custom-editor code {
          background-color: #f1f5f9;
          color: ${BRAND_COLOR};
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
        
        .custom-editor mark {
          background-color: #fef08a; /* Yellow highlight by default */
          border-radius: 2px;
          padding: 0.1em 0.2em;
        }

        .editor-link {
          color: ${BRAND_COLOR};
          text-decoration: underline;
          text-underline-offset: 4px;
          cursor: pointer;
          font-weight: 600;
        }
        .editor-link:hover { color: #188585; }

        .tiptap-image { 
          border-radius: 12px; 
          max-width: 100%; 
          height: auto; 
          margin: 2.5rem 0; 
          display: block; 
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .custom-editor p.is-editor-empty:first-child::before {
          color: #cbd5e1;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        /* Hide Scrollbar for Toolbar */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}