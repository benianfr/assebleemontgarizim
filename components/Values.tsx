"use client";

import { useRevealOnScroll } from "./useRevealOnScroll";

const values = [
  { num: "01", title: "Foi", text: "Une confiance vivante et quotidienne en la fidélité de Dieu." },
  { num: "02", title: "Amour", text: "Le socle de toute relation, à l'image de l'amour du Christ." },
  { num: "03", title: "Service", text: "Mettre ses dons au service de la communauté et du prochain." },
  { num: "04", title: "Discipline", text: "Une vie spirituelle structurée, ancrée dans la Parole." },
  { num: "05", title: "Communion", text: "Marcher ensemble, dans l'unité et le partage fraternel." },
  { num: "06", title: "Mission", text: "Porter l'espérance de l'Évangile au-delà de nos murs." },
];

const delays = ["", "reveal-delay-1", "reveal-delay-2"];

export default function Values() {
  const ref = useRevealOnScroll<HTMLElement>();

  return (
    <section className="section" ref={ref}>
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Nos valeurs</span>
          <h2>Ce qui fonde notre manière de vivre la foi</h2>
        </div>

        <div className="values-scroll">
          {values.map((v, i) => (
            <div className={`value-card reveal ${delays[i % 3]}`} key={v.num}>
              <div className="num">{v.num}</div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
