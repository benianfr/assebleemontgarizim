"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getUpcomingEvents,
  getPastEvents,
  addEvent,
  updateEvent,
  Event,
} from "@/lib/firestore";
import { doc, deleteDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, Tabs, DataTable, Button, Card, Field, Input, Textarea } from "@/components/admin/AdminUI";
import ImageUpload from "@/components/ImageUpload";

type Tab = "upcoming" | "past";

export default function AdminEvenements() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<Event, "order" | "id">>({ imageUrl: "", imagePublicId: "", date: "", title: "", place: "", time: "", description: "", category: "upcoming" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [upcomingRes, pastRes] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
      
      const upcomingData = Array.isArray(upcomingRes?.events) ? upcomingRes.events.map(event => ({
        ...event,
        date: event.date || ''
      })) : [];
      
      const pastData = Array.isArray(pastRes?.pastEvents) ? pastRes.pastEvents.map(event => ({
        ...event,
        date: event.date || ''
      })) : [];
      
      setUpcomingEvents(upcomingData);
      setPastEvents(pastData);
    } catch (error) {
      console.error("Error fetching events:", error);
      setUpcomingEvents([]);
      setPastEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Use useMemo to ensure arrays are always defined
  const safeUpcomingEvents = useMemo(() => Array.isArray(upcomingEvents) ? upcomingEvents : [], [upcomingEvents]);
  const safePastEvents = useMemo(() => Array.isArray(pastEvents) ? pastEvents : [], [pastEvents]);

  const handleDeleteEvent = async (id: string, type: Tab) => {
    await deleteDoc(doc(collection(db, "events"), id));
    fetchData();
  };

  const handleAddEvent = async () => {
    const result = await addEvent(newEvent);
    if (result.success) {
      setShowAddEvent(false);
      setNewEvent({ imageUrl: "", imagePublicId: "", date: "", title: "", place: "", time: "", description: "", category: "upcoming" });
      fetchData();
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
  };

  const handleSaveEvent = async () => {
    if (!editingEvent) return;
    const result = await updateEvent(editingEvent.id, editingEvent);
    if (result.success) {
      setEditingEvent(null);
      fetchData();
    }
  };

  const columns = (type: Tab) => [
    { key: "title", label: "Titre", render: (e: Event) => e.title },
    { key: "date", label: "Date", render: (e: Event) => e.date },
    { key: "category", label: "Catégorie", render: (e: Event) => e.category },
    { key: "location", label: "Lieu", render: (e: Event) => e.place },
    {
      key: "actions",
      label: "Actions",
      render: (e: Event) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button small onClick={() => handleEditEvent(e)}>
            Modifier
          </Button>
          <Button variant="danger" small onClick={() => handleDeleteEvent(e.id, type)}>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <PageHeader title="Événements" description="Programmation à venir et archive des événements passés." />

      <Tabs
        tabs={[
          { value: "upcoming", label: `À venir (${Array.isArray(upcomingEvents) ? upcomingEvents.length : 0})` },
          { value: "past", label: `Passés (${Array.isArray(pastEvents) ? pastEvents.length : 0})` },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div style={{ marginTop: 20 }}>
        {activeTab === "upcoming" && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Button onClick={() => setShowAddEvent(true)}>+ Ajouter un événement</Button>
            </div>
            <DataTable
              rows={Array.isArray(upcomingEvents) ? upcomingEvents : []}
              rowKey={(e) => e.id}
              columns={columns("upcoming")}
              emptyMessage="Aucun événement à venir."
            />
            {showAddEvent && (
              <div style={{ marginTop: 20 }}>
                <Card>
                  <h3>Ajouter un événement</h3>
                  <Field label="Titre">
                    <Input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                  </Field>
                  <Field label="Date">
                    <Input value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                  </Field>
                  <Field label="Lieu">
                    <Input value={newEvent.place} onChange={(e) => setNewEvent({ ...newEvent, place: e.target.value })} />
                  </Field>
                  <Field label="Horaire">
                    <Input value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
                  </Field>
                  <Field label="Image">
                    <ImageUpload 
                      onImageUploaded={(url, publicId) => setNewEvent({ ...newEvent, imageUrl: url, imagePublicId: publicId })}
                      currentImage={newEvent.imageUrl}
                      folder="events"
                    />
                  </Field>
                  <Field label="Description">
                    <Textarea value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
                  </Field>
                  <Field label="Catégorie">
                    <Input value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} />
                  </Field>
                  <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                    <Button onClick={handleAddEvent}>Enregistrer</Button>
                    <Button onClick={() => setShowAddEvent(false)}>Annuler</Button>
                  </div>
                </Card>
              </div>
            )}
            {editingEvent && (
              <div style={{ marginTop: 20 }}>
                <Card>
                  <h3>Modifier l'événement</h3>
                  <Field label="Titre">
                    <Input value={editingEvent.title} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} />
                  </Field>
                  <Field label="Date">
                    <Input value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                  </Field>
                  <Field label="Lieu">
                    <Input value={editingEvent.place} onChange={(e) => setEditingEvent({ ...editingEvent, place: e.target.value })} />
                  </Field>
                  <Field label="Horaire">
                    <Input value={editingEvent.time} onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })} />
                  </Field>
                  <Field label="Image">
                    <ImageUpload 
                      onImageUploaded={(url, publicId) => setEditingEvent({ ...editingEvent, imageUrl: url, imagePublicId: publicId })}
                      currentImage={editingEvent.imageUrl}
                      folder="events"
                    />
                  </Field>
                  <Field label="Description">
                    <Textarea value={editingEvent.description} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} />
                  </Field>
                  <Field label="Catégorie">
                    <Input value={editingEvent.category} onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })} />
                  </Field>
                  <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                    <Button onClick={handleSaveEvent}>Enregistrer</Button>
                    <Button onClick={() => setEditingEvent(null)}>Annuler</Button>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
        {activeTab === "past" && (
          <DataTable
            rows={Array.isArray(pastEvents) ? pastEvents : []}
            rowKey={(e) => e.id}
            columns={columns("past")}
            emptyMessage="Aucun événement passé enregistré."
          />
        )}
      </div>
    </div>
  );
}
