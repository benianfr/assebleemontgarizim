"use client";

import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { useRevealOnScroll } from "@/components/useRevealOnScroll";
import { getContactInfo, ContactInfo, getBooks, Book } from "@/lib/firestore";
import { useEffect, useState } from "react";

export default function LibrairiePage() {
  const ref = useRevealOnScroll<HTMLElement>();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [contactRes, booksRes] = await Promise.all([
        getContactInfo(),
        getBooks(),
      ]);
      if (contactRes.success) setContactInfo(contactRes.contactInfo);
      if (booksRes.success) setBooks(booksRes.books);
      setLoading(false);
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
        <section 
          style={{
            position: "relative",
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "120px 0 80px",
            background: "linear-gradient(135deg, #07213D 0%, #0a2a4d 100%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <div className="container">
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <span 
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  backgroundColor: "rgba(232, 206, 122, 0.2)",
                  color: "#E8CE7A",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  letterSpacing: "1px",
                }}
              >
                LIBRAIRIE
              </span>
              <h1 
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: "700",
                  marginBottom: "24px",
                  lineHeight: "1.2",
                }}
              >
                Découvrez nos <span style={{ color: "#E8CE7A" }}>ressources</span>
              </h1>
              <p 
                style={{
                  fontSize: "1.2rem",
                  opacity: 0.9,
                  lineHeight: "1.8",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Explorez notre sélection de livres, brochures et supports pour approfondir votre foi et votre compréhension de la Parole de Dieu.
              </p>
            </div>
          </div>
        </section>

        {/* Livres Section */}
        <section 
          className="section" 
          ref={ref}
          style={{
            padding: "100px 0",
            backgroundColor: "#F8F9FA",
          }}
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
                NOS LIVRES
              </span>
              <h2 
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: "700",
                  color: "#07213D",
                  marginBottom: "16px",
                }}
              >
                Ressources pour votre croissance spirituelle
              </h2>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
              gap: "32px" 
            }}>
              {loading ? (
                <div style={{ textAlign: "center", gridColumn: "1 / -1" }}>Chargement...</div>
              ) : books.length === 0 ? (
                <div style={{ textAlign: "center", gridColumn: "1 / -1" }}>Aucun livre disponible pour le moment.</div>
              ) : (
                books.map((book, index) => (
                  <div
                    key={book.id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
                    <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
                      {book.imageUrl ? (
                        <img
                          src={book.imageUrl}
                          alt={book.title}
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
                            background: "linear-gradient(135deg, #07213D 0%, #0a2a4d 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#E8CE7A",
                            fontSize: "48px",
                            fontWeight: "700",
                          }}
                        >
                          {book.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "24px" }}>
                      <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#07213D", marginBottom: "8px" }}>
                        {book.title}
                      </h3>
                      <p style={{ color: "#666", fontSize: "14px", marginBottom: "12px" }}>
                        {book.author}
                      </p>
                      <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6", marginBottom: "16px" }}>
                        {book.description}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: "700", color: "#C9A227", fontSize: "18px" }}>
                          {book.price}
                        </span>
                        <button 
                          onClick={() => handleOrder(book.title, book.price)}
                          style={{
                            padding: "10px 20px",
                            backgroundColor: "#07213D",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "background 0.3s ease",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0a2a4d"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#07213D"}
                        >
                          Commander
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Brochures Section */}
        <section 
          style={{
            padding: "100px 0",
            backgroundColor: "white",
          }}
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
                BROCHURES GRATUITES
              </span>
              <h2 
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: "700",
                  color: "#07213D",
                  marginBottom: "16px",
                }}
              >
                Supports de formation
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              {[
                {
                  title: "Guide de la prière",
                  description: "Un guide pratique pour structurer vos temps de prière personnelle.",
                },
                {
                  title: "Étude biblique fondamentale",
                  description: "Les bases de la foi chrétienne expliquées simplement.",
                },
                {
                  title: "Vivre en communauté",
                  description: "Comment s'intégrer et servir dans l'église locale.",
                },
              ].map((brochure, index) => (
                <div
                  key={brochure.title}
                  style={{
                    backgroundColor: "#F8F9FA",
                    padding: "32px",
                    borderRadius: "16px",
                    border: "1px solid rgba(7, 33, 61, 0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
                  <div 
                    style={{
                      width: "56px",
                      height: "56px",
                      backgroundColor: "rgba(232, 206, 122, 0.2)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                      fontSize: "24px",
                      color: "#C9A227",
                      fontWeight: "700",
                    }}
                  >
                    {index + 1}
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#07213D", marginBottom: "8px" }}>
                    {brochure.title}
                  </h3>
                  <p style={{ fontSize: "15px", color: "#666", lineHeight: "1.6", marginBottom: "20px" }}>
                    {brochure.description}
                  </p>
                  <button 
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#E8CE7A",
                      color: "#07213D",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background 0.3s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#C9A227"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#E8CE7A"}
                  >
                    Télécharger gratuitement
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section 
          style={{
            padding: "100px 0",
            backgroundColor: "#07213D",
            color: "white",
          }}
        >
          <div className="container">
            <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
              <span 
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  backgroundColor: "rgba(232, 206, 122, 0.2)",
                  color: "#E8CE7A",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  letterSpacing: "1px",
                }}
              >
                COMMANDE
              </span>
              <h2 
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: "700",
                  marginBottom: "16px",
                }}
              >
                Comment commander nos ressources
              </h2>
              <p style={{ fontSize: "1.1rem", opacity: 0.9, lineHeight: "1.8", marginBottom: "32px" }}>
                Pour commander nos livres ou obtenir plus d'informations sur nos ressources,
                n'hésitez pas à nous contacter par téléphone ou à venir directement à l'église.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <a 
                  href={`tel:${contactInfo?.phone || "+2250700000000"}`}
                  style={{
                    display: "inline-block",
                    padding: "14px 32px",
                    backgroundColor: "white",
                    color: "#07213D",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F8F9FA"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  Appeler
                </a>
                <a 
                  href="/contact"
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
