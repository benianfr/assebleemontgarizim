"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { useRevealOnScroll } from "@/components/useRevealOnScroll";
import { getMinistries, getValues, Ministry, Value } from "@/lib/firestore";

export default function MinisteresPage() {
  const ref1 = useRevealOnScroll();
  const ref2 = useRevealOnScroll();
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [values, setValues] = useState<Value[]>([]);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [ministriesRes, valuesRes] = await Promise.all([
        getMinistries(),
        getValues(),
      ]);

      if (ministriesRes.success) setMinistries(ministriesRes.ministries);
      if (valuesRes.success) setValues(valuesRes.values);

      setLoading(false);
    }

    fetchData();
  }, []);

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
              <span className="eyebrow hero-eyebrow">Nos ministères</span>
              <h1>
                Servez avec <em>passion</em>, grandissez ensemble
              </h1>
              <p className="lead">
                Nos ministères sont des lieux où vous pouvez utiliser vos talents
                pour servir Dieu, développer des relations profondes et grandir
                dans votre foi. Rejoignez l'équipe qui vous correspond.
              </p>
            </div>
          </div>
        </section>

        {/* Ministères détaillés */}
        <section className="section bg-pale" ref={ref1}>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Découvrir nos ministères</span>
              <h2>Des opportunités pour servir et grandir</h2>
            </div>
            <div className="scroll-horizontal">
              {ministries.map((ministry) => (
                <div className="card" key={ministry.title} onClick={() => setSelectedMinistry(ministry)} style={{ cursor: "pointer" }}>
                  <div className="card-media">
                    {ministry.imageUrl ? (
                      <img src={ministry.imageUrl} alt={ministry.title} style={{ width: "100%", height: "auto", objectFit: "cover" }} />
                    ) : (
                      <div className="ph ph-1"></div>
                    )}
                  </div>
                  <div className="card-body">
                    <h3>{ministry.title}</h3>
                    <p style={{ fontSize: "13.5px", lineHeight: "1.65" }}>
                      {ministry.description}
                    </p>
                    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
                      <div style={{ fontSize: "12.5px", color: "var(--text-mid)", marginBottom: "8px" }}>
                        <strong>Horaires :</strong> {ministry.schedule}
                      </div>
                      <div style={{ fontSize: "12.5px", color: "var(--text-mid)" }}>
                        <strong>Responsable :</strong> {ministry.leader}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Valeurs */}
        <section className="section" ref={ref2}>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Nos valeurs</span>
              <h2>Ce qui guide notre service</h2>
            </div>
            <div className="values-scroll">
              {values.map((value) => (
                <div className="value-card" key={value.title}>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <h2>Rejoignez un ministère</h2>
            <p>
              Que vous soyez jeune ou moins jeune, il y a une place pour vous.
              Contactez-nous pour découvrir comment vous pouvez vous impliquer.
            </p>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-gold">
                Nous contacter
              </a>
              <a href="/a-propos" className="btn btn-outline">
                En savoir plus sur l'église
              </a>
            </div>
          </div>
        </section>

        {/* Modal */}
        {selectedMinistry && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedMinistry(null)}
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
                onClick={() => setSelectedMinistry(null)}
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
                {selectedMinistry.imageUrl ? (
                  <img src={selectedMinistry.imageUrl} alt={selectedMinistry.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-md)" }} />
                ) : (
                  <div className="ph ph-1" style={{ width: "100%", height: "100%", borderRadius: "var(--radius-md)" }}></div>
                )}
              </div>
              <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>{selectedMinistry.title}</h2>
              <p style={{ fontSize: "16px", lineHeight: "1.7", marginBottom: "24px", color: "var(--text-mid)" }}>
                {selectedMinistry.description}
              </p>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "20px" }}>
                <div style={{ marginBottom: "12px" }}>
                  <strong>Horaires :</strong> {selectedMinistry.schedule}
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <strong>Responsable :</strong> {selectedMinistry.leader}
                </div>
              </div>
              <a href="/contact" className="btn btn-gold" style={{ marginTop: "24px", display: "inline-block" }}>
                Rejoindre ce ministère
              </a>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
