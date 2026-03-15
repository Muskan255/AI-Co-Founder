import React from 'react';
import { cn } from '@/lib/utils';

export function AIFounderLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={cn("w-full h-full", className)}
    >
      {/* Top horizontal stroke */}
      <path d="M52 18 Q 65 12 82 18" />
      
      {/* Main flourish body */}
      <path 
        d="M58 15 
           C 50 35 25 45 25 65 
           C 25 85 55 95 70 75 
           C 80 55 55 40 40 50 
           C 30 60 35 80 50 85" 
      />
      
      {/* Signature central dot */}
      <circle cx="42" cy="52" r="3.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
