"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getUpcomingEvents,
  getTestimonials,
  getGalleryImages,
} from "@/lib/firestore";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { PageHeader, Card } from "@/components/admin/AdminUI";
import {
  CalendarIcon,
  MessageIcon,
  MailIcon,
  ImageIcon,
  MicIcon,
} from "@/components/admin/icons";
import styles from "./dashboard-home.module.css";

type Stats = {
  upcomingEvents: number;
  pendingTestimonials: number;
  unreadMessages: number;
  galleryImages: number;
};

export default function AdminDashboardHome() {
  const [email, setEmail] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    upcomingEvents: 0,
    pendingTestimonials: 0,
    unreadMessages: 0,
    galleryImages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setEmail(user.email);
    });
    fetchStats();
    return () => unsubscribe();
  }, []);

  const fetchStats = async () => {
    try {
      const [eventsRes, testimonialsRes, imagesRes, messagesSnap] = await Promise.all([
        getUpcomingEvents(),
        getTestimonials(),
        getGalleryImages(),
        getDocs(query(collection(db, "contactMessages"), orderBy("createdAt", "desc"))),
      ]);

      const unreadCount = messagesSnap.docs.filter((d) => !d.data().read).length;

      setStats({
        upcomingEvents: eventsRes.success ? eventsRes.events.length : 0,
        pendingTestimonials: testimonialsRes.success
          ? testimonialsRes.testimonials.filter((t) => !t.approved).length
          : 0,
        unreadMessages: unreadCount,
        galleryImages: imagesRes.success ? imagesRes.images.length : 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Événements à venir", value: stats.upcomingEvents, Icon: CalendarIcon },
    { label: "Témoignages en attente", value: stats.pendingTestimonials, Icon: MessageIcon },
    { label: "Messages non lus", value: stats.unreadMessages, Icon: MailIcon },
    { label: "Images en galerie", value: stats.galleryImages, Icon: ImageIcon },
  ];

  const quickActions = [
    { path: "/admin/dashboard/evenements", label: "Nouvel événement", Icon: CalendarIcon, variant: "gold" as const },
    { path: "/admin/dashboard/predications", label: "Nouvelle prédication", Icon: MicIcon, variant: "primary" as const },
    { path: "/admin/dashboard/galerie", label: "Ajouter une image", Icon: ImageIcon, variant: "primary" as const },
    { path: "/admin/dashboard/parametres", label: "Modifier le thème du mois", Icon: MessageIcon, variant: "primary" as const },
  ];

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        description={email ? `Bienvenue, ${email}` : undefined}
      />

      <div className={styles.statGrid}>
        {statCards.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statIcon}>
              <stat.Icon width={20} height={20} />
            </div>
            <div className={styles.statValue}>{loading ? "…" : stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <Card title="Actions rapides">
        <div className={styles.actionsGrid}>
          {quickActions.map((action) => (
            <Link
              key={action.path}
              href={action.path}
              className={`${styles.actionLink} ${
                action.variant === "gold" ? styles.actionLinkGold : ""
              }`}
            >
              <action.Icon width={17} height={17} />
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
