'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { 
  TwitterIcon, 
  LinkedInIcon, 
  WhatsAppIcon, 
  TelegramIcon,
  MailIcon,
  CopyIcon,
  CheckIcon
} from '@/components/ui/icons';

interface ShareButtonsProps {
  referralLink: string;
  referralCode: string;
  className?: string;
}

export function ShareButtons({ referralLink, referralCode, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false);
  
  const shareMessage = `🤖 I've been using Clawdbot, an incredible AI assistant that remembers everything and automates my work. Use my link to get $20 off your first month!`;
  
  const encodedMessage = encodeURIComponent(shareMessage);
  const encodedLink = encodeURIComponent(referralLink);
  
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedLink}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`,
    whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedLink}`,
    telegram: `https://t.me/share/url?url=${encodedLink}&text=${encodedMessage}`,
    email: `mailto:?subject=${encodeURIComponent('Check out Clawdbot - Your Personal AI Agent')}&body=${encodedMessage}%0A%0A${encodedLink}`,
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const buttonClass = "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95";
  
  return (
    <div className={`${className}`}>
      <p className="text-sm text-gray-400 mb-3">Share via</p>
      <div className="flex flex-wrap gap-3">
        {/* Twitter/X */}
        <a 
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} bg-black hover:bg-gray-800 text-white`}
          title="Share on X (Twitter)"
        >
          <TwitterIcon className="w-5 h-5" />
        </a>
        
        {/* LinkedIn */}
        <a 
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} bg-[#0A66C2] hover:bg-[#004182] text-white`}
          title="Share on LinkedIn"
        >
          <LinkedInIcon className="w-5 h-5" />
        </a>
        
        {/* WhatsApp */}
        <a 
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} bg-[#25D366] hover:bg-[#128C7E] text-white`}
          title="Share on WhatsApp"
        >
          <WhatsAppIcon className="w-5 h-5" />
        </a>
        
        {/* Telegram */}
        <a 
          href={shareLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} bg-[#0088cc] hover:bg-[#006699] text-white`}
          title="Share on Telegram"
        >
          <TelegramIcon className="w-5 h-5" />
        </a>
        
        {/* Email */}
        <a 
          href={shareLinks.email}
          className={`${buttonClass} bg-gray-600 hover:bg-gray-500 text-white`}
          title="Share via Email"
        >
          <MailIcon className="w-5 h-5" />
        </a>
        
        {/* Copy Link */}
        <button 
          onClick={copyToClipboard}
          className={`${buttonClass} ${copied ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-500'} text-white`}
          title={copied ? 'Copied!' : 'Copy Link'}
        >
          {copied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
