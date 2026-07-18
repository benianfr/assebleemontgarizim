"use client";

import { useEffect, useState } from "react";
import { getThemeOfMonth, getNextService, getGalleryImages, ThemeOfMonth, NextService, GalleryImage } from "@/lib/firestore";

export default function Hero() {
  const [theme, setTheme] = useState<ThemeOfMonth | null>(null);
  const [service, setService] = useState<NextService | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [themeRes, serviceRes, galleryRes] = await Promise.all([
        getThemeOfMonth(),
        getNextService(),
        getGalleryImages(),
      ]);

      if (themeRes.success) setTheme(themeRes.theme);
      if (serviceRes.success) setService(serviceRes.service);
      if (galleryRes.success) setGalleryImages(galleryRes.images);

      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (galleryImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [galleryImages.length]);

  const displayTheme = theme || {
    month: "juillet",
    title: "Vaincre par la foi",
    verse: "Car tout ce qui est né de Dieu triomphe du monde, et la victoire qui a triomphé du monde, c'est notre foi. — 1 Jean 5:4",
  };

  const displayService = service || {
    day: "Dimanche",
    time: "9h30 et 11h00",
    location: "Temple Mont Garizim, Abidjan",
  };

  const backgroundImage = galleryImages.length > 0 
    ? galleryImages[currentImageIndex].imageUrl 
    : "/logo1.png";

  return (
    <section 
      className="hero" 
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundImage: `linear-gradient(rgba(7, 33, 61, 0.7), rgba(7, 33, 61, 0.8)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        transition: "background-image 1s ease-in-out",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: "800px", color: "white" }}>
          <span 
            style={{
              display: "inline-block",
              padding: "8px 16px",
              backgroundColor: "rgba(232, 206, 122, 0.2)",
              color: "#E8CE7A",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "20px",
              letterSpacing: "1px",
            }}
          >
            BIENVENUE CHEZ VOUS
          </span>
          <h1 
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: "700",
              lineHeight: "1.2",
              marginBottom: "24px",
              color: "white",
            }}
          >
            Bienvenue à
            <br />
            <span style={{ color: "#E8CE7A" }}>l'Assemblée Mont Garizim</span>
          </h1>
          <p 
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              lineHeight: "1.8",
              marginBottom: "32px",
              color: "rgba(255, 255, 255, 0.9)",
              maxWidth: "600px",
            }}
          >
            Une communauté qui grandit dans la foi, l'amour et l'espérance en Jésus-Christ.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a 
              href="/a-propos" 
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
              Découvrir l'Église
            </a>
            <a 
              href="/contact" 
              style={{
                display: "inline-block",
                padding: "14px 32px",
                backgroundColor: "transparent",
                color: "white",
                border: "2px solid #E8CE7A",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E8CE7A";
                e.currentTarget.style.color = "#07213D";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "white";
              }}
            >
              Nous rejoindre
            </a>
          </div>
        </div>

        <div 
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            padding: "32px",
            borderRadius: "16px",
            maxWidth: "350px",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <span 
            style={{
              display: "inline-block",
              padding: "4px 12px",
              backgroundColor: "rgba(232, 206, 122, 0.2)",
              color: "#E8CE7A",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            THÈME DU MOIS DE {displayTheme.month.toUpperCase()}
          </span>
          <h3 style={{ fontSize: "24px", marginBottom: "12px", color: "#E8CE7A" }}>
            {displayTheme.title}
          </h3>
          <p 
            style={{ 
              fontSize: "14px", 
              color: "rgba(255, 255, 255, 0.8)", 
              fontStyle: "italic", 
              marginBottom: "24px", 
              lineHeight: "1.6" 
            }}
          >
            "{displayTheme.verse}"
          </p>
          <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.2)", paddingTop: "20px" }}>
            <span 
              style={{ 
                display: "block",
                fontSize: "12px", 
                fontWeight: "600", 
                marginBottom: "12px",
                color: "rgba(255, 255, 255, 0.6)",
                letterSpacing: "1px",
              }}
            >
              PROCHAIN CULTE
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ 
                width: "40px", 
                height: "40px", 
                backgroundColor: "rgba(232, 206, 122, 0.2)", 
                borderRadius: "8px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8CE7A" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <small style={{ display: "block", fontSize: "12px", color: "rgba(255, 255, 255, 0.6)" }}>Jour</small>
                <strong style={{ fontSize: "16px", color: "white" }}>{displayService.day}</strong>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ 
                width: "40px", 
                height: "40px", 
                backgroundColor: "rgba(232, 206, 122, 0.2)", 
                borderRadius: "8px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8CE7A" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <small style={{ display: "block", fontSize: "12px", color: "rgba(255, 255, 255, 0.6)" }}>Heure</small>
                <strong style={{ fontSize: "16px", color: "white" }}>{displayService.time}</strong>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ 
                width: "40px", 
                height: "40px", 
                backgroundColor: "rgba(232, 206, 122, 0.2)", 
                borderRadius: "8px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8CE7A" strokeWidth="2">
                  <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
                  <circle cx="12" cy="9" r="2.4" />
                </svg>
              </div>
              <div>
                <small style={{ display: "block", fontSize: "12px", color: "rgba(255, 255, 255, 0.6)" }}>Lieu</small>
                <strong style={{ fontSize: "16px", color: "white" }}>{displayService.location}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {galleryImages.length > 1 && (
        <div style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
          zIndex: 2,
        }}>
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              style={{
                width: index === currentImageIndex ? "32px" : "12px",
                height: "12px",
                borderRadius: "6px",
                backgroundColor: index === currentImageIndex ? "#E8CE7A" : "rgba(255, 255, 255, 0.3)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}

      <div style={{
        position: "absolute",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        color: "white",
        fontSize: "12px",
        zIndex: 2,
      }}>
        <span>Défiler</span>
        <div style={{ width: "1px", height: "30px", backgroundColor: "rgba(255, 255, 255, 0.5)" }} />
      </div>
    </section>
  );
}
