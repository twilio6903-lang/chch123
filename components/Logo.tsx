
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-12 w-12" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative h-12 w-12 flex items-center justify-center bg-amber-950 rounded-full shadow-lg overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,rgba(251,191,36,1)0%,rgba(120,53,15,1)100%)]"></div>
      <svg viewBox="0 0 100 100" className="h-8 w-8 text-amber-100 fill-current">
        <path d="M50 5 C25 5 5 25 5 50 C5 75 25 95 50 95 C75 95 95 75 95 50 C95 25 75 5 50 5 Z M50 15 C69 15 85 31 85 50 C85 69 69 85 50 85 C31 85 15 69 15 50 C15 31 31 15 50 15 Z" />
        <path d="M50 25 L55 45 L75 50 L55 55 L50 75 L45 55 L25 50 L45 45 Z" className="animate-pulse" />
      </svg>
    </div>
    <div className="flex flex-col leading-none">
      <span className="text-2xl font-serif italic tracking-widest text-amber-950 uppercase font-bold">Чайхана</span>
      <span className="text-sm tracking-[0.3em] text-orange-600 font-semibold uppercase">Жулебино</span>
    </div>
  </div>
);
