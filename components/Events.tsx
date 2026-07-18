"use client";

import { useEffect, useState } from "react";
import { useRevealOnScroll } from "./useRevealOnScroll";
import { getUpcomingEvents, Event } from "@/lib/firestore";

const formatDate = (date: any) => {
  if (!date) return "";
  if (date.toDate) return date.toDate().toLocaleDateString("fr-FR");
  if (date instanceof Date) return date.toLocaleDateString("fr-FR");
  return String(date);
};

export default function Events() {
  const ref = useRevealOnScroll<HTMLElement>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      console.log("Fetching events...");
      const result = await getUpcomingEvents();
      console.log("Events result:", result);
      if (result.success) {
        setEvents(result.events);
        console.log("Events set:", result.events);
      } else {
        console.error("Failed to fetch events:", result.error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <section
      className="section"
      id="evenements"
      style={{ padding: "100px 0", backgroundColor: "white" }}
      ref={ref}
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
            PROCHAINS ÉVÉNEMENTS
          </span>
          <h2 
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: "700",
              color: "#07213D",
              marginBottom: "16px",
            }}
          >
            Vivez des moments forts avec nous
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#666", maxWidth: "600px", margin: "0 auto" }}>
            Rejoignez-nous pour nos prochains événements et cultes spéciaux
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ fontSize: "18px", color: "#666" }}>Chargement des événements...</p>
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#F8F9FA", borderRadius: "16px" }}>
            <p style={{ fontSize: "18px", color: "#666", marginBottom: "16px" }}>
              Aucun événement à venir pour le moment.
            </p>
            <a 
              href="/evenements" 
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
              Voir tous les événements
            </a>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
            gap: "32px" 
          }}>
            {events.map((e, index) => (
              <div
                key={e.id || e.title}
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
                  {e.imageUrl ? (
                    <img
                      src={e.imageUrl}
                      alt={e.title}
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
                      📅
                    </div>
                  )}
                  <div 
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      backgroundColor: "rgba(7, 33, 61, 0.9)",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {formatDate(e.date)}
                  </div>
                </div>
                <div style={{ padding: "24px" }}>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", color: "#07213D", marginBottom: "12px" }}>
                    {e.title}
                  </h3>
                  <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#666", fontSize: "14px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                        <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
                        <circle cx="12" cy="9" r="2.4" />
                      </svg>
                      {e.place}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#666", fontSize: "14px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" strokeLinecap="round" />
                      </svg>
                      {e.time}
                    </div>
                  </div>
                  <p style={{ fontSize: "15px", color: "#666", lineHeight: "1.6", marginBottom: "20px" }}>
                    {e.description}
                  </p>
                  <a 
                    href="/evenements" 
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
                    Voir les détails 
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
            href="/evenements" 
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
            Voir tous les événements
          </a>
        </div>
      </div>
    </section>
  );
}
