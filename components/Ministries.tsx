"use client";

import { useRevealOnScroll } from "./useRevealOnScroll";

const ministries = [
  {
    ph: "ph-1",
    title: "Jeunesse",
    text: "Un espace dynamique où les jeunes affermissent leur foi et tissent des amitiés durables.",
  },
  {
    ph: "ph-2",
    title: "Enfants",
    text: "Un accueil chaleureux et sécurisé pour transmettre les valeurs de l'Évangile aux plus petits.",
  },
  {
    ph: "ph-3",
    title: "Louange",
    text: "Une équipe passionnée qui conduit l'assemblée dans une adoration sincère et vivante.",
  },
  {
    ph: "ph-4",
    title: "Intercession",
    text: "Des moments de prière collective pour porter les besoins de l'église et de la nation.",
  },
  {
    ph: "ph-5",
    title: "Évangélisation",
    text: "Aller vers les autres pour partager l'espérance qui nous anime, avec amour et respect.",
  },
  {
    ph: "ph-6",
    title: "Familles",
    text: "Un accompagnement pour renforcer les couples et les liens intergénérationnels.",
  },
];

const delays = ["", "reveal-delay-1", "reveal-delay-2"];

export default function Ministries() {
  const ref = useRevealOnScroll<HTMLElement>();

  return (
    <section className="section bg-pale" id="ministeres" ref={ref}>
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Nos ministères</span>
          <h2>Grandir ensemble, à chaque étape de la vie</h2>
        </div>

        <div className="scroll-horizontal">
          {ministries.map((m, i) => (
            <div className={`card reveal ${delays[i % 3]}`} key={m.title}>
              <div className="card-media">
                <div className={`ph ${m.ph}`}></div>
              </div>
              <div className="card-body">
                <h3>{m.title}</h3>
                <p>{m.text}</p>
                <a href="/#ministeres" className="card-link">
                  Découvrir <span className="arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
