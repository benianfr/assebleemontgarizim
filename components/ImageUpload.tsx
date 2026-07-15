"use client";

import { useState } from "react";

interface ImageUploadProps {
  onImageUploaded: (url: string, publicId: string) => void;
  currentImage?: string;
  folder?: string;
}

export default function ImageUpload({ onImageUploaded, currentImage, folder = "eglise-mont-garizim" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.secure_url && result.public_id) {
        setPreview(result.secure_url);
        onImageUploaded(result.secure_url, result.public_id);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Erreur lors du téléchargement de l'image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      {preview && (
        <div style={{ marginBottom: 12 }}>
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", maxWidth: 600, height: "auto", borderRadius: 8, border: "1px solid #e6e0d2" }}
          />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        style={{
          padding: "8px",
          border: "1px solid #e6e0d2",
          borderRadius: 4,
          width: "100%",
        }}
      />
      {uploading && <p style={{ marginTop: 8, color: "#666" }}>Téléchargement en cours...</p>}
    </div>
  );
}
