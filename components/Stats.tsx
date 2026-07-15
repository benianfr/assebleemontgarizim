"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { target: 18, suffix: "+", label: "Années d'existence" },
  { target: 1200, suffix: "+", label: "Fidèles" },
  { target: 12, suffix: "", label: "Ministères" },
  { target: 60, suffix: "+", label: "Événements organisés" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLHeadingElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 1600;
            let startTime: number | null = null;

            function step(ts: number) {
              if (startTime === null) startTime = ts;
              const progress = Math.min((ts - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(Math.floor(eased * target));
              if (progress < 1) requestAnimationFrame(step);
              else setValue(target);
            }
            requestAnimationFrame(step);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <h3 ref={ref}>
      <span>{value}</span>
      {suffix}
    </h3>
  );
}

export default function Stats() {
  return (
    <section className="section stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div
              className={`stat reveal reveal-delay-${Math.min(i, 3)}`}
              key={s.label}
            >
              <Counter target={s.target} suffix={s.suffix} />
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
