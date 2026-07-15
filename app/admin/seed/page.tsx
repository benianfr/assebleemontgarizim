"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function seedFirestore() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Seed history
      const historyData = [
        { year: "2006", title: "Fondation de l'église", description: "L'Assemblée Mont Garizim voit le jour avec une poignée de fidèles réunis dans un salon à Abidjan.", order: 1 },
        { year: "2010", title: "Premier lieu de culte", description: "Acquisition de notre premier local permettant d'accueillir jusqu'à 200 personnes.", order: 2 },
        { year: "2015", title: "Développement des ministères", description: "Création des ministères jeunesse, enfants et femmes pour mieux servir chaque génération.", order: 3 },
        { year: "2020", title: "Expansion communautaire", description: "Lancement de groupes de maison et d'actions sociales dans les quartiers d'Abidjan.", order: 4 },
        { year: "2024", title: "Nouvelle vision", description: "Plus de 500 membres actifs et une présence accrue dans la communauté locale.", order: 5 },
      ];

      for (const item of historyData) {
        await setDoc(doc(collection(db, "history"), item.year), item);
      }

      // Seed founder
      const founderData = {
        name: "Pasteur Emmanuel Kouassi",
        title: "Fondateur de l'Assemblée Mont Garizim",
        ph: "ph-1",
        description: "En 2006, le Pasteur Emmanuel Kouassi a fondé l'Assemblée Mont Garizim avec une vision claire : créer une communauté de foi authentique qui transforme les vies et la ville d'Abidjan. Avec plus de 20 ans de ministère, il reste passionné par l'enseignement biblique et l'accompagnement spirituel de chaque personne.",
        verse: "Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux. — Matthieu 18:20",
      };

      await setDoc(doc(db, "about", "founder"), founderData);

      // Seed locations
      const locationsData = [
        { ph: "ph-1", name: "Temple principal - Cocody", pastor: "Pasteur Emmanuel Kouassi", address: "Cocody, Abidjan", schedule: "Dimanche 9h30 · Mercredi 18h00", order: 1 },
        { ph: "ph-3", name: "Antenne Yopougon", pastor: "Pasteur Marie-Claire Diallo", address: "Yopougon, Abidjan", schedule: "Dimanche 10h00 · Samedi 17h00", order: 2 },
        { ph: "ph-5", name: "Antenne Marcory", pastor: "Pasteur Jean Koffi", address: "Marcory, Abidjan", schedule: "Dimanche 10h30 · Mardi 18h30", order: 3 },
        { ph: "ph-2", name: "Antenne Treichville", pastor: "Pasteur Philippe Assamoi", address: "Treichville, Abidjan", schedule: "Dimanche 11h00 · Jeudi 18h00", order: 4 },
      ];

      for (const location of locationsData) {
        await setDoc(doc(collection(db, "locations"), location.name), location);
      }

      // Seed ministries
      const ministriesData = [
        { ph: "ph-1", title: "Jeunesse", description: "Un espace dynamique où les jeunes affermissent leur foi et tissent des amitiés durables. Nous organisons des rencontres hebdomadaires, des camps et des événements spéciaux pour aider les jeunes à grandir spirituellement et socialement.", schedule: "Samedis 16h00 — 18h00", leader: "David Yao", order: 1 },
        { ph: "ph-2", title: "Enfants", description: "Un accueil chaleureux et sécurisé pour transmettre les valeurs de l'Évangile aux plus petits. Notre programme adapté à chaque âge permet aux enfants de découvrir la Bible de manière ludique et engageante.", schedule: "Dimanches 9h30 — 11h30", leader: "Grace N'Guessan", order: 2 },
        { ph: "ph-3", title: "Louange", description: "Une équipe passionnée qui conduit l'assemblée dans une adoration sincère et vivante. La louange est au cœur de nos cultes, créant une atmosphère où la présence de Dieu peut se manifester.", schedule: "Répétitions mercredis 18h00", leader: "Marc Kouassi", order: 3 },
        { ph: "ph-4", title: "Intercession", description: "Des moments de prière collective pour porter les besoins de l'église, de la nation et du monde. Nous croyons en la puissance de la prière pour transformer les vies et les situations.", schedule: "Mercredis 19h00 — 20h00", leader: "Pasteur Emmanuel Kouassi", order: 4 },
        { ph: "ph-5", title: "Évangélisation", description: "Aller vers les autres pour partager l'espérance qui nous anime, avec amour et respect. Nos équipes organisent des actions dans les quartiers, les hôpitaux et les écoles.", schedule: "Samedis selon planning", leader: "Philippe Assamoi", order: 5 },
        { ph: "ph-6", title: "Familles", description: "Un accompagnement pour renforcer les couples et les liens intergénérationnels. Nous proposons des sessions de conseil, des ateliers et des événements pour soutenir les familles dans leur cheminement.", schedule: "2ème samedi du mois", leader: "Pasteur Marie-Claire Diallo", order: 6 },
      ];

      for (const ministry of ministriesData) {
        await setDoc(doc(collection(db, "ministries"), ministry.title), ministry);
      }

      // Seed values
      const valuesData = [
        { title: "Service", text: "Chaque ministère est une opportunité de servir Dieu et les autres avec humilité et amour.", order: 1 },
        { title: "Excellence", text: "Nous nous efforçons de donner le meilleur de nous-mêmes dans tout ce que nous entreprenons.", order: 2 },
        { title: "Communauté", text: "Les ministères sont des lieux de vie où des relations profondes et authentiques se construisent.", order: 3 },
        { title: "Croissance", text: "Nous encourageons chaque personne à grandir dans sa foi et à développer ses talents.", order: 4 },
      ];

      for (const value of valuesData) {
        await setDoc(doc(collection(db, "values"), value.title), value);
      }

      // Seed upcoming events
      const eventsData = [
        { ph: "ph-1", date: "12 juillet 2026", title: "Nuit de prière et de louange", place: "Temple principal", time: "19h00 — 23h00", description: "Une soirée dédiée à la prière collective et à l'adoration, ouverte à tous. Venez expérimenter la présence de Dieu à travers la louange et l'intercession.", category: "Prière", order: 1 },
        { ph: "ph-3", date: "26 juillet 2026", title: "Camp d'été de la jeunesse", place: "Centre Mont Garizim", time: "3 jours", description: "Un temps fort de formation, de fraternité et de repos pour les jeunes. Au programme : enseignements, activités de groupe et moments de détente.", category: "Jeunesse", order: 2 },
        { ph: "ph-5", date: "9 août 2026", title: "Journée des familles", place: "Jardin de l'église", time: "10h00 — 17h00", description: "Un moment convivial pour célébrer et renforcer les liens familiaux. Pique-nique, jeux et partage pour toute la famille.", category: "Familles", order: 3 },
        { ph: "ph-2", date: "20 août 2026", title: "Conférence sur la famille", place: "Salle principale", time: "14h00 — 17h00", description: "Conférence avec des experts sur les défis familiaux contemporains et les réponses bibliques. Ouvert à tous, couples et parents.", category: "Formation", order: 4 },
        { ph: "ph-4", date: "3 septembre 2026", title: "Rentrée des groupes de maison", place: "Divers lieux", time: "18h30", description: "Reprise des rencontres hebdomadaires des groupes de maison. Une occasion idéale pour rejoindre un groupe et développer des relations.", category: "Groupes", order: 5 },
      ];

      for (const event of eventsData) {
        await setDoc(doc(collection(db, "events"), event.title), event);
      }

      // Seed past events
      const pastEventsData = [
        { date: "Juin 2026", title: "Semaine de jeûne et prière", description: "Une semaine consacrée à la prière et au jeûne pour l'église et la nation. Plusieurs centaines de participants ont répondu à l'appel.", order: 1 },
        { date: "Mai 2026", title: "Fête de la Pentecôte", description: "Célébration spéciale avec baptêmes et repas communautaire. 15 nouvelles personnes ont été baptisées lors de cette journée mémorable.", order: 2 },
        { date: "Avril 2026", title: "Carême Pâques", description: "Période de 40 jours de réflexion et de prière menant à la célébration de Pâques. Enseignements quotidiens et soirées spéciales.", order: 3 },
      ];

      for (const pastEvent of pastEventsData) {
        await setDoc(doc(collection(db, "pastEvents"), pastEvent.title), pastEvent);
      }

      // Seed sermons
      const sermonsData = [
        { ph: "ph-2", title: "Marcher par la foi, non par la vue", preacher: "Pasteur Jean Koffi", date: "28 juin 2026", duration: "42 min", description: "Dans ce message, nous explorons comment vivre une vie de foi authentique qui transcende les circonstances visibles. Apprenez à vous appuyer sur les promesses de Dieu plutôt que sur ce que vous voyez.", category: "Foi", scripture: "2 Corinthiens 5:7", order: 1 },
        { ph: "ph-3", title: "La grâce qui transforme", preacher: "Pasteur Marie Aké", date: "21 juin 2026", duration: "38 min", description: "Découvrez la puissance transformatrice de la grâce de Dieu. Ce message explique comment la grâce ne nous sauve pas seulement, mais nous change continuellement à l'image de Christ.", category: "Grâce", scripture: "Tite 2:11-12", order: 2 },
        { ph: "ph-5", title: "Espérer contre toute espérance", preacher: "Pasteur Jean Koffi", date: "14 juin 2026", duration: "45 min", description: "Quand tout semble perdu, comment garder espoir ? Ce message nous montre comment Abraham a cru contre toute espérance et comment nous pouvons faire de même.", category: "Espérance", scripture: "Romains 4:18", order: 3 },
        { ph: "ph-1", title: "L'identité en Christ", preacher: "Pasteur Emmanuel Kouassi", date: "7 juin 2026", duration: "50 min", description: "Comprendre qui vous êtes en Christ change tout. Ce message explore notre nouvelle identité en Jésus et comment elle impacte notre vie quotidienne.", category: "Identité", scripture: "Éphésiens 1:3-14", order: 4 },
        { ph: "ph-4", title: "La puissance de la prière", preacher: "Pasteur Marie-Claire Diallo", date: "31 mai 2026", duration: "40 min", description: "La prière n'est pas une option, mais une nécessité. Découvrez les principes bibliques pour une vie de prière puissante et efficace.", category: "Prière", scripture: "Jacques 5:16", order: 5 },
        { ph: "ph-6", title: "Aimer comme Jésus a aimé", preacher: "Pasteur Jean Koffi", date: "24 mai 2026", duration: "47 min", description: "L'amour est au cœur de l'Évangile. Ce message nous défie à aimer non seulement en paroles, mais en actes et en vérité.", category: "Amour", scripture: "Jean 13:34-35", order: 6 },
      ];

      for (const sermon of sermonsData) {
        await setDoc(doc(collection(db, "sermons"), sermon.title), sermon);
      }

      // Seed gallery
      const galleryData = [
        { ph: "ph-1", caption: "Culte du dimanche", category: "Cultes", order: 1 },
        { ph: "ph-3", caption: "Louange et adoration", category: "Louange", order: 2 },
        { ph: "ph-4", caption: "Camp de jeunesse", category: "Jeunesse", order: 3 },
        { ph: "ph-2", caption: "Journée des familles", category: "Familles", order: 4 },
        { ph: "ph-6", caption: "Baptêmes", category: "Cultes", order: 5 },
        { ph: "ph-5", caption: "Action communautaire", category: "Communauté", order: 6 },
        { ph: "ph-1", caption: "Enseignement biblique", category: "Cultes", order: 7 },
        { ph: "ph-3", caption: "Groupe de louange", category: "Louange", order: 8 },
        { ph: "ph-4", caption: "Sortie jeunesse", category: "Jeunesse", order: 9 },
        { ph: "ph-2", caption: "Repas communautaire", category: "Familles", order: 10 },
        { ph: "ph-6", caption: "Célébration Pâques", category: "Cultes", order: 11 },
        { ph: "ph-5", caption: "Visite hospitalière", category: "Communauté", order: 12 },
      ];

      for (const image of galleryData) {
        await setDoc(doc(collection(db, "gallery"), `${image.caption}-${image.order}`), image);
      }

      // Seed contact info
      const contactData = {
        address: "Cocody, Abidjan, Côte d'Ivoire",
        phone: "+225 07 00 00 00 00",
        email: "contact@montgarizim.org",
        hours: "Dim. 9h–13h · Mer. 18h–20h",
      };

      await setDoc(doc(db, "contact", "info"), contactData);

      // Seed donation options
      const donationOptionsData = [
        {
          title: "Virement bancaire",
          description: "Effectuez un virement directement sur notre compte bancaire.",
          details: [
            { label: "Banque", value: "SGBCI" },
            { label: "IBAN", value: "CI01 01234 56789 012345678901 23" },
            { label: "Titulaire", value: "Assemblée Mont Garizim" },
          ],
          order: 1,
        },
        {
          title: "Mobile Money",
          description: "Utilisez votre mobile pour faire un don instantanément.",
          details: [
            { label: "Orange Money", value: "+225 07 00 00 00 00" },
            { label: "MTN Mobile Money", value: "+225 07 00 00 00 00" },
            { label: "Wave", value: "+225 07 00 00 00 00" },
          ],
          order: 2,
        },
        {
          title: "En personne",
          description: "Venez nous voir lors de nos cultes pour faire votre don.",
          details: [
            { label: "Lieu", value: "Temple Mont Garizim, Cocody" },
            { label: "Horaires", value: "Dimanche 9h30 - 13h00" },
            { label: "Contact", value: "Secrétariat de l'église" },
          ],
          order: 3,
        },
      ];

      for (const option of donationOptionsData) {
        await setDoc(doc(collection(db, "donationOptions"), option.title), option);
      }

      // Seed donation purposes
      const donationPurposesData = [
        { title: "Dons généraux", description: "Soutenez les activités générales de l'église : cultes, fonctionnement, missions.", icon: "🏛️", order: 1 },
        { title: "Construction", description: "Contribuez à l'agrandissement de nos locaux pour accueillir plus de fidèles.", icon: "🏗️", order: 2 },
        { title: "Actions sociales", description: "Aidez-nous à soutenir les plus démunis à travers nos actions communautaires.", icon: "❤️", order: 3 },
        { title: "Jeunesse", description: "Financez les camps et activités pour les jeunes de notre église.", icon: "🎯", order: 4 },
      ];

      for (const purpose of donationPurposesData) {
        await setDoc(doc(collection(db, "donationPurposes"), purpose.title), purpose);
      }

      // Seed donation FAQs
      const donationFAQsData = [
        { question: "Mon don est-il déductible des impôts ?", answer: "Oui, l'Assemblée Mont Garizim est une association reconnue d'utilité publique. Vos dons peuvent donner droit à une réduction d'impôt selon la législation en vigueur.", order: 1 },
        { question: "Puis-je faire un don ponctuel ou mensuel ?", answer: "Vous pouvez choisir de faire un don ponctuel ou de mettre en place un don mensuel régulier. Les dons réguliers nous permettent de mieux planifier nos activités.", order: 2 },
        { question: "Comment puis-je recevoir un reçu fiscal ?", answer: "Après chaque don, nous vous envoyons un reçu fiscal par email. Pour les dons en espèces, demandez un reçu au secrétariat lors de votre don.", order: 3 },
        { question: "Mon don va-t-il directement aux personnes dans le besoin ?", answer: "Nous veillons à une gestion transparente de chaque don. Les fonds sont alloués selon l'usage que vous avez spécifié ou aux besoins les plus urgents de l'église et de la communauté.", order: 4 },
      ];

      for (const faq of donationFAQsData) {
        await setDoc(doc(collection(db, "donationFAQs"), faq.question), faq);
      }

      // Seed theme of month
      const themeOfMonthData = {
        month: "juillet",
        title: "Vaincre par la foi",
        verse: "Car tout ce qui est né de Dieu triomphe du monde, et la victoire qui a triomphé du monde, c'est notre foi. — 1 Jean 5:4",
      };

      await setDoc(doc(db, "home", "themeOfMonth"), themeOfMonthData);

      // Seed next service
      const nextServiceData = {
        day: "Dimanche",
        time: "9h30 et 11h00",
        location: "Temple Mont Garizim, Abidjan",
      };

      await setDoc(doc(db, "home", "nextService"), nextServiceData);

      setMessage("✅ Firestore database seeded successfully!");
    } catch (err) {
      console.error("Error seeding Firestore:", err);
      setError(`Erreur: ${err instanceof Error ? err.message : "Unknown error"}`);
    }

    setLoading(false);
  }

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero" style={{ minHeight: "50vh", padding: "100px 0 60px" }}>
          <div className="container">
            <div className="hero-content">
              <span className="eyebrow hero-eyebrow">Admin</span>
              <h1>Seed Firestore Database</h1>
              <p className="lead">
                Cette page permet de peupler Firestore avec les données initiales de la page À propos.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <div style={{ background: "#fff", padding: "40px", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-card)" }}>
                <h3 style={{ marginBottom: "20px" }}>Données à ajouter :</h3>
                <ul style={{ marginBottom: "30px", lineHeight: "1.8" }}>
                  <li>5 items d'historique (2006-2024)</li>
                  <li>Informations du fondateur</li>
                  <li>4 lieux de culte</li>
                  <li>6 ministères</li>
                  <li>4 valeurs</li>
                  <li>5 événements à venir</li>
                  <li>3 événements passés</li>
                  <li>6 prédications</li>
                  <li>12 images de galerie</li>
                  <li>Informations de contact</li>
                  <li>3 options de don</li>
                  <li>4 affectations de dons</li>
                  <li>4 FAQ sur les dons</li>
                  <li>Thème du mois</li>
                  <li>Prochain culte</li>
                </ul>

                <button
                  onClick={seedFirestore}
                  disabled={loading}
                  className="btn btn-gold"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {loading ? "Envoi en cours..." : "Seed Firestore"}
                </button>

                {message && (
                  <div style={{ marginTop: "20px", padding: "16px", background: "#dcfce7", color: "#166534", borderRadius: "var(--radius-sm)" }}>
                    {message}
                  </div>
                )}

                {error && (
                  <div style={{ marginTop: "20px", padding: "16px", background: "#fee2e2", color: "#991b1b", borderRadius: "var(--radius-sm)" }}>
                    {error}
                  </div>
                )}

                <p style={{ fontSize: "13px", color: "var(--text-mid)", marginTop: "20px" }}>
                  ⚠️ Assurez-vous que Firestore est activé dans Firebase Console et que les règles de sécurité permettent l'écriture.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
