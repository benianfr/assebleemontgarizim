"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { useRevealOnScroll } from "@/components/useRevealOnScroll";
import { getUpcomingEvents, getPastEvents, Event } from "@/lib/firestore";

export default function EvenementsPage() {
  const ref1 = useRevealOnScroll();
  const ref2 = useRevealOnScroll();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [upcomingRes, pastRes] = await Promise.all([
        getUpcomingEvents(),
        getPastEvents(),
      ]);

      if (upcomingRes.success) {
        setUpcomingEvents(upcomingRes.events);
      }
      if (pastRes.success) {
        setPastEvents(pastRes.pastEvents);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  // Generate categories dynamically from events
  const categories = (() => {
    const allEvents = [...upcomingEvents, ...pastEvents];
    const categoryCount = allEvents.reduce((acc, event) => {
      const category = event.category || "Autre";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryArray = Object.entries(categoryCount).map(([name, count]) => ({ name, count }));
    categoryArray.sort((a, b) => b.count - a.count);

    return [{ name: "Tous", count: allEvents.length }, ...categoryArray];
  })();

  // Filter events by selected category
  const filteredUpcomingEvents = selectedCategory === "Tous"
    ? upcomingEvents
    : upcomingEvents.filter(event => event.category === selectedCategory);

  const filteredPastEvents = selectedCategory === "Tous"
    ? pastEvents
    : pastEvents.filter(event => event.category === selectedCategory);

  // Truncate description function
  const truncateDescription = (description: string, maxLength: number = 120) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <p>Chargement...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero Section */}
        <section className="hero" style={{ minHeight: "60vh", padding: "120px 0 80px" }}>
          <div className="container">
            <div className="hero-content">
              <span className="eyebrow hero-eyebrow">Événements</span>
              <h1>
                Vivez des moments <em>inoubliables</em> en communauté
              </h1>
              <p className="lead">
                Découvrez nos prochains événements et rejoignez-nous pour des
                temps forts de foi, de fraternité et de célébration. Chaque
                événement est une opportunité de grandir ensemble.
              </p>
            </div>
          </div>
        </section>

        {/* Catégories */}
        <section className="section bg-pale" style={{ padding: "60px 0" }}>
          <div className="container">
            <div className="section-head center" style={{ marginBottom: "30px" }}>
              <span className="eyebrow">Filtrer par catégorie</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "12px" }}>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "100px",
                    border: cat.name === selectedCategory ? "none" : "1.5px solid rgba(10,42,77,0.2)",
                    background: cat.name === selectedCategory ? "var(--deep-blue)" : "transparent",
                    color: cat.name === selectedCategory ? "#fff" : "var(--deep-blue)",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Événements à venir */}
        <section className="section" ref={ref1}>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Agenda</span>
              <h2>Prochains événements</h2>
            </div>
            <div className="scroll-horizontal">
              {filteredUpcomingEvents.map((event, index) => (
                <div className="card" key={event.title} onClick={() => setSelectedEvent(event)} style={{ cursor: "pointer" }}>
                  <div className="card-media">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.title} style={{ width: "100%", height: "auto", objectFit: "cover" }} />
                    ) : (
                      <div className="ph ph-1"></div>
                    )}
                  </div>
                  <div className="card-body">
                    <div style={{ display: "flex", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                      <span className="tl-date">
                        {(() => {
                          const date = event.date as any;
                          if (!date) return "";
                          if (date instanceof Date) return date.toLocaleDateString('fr-FR');
                          if (date.toDate) return date.toDate().toLocaleDateString('fr-FR');
                          return String(date);
                        })()}
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          color: "var(--gold)",
                          background: "var(--sky-pale)",
                          padding: "6px 12px",
                          borderRadius: "100px",
                        }}
                      >
                        {event.category}
                      </span>
                    </div>
                    <h3>{event.title}</h3>
                    <div className="tl-meta">
                      <span>{event.place}</span>
                      <span>{event.time}</span>
                    </div>
                    <p style={{ fontSize: "13.5px", lineHeight: "1.65" }}>{truncateDescription(event.description)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Événements passés */}
        <section className="section bg-pale" ref={ref2}>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Archives</span>
              <h2>Événements passés</h2>
            </div>
            <div className="scroll-horizontal">
              {filteredPastEvents.map((event) => (
                <div className="card" key={event.title}>
                  <div className="card-media">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.title} style={{ width: "100%", height: "auto", objectFit: "cover" }} />
                    ) : (
                      <div className="ph ph-1"></div>
                    )}
                  </div>
                  <div className="card-body">
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        color: "var(--text-mid)",
                        marginBottom: "8px",
                      }}
                    >
                      {(() => {
                        const date = event.date as any;
                        if (!date) return "";
                        if (date instanceof Date) return date.toLocaleDateString('fr-FR');
                        if (date.toDate) return date.toDate().toLocaleDateString('fr-FR');
                        return String(date);
                      })()}
                    </span>
                    <h3>{event.title}</h3>
                    <p style={{ fontSize: "13.5px", lineHeight: "1.65" }}>
                      {truncateDescription(event.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <h2>Ne manquez aucun événement</h2>
            <p>
              Inscrivez-vous à notre newsletter pour recevoir les annonces de
              nos événements à venir et ne manquer aucune occasion de nous rejoindre.
            </p>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-gold">
                S'inscrire à la newsletter
              </a>
              <a href="/ministeres" className="btn btn-outline">
                Découvrir nos ministères
              </a>
            </div>
          </div>
        </section>

        {/* Modal */}
        {selectedEvent && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedEvent(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: "var(--radius-md)",
                maxWidth: "600px",
                width: "100%",
                maxHeight: "90vh",
                overflow: "auto",
                padding: "32px",
                position: "relative",
              }}
            >
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "none",
                  border: "none",
                  fontSize: "28px",
                  cursor: "pointer",
                  color: "var(--text-mid)",
                }}
              >
                ×
              </button>
              <div style={{ width: "100%", height: "250px", borderRadius: "var(--radius-md)", marginBottom: "24px" }}>
                {selectedEvent.imageUrl ? (
                  <img src={selectedEvent.imageUrl} alt={selectedEvent.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-md)" }} />
                ) : (
                  <div className="ph ph-1" style={{ width: "100%", height: "100%", borderRadius: "var(--radius-md)" }}></div>
                )}
              </div>
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
                <span className="tl-date">
                  {(() => {
                    const date = selectedEvent.date as any;
                    if (!date) return "";
                    if (date instanceof Date) return date.toLocaleDateString('fr-FR');
                    if (date.toDate) return date.toDate().toLocaleDateString('fr-FR');
                    return String(date);
                  })()}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    background: "var(--sky-pale)",
                    padding: "6px 12px",
                    borderRadius: "100px",
                  }}
                >
                  {selectedEvent.category}
                </span>
              </div>
              <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>{selectedEvent.title}</h2>
              <p style={{ fontSize: "16px", lineHeight: "1.7", marginBottom: "24px", color: "var(--text-mid)" }}>
                {selectedEvent.description}
              </p>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "20px" }}>
                <div style={{ marginBottom: "12px" }}>
                  <strong>Lieu :</strong> {selectedEvent.place}
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <strong>Horaires :</strong> {selectedEvent.time}
                </div>
              </div>
              <a href="/contact" className="btn btn-gold" style={{ marginTop: "24px", display: "inline-block" }}>
                S'inscrire à cet événement
              </a>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
