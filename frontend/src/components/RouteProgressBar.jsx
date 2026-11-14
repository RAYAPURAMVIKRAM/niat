import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteProgressBar() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] overflow-hidden pointer-events-none">
      <div className="h-full bg-brand shadow-glow animate-shimmer" style={{ width: '100%' }} />
    </div>
  );
}
