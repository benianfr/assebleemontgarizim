"use client";

import { useEffect, useState } from "react";
import { useRevealOnScroll } from "./useRevealOnScroll";
import { getSermons, Sermon } from "@/lib/firestore";

export default function Sermons() {
  const ref = useRevealOnScroll<HTMLElement>();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      console.log("Fetching sermons...");
      const result = await getSermons();
      console.log("Sermons result:", result);
      if (result.success) {
        setSermons(result.sermons);
        console.log("Sermons set:", result.sermons);
      } else {
        console.error("Failed to fetch sermons:", result.error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const displaySermons = sermons;

  return (
    <section 
      className="section" 
      id="predications" 
      ref={ref}
      style={{ padding: "100px 0", backgroundColor: "#F8F9FA" }}
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
            DERNIÈRES PRÉDICATIONS
          </span>
          <h2 
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: "700",
              color: "#07213D",
              marginBottom: "16px",
            }}
          >
            Nourrissez votre foi où que vous soyez
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#666", maxWidth: "600px", margin: "0 auto" }}>
            Accédez à nos enseignements bibliques en ligne
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ fontSize: "18px", color: "#666" }}>Chargement des prédications...</p>
          </div>
        ) : displaySermons.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", backgroundColor: "white", borderRadius: "16px" }}>
            <p style={{ fontSize: "18px", color: "#666", marginBottom: "16px" }}>
              Aucune prédication disponible pour le moment.
            </p>
            <a 
              href="/predications" 
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
              Voir toutes les prédications
            </a>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
            gap: "32px" 
          }}>
            {displaySermons.map((s, index) => (
              <div
                key={s.id || s.title}
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
                }}
              >
                <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                  {s.imageUrl ? (
                    <img
                      src={s.imageUrl}
                      alt={s.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                  ) : (
                    <div 
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#EAF2FB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#C9A227",
                        fontSize: "48px",
                      }}
                    >
                      📺
                    </div>
                  )}
                  <div 
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "64px",
                      height: "64px",
                      backgroundColor: "rgba(232, 206, 122, 0.9)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#E8CE7A";
                      e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(232, 206, 122, 0.9)";
                      e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div 
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      right: "16px",
                      backgroundColor: "rgba(7, 33, 61, 0.9)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {s.duration}
                  </div>
                </div>
                <div style={{ padding: "24px" }}>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", color: "#07213D", marginBottom: "12px" }}>
                    {s.title}
                  </h3>
                  <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#666", fontSize: "14px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {s.preacher}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#666", fontSize: "14px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
                      </svg>
                      {s.date}
                    </div>
                  </div>
                  {s.scripture && (
                    <p style={{ 
                      fontSize: "14px", 
                      color: "#C9A227", 
                      fontStyle: "italic", 
                      marginBottom: "16px",
                      fontWeight: "500"
                    }}>
                      "{s.scripture}"
                    </p>
                  )}
                  <a 
                    href="/predications" 
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#C9A227",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "14px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#E8CE7A"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#C9A227"}
                  >
                    Regarder 
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <a 
            href="/predications" 
            style={{
              display: "inline-block",
              padding: "14px 32px",
              backgroundColor: "transparent",
              color: "#07213D",
              border: "2px solid #07213D",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#07213D";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#07213D";
            }}
          >
            Voir toutes les prédications
          </a>
        </div>
      </div>
    </section>
  );
}
