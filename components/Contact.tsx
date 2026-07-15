"use client";

import { useState } from "react";
import { useRevealOnScroll } from "./useRevealOnScroll";

export default function Contact() {
  const ref = useRevealOnScroll<HTMLElement>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

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

  return (
    <section className="section" id="contact" ref={ref}>
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Contact</span>
          <h2>Nous serions heureux de vous accueillir</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-card reveal">
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
                <strong>Dim. 9h–13h · Mer. 18h–20h</strong>
              </div>
            </div>
          </div>

          <div className="form-card reveal reveal-delay-1">
            <h3>Envoyez-nous un message</h3>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Nom complet</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  placeholder="Comment pouvons-nous vous aider ?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-navy" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              </button>
              {submitStatus === "success" && (
                <p className="text-green-600 mt-2">Message envoyé avec succès !</p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-600 mt-2">Erreur lors de l'envoi du message. Veuillez réessayer.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
