import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router';
import * as LucideIcons from 'lucide-react';
import { useCMS } from '../../hooks/useCMS.jsx';
import logo from "../../assets/logo.png" 

const SCHEDULE_CALL_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf3E-9_WpCdMKM38mh5FL0GQq7frinMK4lRJTucASeXTQ55dw/viewform";

const BrandIcon = ({ name, className = "w-7 h-7" }) => {
  const icons = {
    'AWS': <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M17.5 18C17.5 18 15 20 12 20C8 20 5 17 5 17" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" /><path d="M6 10L9 5L12 10L15 5L18 10" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    'Snowflake': <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M12 2V6M12 18V22" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round" /><path d="M3.34 7L6.8 9M17.2 15L20.66 17" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round" /><path d="M3.34 17L6.8 15M17.2 9L20.66 7" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round" /><path d="M12 10L10 9L12 6L14 9L12 10Z" fill="#29B5E8" /></svg>,
    'Salesforce': <svg viewBox="0 0 24 24" fill="none" className={className}><path d="M16.5 7C16.5 4.79 14.71 3 12.5 3C10.74 3 9.25 4.13 8.71 5.7C8.32 5.57 7.92 5.5 7.5 5.5C4.46 5.5 2 7.96 2 11C2 13.57 3.81 15.73 6.22 16.34C6.72 19.52 9.5 22 12.8 22C16.78 22 20 18.78 20 14.8C20 14.61 19.99 14.43 19.98 14.25C21.14 13.44 22 12 22 10.3C22 7.93 20.07 6 17.7 6C17.31 6 16.93 6.05 16.57 6.15C16.5 6.43 16.5 6.71 16.5 7Z" fill="#00A1E0" /></svg>,
    'Zapier': <svg viewBox="0 0 24 24" fill="none" className={className}><rect width="24" height="24" rx="4" fill="#FF4F00" /><path d="M7 11H13L11 19L19 9H13L15 3L7 11Z" fill="white" /></svg>,
    'HubSpot': <svg viewBox="0 0 24 24" fill="none" className={className}><circle cx="12" cy="12" r="10" fill="#FF7A59" /><path d="M12 6V10M12 14V18M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
  };
  return icons[name] || null;
};

const ItemIcon = ({ item }) => {
  const iconUrl = item.iconUrl || item.imageUrl;
  if (iconUrl) {
    return <img src={iconUrl} alt="icon" className="w-full h-full object-contain p-1 relative z-10" />;
  }
  const rawName = item.iconName || item.title || "Box";
  const brand = BrandIcon({ name: rawName });
  if (brand) return brand;

  const toPascalCase = (str) => str.replace(/[-_ ]+/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  const pascalName = toPascalCase(rawName);
  const IconComponent = LucideIcons[rawName] || LucideIcons[pascalName] || LucideIcons.Box;

  return <IconComponent size={24} className="text-[#23b5b5] group-hover:text-white transition-colors duration-300 relative z-10" />;
};

const Badge = ({ text }) => {
  if (!text) return null;
  return (
    <span className="inline-flex items-center justify-center px-1.5 py-0.5 bg-[#23b5b5] text-black text-[10px] font-bold uppercase rounded-md tracking-wide leading-none ml-1.5 shrink-0">
      {text}
    </span>
  );
};

const Navbar = () => {
  const { data } = useCMS();
  const headerData = data?.header || {};

  // UPDATED LOGIC: Lab first, Products center, Explore end
  const headerKeys = Object.keys(headerData).sort((a, b) => {
    const keyA = a.toLowerCase();
    const keyB = b.toLowerCase();

    // 1. Explicitly set order for the main three
    const orderMap = { 'lab': 1, 'labs': 1, 'products': 2, 'product': 2, 'explore': 3 };
    
    if (orderMap[keyA] !== undefined && orderMap[keyB] !== undefined) {
      return orderMap[keyA] - orderMap[keyB];
    }

    // 2. Logic for others: Dropdowns (items/content) stay in the middle, simple links on edges
    const hasContent = (key) => {
        const val = headerData[key];
        if (!val || typeof val !== 'object') return false;
        return Object.entries(val).some(([k, v]) => k !== 'url' && k !== 'openInNewTab' && v && typeof v === 'object' && !Array.isArray(v)) || Array.isArray(val.items);
    };

    const aHas = hasContent(a);
    const bHas = hasContent(b);

    if (aHas && !bHas) return 0; // Dropdown stays centered relative to simple links
    if (!aHas && bHas) return -1; // Move simple links towards the left if not categorized

    return 0;
  });

  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState(null);
  const [activeProductTab, setActiveProductTab] = useState('');

  const getGroupsFromMenu = (menuKey) => {
    const menuObj = headerData[menuKey];
    if (!menuObj || typeof menuObj !== 'object') return [];
    return Object.entries(menuObj)
      .filter(([key, val]) => {
        if (key === 'url' || key === 'openInNewTab') return false; 
        if (!val || typeof val !== 'object' || Array.isArray(val)) return false;
        return val.title || Array.isArray(val.items) || val.imageUrl || val.iconUrl;
      })
      .map(([key, groupData]) => ({
        ...groupData,
        groupKey: key,
        title: groupData.title || key,
        items: Array.isArray(groupData.items) ? groupData.items : []
      }));
  };

  const getFlatItemsFromMenu = (menuKey) => {
    const menuObj = headerData[menuKey];
    if (!menuObj || !Array.isArray(menuObj.items)) return [];
    return menuObj.items;
  };

  useEffect(() => {
    if (hoveredMenu) {
      const groups = getGroupsFromMenu(hoveredMenu);
      if (groups.length > 0) {
        if (!activeProductTab || !groups.find(g => g.title === activeProductTab)) {
          setActiveProductTab(groups[0].title);
        }
      }
    }
  }, [hoveredMenu, headerData]);

  const handleCategoryClick = (menuKey) => {
    const category = headerData[menuKey];
    const categoryUrl = category?.url;
    if (categoryUrl) {
      if (category.openInNewTab) {
        window.open(categoryUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = categoryUrl;
      }
    }
  };

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #050505; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #333333; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444444; }
  `;

  return (
    <nav
      onMouseLeave={() => setHoveredMenu(null)}
      className={`absolute top-0 inset-x-0 z-[100] py-5 pointer-events-none transition-colors duration-300 ${isMobileMenuOpen ? 'bg-[#05070A]' : ''}`}
    >
      <style>{scrollbarStyles}</style>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-3 items-center relative z-50 pointer-events-auto">

        {/* LOGO */}
        <div className="flex justify-start">
            <RouterLink to="/" className="flex items-center gap-3 group shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
                <img src={logo} className='w-11 h-11 lg:w-12 lg:h-12' alt="Logo" />
                <span className="text-2xl font-bold text-white tracking-tight group-hover:text-[#23b5b5] transition-colors duration-300">Explified</span>
            </RouterLink>
        </div>

        {/* MENU - Desktop */}
        <div className="hidden lg:flex items-center justify-center gap-4 relative z-50">
          {headerKeys.map((menuKey) => {
            const groups = getGroupsFromMenu(menuKey);
            const flatItems = getFlatItemsFromMenu(menuKey);
            const hasContent = groups.length > 0 || flatItems.length > 0;

            const menuTitle = menuKey.charAt(0).toUpperCase() + menuKey.slice(1);
            const isHovered = hoveredMenu === menuKey;
            const useSideTabUI = menuKey.toLowerCase() === 'products' || groups.length > 4;
            const hasUrl = !!headerData[menuKey]?.url;

            const resolvedGroups = groups.length > 0
              ? groups
              : flatItems.length > 0
                ? [{ groupKey: menuKey, title: menuTitle, items: flatItems }]
                : [];

            return (
              <div key={menuKey} className="relative z-50" onMouseEnter={() => hasContent ? setHoveredMenu(menuKey) : null}>
                <button
                  onClick={() => handleCategoryClick(menuKey)}
                  className={`px-4 py-2 text-base font-semibold flex items-center gap-1.5 transition-colors ${isHovered ? 'text-white' : 'text-gray-300 hover:text-white'} ${hasUrl ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {menuTitle} {hasContent && <LucideIcons.ChevronDown size={16} className={`transition-transform duration-300 ${isHovered ? 'rotate-180 text-[#23b5b5]' : ''}`} />}
                </button>

                {useSideTabUI ? (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[92vw] max-w-6xl transition-all duration-300 origin-top z-50 ${isHovered ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'}`}>
                    <div className="bg-[#0A0A0C]/98 backdrop-blur-3xl rounded-xl border border-white/10 shadow-2xl flex overflow-hidden h-[600px] max-h-[75vh]">
                      <div className="w-72 bg-[#050507]/50 border-r border-white/5 p-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                        {resolvedGroups.map((group) => (
                          <button
                            key={group.title}
                            onMouseEnter={() => setActiveProductTab(group.title)}
                            className={`flex items-center gap-3 text-left px-4 py-3 text-[15px] font-semibold rounded-lg transition-all duration-300 ${activeProductTab === group.title ? 'text-[#23b5b5] bg-[#23b5b5]/10 shadow-[inset_0_0_20px_rgba(35,181,181,0.05)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                          >
                            {group.imageUrl ? (
                              <img src={group.imageUrl} alt="" className={`w-6 h-6 object-contain rounded transition-opacity ${activeProductTab === group.title ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`} />
                            ) : (
                              <LucideIcons.Layers size={18} className={activeProductTab === group.title ? 'text-[#23b5b5]' : 'text-gray-600'} />
                            )}
                            <span className="flex-1 truncate">{group.title}</span>
                          </button>
                        ))}
                      </div>
                      <div className="flex-1 p-8 overflow-y-auto relative bg-[#0F141A]/30 custom-scrollbar">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-bold text-white uppercase tracking-widest">{activeProductTab}</h3>
                          <Badge text={resolvedGroups.find(g => g.title === activeProductTab)?.tag} />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          {(resolvedGroups.find(g => g.title === activeProductTab)?.items || []).map((item, idx) => (
                            <a 
                              key={idx} 
                              href={item.url || "#"} 
                              target={item.openInNewTab ? "_blank" : "_self"} 
                              rel="noopener noreferrer" 
                              className="group flex items-start gap-4 p-4 rounded-xl hover:bg-[#23b5b5]/5 border border-transparent hover:border-[#23b5b5]/20 transition-all duration-300"
                            >
                              <div className="w-12 h-12 shrink-0 rounded-xl bg-[#121214] border border-white/10 flex items-center justify-center group-hover:border-[#23b5b5]/50 overflow-hidden transition-colors"><ItemIcon item={item} /></div>
                              <div className="min-w-0 flex-1">
                                <div className="text-[15px] font-bold text-gray-200 group-hover:text-[#23b5b5] transition-colors leading-snug flex items-center">{item.title} <Badge text={item.tag} /></div>
                                <div className="text-[13px] text-gray-500 mt-1 line-clamp-2 group-hover:text-gray-400">{item.desc}</div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 origin-top z-50 ${isHovered ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'}`} style={{ width: resolvedGroups.length <= 2 ? '700px' : '1000px' }}>
                    <div className="bg-[#0A0A0C]/98 backdrop-blur-3xl rounded-xl border border-white/10 shadow-2xl p-8 grid gap-10 max-h-[75vh] overflow-y-auto custom-scrollbar" style={{ gridTemplateColumns: `repeat(${resolvedGroups.length}, minmax(0, 1fr))` }}>
                      {resolvedGroups.map((group) => (
                        <div key={group.title}>
                          <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-3">
                            {group.imageUrl && (
                              <div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center p-1">
                                <img src={group.imageUrl} alt="" className="w-full h-full object-contain" />
                              </div>
                            )}
                            <span className="text-[11px] font-bold uppercase tracking-widest text-[#23b5b5] opacity-80">{group.title}</span>
                            <Badge text={group.tag} />
                          </div>
                          <div className="space-y-2">
                            {group.items.map((item, idx) => (
                              <a 
                                key={idx} 
                                href={item.url || "#"} 
                                target={item.openInNewTab ? "_blank" : "_self"} 
                                rel="noopener noreferrer" 
                                className="group flex items-center gap-4 p-2.5 rounded-xl hover:bg-[#23b5b5]/5 transition-all"
                              >
                                <div className="w-11 h-11 rounded-full bg-[#121417] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden group-hover:border-[#23b5b5]/50 transition-colors"><ItemIcon item={item} /></div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-[15px] font-bold text-gray-200 group-hover:text-white transition-colors truncate">{item.title} <Badge text={item.tag} /></div>
                                  <div className="text-[12.5px] text-gray-500 mt-0.5 line-clamp-1 group-hover:text-gray-400">{item.desc}</div>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT SLOT */}
        <div className="flex items-center justify-end gap-3">
            <a href={SCHEDULE_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#23b5b5] hover:bg-[#1da0a0] text-black text-sm font-bold tracking-wide transition-all duration-300 hover:shadow-[0_0_20px_rgba(35,181,181,0.4)] active:scale-95"
          >
            <LucideIcons.CalendarDays size={15} />
            Schedule a Call
          </a>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-white transition-transform active:scale-90">
            <LucideIcons.Menu size={32} />
          </button>
        </div>
      </div>

      {/* --- MOBILE --- */}
      <div className={`lg:hidden w-full bg-[#05070A] border-t border-white/10 overflow-y-auto transition-all duration-300 custom-scrollbar pointer-events-auto ${isMobileMenuOpen ? 'opacity-100 visible max-h-[100vh]' : 'opacity-0 invisible max-h-0'}`}>
        <div className="px-6 py-8 flex flex-col gap-5 pb-24">
          {headerKeys.map((menuKey) => {
            const groups = getGroupsFromMenu(menuKey);
            const flatItems = getFlatItemsFromMenu(menuKey);
            const hasContent = groups.length > 0 || flatItems.length > 0;

            const resolvedGroups = groups.length > 0
              ? groups
              : flatItems.length > 0
                ? [{ groupKey: menuKey, title: menuKey.charAt(0).toUpperCase() + menuKey.slice(1), items: flatItems }]
                : [];

            const isExpanded = mobileExpandedMenu === menuKey;
            const hasUrl = !!headerData[menuKey]?.url;

            return (
              <div key={menuKey} className="border-b border-white/5 pb-3">
                <div className="w-full flex items-center justify-between py-4">
                  <span
                    onClick={() => handleCategoryClick(menuKey)}
                    className={`text-2xl font-bold text-white ${hasUrl ? 'cursor-pointer hover:text-[#23b5b5]' : ''}`}
                  >
                    {menuKey.charAt(0).toUpperCase() + menuKey.slice(1)}
                  </span>
                  {hasContent && (
                    <button onClick={() => setMobileExpandedMenu(isExpanded ? null : menuKey)}>
                      <LucideIcons.ChevronDown size={24} className={`transition-transform ${isExpanded ? 'rotate-180 text-[#23b5b5]' : 'text-gray-500'}`} />
                    </button>
                  )}
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[5000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-[#0A0C10]/60 rounded-2xl border border-white/5 p-6 space-y-12 mb-6">
                    {resolvedGroups.map((group) => (
                      <div key={group.title}>
                        <div className="flex items-center gap-2.5 mb-8">
                          {group.imageUrl ? <img src={group.imageUrl} alt="" className="w-5 h-5 object-contain" /> : <LucideIcons.Layers size={16} className="text-[#23b5b5]" />}
                          <h4 className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#23b5b5]">{group.title}</h4>
                          <Badge text={group.tag} />
                        </div>
                        <div className="space-y-8">
                          {group.items.map((item, idx) => (
                            <a 
                              key={idx} 
                              href={item.url || "#"} 
                              target={item.openInNewTab ? "_blank" : "_self"} 
                              rel="noopener noreferrer" 
                              onClick={() => setIsMobileMenuOpen(false)} 
                              className="flex items-center gap-5 group active:opacity-70 transition-opacity"
                            >
                              <div className="w-12 h-12 rounded-full bg-[#121417] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden transition-colors"><ItemIcon item={item} /></div>
                              <div className="flex flex-col min-w-0">
                                <div className="text-lg font-bold text-white leading-tight flex items-center truncate">{item.title}</div>
                                <div className="text-[14px] text-gray-500 mt-1.5 line-clamp-1">{item.desc}</div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <a href={SCHEDULE_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#23b5b5] hover:bg-[#1da0a0] text-black text-base font-bold tracking-wide transition-all duration-300 active:scale-95 mt-2"
          >
            <LucideIcons.CalendarDays size={18} />
            Schedule a Call
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;