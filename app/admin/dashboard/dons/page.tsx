"use client";

import { useEffect, useState } from "react";
import {
  getDonationOptions,
  getDonationPurposes,
  getDonationFAQs,
  DonationOption,
  DonationPurpose,
  DonationFAQ,
} from "@/lib/firestore";
import { doc, deleteDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, Card, DataTable, Button } from "@/components/admin/AdminUI";

export default function AdminDons() {
  const [options, setOptions] = useState<DonationOption[]>([]);
  const [purposes, setPurposes] = useState<DonationPurpose[]>([]);
  const [faqs, setFaqs] = useState<DonationFAQ[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [optionsRes, purposesRes, faqsRes] = await Promise.all([
      getDonationOptions(),
      getDonationPurposes(),
      getDonationFAQs(),
    ]);

    if (optionsRes.success) setOptions(optionsRes.options);
    if (purposesRes.success) setPurposes(purposesRes.purposes);
    if (faqsRes.success) setFaqs(faqsRes.faqs);
  };

  const handleDeleteOption = async (id: string) => {
    await deleteDoc(doc(collection(db, "donationOptions"), id));
    fetchData();
  };

  const handleDeletePurpose = async (id: string) => {
    await deleteDoc(doc(collection(db, "donationPurposes"), id));
    fetchData();
  };

  const handleDeleteFAQ = async (question: string) => {
    await deleteDoc(doc(collection(db, "donationFAQs"), question));
    fetchData();
  };

  return (
    <div>
      <PageHeader title="Dons" description="Options, affectations et questions fréquentes sur les dons." />

      <div style={{ display: "grid", gap: 28 }}>
        <Card title={`Options de don (${options.length})`}>
          <DataTable
            rows={options}
            rowKey={(o) => o.id}
            emptyMessage="Aucune option de don enregistrée."
            columns={[
              { key: "title", label: "Titre", render: (o) => o.title },
              { key: "description", label: "Description", render: (o) => o.description, full: true },
              { key: "amount", label: "Montant", render: (o) => o.amount },
              {
                key: "actions",
                label: "Actions",
                render: (o) => (
                  <Button variant="danger" small onClick={() => handleDeleteOption(o.id)}>
                    Supprimer
                  </Button>
                ),
              },
            ]}
          />
        </Card>

        <Card title={`Affectations de dons (${purposes.length})`}>
          <DataTable
            rows={purposes}
            rowKey={(p) => p.id}
            emptyMessage="Aucune affectation enregistrée."
            columns={[
              { key: "title", label: "Titre", render: (p) => p.title },
              { key: "description", label: "Description", render: (p) => p.description, full: true },
              { key: "order", label: "Ordre", render: (p) => p.order },
              {
                key: "actions",
                label: "Actions",
                render: (p) => (
                  <Button variant="danger" small onClick={() => handleDeletePurpose(p.id)}>
                    Supprimer
                  </Button>
                ),
              },
            ]}
          />
        </Card>

        <Card title={`FAQ sur les dons (${faqs.length})`}>
          <DataTable
            rows={faqs}
            rowKey={(f) => f.question}
            emptyMessage="Aucune question fréquente enregistrée."
            columns={[
              { key: "question", label: "Question", render: (f) => f.question, full: true },
              { key: "answer", label: "Réponse", render: (f) => f.answer, full: true },
              {
                key: "actions",
                label: "Actions",
                render: (f) => (
                  <Button variant="danger" small onClick={() => handleDeleteFAQ(f.question)}>
                    Supprimer
                  </Button>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
