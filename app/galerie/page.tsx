"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { useRevealOnScroll } from "@/components/useRevealOnScroll";
import { getGalleryImages, GalleryImage } from "@/lib/firestore";

export default function GaleriePage() {
  const ref = useRevealOnScroll();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [openPh, setOpenPh] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "Tous", count: 12 },
    { name: "Cultes", count: 4 },
    { name: "Louange", count: 2 },
    { name: "Jeunesse", count: 2 },
    { name: "Familles", count: 2 },
    { name: "Communauté", count: 2 },
  ];

  useEffect(() => {
    async function fetchData() {
      const imagesRes = await getGalleryImages();
      if (imagesRes.success) setImages(imagesRes.images);
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

  const displayImages = images.length > 0 ? images : [
    { imageUrl: "", imagePublicId: "", caption: "Culte du dimanche", category: "Cultes", order: 1 },
    { imageUrl: "", imagePublicId: "", caption: "Louange et adoration", category: "Louange", order: 2 },
    { imageUrl: "", imagePublicId: "", caption: "Camp de jeunesse", category: "Jeunesse", order: 3 },
    { imageUrl: "", imagePublicId: "", caption: "Journée des familles", category: "Familles", order: 4 },
    { imageUrl: "", imagePublicId: "", caption: "Baptêmes", category: "Cultes", order: 5 },
    { imageUrl: "", imagePublicId: "", caption: "Action communautaire", category: "Communauté", order: 6 },
    { imageUrl: "", imagePublicId: "", caption: "Enseignement biblique", category: "Cultes", order: 7 },
    { imageUrl: "", imagePublicId: "", caption: "Groupe de louange", category: "Louange", order: 8 },
    { imageUrl: "", imagePublicId: "", caption: "Sortie jeunesse", category: "Jeunesse", order: 9 },
    { imageUrl: "", imagePublicId: "", caption: "Repas communautaire", category: "Familles", order: 10 },
    { imageUrl: "", imagePublicId: "", caption: "Célébration Pâques", category: "Cultes", order: 11 },
    { imageUrl: "", imagePublicId: "", caption: "Visite hospitalière", category: "Communauté", order: 12 },
  ];

  const filteredImages =
    selectedCategory === "Tous"
      ? displayImages
      : displayImages.filter((img) => img.category === selectedCategory);

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero Section */}
        <section className="hero" style={{ minHeight: "60vh", padding: "120px 0 80px" }}>
          <div className="container">
            <div className="hero-content">
              <span className="eyebrow hero-eyebrow">Galerie</span>
              <h1>
                Des instants de <em>vie</em> partagés
              </h1>
              <p className="lead">
                Découvrez à travers nos photos la richesse de notre vie
                communautaire. Chaque image raconte une histoire de foi,
                d'amour et de fraternité.
              </p>
            </div>
          </div>
        </section>

        {/* Catégories */}
        <section className="section bg-pale" style={{ padding: "60px 0" }}>
          <div className="container">
            <div className="section-head center" style={{ marginBottom: "30px" }}>
              <span className="eyebrow">Filtrer par catégorie</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "12px" }}>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "100px",
                    border: selectedCategory === cat.name ? "none" : "1.5px solid rgba(10,42,77,0.2)",
                    background: selectedCategory === cat.name ? "var(--deep-blue)" : "transparent",
                    color: selectedCategory === cat.name ? "#fff" : "var(--deep-blue)",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Galerie */}
        <section className="section" ref={ref}>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Nos moments</span>
              <h2>Explorez notre galerie</h2>
            </div>
            <div className="gallery-grid">
              {filteredImages.map((img, i) => (
                <div
                  className="gallery-item"
                  key={`${img.imageUrl}-${i}`}
                  onClick={() => setOpenPh(img.imageUrl)}
                >
                  {img.imageUrl ? (
                    <img src={img.imageUrl} alt={img.caption} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div className="ph ph-1"></div>
                  )}
                  <span>{img.caption}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lightbox */}
        <div
          className={`lightbox ${openPh ? "open" : ""}`}
          onClick={() => setOpenPh(null)}
        >
          <button
            className="lightbox-close"
            aria-label="Fermer"
            onClick={() => setOpenPh(null)}
          >
            ×
          </button>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            {openPh ? (
              <img src={openPh} alt="Gallery image" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <div className="ph ph-1" style={{ width: "100%", height: "100%" }}></div>
            )}
          </div>
        </div>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <h2>Rejoignez nos moments</h2>
            <p>
              Vous souhaitez faire partie de ces moments de vie et de
              fraternité ? Venez nous rejoindre lors de nos prochaines activités.
            </p>
            <div className="cta-buttons">
              <a href="/evenements" className="btn btn-gold">
                Voir les événements
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
