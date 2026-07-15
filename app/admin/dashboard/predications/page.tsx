"use client";

import { useEffect, useState } from "react";
import { getSermons, addSermon, updateSermon, Sermon } from "@/lib/firestore";
import { doc, deleteDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, DataTable, Button, Card, Field, Input, Textarea } from "@/components/admin/AdminUI";
import ImageUpload from "@/components/ImageUpload";

export default function AdminPredications() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [showAddSermon, setShowAddSermon] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [newSermon, setNewSermon] = useState<Omit<Sermon, "order" | "id">>({ imageUrl: "", imagePublicId: "", title: "", preacher: "", date: "", duration: "", description: "", category: "", scripture: "", videoUrl: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getSermons();
    if (res.success) {
      const sermonsWithDates = res.sermons.map(sermon => ({
        ...sermon,
        date: sermon.date || ''
      }));
      setSermons(sermonsWithDates);
    }
  };

  const handleDeleteSermon = async (id: string) => {
    await deleteDoc(doc(collection(db, "sermons"), id));
    fetchData();
  };

  const handleAddSermon = async () => {
    const result = await addSermon(newSermon);
    if (result.success) {
      setShowAddSermon(false);
      setNewSermon({ imageUrl: "", imagePublicId: "", title: "", preacher: "", date: "", duration: "", description: "", category: "", scripture: "", videoUrl: "" });
      fetchData();
    }
  };

  const handleSaveSermon = async (sermon: Sermon) => {
    if (!sermon.id) {
      console.error("Sermon ID is missing:", sermon);
      alert("Erreur: ID de prédication manquant");
      return;
    }
    const { id, order, ...sermonData } = sermon;
    console.log("Saving sermon with ID:", id);
    console.log("Sermon data:", sermonData);
    const result = await updateSermon(id, sermonData);
    console.log("Update result:", result);
    if (result.success) {
      setEditingSermon(null);
      fetchData();
    } else {
      console.error("Failed to save sermon:", result.error);
      alert("Erreur lors de la sauvegarde. Vérifiez la console pour plus de détails.");
    }
  };

  return (
    <div>
      <PageHeader title="Prédications" description={`${sermons.length} prédication(s) publiée(s).`} />

      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => setShowAddSermon(true)}>+ Ajouter une prédication</Button>
      </div>

      <DataTable
        rows={sermons}
        rowKey={(s) => s.id}
        emptyMessage="Aucune prédication publiée."
        columns={[
          { key: "title", label: "Titre", render: (s) => s.title },
          { key: "preacher", label: "Prédicateur", render: (s) => s.preacher },
          { key: "date", label: "Date", render: (s) => s.date },
          { key: "category", label: "Catégorie", render: (s) => s.category },
          {
            key: "actions",
            label: "Actions",
            render: (s) => (
              <div style={{ display: "flex", gap: 8 }}>
                <Button small onClick={() => setEditingSermon(s)}>
                  Modifier
                </Button>
                <Button variant="danger" small onClick={() => handleDeleteSermon(s.id)}>
                  Supprimer
                </Button>
              </div>
            ),
          },
        ]}
      />

      {showAddSermon && (
        <div style={{ marginTop: 20 }}>
          <Card>
            <h3>Ajouter une prédication</h3>
            <Field label="Titre">
              <Input value={newSermon.title} onChange={(e) => setNewSermon({ ...newSermon, title: e.target.value })} />
            </Field>
            <Field label="Prédicateur">
              <Input value={newSermon.preacher} onChange={(e) => setNewSermon({ ...newSermon, preacher: e.target.value })} />
            </Field>
            <Field label="Date">
              <Input value={newSermon.date} onChange={(e) => setNewSermon({ ...newSermon, date: e.target.value })} />
            </Field>
            <Field label="Durée">
              <Input value={newSermon.duration} onChange={(e) => setNewSermon({ ...newSermon, duration: e.target.value })} />
            </Field>
            <Field label="Image">
              <ImageUpload 
                onImageUploaded={(url, publicId) => setNewSermon({ ...newSermon, imageUrl: url, imagePublicId: publicId })}
                currentImage={newSermon.imageUrl}
                folder="sermons"
              />
            </Field>
            <Field label="Description">
              <Textarea value={newSermon.description} onChange={(e) => setNewSermon({ ...newSermon, description: e.target.value })} />
            </Field>
            <Field label="Catégorie">
              <Input value={newSermon.category} onChange={(e) => setNewSermon({ ...newSermon, category: e.target.value })} />
            </Field>
            <Field label="Écriture">
              <Input value={newSermon.scripture} onChange={(e) => setNewSermon({ ...newSermon, scripture: e.target.value })} />
            </Field>
            <Field label="Lien vidéo YouTube">
              <Input value={newSermon.videoUrl} onChange={(e) => setNewSermon({ ...newSermon, videoUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
            </Field>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Button onClick={handleAddSermon}>Enregistrer</Button>
              <Button onClick={() => setShowAddSermon(false)}>Annuler</Button>
            </div>
          </Card>
        </div>
      )}

      {editingSermon && (
        <div style={{ marginTop: 20 }}>
          <Card>
            <h3>Modifier la prédication</h3>
            <Field label="Titre">
              <Input value={editingSermon.title} onChange={(e) => setEditingSermon({ ...editingSermon, title: e.target.value })} />
            </Field>
            <Field label="Prédicateur">
              <Input value={editingSermon.preacher} onChange={(e) => setEditingSermon({ ...editingSermon, preacher: e.target.value })} />
            </Field>
            <Field label="Date">
              <Input value={editingSermon.date} onChange={(e) => setEditingSermon({ ...editingSermon, date: e.target.value })} />
            </Field>
            <Field label="Durée">
              <Input value={editingSermon.duration} onChange={(e) => setEditingSermon({ ...editingSermon, duration: e.target.value })} />
            </Field>
            <Field label="Image">
              <ImageUpload 
                onImageUploaded={(url, publicId) => setEditingSermon({ ...editingSermon, imageUrl: url, imagePublicId: publicId })}
                currentImage={editingSermon.imageUrl}
                folder="sermons"
              />
            </Field>
            <Field label="Description">
              <Textarea value={editingSermon.description} onChange={(e) => setEditingSermon({ ...editingSermon, description: e.target.value })} />
            </Field>
            <Field label="Catégorie">
              <Input value={editingSermon.category} onChange={(e) => setEditingSermon({ ...editingSermon, category: e.target.value })} />
            </Field>
            <Field label="Écriture">
              <Input value={editingSermon.scripture} onChange={(e) => setEditingSermon({ ...editingSermon, scripture: e.target.value })} />
            </Field>
            <Field label="Lien vidéo YouTube">
              <Input value={editingSermon.videoUrl} onChange={(e) => setEditingSermon({ ...editingSermon, videoUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
            </Field>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Button onClick={() => handleSaveSermon(editingSermon)}>Enregistrer</Button>
              <Button onClick={() => setEditingSermon(null)}>Annuler</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
