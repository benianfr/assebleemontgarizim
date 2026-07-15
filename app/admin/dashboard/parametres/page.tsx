"use client";

import { useEffect, useState } from "react";
import { getThemeOfMonth, getNextService, getContactInfo, ThemeOfMonth, NextService, ContactInfo } from "@/lib/firestore";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, Card, Field, Input, Textarea, Button, Grid2 } from "@/components/admin/AdminUI";

export default function AdminParametres() {
  const [theme, setTheme] = useState<ThemeOfMonth | null>(null);
  const [service, setService] = useState<NextService | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [savingTheme, setSavingTheme] = useState(false);
  const [savingService, setSavingService] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [themeRes, serviceRes, contactRes] = await Promise.all([getThemeOfMonth(), getNextService(), getContactInfo()]);
    if (themeRes.success) setTheme(themeRes.theme);
    if (serviceRes.success) setService(serviceRes.service);
    if (contactRes.success) setContactInfo(contactRes.contactInfo);
  };

  const handleSaveTheme = async () => {
    if (!theme) return;
    setSavingTheme(true);
    try {
      await setDoc(doc(db, "home", "themeOfMonth"), theme);
      alert("Thème du mois sauvegardé.");
    } catch (error) {
      alert("Erreur lors de la sauvegarde.");
      console.error(error);
    }
    setSavingTheme(false);
  };

  const handleSaveService = async () => {
    if (!service) return;
    setSavingService(true);
    try {
      await setDoc(doc(db, "home", "nextService"), service);
      alert("Prochain culte sauvegardé.");
    } catch (error) {
      alert("Erreur lors de la sauvegarde.");
      console.error(error);
    }
    setSavingService(false);
  };

  const handleSaveContact = async () => {
    if (!contactInfo) return;
    setSavingContact(true);
    try {
      await setDoc(doc(db, "contact", "info"), contactInfo);
      alert("Informations de contact sauvegardées.");
    } catch (error) {
      alert("Erreur lors de la sauvegarde.");
      console.error(error);
    }
    setSavingContact(false);
  };

  return (
    <div>
      <PageHeader title="Paramètres du site" description="Thème du mois, informations du prochain culte et coordonnées de contact." />

      <Grid2>
        <Card title="Thème du mois">
          <Field label="Mois">
            <Input
              type="text"
              value={theme?.month || ""}
              onChange={(e) => setTheme({ ...(theme as ThemeOfMonth), month: e.target.value })}
            />
          </Field>
          <Field label="Titre">
            <Input
              type="text"
              value={theme?.title || ""}
              onChange={(e) => setTheme({ ...(theme as ThemeOfMonth), title: e.target.value })}
            />
          </Field>
          <Field label="Verset biblique">
            <Textarea
              value={theme?.verse || ""}
              onChange={(e) => setTheme({ ...(theme as ThemeOfMonth), verse: e.target.value })}
            />
          </Field>
          <Button variant="gold" onClick={handleSaveTheme} disabled={savingTheme}>
            {savingTheme ? "Sauvegarde…" : "Sauvegarder"}
          </Button>
        </Card>

        <Card title="Prochain culte">
          <Field label="Jour">
            <Input
              type="text"
              value={service?.day || ""}
              onChange={(e) => setService({ ...(service as NextService), day: e.target.value })}
            />
          </Field>
          <Field label="Heure">
            <Input
              type="text"
              value={service?.time || ""}
              onChange={(e) => setService({ ...(service as NextService), time: e.target.value })}
            />
          </Field>
          <Field label="Lieu">
            <Input
              type="text"
              value={service?.location || ""}
              onChange={(e) => setService({ ...(service as NextService), location: e.target.value })}
            />
          </Field>
          <Button variant="gold" onClick={handleSaveService} disabled={savingService}>
            {savingService ? "Sauvegarde…" : "Sauvegarder"}
          </Button>
        </Card>

        <Card title="Coordonnées de contact">
          <Field label="Adresse">
            <Input
              type="text"
              value={contactInfo?.address || ""}
              onChange={(e) => setContactInfo({ ...(contactInfo as ContactInfo), address: e.target.value })}
            />
          </Field>
          <Field label="Téléphone">
            <Input
              type="text"
              value={contactInfo?.phone || ""}
              onChange={(e) => setContactInfo({ ...(contactInfo as ContactInfo), phone: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={contactInfo?.email || ""}
              onChange={(e) => setContactInfo({ ...(contactInfo as ContactInfo), email: e.target.value })}
            />
          </Field>
          <Field label="Horaires">
            <Input
              type="text"
              value={contactInfo?.hours || ""}
              onChange={(e) => setContactInfo({ ...(contactInfo as ContactInfo), hours: e.target.value })}
            />
          </Field>
          <Field label="Numéro WhatsApp">
            <Input
              type="text"
              placeholder="Ex: 2250701020304"
              value={contactInfo?.whatsapp || ""}
              onChange={(e) => setContactInfo({ ...(contactInfo as ContactInfo), whatsapp: e.target.value })}
            />
          </Field>
          <Button variant="gold" onClick={handleSaveContact} disabled={savingContact}>
            {savingContact ? "Sauvegarde…" : "Sauvegarder"}
          </Button>
        </Card>
      </Grid2>
    </div>
  );
}
