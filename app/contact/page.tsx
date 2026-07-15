"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { useRevealOnScroll } from "@/components/useRevealOnScroll";
import { getContactInfo, ContactInfo } from "@/lib/firestore";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ContactPage() {
  const ref = useRevealOnScroll();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const contactRes = await getContactInfo();
      if (contactRes.success) setContactInfo(contactRes.contactInfo);
      setLoading(false);
    }

    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Save to Firestore
      await addDoc(collection(db, "contactMessages"), {
        name,
        email,
        subject,
        message,
        read: false,
        createdAt: new Date(),
      });
      
      // Send to WhatsApp if number is configured
      const whatsappNumber = contactInfo?.whatsapp;
      if (whatsappNumber) {
        const whatsappMessage = encodeURIComponent(
          `Nouveau message de contact\n\nNom: ${name}\nEmail: ${email}\nSujet: ${subject}\nMessage: ${message}`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
      }
      
      alert("Message envoyé avec succès !");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

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

  const displayContactInfo = contactInfo || {
    address: "Cocody, Abidjan, Côte d'Ivoire",
    phone: "+225 07 00 00 00 00",
    email: "contact@montgarizim.org",
    hours: "Dim. 9h–13h · Mer. 18h–20h",
  };

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero Section */}
        <section className="hero" style={{ minHeight: "60vh", padding: "120px 0 80px" }}>
          <div className="container">
            <div className="hero-content">
              <span className="eyebrow hero-eyebrow">Contact</span>
              <h1>
                Nous serions heureux de vous <em>accueillir</em>
              </h1>
              <p className="lead">
                Que vous ayez des questions, souhaitiez nous rejoindre ou
                simplement en savoir plus sur notre église, n'hésitez pas à nous
                contacter. Nous serions ravis d'échanger avec vous.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="section" ref={ref}>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Nous contacter</span>
              <h2>Entrons en contact</h2>
            </div>

            <div className="contact-grid">
              <div className="contact-card">
                <h3>Coordonnées</h3>

                <div className="contact-row">
                  <span className="ico">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"
                        stroke="#E8CE7A"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </span>
                  <div>
                    <small>Adresse</small>
                    <strong>Cocody, Abidjan, Côte d&apos;Ivoire</strong>
                  </div>
                </div>

                <div className="contact-row">
                  <span className="ico">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 5c0 8 7 15 15 15l2-4-6-2-2 2c-2-1-4-3-5-5l2-2-2-6H4z"
                        stroke="#E8CE7A"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </span>
                  <div>
                    <small>Téléphone</small>
                    <strong>+225 07 00 00 00 00</strong>
                  </div>
                </div>

                <div className="contact-row">
                  <span className="ico">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                        stroke="#E8CE7A"
                        strokeWidth="1.6"
                      />
                      <path d="M3 6l9 7 9-7" stroke="#E8CE7A" strokeWidth="1.6" />
                    </svg>
                  </span>
                  <div>
                    <small>Email</small>
                    <strong>contact@montgarizim.org</strong>
                  </div>
                </div>

                <div className="contact-row">
                  <span className="ico">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#E8CE7A" strokeWidth="1.6" />
                      <path d="M12 7v5l3 2" stroke="#E8CE7A" strokeWidth="1.6" />
                    </svg>
                  </span>
                  <div>
                    <small>Horaires</small>
                    <strong>{displayContactInfo.hours}</strong>
                  </div>
                </div>

                <div style={{ marginTop: "30px" }}>
                  <h4 style={{ fontSize: "14px", marginBottom: "16px", color: "#fff" }}>
                    Suivez-nous
                  </h4>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <a
                      href="#"
                      aria-label="Facebook"
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M15 8h2V5h-2c-2 0-3.5 1.5-3.5 3.5V10H9v3h2.5v6h3v-6H17l.5-3h-3V8.7c0-.4.3-.7.5-.7z"
                          fill="#fff"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      aria-label="YouTube"
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="6" width="18" height="12" rx="3" stroke="#fff" strokeWidth="1.5" />
                        <path d="M11 10l4 2-4 2z" fill="#fff" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      aria-label="Instagram"
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="4" y="4" width="16" height="16" rx="4" stroke="#fff" strokeWidth="1.5" />
                        <circle cx="12" cy="12" r="3.2" stroke="#fff" strokeWidth="1.5" />
                        <circle cx="16.6" cy="7.4" r="0.9" fill="#fff" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="form-card">
                <h3>Envoyez-nous un message</h3>
                <form onSubmit={handleSubmit}>
                  <div className="field" style={{ marginBottom: "18px" }}>
                    <label htmlFor="name" style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#0F1F35", marginBottom: "8px" }}>Nom complet</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Votre nom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{ display: "block", width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1.5px solid rgba(10,42,77,0.25)", fontFamily: "sans-serif", fontSize: "14.5px", background: "#fff", color: "#0F1F35", boxSizing: "border-box" }}
                    />
                  </div>
                  <div className="field" style={{ marginBottom: "18px" }}>
                    <label htmlFor="email" style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#0F1F35", marginBottom: "8px" }}>Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ display: "block", width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1.5px solid rgba(10,42,77,0.25)", fontFamily: "sans-serif", fontSize: "14.5px", background: "#fff", color: "#0F1F35", boxSizing: "border-box" }}
                    />
                  </div>
                  <div className="field" style={{ marginBottom: "18px" }}>
                    <label htmlFor="subject" style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#0F1F35", marginBottom: "8px" }}>Sujet</label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="Sujet de votre message"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      style={{ display: "block", width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1.5px solid rgba(10,42,77,0.25)", fontFamily: "sans-serif", fontSize: "14.5px", background: "#fff", color: "#0F1F35", boxSizing: "border-box" }}
                    />
                  </div>
                  <div className="field" style={{ marginBottom: "18px" }}>
                    <label htmlFor="message" style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#0F1F35", marginBottom: "8px" }}>Message</label>
                    <textarea
                      id="message"
                      placeholder="Comment pouvons-nous vous aider ?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      style={{ display: "block", width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1.5px solid rgba(10,42,77,0.25)", fontFamily: "sans-serif", fontSize: "14.5px", background: "#fff", color: "#0F1F35", boxSizing: "border-box", minHeight: "110px", resize: "vertical" }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-navy"
                    disabled={submitting}
                    style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
                  >
                    {submitting ? "Envoi en cours..." : "Envoyer le message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <h2>Venez nous rencontrer</h2>
            <p>
              Rien ne remplace une rencontre en personne. Nous serions ravis de
              vous accueillir lors de nos cultes et activités.
            </p>
            <div className="cta-buttons">
              <a href="/evenements" className="btn btn-gold">
                Voir les événements
              </a>
              <a href="/ministeres" className="btn btn-outline">
                Découvrir nos ministères
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
