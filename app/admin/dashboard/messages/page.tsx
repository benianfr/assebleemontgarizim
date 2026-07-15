"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PageHeader, DataTable, Button, ActionsRow } from "@/components/admin/AdminUI";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
  createdAt: Date;
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const messagesData = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
    })) as ContactMessage[];
    setMessages(messagesData);
  };

  const handleDeleteMessage = async (id: string) => {
    await deleteDoc(doc(collection(db, "contactMessages"), id));
    fetchData();
  };

  const handleMarkAsRead = async (id: string) => {
    await setDoc(doc(collection(db, "contactMessages"), id), { read: true });
    fetchData();
  };

  return (
    <div>
      <PageHeader title="Messages de contact" description={`${messages.length} message(s) reçu(s).`} />

      <DataTable
        rows={messages}
        rowKey={(m) => m.id}
        emptyMessage="Aucun message reçu."
        columns={[
          { key: "name", label: "Nom", render: (m) => m.name },
          { key: "email", label: "Email", render: (m) => m.email },
          { key: "subject", label: "Sujet", render: (m) => m.subject },
          { key: "message", label: "Message", render: (m) => m.message, full: true },
          {
            key: "date",
            label: "Date",
            render: (m) => (m.createdAt instanceof Date ? m.createdAt.toLocaleDateString() : new Date(m.createdAt).toLocaleDateString()),
          },
          {
            key: "actions",
            label: "Actions",
            render: (m) => (
              <ActionsRow>
                {!m.read && (
                  <Button variant="success" small onClick={() => handleMarkAsRead(m.id)}>
                    Marquer lu
                  </Button>
                )}
                <Button variant="danger" small onClick={() => handleDeleteMessage(m.id)}>
                  Supprimer
                </Button>
              </ActionsRow>
            ),
          },
        ]}
      />
    </div>
  );
}
