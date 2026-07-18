"use client";

import { useEffect, useState } from "react";
import { useRevealOnScroll } from "./useRevealOnScroll";
import { getUpcomingEvents, Event } from "@/lib/firestore";

const delays = ["", "reveal-delay-1", "reveal-delay-2"];

const formatDate = (date: any) => {
  if (!date) return "";
  if (date.toDate) return date.toDate().toLocaleDateString("fr-FR");
  if (date instanceof Date) return date.toLocaleDateString("fr-FR");
  return String(date);
};

export default function Events() {
  const ref = useRevealOnScroll<HTMLElement>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      console.log("Fetching events...");
      const result = await getUpcomingEvents();
      console.log("Events result:", result);
      if (result.success) {
        setEvents(result.events);
        console.log("Events set:", result.events);
      } else {
        console.error("Failed to fetch events:", result.error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);


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

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Chargement des événements...</p>
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Aucun événement à venir pour le moment.</p>
            <a href="/evenements" style={{ color: "#d4a017", textDecoration: "underline", marginTop: "10px", display: "inline-block" }}>
              Voir tous les événements
            </a>
          </div>
        ) : (
          <div className="scroll-horizontal">
            {events.map((e, i) => (
              <div className={`card reveal ${delays[i % 3]}`} key={e.id || e.title}>
                <div className="card-media">
                  {e.imageUrl ? (
                    <img src={e.imageUrl} alt={e.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div className={`ph ph-1`}></div>
                  )}
                </div>
                <div className="card-body">
                  <span className="tl-date">{formatDate(e.date)}</span>
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
        )}
      </div>
    </section>
  );
}
