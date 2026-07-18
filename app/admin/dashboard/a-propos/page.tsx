"use client";

import { useEffect, useState } from "react";
import {
  getHistory,
  getFounder,
  getLocations,
  addHistoryItem,
  addLocationItem,
  getHistorySection,
  updateHistorySection,
  HistoryItem,
  Founder,
  Location,
  Schedule,
  HistorySection,
} from "@/lib/firestore";
import { doc, deleteDoc, setDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, Tabs, Card, DataTable, Button, Field, Input, Textarea } from "@/components/admin/AdminUI";
import ImageUpload from "@/components/ImageUpload";

type Tab = "history" | "founder" | "locations";

export default function AdminAPropos() {
  const [activeTab, setActiveTab] = useState<Tab>("history");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [founder, setFounder] = useState<Founder | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [historySection, setHistorySection] = useState<HistorySection>({ imageUrl: "", imagePublicId: "" });
  const [editingHistory, setEditingHistory] = useState<HistoryItem | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [editingFounder, setEditingFounder] = useState(false);
  const [editingHistorySection, setEditingHistorySection] = useState(false);
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newHistory, setNewHistory] = useState<Omit<HistoryItem, "order">>({ imageUrl: "", imagePublicId: "", year: "", title: "", description: "" });
  const [newLocation, setNewLocation] = useState<Omit<Location, "order" | "id">>({ imageUrl: "", imagePublicId: "", name: "", pastor: "", address: "", city: "", schedules: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [historyRes, founderRes, locationsRes, historySectionRes] = await Promise.all([
      getHistory(),
      getFounder(),
      getLocations(),
      getHistorySection(),
    ]);

    if (historyRes.success) setHistory(historyRes.history);
    if (founderRes.success) setFounder(founderRes.founder);
    if (locationsRes.success) setLocations(locationsRes.locations);
    if (historySectionRes.success) setHistorySection(historySectionRes.historySection);
  };

  const handleDeleteHistory = async (year: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement historique ?")) {
      try {
        await deleteDoc(doc(db, "history", year));
        fetchData();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression de l'événement historique.");
      }
    }
  };

  const handleDeleteLocation = async (name: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce lieu de culte ?")) {
      try {
        await deleteDoc(doc(db, "locations", name));
        fetchData();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du lieu de culte.");
      }
    }
  };

  const handleEditHistory = (item: HistoryItem) => {
    setEditingHistory(item);
  };

  const handleSaveHistory = async (item: HistoryItem) => {
    try {
      await setDoc(doc(db, "history", item.year), item);
      setEditingHistory(null);
      fetchData();
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      alert("Erreur lors de la modification de l'événement historique.");
    }
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation({ ...location, originalName: location.name } as Location & { originalName: string });
  };

  const handleSaveLocation = async (location: Location & { originalName?: string }) => {
    const originalName = location.originalName || location.name;
    const newName = location.name;

    try {
      // If name changed, delete old document and create new one
      if (originalName !== newName) {
        await deleteDoc(doc(db, "locations", originalName));
      }
      await setDoc(doc(db, "locations", newName), location);
      setEditingLocation(null);
      fetchData();
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      alert("Erreur lors de la modification du lieu de culte.");
    }
  };

  const handleSaveFounder = async (founderData: Founder) => {
    await setDoc(doc(db, "about", "founder"), founderData);
    setEditingFounder(false);
    fetchData();
  };

  const handleSaveHistorySection = async (sectionData: HistorySection) => {
    const result = await updateHistorySection(sectionData);
    if (result.success) {
      setEditingHistorySection(false);
      fetchData();
    }
  };

  const handleAddHistory = async () => {
    const result = await addHistoryItem(newHistory);
    if (result.success) {
      setShowAddHistory(false);
      setNewHistory({ imageUrl: "", imagePublicId: "", year: "", title: "", description: "" });
      fetchData();
    }
  };

  const handleAddLocation = async () => {
    const result = await addLocationItem(newLocation);
    if (result.success) {
      setShowAddLocation(false);
      setNewLocation({ imageUrl: "", imagePublicId: "", name: "", pastor: "", address: "", city: "", schedules: [] });
      fetchData();
    }
  };

  return (
    <div>
      <PageHeader title="À propos" description="Historique, fondateur et lieux de culte." />

      <Tabs
        tabs={[
          { value: "history", label: "Historique" },
          { value: "founder", label: "Fondateur" },
          { value: "locations", label: "Lieux de culte" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div style={{ marginTop: 20 }}>
        {activeTab === "history" && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Button onClick={() => setShowAddHistory(true)}>+ Ajouter un événement historique</Button>
            </div>
            <DataTable
              rows={history}
              rowKey={(item) => item.year}
              emptyMessage="Aucun repère historique enregistré."
              columns={[
                { key: "year", label: "Année", render: (item) => item.year },
                { key: "description", label: "Description", render: (item) => item.description, full: true },
                { key: "order", label: "Ordre", render: (item) => item.order },
                {
                  key: "actions",
                  label: "Actions",
                  render: (item) => (
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button small onClick={() => handleEditHistory(item)}>
                        Modifier
                      </Button>
                      <Button variant="danger" small onClick={() => handleDeleteHistory(item.year)}>
                        Supprimer
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
            <div style={{ marginTop: 20 }}>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3>Image de la section Notre histoire</h3>
                <Button small onClick={() => setEditingHistorySection(true)}>
                  Modifier
                </Button>
              </div>
              {historySection.imageUrl ? (
                <img src={historySection.imageUrl} alt="History section" style={{ width: "100%", maxWidth: 400, height: "auto", borderRadius: 8, border: "1px solid #e6e0d2" }} />
              ) : (
                <div style={{ padding: 40, background: "#f5f5f5", borderRadius: 8, textAlign: "center" }}>
                  Aucune image
                </div>
              )}
              </Card>
            </div>
            {editingHistorySection && (
              <div style={{ marginTop: 20 }}>
                <Card>
                  <h3>Modifier l'image de la section Notre histoire</h3>
                <Field label="Image">
                  <ImageUpload 
                    onImageUploaded={(url, publicId) => setHistorySection({ ...historySection, imageUrl: url, imagePublicId: publicId })}
                    currentImage={historySection.imageUrl}
                    folder="history-section"
                  />
                </Field>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <Button onClick={() => handleSaveHistorySection(historySection)}>Enregistrer</Button>
                  <Button variant="ghost" onClick={() => setEditingHistorySection(false)}>Annuler</Button>
                </div>
                </Card>
              </div>
            )}
            {editingHistory && (
              <div style={{ marginTop: 20 }}>
                <Card>
                  <Field label="Année">
                  <Input value={editingHistory.year} onChange={(e) => setEditingHistory({ ...editingHistory, year: e.target.value })} />
                </Field>
                <Field label="Titre">
                  <Input value={editingHistory.title} onChange={(e) => setEditingHistory({ ...editingHistory, title: e.target.value })} />
                </Field>
                <Field label="Description">
                  <Textarea value={editingHistory.description} onChange={(e) => setEditingHistory({ ...editingHistory, description: e.target.value })} />
                </Field>
                <Field label="Image">
                  <ImageUpload 
                    onImageUploaded={(url, publicId) => setEditingHistory({ ...editingHistory, imageUrl: url, imagePublicId: publicId })}
                    currentImage={editingHistory.imageUrl}
                    folder="history"
                  />
                </Field>
                <Field label="Ordre">
                  <Input type="number" value={editingHistory.order} onChange={(e) => setEditingHistory({ ...editingHistory, order: parseInt(e.target.value) })} />
                </Field>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <Button onClick={() => handleSaveHistory(editingHistory)}>Enregistrer</Button>
                  <Button variant="ghost" onClick={() => setEditingHistory(null)}>Annuler</Button>
                </div>
                </Card>
              </div>
            )}
            {showAddHistory && (
              <div style={{ marginTop: 20 }}>
                <Card>
                  <h3>Ajouter un événement historique</h3>
                  <Field label="Année">
                  <Input value={newHistory.year} onChange={(e) => setNewHistory({ ...newHistory, year: e.target.value })} />
                </Field>
                <Field label="Titre">
                  <Input value={newHistory.title} onChange={(e) => setNewHistory({ ...newHistory, title: e.target.value })} />
                </Field>
                <Field label="Description">
                  <Textarea value={newHistory.description} onChange={(e) => setNewHistory({ ...newHistory, description: e.target.value })} />
                </Field>
                <Field label="Image">
                  <ImageUpload 
                    onImageUploaded={(url, publicId) => setNewHistory({ ...newHistory, imageUrl: url, imagePublicId: publicId })}
                    currentImage={newHistory.imageUrl}
                    folder="history"
                  />
                </Field>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <Button onClick={handleAddHistory}>Enregistrer</Button>
                  <Button variant="ghost" onClick={() => setShowAddHistory(false)}>Annuler</Button>
                </div>
                </Card>
              </div>
            )}
          </>
        )}

        {activeTab === "founder" && (
          <Card>
            {editingFounder && founder ? (
              <div style={{ display: "grid", gap: 16 }}>
                <Field label="Nom">
                  <Input value={founder.name} onChange={(e) => setFounder({ ...founder, name: e.target.value })} />
                </Field>
                <Field label="Titre">
                  <Input value={founder.title} onChange={(e) => setFounder({ ...founder, title: e.target.value })} />
                </Field>
                <Field label="Description">
                  <Textarea value={founder.description} onChange={(e) => setFounder({ ...founder, description: e.target.value })} />
                </Field>
                <Field label="Image">
                  <ImageUpload 
                    onImageUploaded={(url, publicId) => setFounder({ ...founder, imageUrl: url, imagePublicId: publicId })}
                    currentImage={founder.imageUrl}
                    folder="founder"
                  />
                </Field>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <Button onClick={() => handleSaveFounder(founder)}>Enregistrer</Button>
                  <Button variant="ghost" onClick={() => setEditingFounder(false)}>Annuler</Button>
                </div>
              </div>
            ) : founder ? (
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <strong>Nom</strong>
                  <p style={{ marginTop: 4 }}>{founder.name}</p>
                </div>
                <div>
                  <strong>Titre</strong>
                  <p style={{ marginTop: 4 }}>{founder.title}</p>
                </div>
                <div>
                  <strong>Description</strong>
                  <p style={{ marginTop: 4, lineHeight: 1.6 }}>{founder.description}</p>
                </div>
                <div>
                  <strong>Image</strong>
                  <p style={{ marginTop: 4 }}>{founder.imageUrl}</p>
                </div>
                <Button onClick={() => setEditingFounder(true)}>Modifier</Button>
              </div>
            ) : (
              <p style={{ color: "var(--text-muted, #667085)" }}>Aucune information sur le fondateur.</p>
            )}
          </Card>
        )}

        {activeTab === "locations" && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Button onClick={() => setShowAddLocation(true)}>+ Ajouter un lieu de culte</Button>
            </div>
            <DataTable
              rows={locations}
              rowKey={(location) => location.name}
              emptyMessage="Aucun lieu de culte enregistré."
              columns={[
                { key: "name", label: "Nom", render: (l) => l.name },
                { key: "pastor", label: "Pasteur", render: (l) => l.pastor },
                { key: "image", label: "Image", render: (l) => l.imageUrl ? <img src={l.imageUrl} alt={l.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid #e6e0d2" }} /> : "-" },
                { key: "address", label: "Adresse", render: (l) => l.address },
                { key: "city", label: "Ville", render: (l) => l.city },
                { key: "schedules", label: "Horaires", render: (l) => l.schedules?.map((s, i) => `${s.day} ${s.startTime}-${s.endTime}`).join(", ") || "-" },
                {
                  key: "actions",
                  label: "Actions",
                  render: (l) => (
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button small onClick={() => handleEditLocation(l)}>
                        Modifier
                      </Button>
                      <Button variant="danger" small onClick={() => handleDeleteLocation(l.name)}>
                        Supprimer
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
            {editingLocation && (
              <div style={{ marginTop: 20 }}>
                <Card>
                  <Field label="Nom">
                  <Input value={editingLocation.name} onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })} />
                </Field>
                <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                  Attention : Si vous modifiez le nom, l'ancien document sera supprimé et remplacé.
                </p>
                <Field label="Pasteur">
                  <Input value={editingLocation.pastor} onChange={(e) => setEditingLocation({ ...editingLocation, pastor: e.target.value })} />
                </Field>
                <Field label="Image">
                  <ImageUpload 
                    onImageUploaded={(url, publicId) => setEditingLocation({ ...editingLocation, imageUrl: url, imagePublicId: publicId })}
                    currentImage={editingLocation.imageUrl}
                    folder="locations"
                  />
                </Field>
                <Field label="Adresse">
                  <Input value={editingLocation.address} onChange={(e) => setEditingLocation({ ...editingLocation, address: e.target.value })} />
                </Field>
                <Field label="Ville">
                  <Input value={editingLocation.city} onChange={(e) => setEditingLocation({ ...editingLocation, city: e.target.value })} />
                </Field>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <strong>Horaires</strong>
                    <Button small onClick={() => setEditingLocation({ ...editingLocation, schedules: [...(editingLocation.schedules || []), { day: "", startTime: "", endTime: "" }] })}>
                      + Ajouter un horaire
                    </Button>
                  </div>
                  {editingLocation.schedules?.map((schedule, index) => (
                    <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-end" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "12px" }}>Jour</label>
                        <Input value={schedule.day} onChange={(e) => {
                          const newSchedules = [...editingLocation.schedules];
                          newSchedules[index] = { ...schedule, day: e.target.value };
                          setEditingLocation({ ...editingLocation, schedules: newSchedules });
                        }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "12px" }}>Début</label>
                        <Input value={schedule.startTime} onChange={(e) => {
                          const newSchedules = [...editingLocation.schedules];
                          newSchedules[index] = { ...schedule, startTime: e.target.value };
                          setEditingLocation({ ...editingLocation, schedules: newSchedules });
                        }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "12px" }}>Fin</label>
                        <Input value={schedule.endTime} onChange={(e) => {
                          const newSchedules = [...editingLocation.schedules];
                          newSchedules[index] = { ...schedule, endTime: e.target.value };
                          setEditingLocation({ ...editingLocation, schedules: newSchedules });
                        }} />
                      </div>
                      <Button variant="danger" small onClick={() => {
                        const newSchedules = editingLocation.schedules.filter((_, i) => i !== index);
                        setEditingLocation({ ...editingLocation, schedules: newSchedules });
                      }}>
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <Button onClick={() => handleSaveLocation(editingLocation)}>Enregistrer</Button>
                  <Button variant="ghost" onClick={() => setEditingLocation(null)}>Annuler</Button>
                </div>
                </Card>
              </div>
            )}
            {showAddLocation && (
              <div style={{ marginTop: 20 }}>
                <Card>
                  <h3>Ajouter un lieu de culte</h3>
                  <Field label="Nom">
                  <Input value={newLocation.name} onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })} />
                </Field>
                <Field label="Pasteur">
                  <Input value={newLocation.pastor} onChange={(e) => setNewLocation({ ...newLocation, pastor: e.target.value })} />
                </Field>
                <Field label="Image">
                  <ImageUpload 
                    onImageUploaded={(url, publicId) => setNewLocation({ ...newLocation, imageUrl: url, imagePublicId: publicId })}
                    currentImage={newLocation.imageUrl}
                    folder="locations"
                  />
                </Field>
                <Field label="Adresse">
                  <Input value={newLocation.address} onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })} />
                </Field>
                <Field label="Ville">
                  <Input value={newLocation.city} onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })} />
                </Field>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <strong>Horaires</strong>
                    <Button small onClick={() => setNewLocation({ ...newLocation, schedules: [...(newLocation.schedules || []), { day: "", startTime: "", endTime: "" }] })}>
                      + Ajouter un horaire
                    </Button>
                  </div>
                  {newLocation.schedules?.map((schedule, index) => (
                    <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-end" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "12px" }}>Jour</label>
                        <Input value={schedule.day} onChange={(e) => {
                          const newSchedules = [...newLocation.schedules];
                          newSchedules[index] = { ...schedule, day: e.target.value };
                          setNewLocation({ ...newLocation, schedules: newSchedules });
                        }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "12px" }}>Début</label>
                        <Input value={schedule.startTime} onChange={(e) => {
                          const newSchedules = [...newLocation.schedules];
                          newSchedules[index] = { ...schedule, startTime: e.target.value };
                          setNewLocation({ ...newLocation, schedules: newSchedules });
                        }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "12px" }}>Fin</label>
                        <Input value={schedule.endTime} onChange={(e) => {
                          const newSchedules = [...newLocation.schedules];
                          newSchedules[index] = { ...schedule, endTime: e.target.value };
                          setNewLocation({ ...newLocation, schedules: newSchedules });
                        }} />
                      </div>
                      <Button variant="danger" small onClick={() => {
                        const newSchedules = newLocation.schedules.filter((_, i) => i !== index);
                        setNewLocation({ ...newLocation, schedules: newSchedules });
                      }}>
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <Button onClick={handleAddLocation}>Enregistrer</Button>
                  <Button variant="ghost" onClick={() => setShowAddLocation(false)}>Annuler</Button>
                </div>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
