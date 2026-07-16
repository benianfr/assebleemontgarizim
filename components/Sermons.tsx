"use client";

import { useEffect, useState } from "react";
import { useRevealOnScroll } from "./useRevealOnScroll";
import { getSermons, Sermon } from "@/lib/firestore";

const delays = ["", "reveal-delay-1", "reveal-delay-2"];

export default function Sermons() {
  const ref = useRevealOnScroll<HTMLElement>();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await getSermons();
      if (result.success) {
        setSermons(result.sermons);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const displaySermons = sermons;

  return (
    <section className="section" id="predications" ref={ref}>
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Dernières prédications</span>
          <h2>Nourrissez votre foi où que vous soyez</h2>
        </div>

        <div className="scroll-horizontal">
          {displaySermons.map((s, i) => (
            <div className={`card reveal ${delays[i % 3]}`} key={s.title}>
              <div className="card-media">
                {s.imageUrl ? (
                  <img src={s.imageUrl} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div className={`ph ph-2`}></div>
                )}
              </div>
              <div className="card-body">
                <h3>{s.title}</h3>
                <p>{s.preacher} — {s.date} — {s.duration}</p>
                <a href="/predications" className="card-link">
                  Regarder <span className="arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
