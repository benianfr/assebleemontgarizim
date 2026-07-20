"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { useRevealOnScroll } from "@/components/useRevealOnScroll";
import { getHistory, getFounder, getLocations, getHistorySection, HistoryItem, Founder, Location, Schedule, HistorySection } from "@/lib/firestore";

export default function AProposPage() {
  const ref1 = useRevealOnScroll();
  const ref2 = useRevealOnScroll();
  const ref3 = useRevealOnScroll();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [founder, setFounder] = useState<Founder | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [historySection, setHistorySection] = useState<HistorySection>({ imageUrl: "", imagePublicId: "" });
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [historyRes, founderRes, locationsRes, historySectionRes] = await Promise.all([
        getHistory(),
        getFounder(),
        getLocations(),
        getHistorySection(),
      ]);

      if (historyRes.success) setHistory(historyRes.history);
      if (founderRes.success) setFounder(founderRes.founder);
      if (locationsRes.success) setLocations(locationsRes.locations);
      if (historySectionRes.success) setHistorySection(historySectionRes.historySection);

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

  const displayHistory = history.length > 0 ? history : [
    { year: "2006", title: "Fondation de l'église", description: "L'Église Mont Garizim voit le jour avec une poignée de fidèles réunis dans un salon à Abidjan." },
    { year: "2010", title: "Premier lieu de culte", description: "Acquisition de notre premier local permettant d'accueillir jusqu'à 200 personnes." },
    { year: "2015", title: "Développement des ministères", description: "Création des ministères jeunesse, enfants et femmes pour mieux servir chaque génération." },
    { year: "2020", title: "Expansion communautaire", description: "Lancement de groupes de maison et d'actions sociales dans les quartiers d'Abidjan." },
    { year: "2024", title: "Nouvelle vision", description: "Plus de 500 membres actifs et une présence accrue dans la communauté locale." },
  ];

  const displayFounder = founder || {
    name: "Pasteur Emmanuel Kouassi",
    title: "Fondateur de l'Église Mont Garizim",
    imageUrl: "",
    imagePublicId: "",
    description: "En 2006, le Pasteur Emmanuel Kouassi a fondé l'Église Mont Garizim avec une vision claire : créer une communauté de foi authentique qui transforme les vies et la ville d'Abidjan. Avec plus de 20 ans de ministère, il reste passionné par l'enseignement biblique et l'accompagnement spirituel de chaque personne.",
    verse: "Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux. — Matthieu 18:20",
  };

  const displayLocations = locations.length > 0 ? locations : [
    { imageUrl: "", imagePublicId: "", name: "Temple principal - Cocody", pastor: "Pasteur Emmanuel Kouassi", address: "Cocody, Abidjan", city: "Abidjan", schedules: [{ day: "Dimanche", startTime: "9h30", endTime: "11h30" }, { day: "Mercredi", startTime: "18h00", endTime: "20h00" }], order: 1 },
    { imageUrl: "", imagePublicId: "", name: "Antenne Yopougon", pastor: "Pasteur Marie-Claire Diallo", address: "Yopougon, Abidjan", city: "Abidjan", schedules: [{ day: "Dimanche", startTime: "10h00", endTime: "12h00" }, { day: "Samedi", startTime: "17h00", endTime: "19h00" }], order: 2 },
    { imageUrl: "", imagePublicId: "", name: "Antenne Marcory", pastor: "Pasteur Jean Koffi", address: "Marcory, Abidjan", city: "Abidjan", schedules: [{ day: "Dimanche", startTime: "10h30", endTime: "12h30" }, { day: "Mardi", startTime: "18h30", endTime: "20h30" }], order: 3 },
    { imageUrl: "", imagePublicId: "", name: "Antenne Treichville", pastor: "Pasteur Philippe Assamoi", address: "Treichville, Abidjan", city: "Abidjan", schedules: [{ day: "Dimanche", startTime: "11h00", endTime: "13h00" }, { day: "Jeudi", startTime: "18h00", endTime: "20h00" }], order: 4 },
  ];

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero Section */}
        <section className="hero" style={{ minHeight: "60vh", padding: "120px 0 80px" }}>
          <div className="container">
            <div className="hero-content">
              <span className="eyebrow hero-eyebrow">À propos de nous</span>
              <h1>
                Découvrez l'histoire et la <em>vision</em> de l'Église Mont Garizim
              </h1>
              <p className="lead">
                Depuis 2006, nous sommes une communauté de foi engagée à partager
                l'amour de Dieu et à transformer notre ville à travers le service
                et l'enseignement biblique.
              </p>
            </div>
          </div>
        </section>

        {/* Notre Histoire */}
        <section className="section bg-pale" ref={ref1}>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Notre histoire</span>
              <h2>Un parcours de foi et de croissance</h2>
            </div>
            <div style={{ marginBottom: "40px" }}>
              {historySection.imageUrl ? (
                <img src={historySection.imageUrl} alt="Notre histoire" style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "var(--radius-md)" }} />
              ) : (
                <div className="ph ph-1" style={{ width: "100%", height: "300px", borderRadius: "var(--radius-md)" }}></div>
              )}
            </div>
            <div className="scroll-horizontal">
              {displayHistory.map((item, index) => (
                <div className="card" key={item.year}>
                  <div className="card-body">
                    <span className="tl-date">{item.year}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Notre Fondateur */}
        <section className="section" ref={ref2}>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Notre fondateur</span>
              <h2>À l'origine de la vision</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "800px", margin: "0 auto" }}>
              <div className="card" style={{ width: "100%", maxWidth: "500px" }}>
                <div className="card-media">
                  {displayFounder.imageUrl ? (
                    <img src={displayFounder.imageUrl} alt={displayFounder.name} style={{ width: "100%", height: "auto", objectFit: "cover" }} />
                  ) : (
                    <div className="ph ph-1"></div>
                  )}
                </div>
                <div className="card-body">
                  <h3 style={{ fontSize: "22px", marginBottom: "8px" }}>{displayFounder.name}</h3>
                  <p style={{ fontSize: "14px", color: "var(--gold)", fontWeight: 600, marginBottom: "16px" }}>
                    {displayFounder.title}
                  </p>
                  <p style={{ fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>
                    {displayFounder.description}
                  </p>
                  <p style={{ fontSize: "14px", fontStyle: "italic", color: "var(--text-mid)", borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
                    {displayFounder.verse}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nos Lieux */}
        <section className="section bg-pale" ref={ref3}>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Nos lieux de culte</span>
              <h2>Retrouvez-nous près de chez vous</h2>
            </div>
            <div className="scroll-horizontal">
              {displayLocations.map((location) => (
                <div className="card" key={location.name}>
                  <div className="card-media" style={{ cursor: location.imageUrl ? "pointer" : "default" }} onClick={() => location.imageUrl && setSelectedImage(location.imageUrl)}>
                    {location.imageUrl ? (
                      <img src={location.imageUrl} alt={location.name} style={{ width: "100%", height: "auto", objectFit: "cover" }} />
                    ) : (
                      <div className="ph ph-1"></div>
                    )}
                  </div>
                  <div className="card-body">
                    <h3>{location.name}</h3>
                    <p className="lead" style={{ fontSize: "13px", marginBottom: "8px", color: "var(--gold)" }}>
                      {location.pastor}
                    </p>
                    <p style={{ fontSize: "13px", marginBottom: "8px" }}>
                      📍 {location.address}
                    </p>
                    <div style={{ fontSize: "13px", color: "var(--text-mid)" }}>
                      {location.schedules?.map((schedule, index) => (
                        <p key={index} style={{ marginBottom: 4 }}>
                          🕒 {schedule.day} {schedule.startTime}-{schedule.endTime}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <h2>Rejoignez notre communauté</h2>
            <p>
              Nous serions ravis de vous accueillir lors de nos cultes et de vous
              faire découvrir davantage notre église.
            </p>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-gold">
                Nous contacter
              </a>
              <a href="/evenements" className="btn btn-outline">
                Voir les événements
              </a>
            </div>
          </div>
        </section>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div 
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              cursor: "pointer"
            }}
            onClick={() => setSelectedImage(null)}
          >
            <img 
              src={selectedImage} 
              alt="Agrandissement" 
              style={{ 
                maxWidth: "90%", 
                maxHeight: "90%", 
                objectFit: "contain",
                borderRadius: "var(--radius-md)"
              }} 
              onClick={(e) => e.stopPropagation()}
            />
            <button
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                backgroundColor: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontSize: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
