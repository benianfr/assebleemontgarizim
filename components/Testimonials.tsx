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
      console.log("Fetching testimonials...");
      const result = await getApprovedTestimonials();
      console.log("Testimonials result:", result);
      if (result.success) {
        setTestimonials(result.testimonials);
        console.log("Testimonials set:", result.testimonials);
      } else {
        console.error("Failed to fetch testimonials:", result.error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const displayTestimonials = testimonials.map(t => ({
    text: t.temoignage,
    name: `${t.prenom} ${t.nom}`,
    role: t.titre,
    approved: t.approved,
    createdAt: t.createdAt,
  }));

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

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Chargement des témoignages...</p>
          </div>
        ) : displayTestimonials.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Aucun témoignage disponible pour le moment.</p>
            <a href="/temoignages" className="btn btn-outline" style={{ marginTop: "10px", display: "inline-block" }}>
              Partager votre témoignage
            </a>
          </div>
        ) : (
          <>
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
          </>
        )}
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <a href="/temoignages" className="btn btn-outline">
            Partager votre témoignage
          </a>
        </div>
      </div>
    </section>
  );
}
