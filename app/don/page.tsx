"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { useRevealOnScroll } from "@/components/useRevealOnScroll";
import { getDonationOptions, getDonationPurposes, getDonationFAQs, DonationOption, DonationPurpose, DonationFAQ } from "@/lib/firestore";

export default function DonPage() {
  const ref1 = useRevealOnScroll();
  const ref2 = useRevealOnScroll();
  const [donationOptions, setDonationOptions] = useState<DonationOption[]>([]);
  const [donationPurposes, setDonationPurposes] = useState<DonationPurpose[]>([]);
  const [faqs, setFaqs] = useState<DonationFAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [optionsRes, purposesRes, faqsRes] = await Promise.all([
        getDonationOptions(),
        getDonationPurposes(),
        getDonationFAQs(),
      ]);

      if (optionsRes.success) setDonationOptions(optionsRes.options);
      if (purposesRes.success) setDonationPurposes(purposesRes.purposes);
      if (faqsRes.success) setFaqs(faqsRes.faqs);

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

  const displayDonationOptions = donationOptions.length > 0 ? donationOptions : [
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

  const displayDonationPurposes = donationPurposes.length > 0 ? donationPurposes : [
    { title: "Dons généraux", description: "Soutenez les activités générales de l'église : cultes, fonctionnement, missions.", icon: "🏛️", order: 1 },
    { title: "Construction", description: "Contribuez à l'agrandissement de nos locaux pour accueillir plus de fidèles.", icon: "🏗️", order: 2 },
    { title: "Actions sociales", description: "Aidez-nous à soutenir les plus démunis à travers nos actions communautaires.", icon: "❤️", order: 3 },
    { title: "Jeunesse", description: "Financez les camps et activités pour les jeunes de notre église.", icon: "🎯", order: 4 },
  ];

  const displayFAQs = faqs.length > 0 ? faqs : [
    { question: "Mon don est-il déductible des impôts ?", answer: "Oui, l'Assemblée Mont Garizim est une association reconnue d'utilité publique. Vos dons peuvent donner droit à une réduction d'impôt selon la législation en vigueur.", order: 1 },
    { question: "Puis-je faire un don ponctuel ou mensuel ?", answer: "Vous pouvez choisir de faire un don ponctuel ou de mettre en place un don mensuel régulier. Les dons réguliers nous permettent de mieux planifier nos activités.", order: 2 },
    { question: "Comment puis-je recevoir un reçu fiscal ?", answer: "Après chaque don, nous vous envoyons un reçu fiscal par email. Pour les dons en espèces, demandez un reçu au secrétariat lors de votre don.", order: 3 },
    { question: "Mon don va-t-il directement aux personnes dans le besoin ?", answer: "Nous veillons à une gestion transparente de chaque don. Les fonds sont alloués selon l'usage que vous avez spécifié ou aux besoins les plus urgents de l'église et de la communauté.", order: 4 },
  ];

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero Section */}
        <section className="hero" style={{ minHeight: "60vh", padding: "120px 0 80px" }}>
          <div className="container">
            <div className="hero-content">
              <span className="eyebrow hero-eyebrow">Faire un don</span>
              <h1>
                Soutenir l'œuvre de <em>Dieu</em> ensemble
              </h1>
              <p className="lead">
                Votre générosité nous permet de poursuivre notre mission de
                partager l'amour de Dieu et de servir notre communauté. Chaque
                don, quel que soit son montant, fait une différence.
              </p>
            </div>
          </div>
        </section>

        {/* Options de don */}
        <section className="section bg-pale" ref={ref1}>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Comment donner</span>
              <h2>Choisissez votre mode de don</h2>
            </div>
            <div className="grid-3">
              {displayDonationOptions.map((option) => (
                <div className="card" key={option.title}>
                  <div className="card-body">
                    <h3>{option.title}</h3>
                    <p style={{ fontSize: "13.5px", lineHeight: "1.65", marginBottom: "16px" }}>
                      {option.description}
                    </p>
                    <div style={{ borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
                      {option.details.map((detail) => (
                        <div
                          key={detail.label}
                          style={{ marginBottom: "8px", fontSize: "13px" }}
                        >
                          <span style={{ color: "var(--text-mid)", fontWeight: 600 }}>
                            {detail.label} :
                          </span>{" "}
                          <span>{detail.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Affectation des dons */}
        <section className="section" ref={ref2}>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Affectation</span>
              <h2>À quoi servent vos dons</h2>
            </div>
            <div className="values-grid">
              {displayDonationPurposes.map((purpose) => (
                <div className="value-card" key={purpose.title}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>
                    {purpose.icon}
                  </div>
                  <h3>{purpose.title}</h3>
                  <p>{purpose.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section bg-pale">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Questions fréquentes</span>
              <h2>FAQ</h2>
            </div>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              {displayFAQs.map((faq, index) => (
                <div
                  key={faq.question}
                  style={{
                    background: "#fff",
                    borderRadius: "var(--radius-md)",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "1px solid var(--line)",
                  }}
                >
                  <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>
                    {faq.question}
                  </h3>
                  <p style={{ fontSize: "14px", lineHeight: "1.65", color: "var(--text-mid)" }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <h2>Chaque don compte</h2>
            <p>
              Que vous puissiez donner beaucoup ou peu, votre générosité change
              des vies. Merci de soutenir l'œuvre de Dieu à travers l'Assemblée Mont Garizim.
            </p>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-gold">
                Nous contacter pour un don
              </a>
              <a href="/a-propos" className="btn btn-outline">
              En savoir plus sur l'église
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
