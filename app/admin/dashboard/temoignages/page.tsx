"use client";

import { useEffect, useState } from "react";
import { getTestimonials, Testimonial } from "@/lib/firestore";
import { doc, setDoc, deleteDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, DataTable, Button, Badge, ActionsRow, Card } from "@/components/admin/AdminUI";

export default function AdminTemoignages() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getTestimonials();
    if (res.success) {
      const testimonialsWithDates = res.testimonials.map(t => ({
        ...t,
        createdAt: typeof t.createdAt === 'string' ? t.createdAt : t.createdAt?.seconds ? new Date(t.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : ''
      }));
      setTestimonials(testimonialsWithDates);
    }
  };

  const handleApprove = async (t: Testimonial) => {
    await setDoc(doc(collection(db, "testimonials"), `${t.prenom}-${t.nom}-${t.telephone}`), { approved: true });
    fetchData();
  };

  const handleReject = async (t: Testimonial) => {
    await deleteDoc(doc(collection(db, "testimonials"), `${t.prenom}-${t.nom}-${t.telephone}`));
    fetchData();
  };

  const handleView = (t: Testimonial) => {
    setSelectedTestimonial(t);
  };

  return (
    <div>
      <PageHeader title="Témoignages" description={`${testimonials.length} témoignage(s) reçu(s).`} />

      <DataTable
        rows={testimonials}
        rowKey={(t) => `${t.prenom}-${t.nom}-${t.telephone}`}
        emptyMessage="Aucun témoignage pour le moment."
        columns={[
          { key: "name", label: "Nom", render: (t) => `${t.prenom} ${t.nom}` },
          { key: "content", label: "Témoignage", render: (t) => t.temoignage?.substring(0, 100) + (t.temoignage?.length > 100 ? '...' : ''), full: true },
          {
            key: "status",
            label: "Statut",
            render: (t) =>
              t.approved ? <Badge tone="success">Approuvé</Badge> : <Badge tone="warn">En attente</Badge>,
          },
          { key: "date", label: "Date", render: (t) => typeof t.createdAt === 'string' ? t.createdAt : t.createdAt?.seconds ? new Date(t.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : '' },
          {
            key: "actions",
            label: "Actions",
            render: (t) => (
              <ActionsRow>
                <Button variant="ghost" small onClick={() => handleView(t)}>
                  Voir
                </Button>
                {!t.approved ? (
                  <>
                    <Button variant="success" small onClick={() => handleApprove(t)}>
                      Approuver
                    </Button>
                    <Button variant="danger" small onClick={() => handleReject(t)}>
                      Rejeter
                    </Button>
                  </>
                ) : (
                  <Button variant="danger" small onClick={() => handleReject(t)}>
                    Supprimer
                  </Button>
                )}
              </ActionsRow>
            ),
          },
        ]}
      />

      {selectedTestimonial && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ maxWidth: "600px", width: "90%", maxHeight: "80vh", overflowY: "auto" }}>
            <Card>
            <h3 style={{ marginBottom: "16px" }}>Détails du témoignage</h3>
            <div style={{ marginBottom: "16px" }}>
              <strong>Nom:</strong> {selectedTestimonial.prenom} {selectedTestimonial.nom}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Titre:</strong> {selectedTestimonial.titre}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Téléphone:</strong> {selectedTestimonial.telephone}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Témoignage:</strong>
              <p style={{ marginTop: "8px", lineHeight: "1.6" }}>{selectedTestimonial.temoignage}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Date:</strong> {selectedTestimonial.createdAt}
            </div>
            <div style={{ marginBottom: "24px" }}>
              <strong>Statut:</strong> {selectedTestimonial.approved ? <Badge tone="success">Approuvé</Badge> : <Badge tone="warn">En attente</Badge>}
            </div>
            <ActionsRow>
              <Button variant="ghost" onClick={() => setSelectedTestimonial(null)}>
                Fermer
              </Button>
              {!selectedTestimonial.approved ? (
                <>
                  <Button variant="success" onClick={() => { handleApprove(selectedTestimonial); setSelectedTestimonial(null); }}>
                    Approuver
                  </Button>
                  <Button variant="danger" onClick={() => { handleReject(selectedTestimonial); setSelectedTestimonial(null); }}>
                    Rejeter
                  </Button>
                </>
              ) : (
                <Button variant="danger" onClick={() => { handleReject(selectedTestimonial); setSelectedTestimonial(null); }}>
                  Supprimer
                </Button>
              )}
            </ActionsRow>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
