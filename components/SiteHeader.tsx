"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/ministeres", label: "Ministères" },
  { href: "/evenements", label: "Événements" },
  { href: "/predications", label: "Prédications" },
  { href: "/galerie", label: "Galerie" },
  { href: "/temoignages", label: "Témoignages" },
  { href: "/librairie", label: "Librairie" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const heroH = hero ? hero.offsetHeight : 800;

    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 40);
      setDarkMode(y <= heroH - 120);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Empêche le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <header
        id="siteHeader"
        className={`${scrolled ? "scrolled" : ""} ${
          darkMode && !menuOpen ? "dark-mode" : ""
        }`}
      >
        <div className="container">
          <a href="/" className="logo">
            <Logo />
            <span className="logo-text">
              <b>Assemblée</b>
              <span>Mont Garizim</span>
            </span>
          </a>

          <nav className="main-nav">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <a href="/don" className="btn btn-gold">
              Faire un don
            </a>
            <button
              className={`burger ${menuOpen ? "open" : ""}`}
              aria-label="Ouvrir le menu"
              onClick={() => setMenuOpen(true)}
            >
              <span className="burger-lines">
                <i></i>
                <i></i>
                <i></i>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button
          className="mobile-menu-close"
          aria-label="Fermer le menu"
          onClick={() => setMenuOpen(false)}
        >
          ×
        </button>
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/don"
          className="btn btn-gold"
          onClick={() => setMenuOpen(false)}
        >
          Faire un don
        </a>
      </div>
    </>
  );
}
