import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool, ShoppingBag, Chrome, Trello, BookOpen, Layers, Framer, CheckSquare, Globe, MonitorPlay,
  Search, Plus, ArrowRight, Download, Star, Sparkles, 
  LayoutDashboard, Plug, Key, Settings, CreditCard, Activity, Copy, Eye, Bell, ExternalLink
} from 'lucide-react';

// --- MOCK DATA & NAVIGATION ---
const platforms = [
  { id: 'figma', name: 'Figma', icon: PenTool, color: 'from-[#F24E1E]/20 to-[#A259FF]/20' },
  { id: 'shopify', name: 'Shopify', icon: ShoppingBag, color: 'from-[#95BF47]/20 to-[#5E8E3E]/20' },
  { id: 'chrome', name: 'Chrome', icon: Chrome, color: 'from-[#4285F4]/20 to-[#0F9D58]/20' },
  { id: 'atlassian', name: 'Atlassian', icon: Trello, color: 'from-[#0052CC]/20 to-[#2684FF]/20' },
];

const mockApps = [
  { id: 1, platformId: 'figma', name: 'Wireframe Pro', desc: 'Instantly generate high-fidelity wireframes.', installs: '12.4k', rating: 4.9, isNew: true },
  { id: 2, platformId: 'figma', name: 'ColorSync', desc: 'Sync your brand colors across all Figma files.', installs: '5.2k', rating: 4.7, isNew: false },
  { id: 3, platformId: 'shopify', name: 'CartBoost', desc: 'Increase conversions with smart cart upsells.', installs: '3.4k', rating: 4.8, isNew: true },
  { id: 4, platformId: 'shopify', name: 'ReviewAI', desc: 'Auto-moderate and highlight best reviews.', installs: '8.1k', rating: 4.5, isNew: false },
  { id: 5, platformId: 'chrome', name: 'TabFlow', desc: 'Organize messy tabs into workspaces.', installs: '45k', rating: 4.9, isNew: false },
  { id: 6, platformId: 'atlassian', name: 'AgileSprint', desc: 'Advanced sprint metrics for Jira.', installs: '9k', rating: 4.6, isNew: true },
];

const mainNav = [
  { id: 'overview', name: 'Overview', icon: LayoutDashboard },
  { id: 'integrations', name: 'My Integrations', icon: Plug },
];

const systemNav = [
  { id: 'api_keys', name: 'API Keys', icon: Key },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'settings', name: 'Settings', icon: Settings },
];

// --- ANIMATIONS ---
const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function FullDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Helper to render sidebar links
  const SidebarLink = ({ item }) => {
    const isActive = activeTab === item.id;
    const Icon = item.icon;
    return (
      <button
        onClick={() => setActiveTab(item.id)}
        className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium group"
      >
        {isActive && (
          <motion.div 
            layoutId="active-sidebar-pill"
            className="absolute inset-0 bg-[#23b5b5]/10 border border-[#23b5b5]/20 rounded-xl"
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          />
        )}
        <Icon size={18} className={`relative z-10 transition-colors ${isActive ? 'text-[#23b5b5]' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
        <span className={`relative z-10 transition-colors ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
          {item.name}
        </span>
      </button>
    );
  };

  // --- SUB-COMPONENTS FOR DIFFERENT VIEWS ---

  const OverviewView = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-6xl mx-auto space-y-12">
      
      {/* Top Metrics Section */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Total API Requests", value: "1.2M", up: "+14.5%", icon: Activity },
            { title: "Active Installations", value: "84,392", up: "+5.2%", icon: Download },
            { title: "Total Revenue", value: "$12,450", up: "+22.4%", icon: CreditCard }
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants} className="bg-zinc-900/40 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl hover:border-[#23b5b5]/40 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-zinc-800 rounded-lg group-hover:scale-110 transition-transform"><stat.icon size={18} className="text-[#23b5b5]" /></div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">{stat.up}</span>
              </div>
              <h3 className="text-zinc-400 text-sm font-medium">{stat.title}</h3>
              <p className="text-3xl font-bold text-white mt-1 tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Marketplaces & Apps Overview Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Ecosystem Activity</h2>
            <p className="text-zinc-400 text-sm mt-1">A quick look at all your apps across different platforms.</p>
          </div>
          <button className="text-sm font-medium text-[#23b5b5] hover:text-white transition-colors flex items-center gap-1">
            View Analytics <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {platforms.map((platform) => {
            const platformApps = mockApps.filter(app => app.platformId === platform.id);
            const PlatformIcon = platform.icon;
            
            return (
              <motion.div key={platform.id} variants={itemVariants} className="bg-zinc-900/30 backdrop-blur-md border border-white/[0.05] rounded-3xl p-6 flex flex-col hover:border-white/[0.1] transition-colors">
                
                {/* Platform Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${platform.color} border border-white/10 shadow-inner`}>
                      <PlatformIcon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                      <p className="text-xs font-medium text-zinc-500 mt-0.5">{platformApps.length} Active App{platformApps.length !== 1 && 's'}</p>
                    </div>
                  </div>
                  {/* Clicking Manage redirects directly to that marketplace tab */}
                  <button onClick={() => setActiveTab(platform.id)} className="text-xs font-semibold bg-white/5 hover:bg-[#23b5b5] hover:text-black text-zinc-300 px-4 py-2 rounded-xl transition-all border border-white/10 hover:border-[#23b5b5]">
                    Manage
                  </button>
                </div>
                
                {/* Apps List for this Platform */}
                <div className="space-y-3 flex-1">
                  {platformApps.length > 0 ? platformApps.map(app => (
                    <div key={app.id} onClick={() => setActiveTab(platform.id)} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950/50 border border-white/[0.02] hover:border-[#23b5b5]/30 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/[0.05] group-hover:scale-105 transition-transform">
                          <PlatformIcon size={16} className="text-zinc-400 group-hover:text-[#23b5b5] transition-colors" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{app.name}</h4>
                            {app.isNew && <span className="w-1.5 h-1.5 rounded-full bg-[#23b5b5] animate-pulse" />}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[11px] text-zinc-500 flex items-center gap-1"><Download size={10} className="text-zinc-600" /> {app.installs}</span>
                            <span className="text-[11px] text-zinc-500 flex items-center gap-1"><Star size={10} className="text-yellow-500/80" /> {app.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-[#23b5b5]/10 rounded-lg text-[#23b5b5]">
                        <ExternalLink size={16} />
                      </div>
                    </div>
                  )) : (
                    // Empty state if platform has no apps
                    <div className="h-full flex flex-col items-center justify-center py-8 text-center border border-dashed border-white/[0.05] rounded-2xl bg-zinc-950/30">
                      <Layers size={24} className="text-zinc-600 mb-2" />
                      <p className="text-sm text-zinc-400">No apps deployed yet.</p>
                      <button onClick={() => setActiveTab(platform.id)} className="text-xs text-[#23b5b5] hover:text-white mt-2 transition-colors">Create your first app</button>
                    </div>
                  )}
                </div>

              </motion.div>
            )
          })}
        </div>
      </div>

    </motion.div>
  );

  const ApiKeysView = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">API Keys</h1>
          <p className="text-zinc-400">Manage your secret keys for external integrations.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#23b5b5] hover:bg-[#1ea1a1] text-black font-semibold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(35,181,181,0.2)]">
          <Plus size={18} /> Create Key
        </button>
      </div>
      <motion.div variants={itemVariants} className="bg-zinc-900/40 border border-white/[0.05] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.05] bg-zinc-900/80">
              <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Key Name</th>
              <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Token</th>
              <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Created</th>
              <th className="p-4 text-xs font-semibold text-zinc-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {['Production Main', 'Staging Test Key', 'Zapier Webhooks'].map((key, i) => (
              <tr key={i} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                <td className="p-4 text-sm font-medium text-white">{key}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs bg-zinc-950 px-3 py-1.5 rounded-lg border border-white/[0.05] w-max">
                    sk_live_••••••••••••••••
                    <Eye size={14} className="hover:text-[#23b5b5] cursor-pointer ml-2 transition-colors" />
                  </div>
                </td>
                <td className="p-4 text-sm text-zinc-500">Oct 24, 2023</td>
                <td className="p-4 flex justify-end gap-2">
                  <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"><Copy size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );

  const SettingsView = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Workspace Settings</h1>
      <p className="text-zinc-400 mb-8">Manage your organization details and preferences.</p>
      
      <div className="space-y-6">
        <motion.div variants={itemVariants} className="bg-zinc-900/40 border border-white/[0.05] p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">General Info</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Workspace Name</label>
              <input type="text" defaultValue="Nexus Enterprise" className="w-full bg-zinc-950 border border-white/[0.1] text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#23b5b5] text-zinc-200 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Support Email</label>
              <input type="email" defaultValue="hello@nexus.dev" className="w-full bg-zinc-950 border border-white/[0.1] text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#23b5b5] text-zinc-200 transition-colors" />
            </div>
          </div>
          <button className="mt-6 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm">Save Changes</button>
        </motion.div>
      </div>
    </motion.div>
  );

  const MarketplaceView = () => {
    const activeData = platforms.find(p => p.id === activeTab);
    const currentApps = mockApps.filter(app => app.platformId === activeTab);

    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-6xl mx-auto">
        <div className="relative h-48 w-full rounded-3xl overflow-hidden mb-10 border border-white/[0.08] flex flex-col justify-end p-8 group">
          <div className={`absolute inset-0 bg-gradient-to-r ${activeData?.color} opacity-20 group-hover:opacity-30 transition-opacity duration-700`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  {activeData && <activeData.icon size={24} className="text-white" />}
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">{activeData?.name} <span className="text-zinc-500 font-light">Ecosystem</span></h1>
              </div>
              <p className="text-zinc-400 text-sm max-w-lg mt-3">Supercharge your {activeData?.name} workflow with our premium suite of custom tools.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentApps.length > 0 ? currentApps.map((app) => {
            const AppIcon = platforms.find(p => p.id === app.platformId)?.icon;
            return (
              <motion.div key={app.id} variants={itemVariants} className="group relative bg-zinc-900/40 backdrop-blur-sm border border-white/[0.05] rounded-2xl p-6 flex flex-col hover:border-[#23b5b5]/40 transition-all hover:shadow-[0_8px_30px_-12px_rgba(35,181,181,0.2)]">
                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-white/[0.05] group-hover:scale-110 transition-transform">
                    {AppIcon && <AppIcon size={24} className="text-zinc-300 group-hover:text-white transition-colors" />}
                  </div>
                  {app.isNew && <span className="text-[10px] font-bold text-[#23b5b5] bg-[#23b5b5]/10 px-2 py-1 rounded-full border border-[#23b5b5]/20 flex items-center gap-1"><Sparkles size={10} /> NEW</span>}
                </div>
                <div className="relative z-10 flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#23b5b5] transition-colors">{app.name}</h3>
                  <p className="text-sm text-zinc-400 mb-6 leading-relaxed">{app.desc}</p>
                </div>
                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/[0.05]">
                  <div className="flex gap-4 text-xs font-medium text-zinc-500">
                    <span className="flex items-center gap-1.5"><Download size={14} /> {app.installs}</span>
                    <span className="flex items-center gap-1.5 text-yellow-500/80"><Star size={14} fill="currentColor" /> {app.rating}</span>
                  </div>
                  <button className="text-sm font-semibold text-white bg-white/5 hover:bg-[#23b5b5] hover:text-black px-4 py-2 rounded-lg transition-all border border-white/10 hover:border-[#23b5b5]">Install</button>
                </div>
              </motion.div>
            );
          }) : (
            <div className="col-span-full py-20 text-center border border-dashed border-white/[0.1] rounded-3xl bg-zinc-900/20">
              <Layers size={32} className="mx-auto text-zinc-500 mb-4" />
              <h3 className="text-xl font-bold text-white">No integrations yet</h3>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Switch statement to decide what gets rendered in the main area
  const renderContent = () => {
    if (activeTab === 'overview') return <OverviewView key="overview" />;
    if (activeTab === 'api_keys') return <ApiKeysView key="api_keys" />;
    if (activeTab === 'settings') return <SettingsView key="settings" />;
    if (platforms.find(p => p.id === activeTab)) return <MarketplaceView key={activeTab} />;
    
    // Fallback for empty tabs
    return (
      <motion.div key="wip" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="py-20 text-center">
        <Activity size={48} className="mx-auto text-zinc-700 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
        <p className="text-zinc-500">This section is currently under development.</p>
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] text-zinc-200 font-sans selection:bg-[#23b5b5]/30 overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#23b5b5]/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#23b5b5]/5 blur-[150px] pointer-events-none" />

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-[#09090b]/80 backdrop-blur-xl border-r border-white/[0.05] flex flex-col h-full z-10 flex-shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-white/[0.05]">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#23b5b5] to-[#167878] shadow-[0_0_15px_rgba(35,181,181,0.4)] mr-3">
            <Layers size={16} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">Explified</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
          <div>
            <p className="px-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Dashboard</p>
            <div className="space-y-1">{mainNav.map(item => <SidebarLink key={item.id} item={item} />)}</div>
          </div>
          <div>
            <p className="px-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">App Marketplace</p>
            <div className="space-y-1">{platforms.map(item => <SidebarLink key={item.id} item={item} />)}</div>
          </div>
          <div>
            <p className="px-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Developer & Settings</p>
            <div className="space-y-1">{systemNav.map(item => <SidebarLink key={item.id} item={item} />)}</div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/[0.05] bg-[#050505]/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center text-sm font-medium text-zinc-500">
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Admin</span>
            <ArrowRight size={14} className="mx-2 opacity-50" />
            <span className="text-[#23b5b5] drop-shadow-[0_0_8px_rgba(35,181,181,0.3)] capitalize">
              {activeTab.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#23b5b5] transition-colors" />
              <input type="text" placeholder="Search across dashboard..." className="bg-zinc-900/50 border border-white/[0.05] text-sm rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-[#23b5b5]/50 text-zinc-200 placeholder:text-zinc-600 shadow-inner" />
            </div>
            <button className="relative text-zinc-400 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#23b5b5] rounded-full border border-[#050505]"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500 border border-white/[0.1] cursor-pointer" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 pb-24 custom-scrollbar">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}