import React from 'react';
import { cn } from '@/lib/utils';

export function AIFounderLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      
      {/* Top Seed Shape - Pointing Down */}
      <path 
        d="M50 12 
           C 68 12, 65 42, 50 48 
           C 35 42, 32 12, 50 12 Z" 
        fill="currentColor"
      />
      
      {/* Bottom Seed Shape - Pointing Up */}
      <path 
        d="M50 52 
           C 65 58, 68 88, 50 88 
           C 32 88, 35 58, 50 52 Z" 
        fill="currentColor"
      />
    </svg>
  );
}
