import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Figma, ShoppingBag, Chrome, Trello, PenTool, Database, Framer, Layers, Compass, Globe, MessageCircle,
  Search, Plus, Bookmark, Users, Star, LayoutDashboard, Plug, Key, Settings, CreditCard, 
  Copy, Eye, EyeOff, Play, ChevronDown, CheckCircle2, ChevronLeft, Trash2, FileText, Code
} from 'lucide-react';

// --- PLATFORMS DATA ---
const platforms = [
  { id: 'all', name: 'All Actors', icon: Layers },
  { id: 'figma', name: 'Figma', icon: Figma, bg: 'bg-[#F24E1E]/10', color: 'text-[#F24E1E]' },
  { id: 'shopify', name: 'Shopify', icon: ShoppingBag, bg: 'bg-[#95BF47]/10', color: 'text-[#95BF47]' },
  { id: 'chrome', name: 'Chrome', icon: Chrome, bg: 'bg-[#4285F4]/10', color: 'text-[#4285F4]' },
  { id: 'atlassian', name: 'Atlassian', icon: Trello, bg: 'bg-[#0052CC]/10', color: 'text-[#0052CC]' },
  { id: 'penpot', name: 'Penpot', icon: PenTool, bg: 'bg-[#24b15d]/10', color: 'text-[#24b15d]' },
  { id: 'strapi', name: 'Strapi', icon: Database, bg: 'bg-[#8c4bff]/10', color: 'text-[#8c4bff]' },
  { id: 'framer', name: 'Framer', icon: Framer, bg: 'bg-[#00aaff]/10', color: 'text-[#00aaff]' },
  { id: 'clickup', name: 'ClickUp', icon: Layers, bg: 'bg-[#7B68EE]/10', color: 'text-[#7B68EE]' },
  { id: 'edge', name: 'Microsoft Edge', icon: Compass, bg: 'bg-[#0078D7]/10', color: 'text-[#0078D7]' },
  { id: 'opera', name: 'Opera', icon: Globe, bg: 'bg-[#FF1B2D]/10', color: 'text-[#FF1B2D]' },
  { id: 'bubble', name: 'Bubble', icon: MessageCircle, bg: 'bg-[#065A82]/10', color: 'text-[#065A82]' },
];

// --- MOCK APPS GENERATION ---
const initialAppsData = platforms.filter(p => p.id !== 'all').flatMap(platform => {
  const isSubscribed = Math.random() > 0.8;
  return Array.from({ length: 4 }).map((_, i) => ({
    id: `${platform.id}_app_${i}`,
    platformId: platform.id,
    name: `${platform.name} ${['Scraper', 'Sync', 'Crawler', 'Flow', 'AI Tool', 'Extractor', 'Automation'][Math.floor(Math.random() * 7)]}`,
    path: `explified/${platform.id}-tool-${i}`,
    desc: `Extract data, automate workflows, and supercharge your ${platform.name} ecosystem. Includes full data exports, API integrations, and continuous monitoring capabilities to save you countless hours of manual work.`,
    installs: Math.floor(Math.random() * 500) + 'K',
    rating: (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1),
    bookmarks: (Math.random() * 10).toFixed(1) + 'K',
    reviews: Math.floor(Math.random() * 2000),
    pricing: i % 2 === 0 ? 'Free' : `from $${(Math.random() * 10 + 1).toFixed(2)} / 1,000 runs`,
    subscribed: isSubscribed,
    features: ['Auto-sync across environments', 'Real-time collaborative analytics', '1-click deployment', 'Enterprise-grade security export via JSON/CSV'],
    apiKeys: isSubscribed ? [{ id: `key_${Date.now()}_${Math.random()}`, name: 'Default Token', token: `sk_live_${platform.id}_${Math.random().toString(36).substr(2, 12)}` }] : []
  }));
});

// --- PAGE ANIMATION VARIANTS ---
const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

// --- STAGGERED LIST VARIANTS ---
const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function FullDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [apps, setApps] = useState(initialAppsData);
  const [visibleKeys, setVisibleKeys] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [appDetailTab, setAppDetailTab] = useState('information'); 

  // Navigation Logic
  const handleNavClick = (id) => {
    setActiveTab(id);
    setSelectedAppId(null);
  };

  const openAppDetails = (id) => {
    setSelectedAppId(id);
    setAppDetailTab('information');
  };

  // Actions
  const toggleKeyVisibility = (keyId) => setVisibleKeys(prev => prev.includes(keyId) ? prev.filter(id => id !== keyId) : [...prev, keyId]);
  
  const toggleSubscription = (appId) => {
    setApps(apps.map(app => {
      if (app.id === appId) {
        const isNowSubscribed = !app.subscribed;
        return { 
          ...app, 
          subscribed: isNowSubscribed,
          apiKeys: isNowSubscribed && app.apiKeys.length === 0 
            ? [{ id: `key_${Date.now()}`, name: 'Production Key', token: `sk_live_${app.platformId}_${Math.random().toString(36).substr(2, 12)}` }] 
            : app.apiKeys 
        };
      }
      return app;
    }));
  };

  const generateNewKey = (appId) => {
    setApps(apps.map(app => {
      if (app.id === appId) {
        return { ...app, apiKeys: [...app.apiKeys, { id: `key_${Date.now()}`, name: `Key ${app.apiKeys.length + 1}`, token: `sk_live_${app.platformId}_${Math.random().toString(36).substr(2, 12)}` }] };
      }
      return app;
    }));
  };

  const deleteKey = (appId, keyId) => {
    setApps(apps.map(app => {
      if (app.id === appId) return { ...app, apiKeys: app.apiKeys.filter(k => k.id !== keyId) };
      return app;
    }));
  };

  const selectedApp = apps.find(a => a.id === selectedAppId);

  // --- SUB-COMPONENTS ---

  // Sidebar Link with Framer Motion Smoothness
  const SidebarLink = ({ id, name, icon: Icon }) => {
    const isActive = activeTab === id && !selectedAppId;
    return (
      <button 
        onClick={() => handleNavClick(id)} 
        className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group"
      >
        {isActive && (
          <motion.div
            layoutId="active-sidebar"
            className="absolute inset-0 bg-zinc-800 rounded-lg"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <Icon size={16} className={`relative z-10 transition-colors ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
        <span className={`relative z-10 transition-colors ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
          {name}
        </span>
      </button>
    );
  };

  const ApifyAppCard = ({ app }) => {
    const platform = platforms.find(p => p.id === app.platformId);
    return (
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.02, y: -4, boxShadow: "0 10px 40px -10px rgba(35,181,181,0.15)" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => openAppDetails(app.id)}
        className="bg-[#18191E] border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-500 transition-colors cursor-pointer flex flex-col h-[220px]"
      >
        <div className="flex gap-4 items-start mb-3">
          <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center bg-white/5`}>
            {platform && <platform.icon size={24} className={platform.color} />}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-[15px] font-bold text-zinc-100 truncate">{app.name}</h3>
            <p className="text-[13px] font-mono text-zinc-400 truncate mt-0.5">{app.path}</p>
          </div>
        </div>
        
        <p className="text-[13px] text-zinc-400 line-clamp-3 mb-4 flex-1 leading-relaxed">
          {app.desc}
        </p>
        
        <div className="flex items-center justify-between text-[13px] text-zinc-400 pt-3 border-t border-zinc-800/80 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#23b5b5] to-[#167878] flex items-center justify-center text-[10px] font-bold text-white">E</div>
            <span className="font-medium text-zinc-300">Explified</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Star size={13} className="text-zinc-400" /> {app.rating}</span>
            <span className="flex items-center gap-1"><Users size={13} className="text-zinc-400"/> {app.installs}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const AppDetailView = () => {
    if(!selectedApp) return null;
    const platform = platforms.find(p => p.id === selectedApp.platformId);

    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-6xl mx-auto space-y-6 text-zinc-300 pb-20">
        
        {/* Header mimicking Apify App Detail */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ type: "spring", stiffness: 200, damping: 20 }}
             className={`w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/10`}
           >
             <platform.icon size={48} className={platform.color} />
           </motion.div>
           
           <div className="flex-1">
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-wrap items-center gap-3 mb-2">
                 <h1 className="text-3xl font-extrabold text-white">{selectedApp.name}</h1>
                 <span className="px-2 py-1 bg-zinc-800 border border-zinc-700 text-xs font-semibold rounded text-zinc-300">
                   {selectedApp.pricing}
                 </span>
              </motion.div>
              
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center gap-4 text-[13px] text-zinc-400 mb-3">
                 <span className="font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-300">{selectedApp.path}</span>
                 <button className="hover:text-zinc-200 transition-colors"><Copy size={12} className="inline mr-1" /> Copy</button>
                 <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500"/> {selectedApp.rating} ({selectedApp.reviews})</span>
                 <span className="flex items-center gap-1"><Bookmark size={14}/> {selectedApp.bookmarks}</span>
                 <span className="flex items-center gap-1"><Users size={14}/> {selectedApp.installs}</span>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[13px]">
                Crafted by <span className="text-[#23b5b5] font-medium flex items-center inline-flex gap-1"><div className="w-4 h-4 rounded bg-[#23b5b5] flex items-center justify-center text-[8px] text-black">E</div> Explified</span> 
                <span className="mx-2 opacity-50">•</span> Maintained by Explified
              </motion.div>
           </div>

           {/* Action Buttons */}
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-3 w-full md:w-auto">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSubscription(selectedApp.id)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-colors ${
                  selectedApp.subscribed 
                  ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                  : 'bg-green-600 text-white hover:bg-green-500'
                }`}
              >
                {selectedApp.subscribed ? <><CheckCircle2 size={16}/> Subscribed</> : <><Play size={16} fill="currentColor" /> Subscribe & Start</>}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAppDetailTab('api')} 
                className="px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 flex items-center gap-2 font-medium"
              >
                 API <ChevronDown size={14} />
              </motion.button>
           </motion.div>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-[15px] leading-relaxed text-zinc-300 max-w-4xl mt-4">
          {selectedApp.desc} Export data, run via API, schedule and monitor runs, or integrate with other tools directly from your workspace.
        </motion.p>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-zinc-800 mt-8 pt-4">
           <button 
             onClick={() => setAppDetailTab('information')}
             className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${appDetailTab === 'information' ? 'border-[#23b5b5] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
           >
             Information
           </button>
           <button 
             onClick={() => setAppDetailTab('api')}
             className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${appDetailTab === 'api' ? 'border-[#23b5b5] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
           >
             API Configuration
           </button>
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          {appDetailTab === 'information' ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Features & Setup</h3>
                <p className="text-sm text-zinc-400 mb-6">Our base charge is incredibly low. To extract data or configure webhooks, simply install the app and refer to the features below.</p>
                <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedApp.features.map((feat, idx) => (
                    <motion.div variants={itemVariants} key={idx} className="flex items-start gap-3 bg-zinc-950 p-4 rounded-lg border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                      <FileText size={16} className="text-[#23b5b5] mt-0.5" />
                      <span className="text-sm text-zinc-300">{feat}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl bg-[#18191E] border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Code size={20} className="text-[#23b5b5]" />
                <h2 className="text-xl font-bold text-white">API Credentials</h2>
              </div>
              <p className="text-sm text-zinc-400 mb-8">Manage API tokens for programmatically accessing <span className="font-mono text-zinc-300 bg-zinc-900 px-1 rounded">{selectedApp.path}</span>.</p>
              
              {!selectedApp.subscribed ? (
                <div className="text-center py-12 bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed">
                  <Key size={32} className="mx-auto text-zinc-600 mb-3"/>
                  <p className="text-zinc-400 font-medium mb-4">You must be subscribed to generate API keys.</p>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => toggleSubscription(selectedApp.id)} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Subscribe Now
                  </motion.button>
                </div>
              ) : (
                <motion.div variants={containerVariants} initial="initial" animate="animate" className="space-y-4">
                  {selectedApp.apiKeys.map(key => (
                    <motion.div variants={itemVariants} key={key.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between group">
                      <div>
                        <div className="text-sm font-bold text-zinc-200 mb-1">{key.name}</div>
                        <div className="flex items-center gap-3 bg-[#0B0C10] px-3 py-1.5 rounded border border-zinc-800">
                          <code className="text-xs text-[#23b5b5] font-mono">{visibleKeys.includes(key.id) ? key.token : 'sk_live_••••••••••••••••••••••••'}</code>
                          <button onClick={() => toggleKeyVisibility(key.id)} className="text-zinc-500 hover:text-white"><Eye size={14} /></button>
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteKey(selectedApp.id, key.id)} className="text-zinc-600 hover:text-red-500 transition-colors p-2 bg-zinc-900 rounded opacity-0 group-hover:opacity-100"><Trash2 size={16}/></motion.button>
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

  const MarketplaceOverview = () => {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Explified Store</h1>
        
        {/* Search Bar matching Apify */}
        <div className="flex items-center gap-3 max-w-2xl">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search Apps, Plugins, Actors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18191E] border border-zinc-800 text-sm rounded-lg pl-4 pr-4 py-3 focus:outline-none focus:border-zinc-600 text-zinc-200 placeholder:text-zinc-500 transition-colors" 
            />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} className="bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors">
            Search
          </motion.button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {platforms.map(platform => (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={platform.id}
              onClick={() => setActiveFilter(platform.id)}
              className={`px-3 py-1.5 text-[13px] border rounded-md transition-colors ${
                activeFilter === platform.id 
                ? 'bg-zinc-800 border-zinc-700 text-white' 
                : 'bg-[#18191E] border-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'
              }`}
            >
              {platform.name}
            </motion.button>
          ))}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 py-1.5 text-[13px] border border-zinc-800/80 bg-[#18191E] text-zinc-400 rounded-md hover:bg-zinc-800">...</motion.button>
        </div>

        {/* Grouped Apps Section */}
        <div className="space-y-12">
          {platforms.filter(p => p.id !== 'all').map(platform => {
            if (activeFilter !== 'all' && activeFilter !== platform.id) return null;

            const platformApps = apps.filter(app => {
              const matchesPlatform = app.platformId === platform.id;
              const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.desc.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesPlatform && matchesSearch;
            });

            if (platformApps.length === 0) return null;

            return (
              <div key={platform.id} className="pt-2">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-800/50 pb-3">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                    <platform.icon size={22} className={platform.color} /> 
                    {platform.name} Actors
                  </h2>
                  <span className="text-sm font-medium text-zinc-500">{platformApps.length} tools</span>
                </div>
                
                <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {platformApps.map(app => <ApifyAppCard key={app.id} app={app} />)}
                </motion.div>
              </div>
            );
          })}

          {/* Empty State Fallback */}
          {platforms.filter(p => p.id !== 'all').every(platform => {
            if (activeFilter !== 'all' && activeFilter !== platform.id) return true;
            const platformApps = apps.filter(app => app.platformId === platform.id && (app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.desc.toLowerCase().includes(searchQuery.toLowerCase())));
            return platformApps.length === 0;
          }) && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center text-zinc-500">No actors found matching your criteria.</motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  const IntegrationsView = () => {
    const subscribedApps = apps.filter(a => a.subscribed);
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Integrations</h1>
        {subscribedApps.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center border border-zinc-800 rounded-xl bg-[#18191E]">
            <Plug size={40} className="mx-auto text-zinc-600 mb-4" />
            <h3 className="text-xl font-bold text-white">No Integrations Active</h3>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveTab('overview')} className="mt-4 text-sm font-semibold bg-white text-black px-6 py-2 rounded-lg">Browse Store</motion.button>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {subscribedApps.map(app => <ApifyAppCard key={app.id} app={app} />)}
          </motion.div>
        )}
      </motion.div>
    );
  };

  const ApiKeysView = () => {
    const allKeys = useMemo(() => apps.filter(a => a.subscribed).flatMap(app => app.apiKeys.map(key => ({ ...key, appId: app.id, appName: app.name, path: app.path }))), [apps]);

    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Global API Keys</h1>
        <p className="text-zinc-400 mb-8">Centralized view of all your active access tokens.</p>

        {allKeys.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center border border-zinc-800 rounded-xl bg-[#18191E]"><p className="text-zinc-500">No active keys. Subscribe to an app first.</p></motion.div>
        ) : (
          <div className="bg-[#18191E] border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">App Integration</th>
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
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openAppDetails(key.appId)} className="text-sm bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded text-white transition-colors">Manage</motion.button>
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

  // Main Render Routing
  const renderContent = () => {
    if (selectedAppId) return <AppDetailView key="app-detail" />;
    if (activeTab === 'overview') return <MarketplaceOverview key="overview" />;
    if (activeTab === 'integrations') return <IntegrationsView key="integrations" />;
    if (activeTab === 'api_keys') return <ApiKeysView key="api-keys" />;
    return <motion.div key="coming-soon" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="text-center py-20 text-zinc-500">Feature coming soon.</motion.div>;
  };

  return (
    <div className="flex h-screen w-full bg-[#0B0C10] text-zinc-200 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#111217] border-r border-zinc-800 flex flex-col h-full flex-shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-[#23b5b5] to-[#167878] mr-3 flex items-center justify-center text-black font-bold text-xs">E</div>
          <span className="font-bold text-lg text-white">Explified</span>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <div>
            <p className="px-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Dashboard</p>
            <div className="space-y-1">
              <SidebarLink id="overview" name="Store" icon={LayoutDashboard} />
              <SidebarLink id="integrations" name="My Integrations" icon={Plug} />
            </div>
          </div>
          <div>
            <p className="px-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Settings</p>
            <div className="space-y-1">
              <SidebarLink id="api_keys" name="Global API Keys" icon={Key} />
              <SidebarLink id="billing" name="Billing" icon={CreditCard} />
              <SidebarLink id="settings" name="Settings" icon={Settings} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0B0C10] relative">
        
        {/* Navbar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-800 bg-[#111217]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center text-sm font-medium text-zinc-400">
            <span className="cursor-pointer hover:text-white transition-colors" onClick={() => handleNavClick('overview')}>Explified</span>
            <ChevronLeft size={14} className="mx-2 rotate-180 opacity-50" />
            <span className="capitalize">{activeTab.replace('_', ' ')}</span>
            {selectedAppId && selectedApp && (
              <>
                <ChevronLeft size={14} className="mx-2 rotate-180 opacity-50" />
                <span className="text-white">{selectedApp.name}</span>
              </>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 cursor-pointer hover:border-zinc-500 transition-colors" />
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-0">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #27272a; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #3f3f46; }
      `}</style>
    </div>
  );
}