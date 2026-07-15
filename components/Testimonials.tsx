"use client";

import { useEffect, useState } from "react";
import { useRevealOnScroll } from "./useRevealOnScroll";
import { getApprovedTestimonials, Testimonial } from "@/lib/firestore";

export default function Testimonials() {
  const ref = useRevealOnScroll<HTMLElement>();
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await getApprovedTestimonials();
      if (result.success) {
        setTestimonials(result.testimonials);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const displayTestimonials = testimonials.length > 0 ? testimonials.map(t => ({
    text: t.temoignage,
    name: `${t.prenom} ${t.nom}`,
    role: t.titre,
    approved: t.approved,
    createdAt: t.createdAt,
  })) : [
    {
      text: "Rejoindre cette église a transformé ma vie de famille. Nous avons trouvé une communauté qui nous porte réellement.",
      name: "Awa Traoré",
      role: "Membre depuis 2019",
      approved: true,
      createdAt: new Date().toISOString(),
    },
    {
      text: "L'accompagnement des jeunes ici est exceptionnel. J'ai grandi dans ma foi entourée de mentors bienveillants.",
      name: "David Yao",
      role: "Groupe Jeunesse",
      approved: true,
      createdAt: new Date().toISOString(),
    },
    {
      text: "Un enseignement biblique profond et une communion fraternelle sincère. Je m'y sens chez moi.",
      name: "Grace N'Guessan",
      role: "Membre depuis 2015",
      approved: true,
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % displayTestimonials.length);
    }, 5500);
    return () => clearInterval(id);
  }, [displayTestimonials.length]);

  return (
    <section className="section" id="temoignages" ref={ref}>
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Témoignages</span>
          <h2>Ce que notre communauté en dit</h2>
        </div>

        <div className="testi-wrap">
          {displayTestimonials.map((t, i) => (
            <div
              className={`testi-slide ${i === current ? "active" : ""}`}
              key={t.name}
            >
              <div className="quote-mark">&ldquo;</div>
              <p>{t.text}</p>
              <div className="testi-author">
                <div className="testi-avatar"></div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testi-dots">
          {displayTestimonials.map((t, i) => (
            <button
              key={t.name}
              className={i === current ? "active" : ""}
              aria-label={`Témoignage ${i + 1}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <a href="/temoignages" className="btn btn-outline">
            Partager votre témoignage
          </a>
        </div>
      </div>
    </section>
  );
}
