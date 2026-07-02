import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MessageSquare, Paperclip } from "lucide-react";
import { Link } from "react-router";

// --- 1. Real Brand Logos (Dashboard Icons) ---
const Logos = {
  Zoom: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <path
        d="M14 8C14 7.44772 13.5523 7 13 7H4C3.44772 7 3 7.44772 3 8V16C3 16.5523 3.44772 17 4 17H13C13.5523 17 14 16.5523 14 16V8Z"
        fill="#2D8CFF"
      />
      <path d="M19.5 8.5L15 11V13L19.5 15.5V8.5Z" fill="#2D8CFF" />
    </svg>
  ),
  Excel: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#217346" />
      <path
        d="M10 10L14 14M14 10L10 14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M7 4V20" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </svg>
  ),
  Teams: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="#6264A7" />
      <path
        d="M8 10C8 8.89543 8.89543 8 10 8H14C15.1046 8 16 8.89543 16 10V14H8V10Z"
        fill="white"
        fillOpacity="0.8"
      />
      <circle cx="12" cy="11" r="2" fill="#6264A7" />
    </svg>
  ),
  Outlook: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="#0078D4" />
      <path d="M12 12L4 7V17H20V7L12 12Z" fill="white" fillOpacity="0.5" />
      <path
        d="M15 7H19C19.55 7 20 7.45 20 8V9L12 14L4 9V8C4 7.45 4.45 7 5 7H9"
        fill="white"
        fillOpacity="0.2"
      />
    </svg>
  ),
  Word: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#2B579A" />
      <path
        d="M7 8L9 16L12 10L15 16L17 8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Figma: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <path
        d="M8 12C8 10.8954 8.89543 10 10 10H14V14H10C8.89543 14 8 13.1046 8 12Z"
        fill="#0ACF83"
      />
      <path
        d="M8 8C8 6.89543 8.89543 6 10 6H14V10H10C8.89543 10 8 9.10457 8 8Z"
        fill="#F24E1E"
      />
      <path d="M14 6H10V10H14V6Z" fill="#FF7262" />
      <path d="M14 10H10V14H14V10Z" fill="#A259FF" />
      <path
        d="M8 16C8 14.8954 8.89543 14 10 14V18C8.89543 18 8 17.1046 8 16Z"
        fill="#1ABCFE"
      />
    </svg>
  ),
  Slack: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <path
        d="M6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10H8V14H6Z"
        fill="#E01E5A"
      />
      <path
        d="M10 6C10 4.89543 10.8954 4 12 4C13.1046 4 14 4.89543 14 6V8H10V6Z"
        fill="#36C5F0"
      />
      <path
        d="M18 10C19.1046 10 20 10.8954 20 12C20 13.1046 19.1046 14 18 14H16V10H18Z"
        fill="#2EB67D"
      />
      <path
        d="M14 18C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18V16H14V18Z"
        fill="#ECB22E"
      />
      <rect x="10" y="10" width="4" height="4" rx="1" fill="white" />
    </svg>
  ),
  Gmail: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <path
        d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
        fill="#FFFFFF"
      />
      <path d="M4 6L12 12L20 6" stroke="#EA4335" strokeWidth="2.5" />
      <path d="M20 6V18" stroke="#EA4335" strokeWidth="1.5" />
      <path d="M4 6V18" stroke="#EA4335" strokeWidth="1.5" />
    </svg>
  ),
  Google: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <path
        d="M21.5 12.2C21.5 11.3 21.4 10.5 21.3 9.8H12V14.4H17.4C17.2 15.9 16.3 17.2 15 18.1V21H18.2C20.1 19.3 21.5 16.8 21.5 12.2Z"
        fill="#4285F4"
      />
      <path
        d="M12 21.9C14.7 21.9 16.9 21 18.5 19.5L15.3 16.6C14.4 17.2 13.3 17.6 12 17.6C9.5 17.6 7.4 15.9 6.6 13.6H3.3V16.6C4.9 19.8 8.2 21.9 12 21.9Z"
        fill="#34A853"
      />
      <path
        d="M6.6 13.6C6.4 13 6.3 12.3 6.3 11.6C6.3 10.9 6.4 10.2 6.6 9.6V6.6H3.3C2.7 7.9 2.3 9.3 2.3 10.9C2.3 12.5 2.7 13.9 3.3 15.2L6.6 13.6Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.5C13.5 5.5 14.8 6 15.8 7L18.6 4.3C16.9 2.7 14.7 1.8 12 1.8C8.2 1.8 4.9 3.9 3.3 7.1L6.6 10.1C7.4 7.8 9.5 5.5 12 5.5Z"
        fill="#EA4335"
      />
    </svg>
  ),
  Jira: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <path
        d="M10.84 4.14a1.87 1.87 0 0 0-2.64 0l-4.14 4.14a1.87 1.87 0 0 0 0 2.64l4.14 4.14a1.87 1.87 0 0 0 2.64 0l4.14-4.14a1.87 1.87 0 0 0 0-2.64l-4.14-4.14zM15.54 8.84a1.87 1.87 0 0 0-2.64 0l-4.14 4.14a1.87 1.87 0 0 0 0 2.64l4.14 4.14a1.87 1.87 0 0 0 2.64 0l4.14-4.14a1.87 1.87 0 0 0 0-2.64l-4.14-4.14zM20.24 13.54a1.87 1.87 0 0 0-2.64 0l-4.14 4.14a1.87 1.87 0 0 0 0 2.64l4.14 4.14a1.87 1.87 0 0 0 2.64 0l4.14-4.14a1.87 1.87 0 0 0 0-2.64l-4.14-4.14z"
        fill="#2684FF"
      />
    </svg>
  ),
  Trello: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#0079BF" />
      <rect x="6" y="6" width="5" height="10" rx="1" fill="#FFFFFF" />
      <rect x="13" y="6" width="5" height="6" rx="1" fill="#FFFFFF" />
    </svg>
  ),
  Github: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2.5">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.839 21.49C9.339 21.582 9.52 21.273 9.52 21.007C9.52 20.768 9.511 19.957 9.506 18.883C6.725 19.487 6.138 17.542 6.138 17.542C5.684 16.388 5.03 16.082 5.03 16.082C4.125 15.464 5.098 15.476 5.098 15.476C6.098 15.546 6.625 16.503 6.625 16.503C7.513 18.025 8.955 17.585 9.541 17.33C9.63 16.666 9.898 16.226 10.194 15.974C7.974 15.722 5.638 14.863 5.638 11.169C5.638 10.118 6.013 9.259 6.643 8.586C6.543 8.334 6.212 7.356 6.739 6.023C6.739 6.023 7.558 5.761 9.492 7.072C10.271 6.855 11.109 6.746 11.94 6.742C12.771 6.746 13.609 6.855 14.389 7.072C16.321 5.761 17.139 6.023 17.139 6.023C17.667 7.356 17.336 8.334 17.236 8.586C17.868 9.259 18.241 10.118 18.241 11.169C18.241 14.875 15.901 15.717 13.673 15.961C14.043 16.28 14.373 16.906 14.373 17.871C14.373 19.256 14.361 20.373 14.361 20.722C14.361 20.993 14.54 21.309 15.048 21.211C19.015 19.889 21.88 16.14 21.88 11.714C21.88 6.19 17.403 1.714 11.88 1.714Z"
        fill="#FFFFFF"
      />
    </svg>
  ),
};

// --- 2. Tech Scroller Icons ---
const ScrollerIcons = {
  Chrome: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md"
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        fill="#F4B400"
      />
      <path d="M12 2L19.4641 14.866H4.5359L12 2Z" fill="#0F9D58" />
      <path d="M12 22L4.5359 9.13397H19.4641L12 22Z" fill="#DB4437" />
      <circle
        cx="12"
        cy="12"
        r="4.5"
        fill="#4285F4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  Edge: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md"
    >
      <path
        d="M2.5 12C2.5 17.2467 6.75329 21.5 12 21.5C17.2467 21.5 21.5 17.2467 21.5 12C21.5 6.75329 17.2467 2.5 12 2.5C9.7208 2.5 7.63604 3.29824 6 4.63604V9.5C6 11.433 7.567 13 9.5 13H15.5L12 18.5L8.5 15H6.5C6.5 18.0376 8.96243 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.99401 3.5 4.63583 6.27508 3.73244 10H8.5L12 4.5L15.5 10H9.5C8.11929 10 7 8.88071 7 7.5V6.36396C4.29824 7.63604 2.5 9.7208 2.5 12Z"
        fill="#35C1F1"
      />
    </svg>
  ),
  Figma: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md"
      fill="none"
    >
      <path
        d="M8 12C8 10.8954 8.89543 10 10 10H14V14H10C8.89543 14 8 13.1046 8 12Z"
        fill="#0ACF83"
      />
      <path
        d="M8 8C8 6.89543 8.89543 6 10 6H14V10H10C8.89543 10 8 9.10457 8 8Z"
        fill="#F24E1E"
      />
      <path d="M14 6H10V10H14V6Z" fill="#FF7262" />
      <path d="M14 10H10V14H14V10Z" fill="#A259FF" />
      <path
        d="M8 16C8 14.8954 8.89543 14 10 14V18C8.89543 18 8 17.1046 8 16Z"
        fill="#1ABCFE"
      />
    </svg>
  ),
  ClickUp: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md"
      fill="none"
    >
      <path d="M12 3L2 10.5L4.5 14L12 8L19.5 14L22 10.5L12 3Z" fill="#7B68EE" />
      <path
        d="M12 11L4.5 16.5L7 20L12 16L17 20L19.5 16.5L12 11Z"
        fill="#FF007F"
      />
    </svg>
  ),
  OpenAI: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md"
      fill="currentColor"
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-1.5606-3.2503 5.9928 5.9928 0 0 0-3.3246-1.5305 5.9822 5.9822 0 0 0-3.804.5369 5.9912 5.9912 0 0 0-2.3155-2.2217 6.0076 6.0076 0 0 0-4.008-.4305 5.9945 5.9945 0 0 0-3.1558 1.836 5.9839 5.9839 0 0 0-1.4287 3.3276 5.9814 5.9814 0 0 0 .6186 3.864 5.9961 5.9961 0 0 0 1.5606 3.2503 5.9945 5.9945 0 0 0 3.3246 1.5305 5.9839 5.9839 0 0 0 3.804-.5369 5.9945 5.9945 0 0 0 2.3155 2.2217 6.0076 6.0076 0 0 0 4.008.4305 5.9928 5.9928 0 0 0 3.1558-1.836 5.9822 5.9822 0 0 0 1.4287-3.3276 5.9839 5.9839 0 0 0-.6186-3.864Zm-7.149 7.7497a4.4172 4.4172 0 0 1-2.2908.455 4.398 4.398 0 0 1-2.1462-.7723l.116-.067.0988-.058 4.6738-2.7052a.7981.7981 0 0 0 .3944-.6836v-5.238l1.498 .865v4.204a4.414 4.414 0 0 1-2.344 3.9991Zm-7.792-1.936a4.4098 4.4098 0 0 1-.8065-2.21 4.4032 4.4032 0 0 1 1.0506-2.1648l.1177.0664.0987.0583 4.6738 2.7052a.7981.7981 0 0 0 .7872 0l4.538-2.617v1.728a4.414 4.414 0 0 1-2.344 4.001l-3.644 2.103a4.4156 4.4156 0 0 1-4.4714-3.6701Zm-1.3414-7.5855a4.4098 4.4098 0 0 1 1.4842-1.755 4.4064 4.4064 0 0 1 2.2908-.455l-.0017.1334v.115l5.41-3.12a.7981.7981 0 0 0 .7888 0l4.538-2.617-1.498-.865-3.644 2.103a4.4156 4.4156 0 0 1-3.5638-4.911Zm10.134-4.8856a4.4098 4.4098 0 0 1 2.2908-.455 4.398 4.398 0 0 1 2.1462.7723l-.116.067-.0988.058-4.6738 2.7052a.7981.7981 0 0 0-.3944.6836v5.238l-1.498-.865v-4.204a4.414 4.414 0 0 1 2.344-3.9991Zm7.792 1.936a4.4098 4.4098 0 0 1 .8065 2.21 4.4032 4.4032 0 0 1-1.0506 2.1648l-.1177-.0664-.0987-.0583-4.6738-2.7052a.7981.7981 0 0 0-.7872 0l-4.538 2.617v-1.728a4.414 4.414 0 0 1 2.344-4.001l3.644-2.103a4.4156 4.4156 0 0 1 4.4714 3.6701Zm1.3414 7.5855a4.4098 4.4098 0 0 1-1.4842 1.755 4.4064 4.4064 0 0 1-2.2908.455l.0017-.1334v-.115l-5.41-3.12a.7981.7981 0 0 0-.7888 0l-4.538 2.617 1.498.865 3.644-2.103a4.4156 4.4156 0 0 1 3.5638 4.911Z" />
    </svg>
  ),
  Odoo: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md"
    >
      <circle cx="12" cy="12" r="10" fill="#714B67" />
      <path
        d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
        fill="white"
      />
    </svg>
  ),
  Penpot: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 17.5C15.0376 17.5 17.5 15.0376 17.5 12C17.5 8.96243 15.0376 6.5 12 6.5C8.96243 6.5 6.5 8.96243 6.5 12C6.5 15.0376 8.96243 17.5 12 17.5Z"
        fill="#FFFFFF"
      />
      <circle cx="12" cy="12" r="5.5" fill="#3DCC8E" />
    </svg>
  ),
  HubSpot: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.5 14L13 11.5L14.5 10L17 12.5L15.5 14ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15ZM10.5 10L8 12.5L9.5 14L12 11.5L10.5 10Z"
        fill="#FF7A59"
      />
    </svg>
  ),
  Canva: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md"
    >
      <circle cx="12" cy="12" r="10" fill="#00C4CC" />
      <path
        d="M15 9C15 9 13.5 8 12 8C10.5 8 9 9.5 9 12C9 14.5 10.5 16 12 16C13.5 16 15 15 15 15"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  Webex: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md"
      fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="#00BCEB" strokeWidth="2.5" />
      <path
        d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16"
        stroke="#98D600"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Trello: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md"
      fill="none"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#0079BF" />
      <rect x="6" y="6" width="5" height="10" rx="1" fill="#FFFFFF" />
      <rect x="13" y="6" width="5" height="6" rx="1" fill="#FFFFFF" />
    </svg>
  ),
  Shopify: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md"
    >
      <path
        d="M17.5 7H15.5C15.5 5.07 13.93 3.5 12 3.5C10.07 3.5 8.5 5.07 8.5 7H6.5C5.67 7 5 7.67 5 8.5V19.5C5 20.33 5.67 21 6.5 21H17.5C18.33 21 19 20.33 19 19.5V8.5C19 7.67 18.33 7 17.5 7ZM12 5.5C12.83 5.5 13.5 6.17 13.5 7H10.5C10.5 6.17 11.17 5.5 12 5.5Z"
        fill="#95BF47"
      />
    </svg>
  ),
  Bubble: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 md:w-10 md:h-10 shrink-0 drop-shadow-md"
    >
      <circle cx="12" cy="12" r="10" fill="#1A49E5" />
      <path
        d="M11.5 7V17M11.5 12C11.5 14.2091 13.2909 16 15.5 16C17.7091 16 19.5 14.2091 19.5 12C19.5 9.79086 17.7091 8 15.5 8C13.2909 8 11.5 9.79086 11.5 12Z"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
};

const ALL_LOGOS = [
  { name: "Chrome", Icon: ScrollerIcons.Chrome },
  { name: "Edge", Icon: ScrollerIcons.Edge },
  { name: "Figma", Icon: ScrollerIcons.Figma },
  { name: "ClickUp", Icon: ScrollerIcons.ClickUp },
  { name: "OpenAI", Icon: ScrollerIcons.OpenAI },
  { name: "Odoo", Icon: ScrollerIcons.Odoo },
  { name: "Penpot", Icon: ScrollerIcons.Penpot },
  { name: "HubSpot", Icon: ScrollerIcons.HubSpot },
  { name: "Canva", Icon: ScrollerIcons.Canva },
  { name: "Webex", Icon: ScrollerIcons.Webex },
  { name: "Trello", Icon: ScrollerIcons.Trello },
  { name: "Shopify", Icon: ScrollerIcons.Shopify },
  { name: "Bubble", Icon: ScrollerIcons.Bubble },
];

// Small floating marketplace tags scattered around the hero — purely decorative,
// keeps the "trusted brand" texture visible even before the scroller loads.
const FLOATING_TAGS = [
  {
    name: "Framer",
    Icon: Logos.Figma,
    className: "top-16 left-1/2 -translate-x-1/2",
    delay: 0.5,
  },
  {
    name: "Shopify",
    Icon: Logos.Github,
    className: "top-48 left-2 sm:left-8 lg:left-[6%]",
    delay: 0.65,
  },
  {
    name: "Figma",
    Icon: Logos.Figma,
    className: "top-40 right-2 sm:right-8 lg:right-[6%]",
    delay: 0.8,
  },
  {
    name: "Chrome",
    Icon: Logos.Google,
    className: "top-120 right-2 sm:right-10 lg:right-[10%]",
    delay: 0.95,
  },
  {
    name: "Trello",
    Icon: Logos.Trello,
    className: "top-152 left-2 sm:left-10 lg:left-[10%]",
    delay: 1.1,
  },
];

// --- Animations Configuration ---
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.6 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const drawLine = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 0.6,
    transition: {
      pathLength: { duration: 1.5, bounce: 0 },
      opacity: { duration: 0.5 },
      ease: "easeInOut",
      delay: 0.8,
    },
  },
};

// --- Dashboard Sub-components ---
const TaskCard = ({ title, tag1, tag2, tools = [], comments, attachments }) => (
  <motion.div
    variants={cardVariants}
    className="bg-[#121214]/80 border border-white/5 rounded-2xl p-3 md:p-4 flex flex-col gap-3 shadow-lg hover:border-brand/30 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(35,181,181,0.05)] w-full"
  >
    <div className="flex gap-2 mb-1">
      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#2D2D3A] text-gray-400 uppercase tracking-wide border border-white/5 group-hover:bg-brand/10 group-hover:text-brand transition-colors">
        {tag1}
      </span>
      {tag2 && (
        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#2D2D3A] text-gray-400 uppercase tracking-wide border border-white/5">
          {tag2}
        </span>
      )}
    </div>

    <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors truncate">
      {title}
    </h4>

    <div className="flex gap-1.5 my-1">
      {tools.map((ToolLogo, i) => (
        <div
          key={i}
          className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/5 border border-white/5 overflow-hidden relative group-hover:border-white/10 transition-colors"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center scale-[1.75] pointer-events-none">
            <ToolLogo />
          </div>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between mt-auto pt-2">
      <div className="flex -space-x-1.5">
        <div className="w-5 h-5 rounded-full border border-[#121214] bg-orange-400/80 flex items-center justify-center text-[8px] text-black font-bold z-10">
          JD
        </div>
        <div className="w-5 h-5 rounded-full border border-[#121214] bg-blue-400/80 flex items-center justify-center text-[8px] text-black font-bold z-20">
          AL
        </div>
        {tools.length > 2 && (
          <div className="w-5 h-5 rounded-full border border-[#121214] bg-gray-600 flex items-center justify-center text-[8px] text-white z-30">
            +
          </div>
        )}
      </div>

      <div className="text-[10px] text-gray-600 flex gap-3 font-medium">
        <span className="flex items-center gap-1 group-hover:text-gray-400 transition-colors">
          <MessageSquare size={10} /> {comments}
        </span>
        <span className="flex items-center gap-1 group-hover:text-gray-400 transition-colors">
          <Paperclip size={10} /> {attachments}
        </span>
      </div>
    </div>
  </motion.div>
);

const ToolNode = ({ LogoComponent, side, top, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.2, x: side === "left" ? -30 : 30 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    transition={{ duration: 0.8, delay: delay, type: "spring", stiffness: 120 }}
    className={`hidden md:flex absolute ${side === "left" ? "left-4 lg:left-[8%]" : "right-4 lg:right-[8%]"} z-20 flex-col items-center`}
    style={{ top }}
  >
    <div className="w-16 h-16 rounded-2xl bg-[#0F0F11] border border-white/10 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] group hover:scale-110 transition-transform duration-300 relative">
      <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 flex items-center justify-center scale-125 pointer-events-none">
        <LogoComponent />
      </div>
    </div>
  </motion.div>
);

// Faint scattered pill tag used behind the headline, echoing the marketplace names.
// Two-stage animation: fades/scales in once, then drifts up and down forever.
const FloatingTag = ({
  name,
  Icon,
  className,
  delay,
  floatDuration = 4,
  floatDistance = 10,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.9 }}
    animate={{
      opacity: 1,
      scale: 1,
      y: [0, -floatDistance, 0],
    }}
    transition={{
      opacity: { duration: 0.7, delay, ease: "easeOut" },
      scale: { duration: 0.7, delay, ease: "easeOut" },
      y: {
        duration: floatDuration,
        delay: delay + 0.7,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }}
    className={`hidden sm:flex absolute z-10 items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-sm ${className}`}
  >
    {Icon && (
      <span className="w-4 h-4 opacity-60">
        <Icon />
      </span>
    )}
    <span className="text-xs font-medium text-gray-500">{name}</span>
  </motion.div>
);

// --- MAIN HERO COMPONENT ---
const Hero = () => {
  return (
    <section className="relative pt-42 pb-10 overflow-hidden min-h-screen flex flex-col items-center bg-[#050505]">
      {/* Massive Atmospheric Glow */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[800px] bg-brand/20 blur-[150px] rounded-full pointer-events-none opacity-80 mix-blend-screen" />
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-full h-[600px] bg-brand/5 blur-[100px] pointer-events-none" />

      {/* Scattered marketplace tags floating behind the headline */}
      {FLOATING_TAGS.map((tag) => (
        <FloatingTag
          key={tag.name}
          name={tag.name}
          Icon={tag.Icon}
          className={tag.className}
          delay={tag.delay}
        />
      ))}

      {/* --- Text Content (Animated Waterfall) --- */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-20 w-full max-w-7xl px-6 text-left mb-12"
      >
        <motion.div
          variants={fadeUpVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs md:text-sm text-gray-300 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          Building the platform layer for AI-native teams
        </motion.div>

        <motion.h1
          variants={fadeUpVariants}
          className="text-4xl md:text-5xl lg:text-8xl font-bold tracking-tight leading-[1.05]"
        >
          <span className="text-white">The Platform Layer</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-600 to-gray-800">
            For Every Tool You Ship On
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUpVariants}
          className="text-base md:text-lg text-gray-400 max-w-2xl mb-10 mt-5 leading-relaxed px-6"
        >
          Explified unifies powerful apps, automation, and workflows to
          seamlessly support enterprises, teams and individuals.
        </motion.p>

        <motion.div
          variants={fadeUpVariants}
          className="flex flex-col sm:flex-row items-center justify-start gap-4 sm:gap-5"
        >
          <Link to="https://explified.com/labs">
            <button className="relative cursor-pointer overflow-hidden bg-brand text-black font-bold text-lg px-8 py-3.5 rounded-full flex items-center justify-center w-full sm:w-auto gap-2 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(35,181,181,0.4)]">
              <span className="relative z-10">Explore Labs</span>
              <ArrowRight size={18} className="relative z-10" />
              <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
            </button>
          </Link>

          {/* <Link to="/products">
            <button className="cursor-pointer bg-transparent border border-white/15 text-white font-bold text-lg px-8 py-3.5 rounded-full flex items-center justify-center w-full sm:w-auto hover:bg-white/5 hover:border-white/25 transition-colors">
              See Our Products
            </button>
          </Link> */}
        </motion.div>
      </motion.div>

      {/* --- TRUSTED PLATFORMS STRIP --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative w-full overflow-hidden mt-16 pt-10 border-t border-white/5 z-20 flex flex-col items-center"
      >
        <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-[0.2em] mb-8 text-center px-4">
          Trusted across major platforms
        </p>

        <div
          className="relative w-full max-w-[100vw] mx-auto z-10"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
        >
          <div className="flex w-max animate-continuous-scroll hover:[animation-play-state:paused] items-center py-4">
            {[...ALL_LOGOS, ...ALL_LOGOS].map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center gap-3 w-[180px] md:w-[240px] shrink-0 group cursor-pointer text-neutral-600 transition-transform duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                  <item.Icon />
                </div>
                <span className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300 whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Inline Style for seamless infinite scroll animation */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); } 
          }
          .animate-continuous-scroll {
            animation: scroll 45s linear infinite;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `,
          }}
        />
      </motion.div>

      {/* ===================== Stats Section ===================== */}
      <section className="relative w-full bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Card 1 */}
            <div className="flex flex-col justify-center md:px-10 py-8">
              <div className="flex items-baseline-last gap-3">
                <h2 className="text-white text-[60px] leading-none font-extrabold tracking-tight">
                  50+
                </h2>

                <span className="text-[#23b5b5] text-[22px] font-semibold mb-2">
                  Apps
                </span>
              </div>

              <p className="mt-1 text-[16px] text-gray-400">
                Across all major marketplaces
              </p>
            </div>

            {/* Divider */}
            <div className="hidden md:block absolute left-1/3 top-24 bottom-24 w-px bg-white/10" />

            {/* Card 2 */}
            <div className="flex flex-col justify-center md:px-10 py-8 border-l border-white/10">
              <div className="flex items-baseline-last gap-3">
                <h2 className="text-white text-[60px] leading-none font-extrabold tracking-tight">
                  6
                </h2>

                <span className="text-[#23b5b5] text-[22px] font-semibold mb-2">
                  Platforms
                </span>
              </div>

              <p className="mt-1 text-[16px] text-gray-400 leading-relaxed">
                Figma, Shopify, Trello, Chrome,
                <br />
                Framer & more
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col justify-center md:px-10 py-8 border-l border-white/10">
              <div className="flex items-baseline-last gap-3">
                <h2 className="text-white text-[60px] leading-none font-extrabold tracking-tight">
                  37K+
                </h2>

                <span className="text-[#23b5b5] text-[22px] font-semibold mb-2">
                  Followers
                </span>
              </div>

              <p className="mt-1 text-[16px] text-gray-400">
                Across Explified's content channels
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Hero;
