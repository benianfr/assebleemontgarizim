"use client";

import { useEffect, useState } from "react";
import { getPopup, updatePopup, Popup } from "@/lib/firestore";
import { PageHeader, Card, Button, Field, Input, Textarea } from "@/components/admin/AdminUI";
import ImageUpload from "@/components/ImageUpload";

export default function AdminPopup() {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getPopup();
    if (result.success && result.popup) {
      setPopup(result.popup);
    } else {
      // Set default values if not found
      setPopup({
        enabled: false,
        imageUrl: "",
        imagePublicId: "",
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "",
        showDelay: 2,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (popup) {
      const result = await updatePopup(popup);
      if (result.success) {
        setEditing(false);
        alert("Popup mis à jour avec succès !");
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Popup publicitaire"
        description="Gérer le popup qui s'affiche sur le site."
      />

      <Card>
        {editing && popup ? (
          <div style={{ display: "grid", gap: 16 }}>
            <Field label="Activé">
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={popup.enabled}
                  onChange={(e) =>
                    setPopup({ ...popup, enabled: e.target.checked })
                  }
                  style={{ width: 18, height: 18 }}
                />
                <span>Activer le popup</span>
              </label>
            </Field>
            <Field label="Titre">
              <Input
                value={popup.title}
                onChange={(e) =>
                  setPopup({ ...popup, title: e.target.value })
                }
              />
            </Field>
            <Field label="Description">
              <Textarea
                value={popup.description}
                onChange={(e) =>
                  setPopup({ ...popup, description: e.target.value })
                }
              />
            </Field>
            <Field label="Image">
              <ImageUpload
                onImageUploaded={(url, publicId) =>
                  setPopup({ ...popup, imageUrl: url, imagePublicId: publicId })
                }
                currentImage={popup.imageUrl}
                folder="popup"
              />
            </Field>
            <Field label="Texte du bouton">
              <Input
                value={popup.buttonText}
                onChange={(e) =>
                  setPopup({ ...popup, buttonText: e.target.value })
                }
              />
            </Field>
            <Field label="Lien du bouton">
              <Input
                value={popup.buttonLink}
                onChange={(e) =>
                  setPopup({ ...popup, buttonLink: e.target.value })
                }
              />
            </Field>
            <Field label="Délai d'affichage (secondes)">
              <Input
                type="number"
                value={popup.showDelay}
                onChange={(e) =>
                  setPopup({ ...popup, showDelay: parseInt(e.target.value) || 2 })
                }
              />
            </Field>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Button onClick={handleSave}>Enregistrer</Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Annuler
              </Button>
            </div>
          </div>
        ) : popup ? (
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <strong>Statut</strong>
              <p style={{ marginTop: 4 }}>{popup.enabled ? "Activé" : "Désactivé"}</p>
            </div>
            <div>
              <strong>Titre</strong>
              <p style={{ marginTop: 4 }}>{popup.title || "Non défini"}</p>
            </div>
            <div>
              <strong>Description</strong>
              <p style={{ marginTop: 4, lineHeight: 1.6 }}>
                {popup.description || "Non défini"}
              </p>
            </div>
            <div>
              <strong>Image</strong>
              {popup.imageUrl ? (
                <img
                  src={popup.imageUrl}
                  alt="Popup"
                  style={{ marginTop: 8, maxWidth: "300px", borderRadius: "8px" }}
                />
              ) : (
                <p style={{ marginTop: 4, color: "var(--text-muted)" }}>Aucune image</p>
              )}
            </div>
            <div>
              <strong>Texte du bouton</strong>
              <p style={{ marginTop: 4 }}>{popup.buttonText || "Non défini"}</p>
            </div>
            <div>
              <strong>Lien du bouton</strong>
              <p style={{ marginTop: 4 }}>{popup.buttonLink || "Non défini"}</p>
            </div>
            <div>
              <strong>Délai d'affichage</strong>
              <p style={{ marginTop: 4 }}>{popup.showDelay} secondes</p>
            </div>
            <Button onClick={() => setEditing(true)}>Modifier</Button>
          </div>
        ) : (
          <p style={{ color: "var(--text-muted, #667085)" }}>
            Aucune information disponible.
          </p>
        )}
      </Card>
    </div>
  );
}
