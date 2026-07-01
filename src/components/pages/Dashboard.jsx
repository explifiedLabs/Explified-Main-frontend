import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import {
  Store, Plug, Key, Settings, CreditCard,
  Copy, Eye, Play, ChevronDown, CheckCircle2, ChevronLeft, Trash2, Code,
  LogOut, Activity, AlertCircle, Users, Star, Box, Loader2,
  Search, X, ChevronRight, Plus, Camera, Check, Ban, Clock,
  Calendar, TrendingUp, Package, RefreshCw, ExternalLink, Zap
} from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/authSlice';
import axiosInstance from '../../lib/axios';
import { toast } from 'react-toastify';
import PaymentModal from './PaymentModel';
import logo from "../../../logo.png"
// --- CONSTANTS ---
const DEFAULT_DESC = "Streamline your operations and unlock new capabilities with this powerful integration. Designed to seamlessly connect your workspace, automate repetitive tasks, and sync data in real-time, saving you countless hours of manual work.";
const MARKETPLACE = "explified";

// --- DYNAMIC ICON ---
const DynamicIcon = ({ name, size = 24, className = "" }) => {
  const IconCmp = LucideIcons[name] || LucideIcons.Box;
  return <IconCmp size={size} className={className} />;
};

const getMarketplaceIcon = (name) => {
  const map = {
    'Figma': 'Figma', 'Shopify': 'ShoppingBag', 'Chrome': 'Chrome',
    'Atlassian': 'Trello', 'Penpot': 'PenTool', 'Strapi': 'Database',
    'Framer': 'Framer', 'ClickUp': 'Layers', 'Microsoft Edge': 'Compass',
    'Opera': 'Globe', 'Bubble': 'MessageCircle', 'Odoo': 'Briefcase'
  };
  return map[name] || 'Layers';
};

// --- ANIMATION VARIANTS ---
const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};
const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// --- STATUS BADGE ---
const StatusBadge = ({ status }) => {
  const config = {
    active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400', label: 'Active' },
    cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400', label: 'Cancelled' },
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', dot: 'bg-yellow-400', label: 'Pending' },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

// --- SUBSCRIPTION SHIMMER SKELETON ---
const SubscriptionShimmer = () => (
  <div className="bg-[#18191E] border border-zinc-800/40 rounded-xl p-5 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-4 w-36 bg-zinc-800 rounded" />
            <div className="h-3 w-56 bg-zinc-800/60 rounded" />
          </div>
          <div className="h-5 w-16 bg-zinc-800 rounded-full" />
        </div>
        <div className="flex gap-3 mt-3">
          <div className="h-3 w-20 bg-zinc-800/60 rounded" />
          <div className="h-3 w-16 bg-zinc-800/60 rounded" />
          <div className="h-3 w-14 bg-zinc-800/60 rounded" />
        </div>
        <div className="flex gap-3 mt-1">
          <div className="h-3 w-28 bg-zinc-800/40 rounded" />
          <div className="h-3 w-24 bg-zinc-800/40 rounded" />
        </div>
      </div>
    </div>
    <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-800/40">
      <div className="h-7 w-36 bg-zinc-800/60 rounded-lg" />
      <div className="h-7 w-24 bg-zinc-800/40 rounded-lg" />
    </div>
  </div>
);

// --- STATS SHIMMER ---
const StatsShimmer = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-[#18191E] border border-zinc-800 rounded-xl p-5 flex items-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex-shrink-0" />
        <div className="space-y-2">
          <div className="h-3 w-16 bg-zinc-800 rounded" />
          <div className="h-6 w-8 bg-zinc-800/60 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// --- LIGHTBOX ---
const Lightbox = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => { setCurrent(startIndex); }, [startIndex]);

  const prev = useCallback((e) => {
    e.stopPropagation();
    setCurrent(c => (c - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback((e) => {
    e.stopPropagation();
    setCurrent(c => (c + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') setCurrent(c => (c - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setCurrent(c => (c + 1) % images.length);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <button className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" onClick={onClose}>
        <X size={20} />
      </button>
      {images.length > 1 && (
        <button className="absolute left-5 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200 shadow-xl transition-colors" onClick={prev}>
          <ChevronLeft size={22} />
        </button>
      )}
      <div className="relative w-full h-full max-w-[1100px] max-h-[88vh] mx-auto flex items-center justify-center px-20" onClick={(e) => e.stopPropagation()}>
        {images.map((src, i) => (
          <img key={src} src={src} alt={`Slide ${i + 1}`} style={{
            position: i === 0 ? 'relative' : 'absolute', opacity: i === current ? 1 : 0,
            transition: 'opacity 0.18s ease', pointerEvents: i === current ? 'auto' : 'none',
            maxWidth: '100%', maxHeight: '88vh', width: 'auto', height: 'auto',
            objectFit: 'contain', borderRadius: '14px', boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
            userSelect: 'none', display: 'block', inset: i === 0 ? undefined : 0, margin: 'auto',
          }} />
        ))}
      </div>
      {images.length > 1 && (
        <button className="absolute right-5 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200 shadow-xl transition-colors" onClick={next}>
          <ChevronRight size={22} />
        </button>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }} style={{
              width: i === current ? 24 : 8, height: 8, borderRadius: 4,
              background: i === current ? '#23b5b5' : 'rgba(255,255,255,0.35)',
              transition: 'all 0.2s ease', border: 'none', cursor: 'pointer', padding: 0,
            }} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
export default function FullDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const mainScrollRef = useRef(null);

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('integrations');
  const [selectedAppId, setSelectedAppId] = useState(null);

  const [storeCategories, setStoreCategories] = useState([]);
  const [storeApps, setStoreApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [subscriptionLogs, setSubscriptionLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const [visibleKeys, setVisibleKeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [appDetailTab, setAppDetailTab] = useState('information');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [paymentApp, setPaymentApp] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // FIX: logFilter lifted to parent so it survives re-renders of IntegrationsView
  const [logFilter, setLogFilter] = useState('all');

  // --- SCROLL TO TOP ---
  useEffect(() => {
    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
  }, [selectedAppId, activeTab, appDetailTab]);

  // --- FETCH STORE PRODUCTS ---
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://cmsapi-pf6diz22ka-uc.a.run.app/api/menus/products/info", {
          headers: { 'x-site-id': '69c67e3f225219428111ab74' }
        });
        const json = await response.json();

        let allProducts = [];
        let categories = [];

        if (json?.data?.header?.products) {
          const prodsObj = json.data.header.products;
          Object.keys(prodsObj).forEach(key => {
            if (['title', 'url', 'openInNewTab', 'location', 'id', '_id', 'order'].includes(key)) return;
            const categoryNode = prodsObj[key];
            if (categoryNode && typeof categoryNode === 'object') {
              const catName = categoryNode.title || key;
              const catIconUrl = categoryNode.imageUrl || categoryNode.iconUrl || categoryNode.icon || null;
              const items = Array.isArray(categoryNode.items) ? categoryNode.items : [];
              const mappedItems = items.map((item, i) => {
                const appIconUrl = item.iconUrl || item.icon || item.imageUrl || null;
                return {
                  id: item._id || item.id || `item_${key}_${i}`,
                  _id: item._id || null,
                  name: item.title || item.label || 'Unnamed Product',
                  category: catName,
                  categoryIcon: catIconUrl,
                  desc: (item.description && item.description.trim() !== '') ? item.description : DEFAULT_DESC,
                  path: item.url || `explified/${(item.title || item.label || 'app').toLowerCase().replace(/\s+/g, '-')}`,
                  tag: item.tag || '',
                  iconType: item.type || item.iconType || (appIconUrl ? 'upload' : 'lucide'),
                  iconName: item.iconName || 'Box',
                  iconUrl: appIconUrl,
                  features: Array.isArray(item.features) && item.features.length > 0 ? item.features : ['One-click deployment', 'High performance data sync'],
                  featureImages: Array.isArray(item.featureImages) ? item.featureImages : [],
                  installs: Math.floor(Math.random() * 500) + 'K',
                  rating: (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1),
                  bookmarks: (Math.random() * 10).toFixed(1) + 'K',
                  reviews: Math.floor(Math.random() * 2000),
                  pricing: i % 2 === 0 ? 'free' : `from $19.99 / mo`,
                  subscribed: false,
                  apiKeys: []
                };
              });
              if (mappedItems.length > 0) {
                categories.push({
                  id: key, name: catName,
                  iconType: catIconUrl ? 'upload' : (categoryNode.iconType || 'lucide'),
                  iconUrl: catIconUrl,
                  iconName: categoryNode.iconName || getMarketplaceIcon(catName),
                  items: mappedItems
                });
                allProducts = [...allProducts, ...mappedItems];
              }
            }
          });
        }
        setStoreCategories(categories);
        setStoreApps(allProducts);
      } catch (error) {
        console.error("Failed to fetch store products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- FETCH USER SUBSCRIPTIONS ---
  useEffect(() => {
    if (!user) return;
    fetchMySubscriptions();
    fetchSubscriptionLogs();
  }, [user]);

  const fetchMySubscriptions = async () => {
    try {
      const { data } = await axiosInstance.get('/subscriptions/my-subscriptions');
      if (data.success) {
        setUserSubscriptions(data.subscriptions);
      }
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
    }
  };

  const fetchSubscriptionLogs = async () => {
    setLogsLoading(true);
    try {
      const { data } = await axiosInstance.get('/subscriptions/my-subscriptions');
      if (data.success) {
        const logs = data.subscriptions.map(s => ({
          _id: s._id,
          appName: s.app?.name || s.domain,
          appSlug: s.app?.slug || '',
          appLogo: s.app?.logo || null,
          domain: s.domain,
          marketplace: s.marketplace,
          planType: s.planType,
          amount: s.amount,
          paymentStatus: s.paymentStatus,
          subscriptionStatus: s.subscriptionStatus,
          currentPeriodStart: s.currentPeriodStart,
          currentPeriodEnd: s.currentPeriodEnd || null,
          cancelledAt: s.cancelledAt || null,
          createdAt: s.createdAt,
          app: s.app,
        }));
        setSubscriptionLogs(logs);
        setUserSubscriptions(data.subscriptions);
      }
    } catch (err) {
      console.error('Failed to fetch subscription logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  // --- SYNC BACKEND SUBSCRIPTIONS INTO storeApps ---
  useEffect(() => {
    if (userSubscriptions.length === 0) return;
    if (storeApps.length === 0) return;

    const subscribedDomains = new Set(
      userSubscriptions
        .filter(s => s.subscriptionStatus === 'active')
        .map(s => s.domain.toLowerCase())
    );

    setStoreApps(prev => prev.map(app => {
      const isSubscribed = subscribedDomains.has(app.path.toLowerCase());
      if (isSubscribed && !app.subscribed) {
        return {
          ...app,
          subscribed: true,
          apiKeys: app.apiKeys.length > 0 ? app.apiKeys : [{
            id: `key_existing_${app.id}`,
            name: 'Production Key',
            token: `sk_live_${app.id.slice(-6)}_${Math.random().toString(36).substr(2, 12)}`
          }]
        };
      }
      return app;
    }));
  }, [userSubscriptions, storeApps.length]);

  // --- DERIVED ---
  const selectedApp = storeApps.find(a => a.id === selectedAppId);
  const subscribedApps = useMemo(() => storeApps.filter(a => a.subscribed), [storeApps]);
  const activeLogs = useMemo(() => subscriptionLogs.filter(l => l.subscriptionStatus === 'active'), [subscriptionLogs]);
  const cancelledLogs = useMemo(() => subscriptionLogs.filter(l => l.subscriptionStatus === 'cancelled'), [subscriptionLogs]);

  // --- ACTIONS ---
  const handleNavClick = (id) => {
    setActiveTab(id);
    setSelectedAppId(null);
  };

  const openAppDetails = (id) => {
    setSelectedAppId(id);
    setAppDetailTab('information');
  };

  const handleLogout = () => { dispatch(logoutUser()); };

  const toggleKeyVisibility = (keyId) => setVisibleKeys(prev =>
    prev.includes(keyId) ? prev.filter(id => id !== keyId) : [...prev, keyId]
  );

  const initiateSubscription = (appId) => {
    const app = storeApps.find(a => a.id === appId);
    if (!app) return;
    if (app.subscribed) {
      handleCancelSubscription(appId);
    } else {
      setPaymentApp(app);
    }
  };

  const handleCancelSubscription = async (appId, logId = null) => {
    let subId = logId;

    if (!subId) {
      const app = storeApps.find(a => a.id === appId);
      if (!app) return;
      const subDoc = userSubscriptions.find(
        s => s.domain === app.path.toLowerCase() && s.subscriptionStatus === 'active'
      );
      if (!subDoc) {
        toast.error('No active subscription found');
        return;
      }
      subId = subDoc._id;
    }

    setCancellingId(subId);
    try {
      await axiosInstance.put(`/subscriptions/cancel/${subId}`);

      const appName = appId
        ? storeApps.find(a => a.id === appId)?.name
        : subscriptionLogs.find(l => l._id === subId)?.appName;

      toast.success(`${appName || 'Subscription'} cancelled successfully`);

      setUserSubscriptions(prev =>
        prev.map(s => s._id === subId ? { ...s, subscriptionStatus: 'cancelled' } : s)
      );

      setSubscriptionLogs(prev =>
        prev.map(l => l._id === subId ? { ...l, subscriptionStatus: 'cancelled', cancelledAt: new Date().toISOString() } : l)
      );

      if (appId) {
        setStoreApps(prev => prev.map(a =>
          a.id === appId ? { ...a, subscribed: false, apiKeys: [] } : a
        ));
      }
    } catch (err) {
      toast.error('Failed to cancel subscription');
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };

  const handlePaymentSuccess = async ({ appId, appName, domain, marketplace, planType, amount, paymentStatus }) => {
    try {
      const { data } = await axiosInstance.post('/subscriptions/subscribe', {
        appId,
        appName,
        domain,
        marketplace,
        planType,
        amount,
        paymentStatus,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      });

      if (data.success) {
        toast.success('Subscription activated!');

        setUserSubscriptions(prev => [...prev, data.subscription]);

        setSubscriptionLogs(prev => [{
          _id: data.subscription._id,
          appName: data.subscription.app?.name || appName,
          appSlug: data.subscription.app?.slug || '',
          appLogo: data.subscription.app?.logo || null,
          domain: data.subscription.domain,
          marketplace: data.subscription.marketplace,
          planType: data.subscription.planType,
          amount: data.subscription.amount,
          paymentStatus: data.subscription.paymentStatus,
          subscriptionStatus: data.subscription.subscriptionStatus,
          currentPeriodStart: data.subscription.currentPeriodStart,
          currentPeriodEnd: data.subscription.currentPeriodEnd,
          cancelledAt: null,
          createdAt: data.subscription.createdAt,
          app: data.subscription.app,
        }, ...prev]);

        setStoreApps(prev => prev.map(app => {
          if (app.id === appId) {
            return {
              ...app,
              subscribed: true,
              apiKeys: [{
                id: `key_${Date.now()}`,
                name: 'Production Key',
                token: `sk_live_${app.id.slice(-6)}_${Math.random().toString(36).substr(2, 12)}`
              }]
            };
          }
          return app;
        }));

        setAppDetailTab('api');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Subscription failed';
      toast.error(msg);
      console.error('Subscribe error:', err);
    } finally {
      setPaymentApp(null);
    }
  };

  const generateNewKey = (appId) => {
    setStoreApps(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          apiKeys: [...app.apiKeys, {
            id: `key_${Date.now()}`,
            name: `Key ${app.apiKeys.length + 1}`,
            token: `sk_live_${app.id.slice(-6)}_${Math.random().toString(36).substr(2, 12)}`
          }]
        };
      }
      return app;
    }));
  };

  const deleteKey = (appId, keyId) => {
    setStoreApps(prev => prev.map(app => {
      if (app.id === appId) {
        return { ...app, apiKeys: app.apiKeys.filter(k => k.id !== keyId) };
      }
      return app;
    }));
  };

  const openLightbox = (index) => { setPhotoIndex(index); setLightboxOpen(true); };
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const fmtDateShort = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';

  // --- SUB-COMPONENTS ---

  const SidebarLink = ({ id, name, icon: Icon, badge }) => {
    const isActive = activeTab === id && !selectedAppId;
    return (
      <button onClick={() => handleNavClick(id)} className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group">
        {isActive && (
          <motion.div layoutId="active-sidebar" className="absolute inset-0 bg-zinc-800 rounded-lg" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
        )}
        <Icon size={16} className={`relative z-10 transition-colors ${isActive ? 'text-[#23b5b5]' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
        <span className={`relative z-10 flex-1 text-left transition-colors ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{name}</span>
        {badge > 0 && (
          <span className="relative z-10 min-w-[20px] h-5 px-1.5 bg-[#23b5b5] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
            {badge}
          </span>
        )}
      </button>
    );
  };

  const AppIcon = ({ app, size = 'md' }) => {
    const dim = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 28 : 20;
    return (
      <div className={`${dim} rounded-lg flex-shrink-0 flex items-center justify-center bg-zinc-900 border border-zinc-700/50 overflow-hidden text-[#23b5b5]`}>
        {app.iconUrl ? (
          <img src={app.iconUrl} alt={app.name} className="w-full h-full object-contain p-1.5" />
        ) : (
          <DynamicIcon name={app.iconName || 'Box'} size={iconSize} />
        )}
      </div>
    );
  };

  const ProductCard = ({ app }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4, boxShadow: "0 10px 40px -10px rgba(35,181,181,0.15)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => openAppDetails(app.id)}
      className="bg-[#18191E] border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-500 transition-colors cursor-pointer flex flex-col h-[220px]"
    >
      <div className="flex gap-4 items-start mb-3">
        <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center bg-zinc-900 border border-zinc-700/50 overflow-hidden text-[#23b5b5]">
          {app.iconUrl ? (
            <img src={app.iconUrl} alt={app.name} className="w-full h-full object-contain p-1.5" />
          ) : (
            <DynamicIcon name={app.iconName} size={24} />
          )}
        </div>
        <div className="overflow-hidden">
          <h3 className="text-[15px] font-bold text-zinc-100 truncate">{app.name}</h3>
          {app.tag && <p className="text-[11px] font-bold uppercase tracking-wider text-[#23b5b5] mt-0.5">{app.tag}</p>}
          {app.subscribed && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded mt-0.5">
              <Check size={9} /> Subscribed
            </span>
          )}
        </div>
      </div>
      <p className="text-[13px] text-zinc-400 line-clamp-3 mb-4 flex-1 leading-relaxed">{app.desc}</p>
      <div className="flex items-center justify-between text-[13px] text-zinc-400 pt-3 border-t border-zinc-800/80 mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-[#23b5b5] to-[#167878] flex items-center justify-center text-[10px] font-bold text-white">E</div>
          <span className="font-medium text-zinc-300">Explified</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Star size={13} className="text-zinc-400" /> {app.rating}</span>
        </div>
      </div>
    </motion.div>
  );

  // ─── SUBSCRIPTION LOG CARD ───
  const SubscriptionLogCard = ({ log }) => {
    const isCancelling = cancellingId === log._id;
    const isActive = log.subscriptionStatus === 'active';

    return (
      <motion.div
        variants={itemVariants}
        className={`bg-[#18191E] border rounded-xl p-5 transition-all ${isActive ? 'border-zinc-800/80 hover:border-zinc-600' : 'border-zinc-800/40 opacity-75'}`}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-zinc-900 border border-zinc-700/50 overflow-hidden text-[#23b5b5]">
            {log.appLogo ? (
              <img src={log.appLogo} alt={log.appName} className="w-full h-full object-contain p-1.5" />
            ) : (
              <Package size={22} className="text-[#23b5b5]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-[15px] font-bold text-zinc-100 truncate">{log.appName}</h3>
                <p className="text-[12px] text-zinc-500 font-mono mt-0.5 truncate max-w-[280px]">{log.domain}</p>
              </div>
              <StatusBadge status={log.subscriptionStatus} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
              <span className="flex items-center gap-1.5 text-[12px] text-zinc-400">
                <span className="capitalize px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300 text-[11px] font-medium">{log.marketplace}</span>
              </span>
              <span className="flex items-center gap-1.5 text-[12px] text-zinc-400">
                <Zap size={11} className="text-[#23b5b5]" />
                <span className="capitalize">{log.planType} plan</span>
              </span>
              <span className="flex items-center gap-1.5 text-[12px] text-zinc-400">
                <span className="font-semibold text-zinc-200">${(log.amount || 0).toFixed(2)}</span>
                {log.planType !== 'free' && <span className="text-zinc-600">/ {log.planType === 'monthly' ? 'mo' : 'yr'}</span>}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <Calendar size={10} />
                Subscribed {fmtDate(log.createdAt)}
              </span>
              {isActive && log.currentPeriodEnd && (
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <RefreshCw size={10} />
                  Renews {fmtDate(log.currentPeriodEnd)}
                </span>
              )}
              {!isActive && log.cancelledAt && (
                <span className="flex items-center gap-1.5 text-[11px] text-red-400/70">
                  <Ban size={10} />
                  Cancelled {fmtDate(log.cancelledAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {isActive && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800/60">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => handleCancelSubscription(null, log._id)}
              disabled={isCancelling}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors disabled:opacity-50"
            >
              {isCancelling ? <Loader2 size={12} className="animate-spin" /> : <Ban size={12} />}
              {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => window.open(log.domain, '_blank')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-zinc-400 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <ExternalLink size={12} /> Open App
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  };

  // ─── APP DETAIL VIEW ───
  const AppDetailView = () => {
    if (!selectedApp) return null;
    const images = selectedApp.featureImages || [];
    const isCancelling = cancellingId !== null;

    const matchingLog = subscriptionLogs.find(
      l => l.domain.toLowerCase() === selectedApp.path.toLowerCase() && l.subscriptionStatus === 'active'
    );

    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-6xl mx-auto space-y-6 text-zinc-300 pb-20">

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 bg-zinc-900 border border-white/10 overflow-hidden text-[#23b5b5]"
          >
            {selectedApp.iconUrl ? (
              <img src={selectedApp.iconUrl} alt={selectedApp.name} className="w-full h-full object-contain p-3" />
            ) : (
              <DynamicIcon name={selectedApp.iconName} size={48} />
            )}
          </motion.div>

          <div className="flex-1">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-white">{selectedApp.name}</h1>
              <span className="px-2 py-1 bg-zinc-800 border border-zinc-700 text-xs font-semibold rounded text-zinc-300">{selectedApp.pricing}</span>
              {selectedApp.tag && (
                <span className="px-2 py-1 bg-[#23b5b5]/10 border border-[#23b5b5]/30 text-xs font-bold rounded text-[#23b5b5] uppercase tracking-wider">{selectedApp.tag}</span>
              )}
              {selectedApp.subscribed && <StatusBadge status="active" />}
            </motion.div>

            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center gap-4 text-[13px] text-zinc-400 mb-3">
              <span className="font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-300">{selectedApp.path}</span>
              <button className="hover:text-zinc-200 transition-colors flex items-center" onClick={() => { navigator.clipboard.writeText(selectedApp.path); toast.success('Copied!'); }}>
                <Copy size={12} className="inline mr-1" /> Copy
              </button>
              <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500" /> {selectedApp.rating} ({selectedApp.reviews})</span>
              <span className="flex items-center gap-1"><Users size={14} /> {selectedApp.installs}</span>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-[14px] text-zinc-400 mt-4 mb-3 leading-relaxed max-w-3xl">
              {selectedApp.desc}
            </motion.p>

            {selectedApp.subscribed && matchingLog && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-4 mt-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-[12px]"
              >
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Calendar size={11} className="text-emerald-400" />
                  Subscribed {fmtDate(matchingLog.createdAt)}
                </span>
                {matchingLog.currentPeriodEnd && (
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <RefreshCw size={11} className="text-emerald-400" />
                    Renews {fmtDate(matchingLog.currentPeriodEnd)}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Zap size={11} className="text-emerald-400" />
                  {matchingLog.planType} · ${(matchingLog.amount || 0).toFixed(2)}
                </span>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[13px] flex items-center flex-wrap gap-2 mt-3">
              Crafted by <span className="text-[#23b5b5] font-medium inline-flex items-center gap-1"><div className="w-4 h-4 rounded bg-[#23b5b5] flex items-center justify-center text-[8px] text-black">E</div> Explified</span>
              <span className="mx-1 opacity-50">•</span>
              <span className="flex items-center gap-1.5 text-zinc-300 bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-700/50">
                {selectedApp.categoryIcon ? (
                  <img src={selectedApp.categoryIcon} className="w-3.5 h-3.5 object-contain" alt={selectedApp.category} />
                ) : (
                  <DynamicIcon name={getMarketplaceIcon(selectedApp.category)} size={12} className="text-zinc-400" />
                )}
                {selectedApp.category}
              </span>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="flex flex-col items-stretch gap-2 w-full md:w-auto mt-2 md:mt-0">
            {selectedApp.subscribed ? (
              <>
                <div className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 size={16} /> Active Subscription
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleCancelSubscription(selectedApp.id)}
                  disabled={isCancelling}
                  className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium text-sm transition-colors disabled:opacity-50"
                >
                  {isCancelling ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                  {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                onClick={() => initiateSubscription(selectedApp.id)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold bg-[#23b5b5] text-black hover:bg-[#1ca3a3] transition-colors"
              >
                <Play size={16} fill="currentColor" /> Subscribe
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
              onClick={() => setAppDetailTab('api')}
              className="px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 flex items-center justify-center gap-2 font-medium text-sm"
            >
              API Config <ChevronDown size={14} />
            </motion.button>
          </motion.div>
        </div>

        <div className="flex gap-6 border-b border-zinc-800 mt-8 pt-4">
          <button onClick={() => setAppDetailTab('information')} className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${appDetailTab === 'information' ? 'border-[#23b5b5] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>
            Overview
          </button>
          <button onClick={() => setAppDetailTab('api')} className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${appDetailTab === 'api' ? 'border-[#23b5b5] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>
            API Configuration
          </button>
        </div>

        <div className="pt-6">
          {appDetailTab === 'information' ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              {images.length > 0 && (
                <div className="w-full">
                  {images.length === 1 && (
                    <div className="w-full aspect-video md:aspect-[21/9] cursor-pointer rounded-2xl overflow-hidden border border-zinc-800/80 bg-[#18191E]" onClick={() => openLightbox(0)}>
                      <img src={images[0]} alt="Feature 1" className="w-full h-full object-contain hover:scale-[1.02] transition-transform duration-700" />
                    </div>
                  )}
                  {images.length === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {images.map((img, i) => (
                        <div key={i} className="cursor-pointer rounded-2xl overflow-hidden border border-zinc-800/80 aspect-video bg-[#18191E]" onClick={() => openLightbox(i)}>
                          <img src={img} alt={`Feature ${i + 1}`} className="w-full h-full object-contain hover:scale-[1.02] transition-transform duration-700" />
                        </div>
                      ))}
                    </div>
                  )}
                  {images.length >= 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[450px]">
                      <div className="md:col-span-2 h-[250px] md:h-full cursor-pointer rounded-2xl overflow-hidden relative group border border-zinc-800/80 bg-[#18191E]" onClick={() => openLightbox(0)}>
                        <img src={images[0]} alt="Feature 1" className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-700" />
                      </div>
                      <div className="grid grid-rows-2 gap-4 h-[500px] md:h-full">
                        <div className="cursor-pointer rounded-2xl overflow-hidden relative group border border-zinc-800/80 bg-[#18191E]" onClick={() => openLightbox(1)}>
                          <img src={images[1]} alt="Feature 2" className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-700" />
                        </div>
                        <div className="cursor-pointer rounded-2xl overflow-hidden relative group border border-zinc-800/80 bg-[#18191E]" onClick={() => openLightbox(2)}>
                          <img src={images[2]} alt="Feature 3" className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-700" />
                          {images.length > 3 && (
                            <div className="absolute inset-0 bg-black/60 hover:bg-black/50 transition-colors flex items-center justify-center text-white font-bold text-xl backdrop-blur-[2px]">
                              + {images.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="max-w-4xl space-y-6 bg-[#18191E] p-8 rounded-2xl border border-zinc-800/80 shadow-sm">
                <h2 className="text-2xl font-bold text-white">{selectedApp.name} Setup & Capabilities</h2>
                <p className="text-[15px] leading-relaxed text-zinc-300">{selectedApp.desc}</p>
                <div className="w-full h-px bg-zinc-800/80 my-4" />
                <ul className="space-y-4 pt-2">
                  {selectedApp.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-zinc-300 text-[15px]">
                      <div className="w-5 h-5 rounded-md bg-[#23b5b5]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#23b5b5]/20">
                        <CheckCircle2 size={12} className="text-[#23b5b5]" />
                      </div>
                      <span className="leading-relaxed font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl bg-[#18191E] border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Code size={20} className="text-[#23b5b5]" />
                <h2 className="text-xl font-bold text-white">API Credentials</h2>
              </div>
              <p className="text-sm text-zinc-400 mb-8">
                Manage API tokens for <span className="font-mono text-zinc-300 bg-zinc-900 px-1 rounded">{selectedApp.path}</span>.
              </p>

              {!selectedApp.subscribed ? (
                <div className="text-center py-12 bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed">
                  <Key size={32} className="mx-auto text-zinc-600 mb-3" />
                  <p className="text-zinc-400 font-medium mb-4">You must be subscribed to generate API keys.</p>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => initiateSubscription(selectedApp.id)} className="bg-[#23b5b5] hover:bg-[#1ca3a3] text-black px-6 py-2 rounded-lg font-medium transition-colors">
                    Subscribe Now
                  </motion.button>
                </div>
              ) : (
                <motion.div variants={containerVariants} initial="initial" animate="animate" className="space-y-4">
                  {selectedApp.apiKeys.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-zinc-500 text-sm">No API keys generated yet.</p>
                    </div>
                  )}
                  {selectedApp.apiKeys.map(key => (
                    <motion.div variants={itemVariants} key={key.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between group">
                      <div>
                        <div className="text-sm font-bold text-zinc-200 mb-1">{key.name}</div>
                        <div className="flex items-center gap-3 bg-[#0B0C10] px-3 py-1.5 rounded border border-zinc-800">
                          <code className="text-xs text-[#23b5b5] font-mono">
                            {visibleKeys.includes(key.id) ? key.token : 'sk_live_••••••••••••••••••••••••'}
                          </code>
                          <button onClick={() => toggleKeyVisibility(key.id)} className="text-zinc-500 hover:text-white"><Eye size={14} /></button>
                          <button onClick={() => { navigator.clipboard.writeText(key.token); toast.success('Key copied!'); }} className="text-zinc-500 hover:text-white"><Copy size={14} /></button>
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteKey(selectedApp.id, key.id)} className="text-zinc-600 hover:text-red-500 transition-colors p-2 bg-zinc-900 rounded opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => generateNewKey(selectedApp.id)} className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                    <Plus size={16} /> Create New Key
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  // ─── STORE / MARKETPLACE ───
  const MarketplaceOverview = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500">
          <Loader2 size={32} className="animate-spin text-[#23b5b5] mb-4" />
          <p className="font-medium">Loading Explified Store...</p>
        </div>
      );
    }

    const filteredCategories = storeCategories.map(category => {
      const filteredItems = category.items.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...category, items: filteredItems };
    }).filter(cat => cat.items.length > 0);

    const subscribedSet = new Set(storeApps.filter(a => a.subscribed).map(a => a.id));
    const syncedCategories = filteredCategories.map(cat => ({
      ...cat,
      items: cat.items.map(item => ({
        ...item,
        subscribed: subscribedSet.has(item.id)
      }))
    }));

    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-7xl mx-auto space-y-8 pb-20">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Explified Store</h1>

        <div className="flex items-center gap-3 max-w-2xl mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search tools, workflows, platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18191E] border border-zinc-800 text-sm rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-[#23b5b5] text-zinc-200 placeholder:text-zinc-500 transition-colors"
            />
          </div>
        </div>

        {syncedCategories.length === 0 ? (
          <div className="py-20 text-center border border-zinc-800 border-dashed rounded-xl bg-zinc-900/20">
            <Box size={40} className="mx-auto text-zinc-600 mb-3" />
            <p className="text-zinc-400 font-medium">No products found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {syncedCategories.map((category) => (
              <div key={category.id} className="pt-2">
                <div className="flex items-center justify-between mb-5 border-b border-zinc-800/60 pb-3">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-700/50 overflow-hidden">
                      {category.iconUrl ? (
                        <img src={category.iconUrl} className="w-full h-full object-contain p-1.5" alt={category.name} />
                      ) : (
                        <DynamicIcon name={category.iconName} size={16} className="text-[#23b5b5]" />
                      )}
                    </div>
                    {category.name}
                  </h2>
                  <span className="text-sm font-medium text-zinc-500">{category.items.length} apps</span>
                </div>
                <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {category.items.map(app => <ProductCard key={app.id} app={app} />)}
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  // ─── INTEGRATIONS VIEW ───
  const IntegrationsView = () => {
    const filteredLogs = useMemo(() => {
      if (logFilter === 'active') return subscriptionLogs.filter(l => l.subscriptionStatus === 'active');
      if (logFilter === 'cancelled') return subscriptionLogs.filter(l => l.subscriptionStatus === 'cancelled');
      return subscriptionLogs;
    }, [logFilter, subscriptionLogs]);

    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-7xl mx-auto pb-20">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-white">My Integrations</h1>
            <p className="text-zinc-400 mt-1">All your subscriptions — active and past.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={fetchSubscriptionLogs}
            disabled={logsLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-400 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={logsLoading ? 'animate-spin' : ''} />
            Refresh
          </motion.button>
        </div>

        {logsLoading ? (
          <StatsShimmer />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <div className="bg-[#18191E] border border-zinc-800 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#23b5b5]/10 flex items-center justify-center text-[#23b5b5]">
                <Plug size={22} />
              </div>
              <div>
                <div className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-0.5">Active</div>
                <div className="text-2xl font-bold text-white">{activeLogs.length}</div>
              </div>
            </div>
            <div className="bg-[#18191E] border border-zinc-800 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                <Ban size={22} />
              </div>
              <div>
                <div className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-0.5">Cancelled</div>
                <div className="text-2xl font-bold text-white">{cancelledLogs.length}</div>
              </div>
            </div>
            <div className="bg-[#18191E] border border-zinc-800 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <TrendingUp size={22} />
              </div>
              <div>
                <div className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-0.5">Total Spent</div>
                <div className="text-2xl font-bold text-white">
                  ${subscriptionLogs.reduce((sum, l) => sum + (l.amount || 0), 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {!logsLoading && subscriptionLogs.length > 0 && (
          <div className="flex gap-2 mb-6">
            {[
              { id: 'all', label: `All (${subscriptionLogs.length})` },
              { id: 'active', label: `Active (${activeLogs.length})` },
              { id: 'cancelled', label: `Cancelled (${cancelledLogs.length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setLogFilter(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${logFilter === tab.id ? 'bg-[#23b5b5] text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {logsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <SubscriptionShimmer key={i} />)}
          </div>
        ) : subscriptionLogs.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="py-20 text-center border border-zinc-800 rounded-xl bg-[#18191E]"
          >
            <Plug size={40} className="mx-auto text-zinc-600 mb-4" />
            <h3 className="text-xl font-bold text-white">No Integrations Yet</h3>
            <p className="text-zinc-400 mt-2 text-sm max-w-sm mx-auto mb-6">You haven't subscribed to any products yet. Browse the store to get started.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleNavClick('store')} className="text-sm font-semibold bg-[#23b5b5] text-black px-6 py-2.5 rounded-lg hover:bg-[#1ca3a3] transition-colors">
              Browse Store
            </motion.button>
          </motion.div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-zinc-500">
            <p className="font-medium">No {logFilter} subscriptions found.</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLogs.map(log => <SubscriptionLogCard key={log._id} log={log} />)}
          </motion.div>
        )}
      </motion.div>
    );
  };

  const BillingView = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-5xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-white mb-2">Billing & Usage</h1>
      <p className="text-zinc-400 mb-8">Manage your subscription, compute usage, and billing history.</p>

      {userSubscriptions.filter(s => s.subscriptionStatus === 'active').length > 0 && (
        <div className="mb-8 bg-[#18191E] border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Active Subscriptions</h2>
          <div className="space-y-3">
            {userSubscriptions.filter(s => s.subscriptionStatus === 'active').map(sub => (
              <div key={sub._id} className="flex items-center justify-between py-3 border-b border-zinc-800/60 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-zinc-200">{sub.app?.name || sub.domain}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {sub.planType} · {sub.marketplace} ·{' '}
                    {sub.currentPeriodEnd ? `Renews ${new Date(sub.currentPeriodEnd).toLocaleDateString()}` : 'No expiry'}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-sm font-bold text-white">${(sub.amount || 0).toFixed(2)}</span>
                  <StatusBadge status="active" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#18191E] border border-zinc-800 rounded-xl p-6 text-center py-20">
        <CreditCard size={40} className="mx-auto text-zinc-600 mb-4" />
        <p className="text-zinc-400 font-medium">Full billing module is integrated via Stripe in production.</p>
      </div>
    </motion.div>
  );

  const SettingsView = () => {
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
    const fileInputRef = useRef(null);
    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target.result);
      reader.readAsDataURL(file);
    };
    const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
    const displayDomains = (user?.domains || []).filter(d => !d.startsWith('http') && d.length < 40);

    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto pb-20">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-zinc-400 mb-10">Manage your profile and account preferences.</p>
        <div className="bg-[#18191E] border border-zinc-800 rounded-2xl p-8 flex flex-col items-center gap-6 max-w-sm">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-zinc-700 bg-[#E53961] flex items-center justify-center shadow-xl">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-white">{initials}</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Camera size={22} className="text-white" />
            </button>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">{user?.name || 'Your Name'}</p>
            <p className="text-sm text-zinc-400 mt-0.5">{user?.email || ''}</p>
            {displayDomains.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {displayDomains.map(d => (
                  <span key={d} className="text-[11px] px-2 py-0.5 bg-[#23b5b5]/10 text-[#23b5b5] border border-[#23b5b5]/20 rounded-full font-medium">{d}</span>
                ))}
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors border border-zinc-700"
          >
            <Camera size={15} /> Change Photo
          </motion.button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      </motion.div>
    );
  };

  const ApiKeysView = () => {
    const allKeys = useMemo(() =>
      storeApps.filter(a => a.subscribed).flatMap(app =>
        app.apiKeys.map(key => ({ ...key, appId: app.id, appName: app.name, path: app.path }))
      ), [storeApps]);

    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-6xl mx-auto pb-20">
        <h1 className="text-3xl font-bold text-white mb-2">Global API Keys</h1>
        <p className="text-zinc-400 mb-8">Centralized view of all your active access tokens.</p>

        {allKeys.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center border border-zinc-800 rounded-xl bg-[#18191E]">
            <p className="text-zinc-500">No active keys. Subscribe to a product first.</p>
          </motion.div>
        ) : (
          <div className="bg-[#18191E] border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Product</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Key Name</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Token</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <motion.tbody variants={containerVariants} initial="initial" animate="animate">
                {allKeys.map(key => (
                  <motion.tr variants={itemVariants} key={key.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-bold text-zinc-200">{key.appName}</p>
                      <p className="text-xs text-zinc-500 font-mono">{key.path}</p>
                    </td>
                    <td className="p-4 text-sm font-medium text-zinc-300">{key.name}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 bg-[#0B0C10] px-3 py-1.5 rounded border border-zinc-800 w-max">
                        <code className="text-xs text-[#23b5b5] font-mono">{visibleKeys.includes(key.id) ? key.token : 'sk_live_••••••••••••••••'}</code>
                        <button onClick={() => toggleKeyVisibility(key.id)} className="text-zinc-500 hover:text-white"><Eye size={14} /></button>
                        <button onClick={() => { navigator.clipboard.writeText(key.token); toast.success('Copied!'); }} className="text-zinc-500 hover:text-white"><Copy size={14} /></button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openAppDetails(key.appId)} className="text-sm bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded text-white transition-colors">
                        Manage
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        )}
      </motion.div>
    );
  };

  // --- ROUTER ---
  const renderContent = () => {
    if (selectedAppId) return <AppDetailView key="app-detail" />;
    if (activeTab === 'store') return <MarketplaceOverview key="store" />;
    if (activeTab === 'integrations') return <IntegrationsView key="integrations" />;
    if (activeTab === 'billing') return <BillingView key="billing" />;
    if (activeTab === 'settings') return <SettingsView key="settings" />;
    if (activeTab === 'api_keys') return <ApiKeysView key="api-keys" />;
    return <motion.div key="coming-soon" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="text-center py-20 text-zinc-500">Feature coming soon.</motion.div>;
  };

  return (
    <div className="flex h-screen w-full bg-[#0B0C10] text-zinc-200 font-sans overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#111217] border-r border-zinc-800 flex flex-col h-full flex-shrink-0 z-[50]">

        {/* ── LOGO — clicks open explified.com in new tab ── */}
        <div
          className="h-16 flex items-center px-6 border-b border-zinc-800 shrink-0 cursor-pointer select-none hover:opacity-80 transition-opacity"
          onClick={() => window.open('https://explified.com', '_blank')}
        >
          <img
            src={logo}
            alt="Explified Logo"
            className="w-8 h-8 mr-3 object-contain"
          />
          <span className="font-bold text-lg text-white">
            Explified
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
          <div>
            <p className="px-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">DASHBOARD</p>
            <div className="space-y-1">
              <SidebarLink id="integrations" name="My Integrations" icon={Plug} badge={activeLogs.length} />
              <SidebarLink id="billing" name="Billing" icon={CreditCard} />
            </div>
          </div>
       
        </div>

        <div className="px-4 pb-4 space-y-2 shrink-0">
          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="bg-[#18191E] border border-zinc-800/80 rounded-xl p-1.5 space-y-1"
              >
                {/* Store */}
                <button
                  onClick={() => { handleNavClick('store'); setIsUserMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${activeTab === 'store' && !selectedAppId ? 'bg-zinc-800/80 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                >
                  <Store size={16} className={activeTab === 'store' && !selectedAppId ? 'text-[#23b5b5]' : 'text-zinc-400'} />
                  Store
                </button>

                {/* My Integrations */}
                <button
                  onClick={() => { handleNavClick('integrations'); setIsUserMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${activeTab === 'integrations' && !selectedAppId ? 'bg-zinc-800/80 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                >
                  <Plug size={16} className={activeTab === 'integrations' && !selectedAppId ? 'text-[#23b5b5]' : 'text-zinc-400'} />
                  My Integrations
                  {activeLogs.length > 0 && (
                    <span className="ml-auto min-w-[18px] h-[18px] px-1 bg-[#23b5b5] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                      {activeLogs.length}
                    </span>
                  )}
                </button>

                {/* Global API Keys */}
                <button
                  onClick={() => { handleNavClick('api_keys'); setIsUserMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${activeTab === 'api_keys' && !selectedAppId ? 'bg-zinc-800/80 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                >
                  <Key size={16} className={activeTab === 'api_keys' && !selectedAppId ? 'text-[#23b5b5]' : 'text-zinc-400'} />
                  Global API Keys
                </button>

                {/* Settings */}
                <button
                  onClick={() => { handleNavClick('settings'); setIsUserMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${activeTab === 'settings' && !selectedAppId ? 'bg-zinc-800/80 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                >
                  <Settings size={16} className={activeTab === 'settings' && !selectedAppId ? 'text-[#23b5b5]' : 'text-zinc-400'} />
                  Settings
                </button>

                {/* Divider */}
                <div className="h-px bg-zinc-800/60 mx-1 my-1" />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium text-[#FF4F4F] hover:bg-[#FF4F4F]/10 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            onClick={() => setIsUserMenuOpen(prev => !prev)}
            className={`flex items-center gap-3 p-3 rounded-xl bg-[#18191E] border transition-colors shadow-sm cursor-pointer ${isUserMenuOpen ? 'border-zinc-600' : 'border-zinc-800 hover:border-zinc-600'}`}
          >
            <div className="w-10 h-10 rounded-full bg-[#E53961] flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden shadow-inner">
              {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : (user?.name ? user.name.charAt(0).toUpperCase() : 'G')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold text-white truncate leading-tight">{user?.name || 'User'}</p>
              <p className="text-[11px] text-zinc-500 truncate mt-0.5">{user?.email || ''}</p>
            </div>
            <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-200 shrink-0 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0B0C10] relative z-0">
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-800 bg-[#111217]/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="flex items-center text-sm font-medium text-zinc-400">
            <span className="cursor-pointer hover:text-white transition-colors" onClick={() => handleNavClick('store')}>Explified</span>
            <ChevronLeft size={14} className="mx-2 rotate-180 opacity-50" />
            <span className="capitalize text-white">{activeTab === 'store' ? 'Store' : activeTab.replace('_', ' ')}</span>
            {selectedAppId && selectedApp && (
              <>
                <ChevronLeft size={14} className="mx-2 rotate-180 opacity-50" />
                <span className="text-white">{selectedApp.name}</span>
              </>
            )}
          </div>
        </header>

        <main ref={mainScrollRef} className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {paymentApp && (
          <PaymentModal
            app={paymentApp}
            onClose={() => setPaymentApp(null)}
            onSuccess={handlePaymentSuccess}
          />
        )}
        {lightboxOpen && selectedApp && (selectedApp.featureImages || []).length > 0 && (
          <Lightbox images={selectedApp.featureImages} startIndex={photoIndex} onClose={closeLightbox} />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #27272a; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #3f3f46; }
      `}</style>
    </div>
  );
}