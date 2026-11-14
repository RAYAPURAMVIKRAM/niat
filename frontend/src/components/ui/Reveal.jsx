import React from 'react';

export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={`animate-fade-in-up ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
