"use client";

import { useState, useEffect } from "react";
import { useRevealOnScroll } from "./useRevealOnScroll";
import { getContactInfo, ContactInfo, getGalleryImages, GalleryImage } from "@/lib/firestore";

export default function Contact() {
  const ref = useRevealOnScroll<HTMLElement>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [contactRes, galleryRes] = await Promise.all([
        getContactInfo(),
        getGalleryImages(),
      ]);
      if (contactRes.success && contactRes.contactInfo) {
        setContactInfo(contactRes.contactInfo);
      }
      if (galleryRes.success) {
        setGalleryImages(galleryRes.images.slice(0, 3));
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const displayContact = contactInfo || {
    address: "Cocody, Abidjan, Côte d'Ivoire",
    phone: "+225 07 00 00 00 00",
    email: "contact@montgarizim.org",
    hours: "Dim. 9h–13h · Mer. 18h–20h",
  };

  return (
    <section 
      className="section" 
      id="contact" 
      ref={ref}
      style={{ padding: "100px 0", backgroundColor: "white" }}
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
            CONTACT
          </span>
          <h2 
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: "700",
              color: "#07213D",
              marginBottom: "16px",
            }}
          >
            Nous serions heureux de vous accueillir
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#666", maxWidth: "600px", margin: "0 auto" }}>
            N'hésitez pas à nous contacter pour toute question ou pour nous rejoindre
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "48px" }}>
          {/* Contact Info Card */}
          <div 
            style={{
              backgroundColor: "#F8F9FA",
              borderRadius: "16px",
              padding: "40px",
            }}
          >
            <h3 style={{ fontSize: "24px", fontWeight: "600", color: "#07213D", marginBottom: "32px" }}>
              Coordonnées
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div 
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "rgba(232, 206, 122, 0.2)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                    <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
                    <circle cx="12" cy="9" r="2.4" />
                  </svg>
                </div>
                <div>
                  <small style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>Adresse</small>
                  <strong style={{ fontSize: "16px", color: "#07213D" }}>{displayContact.address}</strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div 
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "rgba(232, 206, 122, 0.2)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                    <path d="M4 5c0 8 7 15 15 15l2-4-6-2-2 2c-2-1-4-3-5-5l2-2-2-6H4z" />
                  </svg>
                </div>
                <div>
                  <small style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>Téléphone</small>
                  <strong style={{ fontSize: "16px", color: "#07213D" }}>{displayContact.phone}</strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div 
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "rgba(232, 206, 122, 0.2)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 6l9 7 9-7" />
                  </svg>
                </div>
                <div>
                  <small style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>Email</small>
                  <strong style={{ fontSize: "16px", color: "#07213D" }}>{displayContact.email}</strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div 
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "rgba(232, 206, 122, 0.2)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <small style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>Horaires</small>
                  <strong style={{ fontSize: "16px", color: "#07213D" }}>{displayContact.hours}</strong>
                </div>
              </div>
            </div>

            {/* Image Grid */}
            {galleryImages.length > 0 && (
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(3, 1fr)", 
                gap: "12px", 
                marginTop: "32px" 
              }}>
                {galleryImages.slice(0, 3).map((img, index) => (
                  <div 
                    key={index}
                    style={{
                      aspectRatio: "1",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.caption || "Galerie"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Card */}
          <div 
            style={{
              backgroundColor: "#07213D",
              borderRadius: "16px",
              padding: "40px",
              color: "white",
            }}
          >
            <h3 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "32px" }}>
              Envoyez-nous un message
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "24px" }}>
                <label 
                  htmlFor="name" 
                  style={{ 
                    display: "block", 
                    fontSize: "14px", 
                    fontWeight: "600", 
                    marginBottom: "8px",
                    color: "rgba(255, 255, 255, 0.9)"
                  }}
                >
                  Nom complet
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#E8CE7A"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"}
                />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label 
                  htmlFor="email" 
                  style={{ 
                    display: "block", 
                    fontSize: "14px", 
                    fontWeight: "600", 
                    marginBottom: "8px",
                    color: "rgba(255, 255, 255, 0.9)"
                  }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#E8CE7A"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"}
                />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label 
                  htmlFor="message" 
                  style={{ 
                    display: "block", 
                    fontSize: "14px", 
                    fontWeight: "600", 
                    marginBottom: "8px",
                    color: "rgba(255, 255, 255, 0.9)"
                  }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Comment pouvons-nous vous aider ?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#E8CE7A"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"}
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "14px 32px",
                  backgroundColor: "#E8CE7A",
                  color: "#07213D",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = "#C9A227")}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E8CE7A"}
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              </button>
              {submitStatus === "success" && (
                <p style={{ color: "#4CAF50", marginTop: "16px", fontSize: "14px" }}>
                  Message envoyé avec succès !
                </p>
              )}
              {submitStatus === "error" && (
                <p style={{ color: "#f44336", marginTop: "16px", fontSize: "14px" }}>
                  Erreur lors de l'envoi du message. Veuillez réessayer.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
