"use client";

import { useEffect, useState } from "react";
import { getValues, addValue, Value } from "@/lib/firestore";
import { doc, deleteDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, DataTable, Button, Card, Field, Input, Textarea } from "@/components/admin/AdminUI";

export default function AdminValeurs() {
  const [values, setValues] = useState<Value[]>([]);
  const [showAddValue, setShowAddValue] = useState(false);
  const [newValue, setNewValue] = useState<Omit<Value, "order" | "id">>({ title: "", text: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getValues();
    if (res.success) setValues(res.values);
  };

  const handleDeleteValue = async (id: string) => {
    await deleteDoc(doc(collection(db, "values"), id));
    fetchData();
  };

  const handleAddValue = async () => {
    const result = await addValue(newValue);
    if (result.success) {
      setShowAddValue(false);
      setNewValue({ title: "", text: "" });
      fetchData();
    }
  };

  return (
    <div>
      <PageHeader title="Valeurs" description={`${values.length} valeur(s) enregistrée(s).`} />

      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => setShowAddValue(true)}>+ Ajouter une valeur</Button>
      </div>

      <DataTable
        rows={values}
        rowKey={(v) => v.id}
        emptyMessage="Aucune valeur enregistrée."
        columns={[
          { key: "title", label: "Titre", render: (v) => v.title },
          { key: "text", label: "Description", render: (v) => v.text, full: true },
          { key: "order", label: "Ordre", render: (v) => v.order },
          {
            key: "actions",
            label: "Actions",
            render: (v) => (
              <Button variant="danger" small onClick={() => handleDeleteValue(v.id)}>
                Supprimer
              </Button>
            ),
          },
        ]}
      />

      {showAddValue && (
        <div style={{ marginTop: 20 }}>
          <Card>
            <h3>Ajouter une valeur</h3>
            <Field label="Titre">
              <Input value={newValue.title} onChange={(e) => setNewValue({ ...newValue, title: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea value={newValue.text} onChange={(e) => setNewValue({ ...newValue, text: e.target.value })} />
            </Field>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Button onClick={handleAddValue}>Enregistrer</Button>
              <Button onClick={() => setShowAddValue(false)}>Annuler</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
