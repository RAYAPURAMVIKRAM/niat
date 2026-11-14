import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-20 sm:bottom-8 right-6 z-40 p-2.5 rounded-full bg-surface/90 text-fg border border-border/20 shadow-elevated hover:border-brand hover:text-brand transition-all duration-200 transform hover:-translate-y-1 backdrop-blur-md btn-shine"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
