import React, { useState, useEffect } from 'react';

export default function CountUp({ end = 100, duration = 1200, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const finalValue = typeof end === 'number' ? end : parseInt(end, 10) || 0;
    if (finalValue === 0) {
      setCount(0);
      return;
    }

    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = finalValue / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= finalValue) {
        setCount(finalValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span className="tabular-nums font-mono">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
