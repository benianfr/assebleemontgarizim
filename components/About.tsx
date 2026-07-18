"use client";

import { useEffect, useState } from "react";
import { useRevealOnScroll } from "./useRevealOnScroll";
import { getValues, Value, getAboutSection, AboutSection, getGalleryImages, GalleryImage } from "@/lib/firestore";

export default function About() {
  const ref = useRevealOnScroll<HTMLElement>();
  const [values, setValues] = useState<Value[]>([]);
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [valuesRes, aboutRes, galleryRes] = await Promise.all([
        getValues(),
        getAboutSection(),
        getGalleryImages(),
      ]);
      if (valuesRes.success) {
        setValues(valuesRes.values);
      }
      if (aboutRes.success && aboutRes.aboutSection) {
        setAboutSection(aboutRes.aboutSection);
      }
      if (galleryRes.success) {
        setGalleryImages(galleryRes.images.slice(0, 4));
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
    <section 
      className="section" 
      id="about" 
      ref={ref}
      style={{
        padding: "100px 0",
        backgroundColor: "#F8F9FA",
      }}
    >
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span 
            style={{
              display: "inline-block",
              padding: "8px 16px",
              backgroundColor: "rgba(232, 206, 122, 0.2)",
              color: "#C9A227",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "16px",
              letterSpacing: "1px",
            }}
          >
            À PROPOS DE NOUS
          </span>
          <h2 
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: "700",
              color: "#07213D",
              marginBottom: "16px",
            }}
          >
            {aboutSection?.subtitle || "Un lieu où la foi devient un mode de vie"}
          </h2>
          <p 
            style={{
              fontSize: "1.1rem",
              color: "#666",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.8",
            }}
          >
            {aboutSection?.description || "Depuis notre fondation, l'Assemblée Mont Garizim accompagne des hommes et des femmes de toutes générations dans leur cheminement spirituel. Nous croyons en une foi vivante, incarnée dans la prière, l'étude de la Parole et le service du prochain."}
          </p>
        </div>

        {/* Image Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(4, 1fr)", 
          gap: "16px", 
          marginBottom: "60px" 
        }}>
          {galleryImages.slice(0, 4).map((img, index) => (
            <div 
              key={index}
              style={{
                position: "relative",
                aspectRatio: "1",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={img.imageUrl}
                alt={img.caption || "Galerie"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              />
            </div>
          ))}
        </div>

        {/* Stats Card */}
        <div 
          style={{
            backgroundColor: "#07213D",
            borderRadius: "16px",
            padding: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "32px",
            marginBottom: "60px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Image */}
          {galleryImages.length > 0 && (
            <img
              src={galleryImages[0].imageUrl}
              alt="Background"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.15,
                pointerEvents: "none",
              }}
            />
          )}
          
          <div style={{ color: "white", position: "relative", zIndex: 1 }}>
            <span 
              style={{
                display: "block",
                fontSize: "48px",
                fontWeight: "700",
                color: "#E8CE7A",
                marginBottom: "8px",
              }}
            >
              {aboutSection?.years || 18}+
            </span>
            <span style={{ fontSize: "16px", opacity: 0.9 }}>
              {aboutSection?.yearsText || "années au service de la communauté"}
            </span>
          </div>
          <a 
            href="/a-propos" 
            style={{
              display: "inline-block",
              padding: "14px 32px",
              backgroundColor: "#E8CE7A",
              color: "#07213D",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              position: "relative",
              zIndex: 1,
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#C9A227"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E8CE7A"}
          >
            En savoir plus
          </a>
        </div>
      </div>
    </section>
  );
}
