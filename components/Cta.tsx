"use client";

import { useRevealOnScroll } from "./useRevealOnScroll";

export default function Cta() {
  const ref = useRevealOnScroll<HTMLElement>();

  return (
    <section className="cta-section" id="don" ref={ref}>
      <div className="container reveal">
        <h2>Faites partie d&apos;une communauté qui grandit dans la foi</h2>
        <p>
          Que vous cherchiez une église, une famille spirituelle ou
          simplement un lieu de paix, vous êtes le bienvenu parmi nous.
        </p>
        <div className="cta-buttons">
          <a href="/contact" className="btn btn-gold">
            Nous rejoindre
          </a>
          <a href="/contact" className="btn btn-outline">
            Faire un don
          </a>
        </div>
      </div>
    </section>
  );
}
