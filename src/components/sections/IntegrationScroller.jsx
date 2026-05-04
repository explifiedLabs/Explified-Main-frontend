import React from 'react';

// --- 1. Your Original Real SVG Tech Icons ---
const Icons = {
  Chrome: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#F4B400"/>
      <path d="M12 2L19.4641 14.866H4.5359L12 2Z" fill="#0F9D58"/>
      <path d="M12 22L4.5359 9.13397H19.4641L12 22Z" fill="#DB4437"/>
      <circle cx="12" cy="12" r="4.5" fill="#4285F4" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  Edge: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md">
      <path d="M2.5 12C2.5 17.2467 6.75329 21.5 12 21.5C17.2467 21.5 21.5 17.2467 21.5 12C21.5 6.75329 17.2467 2.5 12 2.5C9.7208 2.5 7.63604 3.29824 6 4.63604V9.5C6 11.433 7.567 13 9.5 13H15.5L12 18.5L8.5 15H6.5C6.5 18.0376 8.96243 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.99401 3.5 4.63583 6.27508 3.73244 10H8.5L12 4.5L15.5 10H9.5C8.11929 10 7 8.88071 7 7.5V6.36396C4.29824 7.63604 2.5 9.7208 2.5 12Z" fill="#35C1F1" />
    </svg>
  ),
  Figma: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md">
      <path d="M8 12C8 10.8954 8.89543 10 10 10H14V14H10C8.89543 14 8 13.1046 8 12Z" fill="#0ACF83" />
      <path d="M8 8C8 6.89543 8.89543 6 10 6H14V10H10C8.89543 10 8 9.10457 8 8Z" fill="#F24E1E" />
      <path d="M14 6H10V10H14V6Z" fill="#FF7262" />
      <path d="M14 10H10V14H14V10Z" fill="#A259FF" />
      <path d="M8 16C8 14.8954 8.89543 14 10 14V18C8.89543 18 8 17.1046 8 16Z" fill="#1ABCFE" />
    </svg>
  ),
  ClickUp: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md" fill="none">
      <path d="M12 3L2 10.5L4.5 14L12 8L19.5 14L22 10.5L12 3Z" fill="#7B68EE"/>
      <path d="M12 11L4.5 16.5L7 20L12 16L17 20L19.5 16.5L12 11Z" fill="#FF007F"/>
    </svg>
  ),
  OpenAI: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md" fill="currentColor">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-1.5606-3.2503 5.9928 5.9928 0 0 0-3.3246-1.5305 5.9822 5.9822 0 0 0-3.804.5369 5.9912 5.9912 0 0 0-2.3155-2.2217 6.0076 6.0076 0 0 0-4.008-.4305 5.9945 5.9945 0 0 0-3.1558 1.836 5.9839 5.9839 0 0 0-1.4287 3.3276 5.9814 5.9814 0 0 0 .6186 3.864 5.9961 5.9961 0 0 0 1.5606 3.2503 5.9945 5.9945 0 0 0 3.3246 1.5305 5.9839 5.9839 0 0 0 3.804-.5369 5.9945 5.9945 0 0 0 2.3155 2.2217 6.0076 6.0076 0 0 0 4.008.4305 5.9928 5.9928 0 0 0 3.1558-1.836 5.9822 5.9822 0 0 0 1.4287-3.3276 5.9839 5.9839 0 0 0-.6186-3.864Zm-7.149 7.7497a4.4172 4.4172 0 0 1-2.2908.455 4.398 4.398 0 0 1-2.1462-.7723l.116-.067.0988-.058 4.6738-2.7052a.7981.7981 0 0 0 .3944-.6836v-5.238l1.498 .865v4.204a4.414 4.414 0 0 1-2.344 3.9991Zm-7.792-1.936a4.4098 4.4098 0 0 1-.8065-2.21 4.4032 4.4032 0 0 1 1.0506-2.1648l.1177.0664.0987.0583 4.6738 2.7052a.7981.7981 0 0 0 .7872 0l4.538-2.617v1.728a4.414 4.414 0 0 1-2.344 4.001l-3.644 2.103a4.4156 4.4156 0 0 1-4.4714-3.6701Zm-1.3414-7.5855a4.4098 4.4098 0 0 1 1.4842-1.755 4.4064 4.4064 0 0 1 2.2908-.455l-.0017.1334v.115l5.41 3.12a.7981.7981 0 0 0 .7888 0l4.538-2.617-1.498-.865-3.644 2.103a4.4156 4.4156 0 0 1-3.5638-4.911Zm10.134-4.8856a4.4098 4.4098 0 0 1 2.2908-.455 4.398 4.398 0 0 1 2.1462.7723l-.116.067-.0988.058-4.6738 2.7052a.7981.7981 0 0 0-.3944.6836v5.238l-1.498-.865v-4.204a4.414 4.414 0 0 1 2.344-3.9991Zm7.792 1.936a4.4098 4.4098 0 0 1 .8065 2.21 4.4032 4.4032 0 0 1-1.0506 2.1648l-.1177-.0664-.0987-.0583-4.6738-2.7052a.7981.7981 0 0 0-.7872 0l-4.538 2.617v-1.728a4.414 4.414 0 0 1 2.344-4.001l3.644-2.103a4.4156 4.4156 0 0 1 4.4714 3.6701Zm1.3414 7.5855a4.4098 4.4098 0 0 1-1.4842 1.755 4.4064 4.4064 0 0 1-2.2908.455l.0017-.1334v-.115l-5.41-3.12a.7981.7981 0 0 0-.7888 0l-4.538 2.617 1.498.865 3.644-2.103a4.4156 4.4156 0 0 1 3.5638 4.911Z"/>
    </svg>
  ),
  Odoo: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md">
      <circle cx="12" cy="12" r="10" fill="#714B67" />
      <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="white"/>
    </svg>
  ),
  Penpot: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 17.5C15.0376 17.5 17.5 15.0376 17.5 12C17.5 8.96243 15.0376 6.5 12 6.5C8.96243 6.5 6.5 8.96243 6.5 12C6.5 15.0376 8.96243 17.5 12 17.5Z" fill="#FFFFFF"/>
      <circle cx="12" cy="12" r="5.5" fill="#3DCC8E"/>
    </svg>
  ),
  HubSpot: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.5 14L13 11.5L14.5 10L17 12.5L15.5 14ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15ZM10.5 10L8 12.5L9.5 14L12 11.5L10.5 10Z" fill="#FF7A59"/>
    </svg>
  ),
  Canva: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md">
      <circle cx="12" cy="12" r="10" fill="#00C4CC"/>
      <path d="M15 9C15 9 13.5 8 12 8C10.5 8 9 9.5 9 12C9 14.5 10.5 16 12 16C13.5 16 15 15 15 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  Webex: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#00BCEB" strokeWidth="2.5" />
      <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16" stroke="#98D600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Trello: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#0079BF" />
      <rect x="6" y="6" width="5" height="10" rx="1" fill="#FFFFFF" />
      <rect x="13" y="6" width="5" height="6" rx="1" fill="#FFFFFF" />
    </svg>
  ),
  Shopify: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md">
      <path d="M17.5 7H15.5C15.5 5.07 13.93 3.5 12 3.5C10.07 3.5 8.5 5.07 8.5 7H6.5C5.67 7 5 7.67 5 8.5V19.5C5 20.33 5.67 21 6.5 21H17.5C18.33 21 19 20.33 19 19.5V8.5C19 7.67 18.33 7 17.5 7ZM12 5.5C12.83 5.5 13.5 6.17 13.5 7H10.5C10.5 6.17 11.17 5.5 12 5.5Z" fill="#95BF47"/>
    </svg>
  ),
  Bubble: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md">
      <circle cx="12" cy="12" r="10" fill="#1A49E5" />
      <path d="M11.5 7V17M11.5 12C11.5 14.2091 13.2909 16 15.5 16C17.7091 16 19.5 14.2091 19.5 12C19.5 9.79086 17.7091 8 15.5 8C13.2909 8 11.5 9.79086 11.5 12Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
};

// --- 2. Single Combined Array ---
const ALL_LOGOS =[
  { name: "Chrome", Icon: Icons.Chrome },
  { name: "Edge", Icon: Icons.Edge },
  { name: "Figma", Icon: Icons.Figma },
  { name: "ClickUp", Icon: Icons.ClickUp },
  { name: "OpenAI", Icon: Icons.OpenAI },
  { name: "Odoo", Icon: Icons.Odoo },
  { name: "Penpot", Icon: Icons.Penpot },
  { name: "HubSpot", Icon: Icons.HubSpot },
  { name: "Canva", Icon: Icons.Canva },
  { name: "Webex", Icon: Icons.Webex },
  { name: "Trello", Icon: Icons.Trello },
  { name: "Shopify", Icon: Icons.Shopify },
  { name: "Bubble", Icon: Icons.Bubble },
];

const PremiumTechScroller = () => {
  return (
    <section className="relative w-full py-20 overflow-hidden bg-black z-10">
      
      {/* Subtle background ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* --- EXACY TAG FROM THE IMAGE --- */}
      <div className="flex justify-center mb-16 relative z-20">
        {/* Pill shaped border using exactly the cyan/teal hex */}
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-[#23b5b5]/40 bg-transparent">
          {/* Left Dot */}
          <span className="w-2 h-2 rounded-full bg-[#23b5b5]"></span>
          
          {/* Cyan Text */}
          <span className="text-xs md:text-sm font-bold tracking-[0.15em] uppercase text-[#23b5b5]">
            Official apps available on major marketplaces
          </span>
          
          {/* Right Dot */}
          <span className="w-2 h-2 rounded-full bg-[#23b5b5]"></span>
        </div>
      </div>

      {/* Scroller Container with WIDER transparent masks on edges (25% / 75%) */}
      <div 
        className="relative w-full max-w-[100vw] mx-auto z-10"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 25%, black 75%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 25%, black 75%, transparent)'
        }}
      >
        
        {/* Single Scrolling Row */}
        <div className="flex w-max animate-continuous-scroll hover:[animation-play-state:paused] items-center py-4">
          
          {/* Duplicating the array twice guarantees a perfectly seamless infinite scroll */}
          {[...ALL_LOGOS, ...ALL_LOGOS].map((item, index) => (
            <div 
              key={`${item.name}-${index}`} 
              className="flex items-center gap-3 w-[180px] md:w-[240px] shrink-0 group cursor-pointer text-neutral-600 transition-transform duration-300 hover:scale-105"
            >
              {/* Premium Grayscale to Full Color Hover Effect */}
              <div className="flex items-center justify-center grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                <item.Icon />
              </div>
              
              {/* Neutral Gray Text transitioning to Bright White with a slight text-shadow/glow */}
              <span className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300 whitespace-nowrap">
                {item.name}
              </span>
            </div>
          ))}

        </div>
      </div>

      {/* CSS Animation required for seamless infinite scrolling */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } 
        }
        .animate-continuous-scroll {
          /* 45s speed keeps it smooth and premium */
          animation: scroll 45s linear infinite;
        }
      `}} />
    </section>
  );
};

export default PremiumTechScroller;