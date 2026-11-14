import React, { useState } from 'react';

// Curated pool of high-quality, stable Unsplash tech & hackathon images
const CURATED_EVENT_PHOTOS = [
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=70', // Hackathon teamwork
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=70', // Code & design sprint
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=70', // Tech summit keynote
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=70', // Engineers brainstorming
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=70', // AI neural network code
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=70', // Startup sprint session
  'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=70', // Intelligent agent hardware
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=70', // Developer collaboration
];

// Fallback mesh gradient generators by category
const CATEGORY_GRADIENTS = {
  Hackathon: 'from-violet-900 via-indigo-950 to-slate-900',
  'National Hackathon': 'from-blue-900 via-indigo-950 to-slate-900',
  'Tech Fest': 'from-amber-900 via-rose-950 to-slate-900',
  Datathon: 'from-cyan-900 via-blue-950 to-slate-900',
  Sprint: 'from-emerald-900 via-teal-950 to-slate-900',
  default: 'from-indigo-900 via-slate-900 to-slate-950',
};

export default function CoverImage({
  seedKey = 'event',
  title = '',
  category = 'Hackathon',
  className = '',
  children,
}) {
  const [imageFailed, setImageFailed] = useState(false);

  // Deterministic stable hash calculation
  const getHashIndex = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % CURATED_EVENT_PHOTOS.length;
  };

  const imageSrc = CURATED_EVENT_PHOTOS[getHashIndex(seedKey + title)];
  const gradientClass = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.default;

  return (
    <div
      className={`relative w-full h-44 sm:h-48 overflow-hidden rounded-xl bg-slate-900 group ${className}`}
    >
      {!imageFailed ? (
        <img
          src={imageSrc}
          alt={title || 'Event Cover'}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : null}

      {/* SVG Geometric Grid & Gradient Overlay for Contrast */}
      <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} ${imageFailed ? 'opacity-100' : 'opacity-80 mix-blend-multiply'} transition-opacity`} />
      
      {/* Mesh Dots Pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Bottom Gradient Fade for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

      {/* Embedded Floating Badges / Children */}
      {children && <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">{children}</div>}
    </div>
  );
}
