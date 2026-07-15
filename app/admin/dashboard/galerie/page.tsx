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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getGalleryImages();
    if (res.success) setImages(res.images);
  };

  const handleDeleteImage = async (id: string) => {
    await deleteDoc(doc(collection(db, "gallery"), id));
    fetchData();
  };

  const handleAddImage = async () => {
    const result = await addGalleryImage(newImage);
    if (result.success) {
      setShowAddImage(false);
      setNewImage({ imageUrl: "", imagePublicId: "", caption: "", category: "" });
      fetchData();
    }
  };

  return (
    <div>
      <PageHeader title="Galerie" description={`${images.length} image(s) publiée(s).`} />

      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => setShowAddImage(true)}>+ Ajouter une image</Button>
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
              <Button variant="danger" small onClick={() => handleDeleteImage(img.id)}>
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
              <Button onClick={handleAddImage}>Enregistrer</Button>
              <Button onClick={() => setShowAddImage(false)}>Annuler</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
