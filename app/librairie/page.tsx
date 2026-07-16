"use client";

import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { useRevealOnScroll } from "@/components/useRevealOnScroll";
import { getContactInfo, ContactInfo } from "@/lib/firestore";
import { useEffect, useState } from "react";

export default function LibrairiePage() {
  const ref = useRevealOnScroll();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    async function fetchData() {
      const result = await getContactInfo();
      if (result.success) setContactInfo(result.contactInfo);
    }
    fetchData();
  }, []);

  const handleOrder = (title: string, price: string) => {
    const message = encodeURIComponent(
      `Bonjour, je souhaite commander le livre "${title}" au prix de ${price}.`
    );
    const whatsappNumber = contactInfo?.whatsapp || "2250700000000";
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero Section */}
        <section className="hero" style={{ minHeight: "60vh", padding: "120px 0 80px" }}>
          <div className="container">
            <div className="hero-content">
              <span className="eyebrow hero-eyebrow">Librairie</span>
              <h1>
                Découvrez nos <em>ressources</em>
              </h1>
              <p className="lead">
                Explorez notre sélection de livres, brochures et supports
                pour approfondir votre foi et votre compréhension de la Parole de Dieu.
              </p>
            </div>
          </div>
        </section>

        {/* Livres Section */}
        <section className="section bg-pale" ref={ref}>
          <div className="container">
            <div className="section-head center reveal">
              <span className="eyebrow">Nos livres</span>
              <h2>Ressources pour votre croissance spirituelle</h2>
            </div>

            <div className="scroll-horizontal">
              {[
                {
                  title: "La marche par la foi",
                  author: "Pasteur Jean Koffi",
                  description: "Un guide pratique pour développer une foi authentique au quotidien.",
                  price: "5 000 FCFA"
                },
                {
                  title: "La puissance de la prière",
                  author: "Pasteur Marie Aké",
                  description: "Découvrez les principes bibliques d'une vie de prière efficace.",
                  price: "4 500 FCFA"
                },
                {
                  title: "L'identité en Christ",
                  author: "Pasteur Emmanuel Kouassi",
                  description: "Comprendre qui vous êtes en Jésus-Christ change tout.",
                  price: "6 000 FCFA"
                },
              ].map((book, index) => (
                <div className="card reveal" key={book.title} style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="card-media">
                    <div className="ph ph-1"></div>
                  </div>
                  <div className="card-body">
                    <h3>{book.title}</h3>
                    <p style={{ color: "var(--text-mid)", fontSize: "14px", marginBottom: "8px" }}>
                      {book.author}
                    </p>
                    <p style={{ fontSize: "13.5px", lineHeight: "1.65", marginBottom: "16px" }}>
                      {book.description}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, color: "var(--gold)" }}>{book.price}</span>
                      <button 
                        className="btn btn-navy" 
                        style={{ padding: "8px 16px", fontSize: "14px" }}
                        onClick={() => handleOrder(book.title, book.price)}
                      >
                        Commander
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brochures Section */}
        <section className="section">
          <div className="container">
            <div className="section-head center reveal">
              <span className="eyebrow">Brochures gratuites</span>
              <h2>Supports de formation</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              {[
                {
                  title: "Guide de la prière",
                  description: "Un guide pratique pour structurer vos temps de prière personnelle.",
                  download: true
                },
                {
                  title: "Étude biblique fondamentale",
                  description: "Les bases de la foi chrétienne expliquées simplement.",
                  download: true
                },
                {
                  title: "Vivre en communauté",
                  description: "Comment s'intégrer et servir dans l'église locale.",
                  download: true
                },
              ].map((brochure, index) => (
                <div
                  className="card reveal"
                  key={brochure.title}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="card-body">
                    <h3>{brochure.title}</h3>
                    <p style={{ fontSize: "13.5px", lineHeight: "1.65", marginBottom: "16px" }}>
                      {brochure.description}
                    </p>
                    <button className="btn btn-gold" style={{ width: "100%" }}>
                      Télécharger gratuitement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section bg-pale">
          <div className="container">
            <div className="section-head center reveal">
              <span className="eyebrow">Commande</span>
              <h2>Comment commander nos ressources</h2>
            </div>

            <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }} className="reveal">
              <p style={{ marginBottom: "24px", lineHeight: "1.7" }}>
                Pour commander nos livres ou obtenir plus d'informations sur nos ressources,
                n'hésitez pas à nous contacter par téléphone ou à venir directement à l'église.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="tel:+2250700000000" className="btn btn-navy">
                  Appeler
                </a>
                <a href="/contact" className="btn btn-gold">
                  Formulaire de contact
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
