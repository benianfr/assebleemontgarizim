"use client";

import { useEffect, useState } from "react";
import { getMinistries, addMinistry, Ministry } from "@/lib/firestore";
import { doc, deleteDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, DataTable, Button, Card, Field, Input, Textarea } from "@/components/admin/AdminUI";
import ImageUpload from "@/components/ImageUpload";

export default function AdminMinisteres() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [showAddMinistry, setShowAddMinistry] = useState(false);
  const [newMinistry, setNewMinistry] = useState<Omit<Ministry, "order" | "id">>({ imageUrl: "", imagePublicId: "", title: "", description: "", schedule: "", leader: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getMinistries();
    if (res.success) setMinistries(res.ministries);
  };

  const handleDeleteMinistry = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce ministère ?")) {
      try {
        await deleteDoc(doc(db, "ministries", id));
        fetchData();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du ministère.");
      }
    }
  };

  const handleAddMinistry = async () => {
    const result = await addMinistry(newMinistry);
    if (result.success) {
      setShowAddMinistry(false);
      setNewMinistry({ imageUrl: "", imagePublicId: "", title: "", description: "", schedule: "", leader: "" });
      fetchData();
    }
  };

  return (
    <div>
      <PageHeader title="Ministères" description={`${ministries.length} ministère(s) actif(s).`} />

      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => setShowAddMinistry(true)}>+ Ajouter un ministère</Button>
      </div>

      <DataTable
        rows={ministries}
        rowKey={(m) => m.id}
        emptyMessage="Aucun ministère enregistré."
        columns={[
          { key: "title", label: "Titre", render: (m) => m.title },
          { key: "description", label: "Description", render: (m) => m.description, full: true },
          { key: "order", label: "Ordre", render: (m) => m.order },
          {
            key: "actions",
            label: "Actions",
            render: (m) => (
              <Button variant="danger" small onClick={() => handleDeleteMinistry(m.id)}>
                Supprimer
              </Button>
            ),
          },
        ]}
      />

      {showAddMinistry && (
        <div style={{ marginTop: 20 }}>
          <Card>
            <h3>Ajouter un ministère</h3>
            <Field label="Titre">
              <Input value={newMinistry.title} onChange={(e) => setNewMinistry({ ...newMinistry, title: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea value={newMinistry.description} onChange={(e) => setNewMinistry({ ...newMinistry, description: e.target.value })} />
            </Field>
            <Field label="Image">
              <ImageUpload 
                onImageUploaded={(url, publicId) => setNewMinistry({ ...newMinistry, imageUrl: url, imagePublicId: publicId })}
                currentImage={newMinistry.imageUrl}
                folder="ministries"
              />
            </Field>
            <Field label="Responsable">
              <Input value={newMinistry.leader} onChange={(e) => setNewMinistry({ ...newMinistry, leader: e.target.value })} />
            </Field>
            <Field label="Horaires">
              <Input value={newMinistry.schedule} onChange={(e) => setNewMinistry({ ...newMinistry, schedule: e.target.value })} />
            </Field>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Button onClick={handleAddMinistry}>Enregistrer</Button>
              <Button onClick={() => setShowAddMinistry(false)}>Annuler</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
