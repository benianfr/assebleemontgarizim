"use client";

import { useState, useEffect } from "react";
import { useRevealOnScroll } from "./useRevealOnScroll";
import { getGalleryImages, GalleryImage } from "@/lib/firestore";

const delays = ["", "reveal-delay-1", "reveal-delay-2"];

export default function Gallery() {
  const ref = useRevealOnScroll<HTMLElement>();
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await getGalleryImages();
      if (result.success) {
        setImages(result.images);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const displayImages = images.length > 0 ? images : [
    { imageUrl: "", imagePublicId: "", caption: "Culte du dimanche", category: "general", order: 1 },
    { imageUrl: "", imagePublicId: "", caption: "Louange et adoration", category: "general", order: 2 },
    { imageUrl: "", imagePublicId: "", caption: "Camp de jeunesse", category: "general", order: 3 },
    { imageUrl: "", imagePublicId: "", caption: "Journée des familles", category: "general", order: 4 },
    { imageUrl: "", imagePublicId: "", caption: "Baptêmes", category: "general", order: 5 },
    { imageUrl: "", imagePublicId: "", caption: "Action communautaire", category: "general", order: 6 },
  ];

  return (
    <section className="section bg-pale" id="galerie" ref={ref}>
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Galerie</span>
          <h2>Des instants de vie partagés en communauté</h2>
        </div>

        <div className="gallery-grid">
          {displayImages.map((img, i) => (
            <div
              className={`gallery-item reveal ${delays[i % 3]}`}
              key={img.caption}
              onClick={() => setOpenImage(img.imageUrl)}
            >
              {img.imageUrl ? (
                <img src={img.imageUrl} alt={img.caption} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div className={`ph ph-1`}></div>
              )}
              <span>{img.caption}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`lightbox ${openImage ? "open" : ""}`}
        onClick={() => setOpenImage(null)}
      >
        <button
          className="lightbox-close"
          aria-label="Fermer"
          onClick={() => setOpenImage(null)}
        >
          ×
        </button>
        <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
          {openImage ? (
            <img src={openImage} alt="Gallery" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            <div className={`ph ph-1`} style={{ width: "100%", height: "100%" }}></div>
          )}
        </div>
      </div>
    </section>
  );
}
