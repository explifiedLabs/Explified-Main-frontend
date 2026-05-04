import { memo } from "react";

export const ExplifiedLogo = memo(() => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.0068 5.48513L4.9392 23.3283C3.65593 24.9566 4.67107 27.424 6.7495 27.6006L31.6253 29.7144C33.7431 29.8943 35.1557 27.6433 34.195 25.7483L22.9902 3.66443C22.1384 1.98457 19.8669 1.83853 19.0068 5.48513Z"
      fill="url(#paint0_linear)"
    />
    <path
      d="M19.0068 5.48513L4.9392 23.3283C3.65593 24.9566 4.67107 27.424 6.7495 27.6006L20.8171 9.75734C22.1004 8.12906 21.0852 5.66173 19.0068 5.48513Z"
      fill="#134E4A"
      fillOpacity="0.5"
    />
    <defs>
      <linearGradient id="paint0_linear" x1="19.5" y1="2" x2="19.5" y2="29" gradientUnits="userSpaceOnUse">
        <stop stopColor="#23B5B5" />
        <stop offset="1" stopColor="#0D5C5C" />
      </linearGradient>
    </defs>
  </svg>
));

export const GoogleIcon = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
));

export const Logo1 = memo(() => (
  <svg width="80" height="24" viewBox="0 0 100 30" fill="currentColor">
    <path d="M10,15 A5,5 0 1,0 20,15 A5,5 0 1,0 10,15 M25,10 h10 v10 h-10 z M40,15 l10,-5 v10 z M55,10 h5 v10 h-5 z M65,10 h15 M72.5,10 v10" />
  </svg>
));

export const Logo2 = memo(() => (
  <svg width="70" height="20" viewBox="0 0 100 30" fill="currentColor">
    <circle cx="15" cy="15" r="10" />
    <rect x="30" y="5" width="40" height="20" rx="5" />
  </svg>
));

export const Logo3 = memo(() => (
  <svg width="85" height="22" viewBox="0 0 100 30" fill="currentColor">
    <path d="M5,15 L20,5 L35,15 L20,25 Z M40,10 h30 v10 h-30 z M75,5 v20 M85,5 v20 M95,5 v20" />
  </svg>
));