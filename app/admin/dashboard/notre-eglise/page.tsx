"use client";

import { useEffect, useState } from "react";
import { getAboutSection, updateAboutSection, AboutSection } from "@/lib/firestore";
import { PageHeader, Card, Button, Field, Input, Textarea } from "@/components/admin/AdminUI";

export default function AdminNotreEglise() {
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getAboutSection();
    if (result.success && result.aboutSection) {
      setAboutSection(result.aboutSection);
    } else {
      // Set default values if not found
      setAboutSection({
        title: "Notre église",
        subtitle: "Un lieu où la foi devient un mode de vie",
        description: "Depuis notre fondation, l'Assemblée Mont Garizim accompagne des hommes et des femmes de toutes générations dans leur cheminement spirituel. Nous croyons en une foi vivante, incarnée dans la prière, l'étude de la Parole et le service du prochain.",
        years: 18,
        yearsText: "au service de la communauté d'Abidjan",
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (aboutSection) {
      const result = await updateAboutSection(aboutSection);
      if (result.success) {
        setEditing(false);
        alert("Section Notre église mise à jour avec succès !");
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
        title="Notre église"
        description="Modifier le contenu de la section Notre église sur la page d'accueil."
      />

      <Card>
        {editing && aboutSection ? (
          <div style={{ display: "grid", gap: 16 }}>
            <Field label="Titre (eyebrow)">
              <Input
                value={aboutSection.title}
                onChange={(e) =>
                  setAboutSection({ ...aboutSection, title: e.target.value })
                }
              />
            </Field>
            <Field label="Sous-titre">
              <Input
                value={aboutSection.subtitle}
                onChange={(e) =>
                  setAboutSection({ ...aboutSection, subtitle: e.target.value })
                }
              />
            </Field>
            <Field label="Description">
              <Textarea
                value={aboutSection.description}
                onChange={(e) =>
                  setAboutSection({ ...aboutSection, description: e.target.value })
                }
              />
            </Field>
            <Field label="Nombre d'années">
              <Input
                type="number"
                value={aboutSection.years}
                onChange={(e) =>
                  setAboutSection({ ...aboutSection, years: parseInt(e.target.value) })
                }
              />
            </Field>
            <Field label="Texte des années">
              <Input
                value={aboutSection.yearsText}
                onChange={(e) =>
                  setAboutSection({ ...aboutSection, yearsText: e.target.value })
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
        ) : aboutSection ? (
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <strong>Titre (eyebrow)</strong>
              <p style={{ marginTop: 4 }}>{aboutSection.title}</p>
            </div>
            <div>
              <strong>Sous-titre</strong>
              <p style={{ marginTop: 4 }}>{aboutSection.subtitle}</p>
            </div>
            <div>
              <strong>Description</strong>
              <p style={{ marginTop: 4, lineHeight: 1.6 }}>
                {aboutSection.description}
              </p>
            </div>
            <div>
              <strong>Nombre d'années</strong>
              <p style={{ marginTop: 4 }}>{aboutSection.years}</p>
            </div>
            <div>
              <strong>Texte des années</strong>
              <p style={{ marginTop: 4 }}>{aboutSection.yearsText}</p>
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
