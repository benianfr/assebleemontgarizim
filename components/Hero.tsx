"use client";

import { useEffect, useState } from "react";
import { getThemeOfMonth, getNextService, ThemeOfMonth, NextService } from "@/lib/firestore";

export default function Hero() {
  const [theme, setTheme] = useState<ThemeOfMonth | null>(null);
  const [service, setService] = useState<NextService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [themeRes, serviceRes] = await Promise.all([
        getThemeOfMonth(),
        getNextService(),
      ]);

      if (themeRes.success) setTheme(themeRes.theme);
      if (serviceRes.success) setService(serviceRes.service);

      setLoading(false);
    }

    fetchData();
  }, []);

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

  return (
    <section className="hero" id="hero">
      <svg
        className="hero-rays"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="rayGrad" cx="72%" cy="8%" r="75%">
            <stop offset="0%" stopColor="#E8CE7A" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#C9A227" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#rayGrad)" />
      </svg>
      <div className="hero-veil"></div>
      <div className="hero-silhouette">
        <svg
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "120px", display: "block" }}
        >
          <path
            d="M0 180 L0 110 L160 50 L280 100 L420 30 L600 95 L760 20 L940 90 L1100 45 L1260 100 L1440 60 L1440 180 Z"
            fill="#07213D"
          />
        </svg>
      </div>

      <div className="container">
        <div className="hero-content">
          <span className="eyebrow hero-eyebrow">Bienvenue chez vous</span>
          <h1 className="reveal in-view">
            Bienvenue à
            <br />
            <em>l&apos;Assemblée Mont Garizim</em>
          </h1>
          <p className="lead">
            Une communauté qui grandit dans la foi, l&apos;amour et
            l&apos;espérance en Jésus-Christ.
          </p>
          <div className="hero-buttons">
            <a href="/a-propos" className="btn btn-gold">
              Découvrir l&apos;Église
            </a>
            <a href="/contact" className="btn btn-outline">
              Nous rejoindre
            </a>
          </div>
        </div>

        <div className="hero-card">
          <span className="eyebrow">Thème du mois de {displayTheme.month}</span>
          <h3>{displayTheme.title}</h3>
          <p style={{ fontSize: "14px", color: "var(--text-mid)", fontStyle: "italic", marginBottom: "16px", lineHeight: "1.6" }}>
            "{displayTheme.verse}"
          </p>
          <div style={{ borderTop: "1px solid rgba(232, 206, 122, 0.3)", paddingTop: "16px" }}>
            <span className="eyebrow" style={{ fontSize: "11px", marginBottom: "8px" }}>Prochain culte</span>
            <div className="hero-card-row">
              <span className="ico">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                    stroke="#E8CE7A"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M3 10h18M8 3v4M16 3v4"
                    stroke="#E8CE7A"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="txt">
                <small>Jour</small>
                <strong>{displayService.day}</strong>
              </span>
            </div>
            <div className="hero-card-row">
              <span className="ico">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#E8CE7A" strokeWidth="1.6" />
                  <path
                    d="M12 7v5l3 2"
                    stroke="#E8CE7A"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="txt">
                <small>Heure</small>
                <strong>{displayService.time}</strong>
              </span>
            </div>
            <div className="hero-card-row">
              <span className="ico">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"
                    stroke="#E8CE7A"
                    strokeWidth="1.6"
                  />
                  <circle cx="12" cy="9" r="2.4" stroke="#E8CE7A" strokeWidth="1.6" />
                </svg>
              </span>
              <span className="txt">
                <small>Lieu</small>
                <strong>{displayService.location}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-cue">
        <span>Défiler</span>
        <span className="line"></span>
      </div>
    </section>
  );
}
