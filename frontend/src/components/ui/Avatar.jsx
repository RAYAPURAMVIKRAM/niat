import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Avatar({
  name = 'Hacker',
  size = 'md', // sm, md, lg, xl
  isVerified = false,
  showOnline = false,
  className = '',
}) {
  const [useFallback, setUseFallback] = useState(false);
  const [useFinalFallback, setUseFinalFallback] = useState(false);

  const cleanName = name || 'Hacker';
  const dicebearUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=e0e7ff,c7d2fe,bfdbfe`;
  const uiAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=4F46E5&color=fff&bold=true&rounded=true`;

  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-xs',
    lg: 'h-11 w-11 text-sm',
    xl: 'h-14 w-14 text-base',
  };

  const badgeSizes = {
    xs: 'h-2 w-2 -bottom-0.5 -right-0.5',
    sm: 'h-2.5 w-2.5 -bottom-0.5 -right-0.5',
    md: 'h-3.5 w-3.5 -bottom-0.5 -right-0.5',
    lg: 'h-4 w-4 -bottom-1 -right-1',
    xl: 'h-5 w-5 -bottom-1 -right-1',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;
  const badgeSizeClass = badgeSizes[size] || badgeSizes.md;

  const getInitials = (n) => {
    const parts = n.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`${currentSizeClass} rounded-full overflow-hidden border border-slate-200/90 shadow-2xs bg-slate-100 flex items-center justify-center`}
      >
        {!useFallback ? (
          <img
            src={dicebearUrl}
            alt={cleanName}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setUseFallback(true)}
          />
        ) : !useFinalFallback ? (
          <img
            src={uiAvatarUrl}
            alt={cleanName}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setUseFinalFallback(true)}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 text-white font-bold flex items-center justify-center font-display">
            {getInitials(cleanName)}
          </div>
        )}
      </div>

      {/* Verified Shield Badge Overlay */}
      {isVerified && (
        <span
          className={`absolute ${badgeSizeClass} flex items-center justify-center rounded-full bg-white text-emerald-600 shadow-xs ring-1 ring-emerald-500`}
          title="Verified Student Hacker"
        >
          <ShieldCheck className="w-full h-full p-0.5" />
        </span>
      )}

      {/* Online indicator dot if not verified */}
      {showOnline && !isVerified && (
        <span
          className={`absolute ${badgeSizeClass} rounded-full bg-emerald-500 ring-2 ring-white`}
          title="Active on HackSphere"
        />
      )}
    </div>
  );
}
