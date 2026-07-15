"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { submitTestimonial, getApprovedTestimonials, Testimonial } from "@/lib/firestore";

export default function TemoignagesPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    titre: "",
    temoignage: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      const result = await getApprovedTestimonials();
      if (result.success) setTestimonials(result.testimonials);
      setTestimonialsLoading(false);
    }

    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await submitTestimonial(formData);

    if (result.success) {
      setSubmitted(true);
      setFormData({
        nom: "",
        prenom: "",
        telephone: "",
        titre: "",
        temoignage: ""
      });
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      setError("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero" style={{ minHeight: "50vh", padding: "100px 0 60px" }}>
          <div className="container">
            <div className="hero-content">
              <span className="eyebrow hero-eyebrow">Témoignages</span>
              <h1>
                Partagez votre <em>expérience</em>
              </h1>
              <p className="lead">
                Votre témoignage peut encourager d'autres personnes dans leur
                parcours de foi. Partagez avec nous comment Dieu a agi dans votre vie.
              </p>
            </div>
          </div>
        </section>

        <section className="section bg-pale">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Votre témoignage</span>
              <h2>Racontez votre histoire</h2>
            </div>

            {submitted ? (
              <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px", background: "#fff", borderRadius: "var(--radius-md)", textAlign: "center", boxShadow: "var(--shadow-card)" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--sky-pale)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 style={{ fontSize: "24px", marginBottom: "12px", color: "var(--deep-blue)" }}>
                  Merci pour votre témoignage !
                </h3>
                <p style={{ color: "var(--text-mid)", lineHeight: "1.7" }}>
                  Votre témoignage a été soumis avec succès. Nous le revérifierons et le publierons prochainement.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ maxWidth: "700px", margin: "0 auto", background: "#fff", padding: "40px", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-card)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--deep-blue)" }}>
                      Nom *
                    </label>
                    <input type="text" name="nom" value={formData.nom} onChange={handleChange} required style={{ width: "100%", padding: "12px 16px", border: "1.5px solid var(--line)", borderRadius: "var(--radius-sm)", fontSize: "15px", transition: "border-color 0.3s ease" }} placeholder="Votre nom" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--deep-blue)" }}>
                      Prénom *
                    </label>
                    <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required style={{ width: "100%", padding: "12px 16px", border: "1.5px solid var(--line)", borderRadius: "var(--radius-sm)", fontSize: "15px", transition: "border-color 0.3s ease" }} placeholder="Votre prénom" />
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--deep-blue)" }}>
                    Numéro de téléphone *
                  </label>
                  <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required style={{ width: "100%", padding: "12px 16px", border: "1.5px solid var(--line)", borderRadius: "var(--radius-sm)", fontSize: "15px", transition: "border-color 0.3s ease" }} placeholder="+225 XX XX XX XX XX" />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--deep-blue)" }}>
                    Titre du témoignage *
                  </label>
                  <input type="text" name="titre" value={formData.titre} onChange={handleChange} required style={{ width: "100%", padding: "12px 16px", border: "1.5px solid var(--line)", borderRadius: "var(--radius-sm)", fontSize: "15px", transition: "border-color 0.3s ease" }} placeholder="Ex: Comment Dieu a transformé ma vie" />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--deep-blue)" }}>
                    Votre témoignage *
                  </label>
                  <textarea name="temoignage" value={formData.temoignage} onChange={handleChange} required rows={8} style={{ width: "100%", padding: "12px 16px", border: "1.5px solid var(--line)", borderRadius: "var(--radius-sm)", fontSize: "15px", lineHeight: "1.7", resize: "vertical", transition: "border-color 0.3s ease" }} placeholder="Partagez votre expérience de foi et comment Dieu a agi dans votre vie..." />
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
                  {loading ? "Envoi en cours..." : "Envoyer mon témoignage"}
                </button>

                {error && (
                  <p style={{ fontSize: "13px", color: "#dc2626", marginTop: "12px", textAlign: "center" }}>
                    {error}
                  </p>
                )}

                <p style={{ fontSize: "13px", color: "var(--text-mid)", marginTop: "16px", textAlign: "center" }}>
                  * Champs obligatoires
                </p>
              </form>
            )}
          </div>
        </section>

        {/* Display approved testimonials */}
        {testimonials.length > 0 && (
          <section className="section">
            <div className="container">
              <div className="section-head center">
                <span className="eyebrow">Témoignages</span>
                <h2>Histoires de transformation</h2>
              </div>
              <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.titre}
                    style={{
                      background: "#fff",
                      borderRadius: "var(--radius-md)",
                      padding: "32px",
                      marginBottom: "24px",
                      border: "1px solid var(--line)",
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    <h3 style={{ fontSize: "20px", marginBottom: "16px", color: "var(--deep-blue)" }}>
                      {testimonial.titre}
                    </h3>
                    <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-mid)", marginBottom: "16px" }}>
                      {testimonial.temoignage}
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--gold)" }}>
                      {testimonial.prenom} {testimonial.nom}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="cta-section">
          <div className="container">
            <h2>Découvrez d'autres témoignages</h2>
            <p>
              Lisez les histoires de membres de notre communauté et soyez encouragé
              dans votre propre parcours de foi.
            </p>
            <div className="cta-buttons">
              <a href="/" className="btn btn-gold">
                Retour à l'accueil
              </a>
              <a href="/contact" className="btn btn-outline">
                Nous contacter
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
