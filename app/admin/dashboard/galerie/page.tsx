"use client";

import { useEffect, useState } from "react";
import { getGalleryImages, addGalleryImage, GalleryImage } from "@/lib/firestore";
import { doc, deleteDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, DataTable, Button, Card, Field, Input, Textarea } from "@/components/admin/AdminUI";
import ImageUpload from "@/components/ImageUpload";

export default function AdminGalerie() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [showAddImage, setShowAddImage] = useState(false);
  const [newImage, setNewImage] = useState<Omit<GalleryImage, "order" | "id">>({ imageUrl: "", imagePublicId: "", caption: "", category: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getGalleryImages();
    if (res.success) setImages(res.images);
  };

  const handleDeleteImage = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "gallery", id));
        // Optimistic update
        setImages(images.filter(img => img.id !== id));
        await fetchData();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression de l'image.");
        await fetchData();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddImage = async () => {
    setLoading(true);
    try {
      const result = await addGalleryImage(newImage);
      if (result.success) {
        setShowAddImage(false);
        setNewImage({ imageUrl: "", imagePublicId: "", caption: "", category: "" });
        await fetchData();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      alert("Erreur lors de l'ajout de l'image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Galerie" description={`${images.length} image(s) publiée(s).`} />

      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => setShowAddImage(true)} disabled={loading}>+ Ajouter une image</Button>
      </div>

      <DataTable
        rows={images}
        rowKey={(img) => img.id}
        emptyMessage="Aucune image dans la galerie."
        columns={[
          {
            key: "preview",
            label: "Image",
            render: (img) => (
              <img
                src={img.imageUrl}
                alt={img.caption}
                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid #e6e0d2" }}
              />
            ),
          },
          { key: "caption", label: "Légende", render: (img) => img.caption },
          { key: "category", label: "Catégorie", render: (img) => img.category },
          {
            key: "actions",
            label: "Actions",
            render: (img) => (
              <Button variant="danger" small onClick={() => handleDeleteImage(img.id)} disabled={loading}>
                Supprimer
              </Button>
            ),
          },
        ]}
      />

      {showAddImage && (
        <div style={{ marginTop: 20 }}>
          <Card>
            <h3>Ajouter une image</h3>
            <Field label="Image">
              <ImageUpload 
                onImageUploaded={(url, publicId) => setNewImage({ ...newImage, imageUrl: url, imagePublicId: publicId })}
                currentImage={newImage.imageUrl}
                folder="gallery"
              />
            </Field>
            <Field label="Légende">
              <Input value={newImage.caption} onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })} />
            </Field>
            <Field label="Catégorie">
              <Input value={newImage.category} onChange={(e) => setNewImage({ ...newImage, category: e.target.value })} />
            </Field>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Button onClick={handleAddImage} disabled={loading}>{loading ? "Enregistrement..." : "Enregistrer"}</Button>
              <Button onClick={() => setShowAddImage(false)} disabled={loading}>Annuler</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
