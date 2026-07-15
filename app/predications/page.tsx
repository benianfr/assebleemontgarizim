"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { useRevealOnScroll } from "@/components/useRevealOnScroll";
import { getSermons, Sermon } from "@/lib/firestore";

export default function PredicationsPage() {
  const ref1 = useRevealOnScroll();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "Tous", count: 24 },
    { name: "Foi", count: 6 },
    { name: "Amour", count: 5 },
    { name: "Grâce", count: 4 },
    { name: "Prière", count: 4 },
    { name: "Espérance", count: 3 },
    { name: "Identité", count: 2 },
  ];

  useEffect(() => {
    async function fetchData() {
      const sermonsRes = await getSermons();
      if (sermonsRes.success) {
        const sermonsWithDates = sermonsRes.sermons.map(sermon => ({
          ...sermon,
          date: sermon.date instanceof Date ? sermon.date.toLocaleDateString('fr-FR') : 
                sermon.date?.seconds ? new Date(sermon.date.seconds * 1000).toLocaleDateString('fr-FR') : 
                sermon.date || ''
        }));
        setSermons(sermonsWithDates);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
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

  const displaySermons = sermons.length > 0 ? sermons : [
    {
      imageUrl: "",
      imagePublicId: "",
      title: "Marcher par la foi, non par la vue",
      preacher: "Pasteur Jean Koffi",
      date: "28 juin 2026",
      duration: "42 min",
      description: "Dans ce message, nous explorons comment vivre une vie de foi authentique qui transcende les circonstances visibles. Apprenez à vous appuyer sur les promesses de Dieu plutôt que sur ce que vous voyez.",
      category: "Foi",
      scripture: "2 Corinthiens 5:7",
      order: 1,
    },
    {
      imageUrl: "",
      imagePublicId: "",
      title: "La grâce qui transforme",
      preacher: "Pasteur Marie Aké",
      date: "21 juin 2026",
      duration: "38 min",
      description: "Découvrez la puissance transformatrice de la grâce de Dieu. Ce message explique comment la grâce ne nous sauve pas seulement, mais nous change continuellement à l'image de Christ.",
      category: "Grâce",
      scripture: "Tite 2:11-12",
      order: 2,
    },
    {
      imageUrl: "",
      imagePublicId: "",
      title: "Espérer contre toute espérance",
      preacher: "Pasteur Jean Koffi",
      date: "14 juin 2026",
      duration: "45 min",
      description: "Quand tout semble perdu, comment garder espoir ? Ce message nous montre comment Abraham a cru contre toute espérance et comment nous pouvons faire de même.",
      category: "Espérance",
      scripture: "Romains 4:18",
      order: 3,
    },
    {
      imageUrl: "",
      imagePublicId: "",
      title: "L'identité en Christ",
      preacher: "Pasteur Emmanuel Kouassi",
      date: "7 juin 2026",
      duration: "50 min",
      description: "Comprendre qui vous êtes en Christ change tout. Ce message explore notre nouvelle identité en Jésus et comment elle impacte notre vie quotidienne.",
      category: "Identité",
      scripture: "Éphésiens 1:3-14",
      order: 4,
    },
    {
      imageUrl: "",
      imagePublicId: "",
      title: "La puissance de la prière",
      preacher: "Pasteur Marie-Claire Diallo",
      date: "31 mai 2026",
      duration: "40 min",
      description: "La prière n'est pas une option, mais une nécessité. Découvrez les principes bibliques pour une vie de prière puissante et efficace.",
      category: "Prière",
      scripture: "Jacques 5:16",
      order: 5,
    },
    {
      imageUrl: "",
      imagePublicId: "",
      title: "Aimer comme Jésus a aimé",
      preacher: "Pasteur Jean Koffi",
      date: "24 mai 2026",
      duration: "47 min",
      description: "L'amour est au cœur de l'Évangile. Ce message nous défie à aimer non seulement en paroles, mais en actes et en vérité.",
      category: "Amour",
      scripture: "Jean 13:34-35",
      order: 6,
    },
  ];

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero Section */}
        <section className="hero" style={{ minHeight: "60vh", padding: "120px 0 80px" }}>
          <div className="container">
            <div className="hero-content">
              <span className="eyebrow hero-eyebrow">Prédications</span>
              <h1>
                Nourrissez votre <em>foi</em> où que vous soyez
              </h1>
              <p className="lead">
                Accédez à nos prédications pour approfondir votre compréhension
                de la Parole de Dieu. Que vous soyez chez vous ou en déplacement,
                la Parole est à portée de main.
              </p>
            </div>
          </div>
        </section>

        {/* Catégories */}
        <section className="section bg-pale" style={{ padding: "60px 0" }}>
          <div className="container">
            <div className="section-head center" style={{ marginBottom: "30px" }}>
              <span className="eyebrow">Explorer par thème</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "12px" }}>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "100px",
                    border: cat.name === "Tous" ? "none" : "1.5px solid rgba(10,42,77,0.2)",
                    background: cat.name === "Tous" ? "var(--deep-blue)" : "transparent",
                    color: cat.name === "Tous" ? "#fff" : "var(--deep-blue)",
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

        {/* Dernières prédications */}
        <section className="section" ref={ref1}>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Enseignements</span>
              <h2>Dernières prédications</h2>
            </div>
            <div className="scroll-horizontal">
              {displaySermons.map((sermon) => (
                <div className="card" key={sermon.title} onClick={() => setSelectedSermon(sermon)} style={{ cursor: "pointer" }}>
                  <div className="card-media">
                    {sermon.imageUrl ? (
                      <img src={sermon.imageUrl} alt={sermon.title} style={{ width: "100%", height: "auto", objectFit: "cover" }} />
                    ) : (
                      <div className="ph ph-1"></div>
                    )}
                  </div>
                  <div className="card-body">
                    <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          color: "var(--gold)",
                          background: "var(--sky-pale)",
                          padding: "4px 10px",
                          borderRadius: "100px",
                        }}
                      >
                        {sermon.category}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--text-mid)",
                        }}
                      >
                        {sermon.duration}
                      </span>
                    </div>
                    <h3>{sermon.title}</h3>
                    <p style={{ fontSize: "13px", color: "var(--text-mid)", marginBottom: "8px" }}>
                      {sermon.preacher} — {sermon.date}
                    </p>
                    <p style={{ fontSize: "13.5px", lineHeight: "1.65", marginBottom: "16px" }}>
                      {sermon.description}
                    </p>
                    <div style={{ fontSize: "12px", color: "var(--text-mid)", fontStyle: "italic", marginBottom: "12px" }}>
                      {sermon.scripture}
                    </div>
                    {sermon.videoUrl && (
                      <a
                        href={sermon.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: "inline-block",
                          padding: "8px 16px",
                          background: "var(--gold)",
                          color: "#fff",
                          textDecoration: "none",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "13px",
                          fontWeight: 600,
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#d4a017"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "var(--gold)"}
                      >
                        Regarder la vidéo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <h2>Ne manquez aucune prédication</h2>
            <p>
              Abonnez-vous à notre chaîne YouTube pour recevoir les nouvelles
              prédications dès leur publication et être notifié des enseignements à venir.
            </p>
            <div className="cta-buttons">
              <a href="#" className="btn btn-gold">
                S'abonner sur YouTube
              </a>
              <a href="/contact" className="btn btn-outline">
                Demander un enseignement
              </a>
            </div>
          </div>
        </section>

        {/* Modal */}
        {selectedSermon && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedSermon(null)}
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
                maxWidth: "700px",
                width: "100%",
                maxHeight: "90vh",
                overflow: "auto",
                padding: "32px",
                position: "relative",
              }}
            >
              <button
                onClick={() => setSelectedSermon(null)}
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
              <div style={{ width: "100%", height: "300px", borderRadius: "var(--radius-md)", marginBottom: "24px", overflow: "hidden" }}>
                {selectedSermon.videoUrl && getYouTubeVideoId(selectedSermon.videoUrl) ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedSermon.videoUrl)}`}
                    title={selectedSermon.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: "var(--radius-md)" }}
                  />
                ) : selectedSermon.imageUrl ? (
                  <img src={selectedSermon.imageUrl} alt={selectedSermon.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-md)" }} />
                ) : (
                  <div className="ph ph-1" style={{ width: "100%", height: "100%", borderRadius: "var(--radius-md)" }}></div>
                )}
              </div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
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
                  {selectedSermon.category}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-mid)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {selectedSermon.duration}
                </span>
              </div>
              <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>{selectedSermon.title}</h2>
              <p style={{ fontSize: "14px", color: "var(--text-mid)", marginBottom: "8px" }}>
                {selectedSermon.preacher} — {selectedSermon.date}
              </p>
              <p style={{ fontSize: "16px", lineHeight: "1.7", marginBottom: "24px", color: "var(--text-mid)" }}>
                {selectedSermon.description}
              </p>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "20px", marginBottom: "24px" }}>
                <div style={{ fontSize: "14px", fontStyle: "italic", color: "var(--text-mid)" }}>
                  {selectedSermon.scripture}
                </div>
              </div>
              {selectedSermon.videoUrl ? (
                <a href={selectedSermon.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ display: "inline-block", marginRight: "12px" }}>
                  Regarder sur YouTube
                </a>
              ) : (
                <a href="#" className="btn btn-gold" style={{ display: "inline-block", marginRight: "12px" }}>
                  Regarder sur YouTube
                </a>
              )}
              <a href="/contact" className="btn btn-outline" style={{ display: "inline-block" }}>
                Demander un enseignement
              </a>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
