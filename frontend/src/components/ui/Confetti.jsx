import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function Confetti({ trigger = false, onComplete }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Color palettes tuned to active theme
    const themeColors = {
      aurum: ['#FFC21A', '#FFE27A', '#FAF7EE', '#FFFFFF', '#D97706'],
      volt: ['#B6FF00', '#E4FF8A', '#F6F0E1', '#FFFFFF', '#10B981'],
      lagoon: ['#FF6B4A', '#0E7C73', '#FF8A65', '#2DD4BF', '#F4FAF8'],
    };
    const colors = themeColors[theme] || themeColors.aurum;

    const particles = Array.from({ length: 65 }, () => ({
      x: width / 2,
      y: height / 2 + 50,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.8) * 16,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
    }));

    let animationFrame;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let activeCount = 0;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.98; // drag
        p.rotation += p.vRot;
        p.alpha -= 0.012; // fade out

        if (p.alpha > 0) {
          activeCount++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
          ctx.restore();
        }
      });

      if (activeCount > 0) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        if (onComplete) onComplete();
      }
    };

    animationFrame = requestAnimationFrame(render);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [trigger, theme, onComplete]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100] w-full h-full"
    />
  );
}
