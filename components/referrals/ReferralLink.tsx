'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { CopyIcon, CheckIcon, LinkIcon } from '@/components/ui/icons';

interface ReferralLinkProps {
  referralLink: string;
  referralCode: string;
  className?: string;
}

export function ReferralLink({ referralLink, referralCode, className = '' }: ReferralLinkProps) {
  const [copied, setCopied] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setShowTooltip(true);
      setTimeout(() => {
        setCopied(false);
        setShowTooltip(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Your Referral Link
      </label>
      <div className="relative">
        <div className="flex items-center gap-2 p-4 bg-gray-900/70 rounded-lg border border-gray-700/50 group hover:border-purple-500/50 transition-all duration-200">
          <LinkIcon className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 bg-transparent text-white text-sm sm:text-base font-mono focus:outline-none cursor-text select-all truncate"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <Button
            variant={copied ? 'primary' : 'outline'}
            size="sm"
            onClick={copyToClipboard}
            className={`flex-shrink-0 transition-all duration-200 ${copied ? 'bg-green-600 border-green-600' : ''}`}
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </Button>
        </div>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg animate-fade-in-up shadow-lg">
            Link copied to clipboard!
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-600 rotate-45"></div>
          </div>
        )}
      </div>
      
      <p className="mt-2 text-xs text-gray-500">
        Your unique code: <span className="font-mono text-purple-400">{referralCode}</span>
      </p>
    </div>
  );
}
