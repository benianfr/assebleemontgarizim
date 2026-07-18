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
    }, 6000);
    return () => clearInterval(id);
  }, [displayTestimonials.length]);

  return (
    <section 
      className="section" 
      id="temoignages" 
      ref={ref}
      style={{ 
        padding: "100px 0", 
        backgroundColor: "#07213D",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Pattern */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(232, 206, 122, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(232, 206, 122, 0.1) 0%, transparent 50%)`,
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span 
            style={{
              display: "inline-block",
              padding: "8px 16px",
              backgroundColor: "rgba(232, 206, 122, 0.2)",
              color: "#E8CE7A",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "16px",
              letterSpacing: "1px",
            }}
          >
            TÉMOIGNAGES
          </span>
          <h2 
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: "700",
              color: "white",
              marginBottom: "16px",
            }}
          >
            Ce que notre communauté en dit
          </h2>
          <p style={{ fontSize: "1.1rem", color: "rgba(255, 255, 255, 0.8)", maxWidth: "600px", margin: "0 auto" }}>
            Découvrez les expériences de vie transformées par la foi
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.8)" }}>Chargement des témoignages...</p>
          </div>
        ) : displayTestimonials.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "16px" }}>
            <p style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.8)", marginBottom: "16px" }}>
              Aucun témoignage disponible pour le moment.
            </p>
            <a 
              href="/temoignages" 
              style={{
                display: "inline-block",
                padding: "14px 32px",
                backgroundColor: "#E8CE7A",
                color: "#07213D",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#C9A227"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E8CE7A"}
            >
              Partager votre témoignage
            </a>
          </div>
        ) : (
          <>
            <div style={{ 
              maxWidth: "900px", 
              margin: "0 auto",
              position: "relative",
              minHeight: "300px",
            }}>
              {displayTestimonials.map((t, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    opacity: i === current ? 1 : 0,
                    transform: i === current ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.5s ease",
                    pointerEvents: i === current ? "auto" : "none",
                  }}
                >
                  <div style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "20px",
                    padding: "48px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}>
                    <div 
                      style={{
                        fontSize: "80px",
                        color: "#E8CE7A",
                        lineHeight: "1",
                        marginBottom: "24px",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      "
                    </div>
                    <p 
                      style={{
                        fontSize: "1.25rem",
                        color: "white",
                        lineHeight: "1.8",
                        marginBottom: "32px",
                        fontStyle: "italic",
                      }}
                    >
                      {t.text}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div 
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(232, 206, 122, 0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                          color: "#E8CE7A",
                        }}
                      >
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <strong style={{ display: "block", fontSize: "18px", color: "white" }}>
                          {t.name}
                        </strong>
                        <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>
                          {t.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "40px" }}>
              {displayTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? "40px" : "12px",
                    height: "12px",
                    borderRadius: "6px",
                    backgroundColor: i === current ? "#E8CE7A" : "rgba(255, 255, 255, 0.3)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  aria-label={`Témoignage ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <a 
            href="/temoignages" 
            style={{
              display: "inline-block",
              padding: "14px 32px",
              backgroundColor: "transparent",
              color: "#E8CE7A",
              border: "2px solid #E8CE7A",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E8CE7A";
              e.currentTarget.style.color = "#07213D";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#E8CE7A";
            }}
          >
            Partager votre témoignage
          </a>
        </div>
      </div>
    </section>
  );
}
