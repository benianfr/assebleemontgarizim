"use client";

import { useEffect, useState } from "react";
import { useRevealOnScroll } from "./useRevealOnScroll";
import { getValues, Value, getAboutSection, AboutSection } from "@/lib/firestore";

export default function About() {
  const ref = useRevealOnScroll<HTMLElement>();
  const [values, setValues] = useState<Value[]>([]);
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [valuesRes, aboutRes] = await Promise.all([
        getValues(),
        getAboutSection(),
      ]);
      if (valuesRes.success) {
        setValues(valuesRes.values);
      }
      if (aboutRes.success && aboutRes.aboutSection) {
        setAboutSection(aboutRes.aboutSection);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const points = values.length > 0 ? values.map(v => ({ title: v.title, text: v.text })) : [
    { title: "Enseignement biblique", text: "Fidèle et accessible à tous" },
    { title: "Vie communautaire", text: "Des groupes à taille humaine" },
    { title: "Service et mission", text: "Tournés vers les autres" },
    { title: "Familles et enfants", text: "Un accueil pensé pour chacun" },
  ];

  return (
    <section className="section" id="about" ref={ref}>
      <div className="container about-grid">
        <div className="about-media reveal">
          {aboutSection?.imageUrl ? (
            <img
              src={aboutSection.imageUrl}
              alt="Notre église"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div className="ph"></div>
          )}
          <div className="tag">
            <strong>{aboutSection?.years || 18} années</strong>
            <span>{aboutSection?.yearsText || "au service de la communauté d'Abidjan"}</span>
          </div>
        </div>

        <div className="about-text reveal reveal-delay-1">
          <span className="eyebrow">{aboutSection?.title || "Notre église"}</span>
          <h2>{aboutSection?.subtitle || "Un lieu où la foi devient un mode de vie"}</h2>
          <p className="lead">
            {aboutSection?.description || "Depuis notre fondation, l'Assemblée Mont Garizim accompagne des hommes et des femmes de toutes générations dans leur cheminement spirituel. Nous croyons en une foi vivante, incarnée dans la prière, l'étude de la Parole et le service du prochain."}
          </p>

          <div className="about-points">
            {points.map((p) => (
              <div className="about-point" key={p.title}>
                <span className="dot"></span>
                <div>
                  <strong>{p.title}</strong>
                  <span>{p.text}</span>
                </div>
              </div>
            ))}
          </div>

          <a href="/ministeres" className="btn btn-outline-dark">
            En savoir plus
          </a>
        </div>
      </div>
    </section>
  );
}
