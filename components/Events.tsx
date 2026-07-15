"use client";

import { useEffect, useState } from "react";
import { useRevealOnScroll } from "./useRevealOnScroll";
import { getUpcomingEvents, Event } from "@/lib/firestore";

const delays = ["", "reveal-delay-1", "reveal-delay-2"];

export default function Events() {
  const ref = useRevealOnScroll<HTMLElement>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await getUpcomingEvents();
      if (result.success) {
        setEvents(result.events);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const displayEvents = events.length > 0 ? events : [
    {
      imageUrl: "",
      imagePublicId: "",
      date: "12 juillet 2026",
      title: "Nuit de prière et de louange",
      place: "Temple principal",
      time: "19h00 — 23h00",
      description: "Une soirée dédiée à la prière collective et à l'adoration, ouverte à tous.",
      category: "upcoming",
      order: 1,
    },
    {
      imageUrl: "",
      imagePublicId: "",
      date: "26 juillet 2026",
      title: "Camp d'été de la jeunesse",
      place: "Centre Mont Garizim",
      time: "3 jours",
      description: "Un temps fort de formation, de fraternité et de repos pour les jeunes.",
      category: "upcoming",
      order: 2,
    },
    {
      imageUrl: "",
      imagePublicId: "",
      date: "9 août 2026",
      title: "Journée des familles",
      place: "Jardin de l'église",
      time: "10h00 — 17h00",
      description: "Un moment convivial pour célébrer et renforcer les liens familiaux.",
      category: "upcoming",
      order: 3,
    },
  ];

  return (
    <section
      className="section bg-pale"
      id="evenements"
      style={{ paddingTop: 40 }}
      ref={ref}
    >
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Prochains événements</span>
          <h2>Vivez des moments forts avec nous</h2>
        </div>

        <div className="scroll-horizontal">
          {displayEvents.map((e, i) => (
            <div className={`card reveal ${delays[i % 3]}`} key={e.title}>
              <div className="card-media">
                {e.imageUrl ? (
                  <img src={e.imageUrl} alt={e.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div className={`ph ph-1`}></div>
                )}
              </div>
              <div className="card-body">
                <span className="tl-date">{e.date}</span>
                <h3>{e.title}</h3>
                <div className="tl-meta">
                  <span>{e.place}</span>
                  <span>{e.time}</span>
                </div>
                <p>{e.description}</p>
                <a href="/evenements" className="card-link">
                  Voir les détails <span className="arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
