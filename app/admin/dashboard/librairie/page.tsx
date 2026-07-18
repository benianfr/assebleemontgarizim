"use client";

import { useEffect, useState } from "react";
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  Book,
} from "@/lib/firestore";
import { PageHeader, DataTable, Button, Card, Field, Input, Textarea } from "@/components/admin/AdminUI";
import ImageUpload from "@/components/ImageUpload";

export default function AdminLibrairie() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState<Omit<Book, "id">>({
    title: "",
    author: "",
    description: "",
    price: "",
    imageUrl: "",
    imagePublicId: "",
    order: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getBooks();
      if (result.success) {
        setBooks(result.books);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id);
    fetchData();
  };

  const handleAddBook = async () => {
    const result = await addBook(newBook);
    if (result.success) {
      setShowAddBook(false);
      setNewBook({
        title: "",
        author: "",
        description: "",
        price: "",
        imageUrl: "",
        imagePublicId: "",
        order: 0,
      });
      fetchData();
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
  };

  const handleSaveBook = async () => {
    if (!editingBook) return;
    const result = await updateBook(editingBook.id, editingBook);
    if (result.success) {
      setEditingBook(null);
      fetchData();
    }
  };

  const columns = [
    { key: "title", label: "Titre", render: (b: Book) => b.title },
    { key: "author", label: "Auteur", render: (b: Book) => b.author },
    { key: "price", label: "Prix", render: (b: Book) => b.price },
    { key: "order", label: "Ordre", render: (b: Book) => b.order },
    {
      key: "actions",
      label: "Actions",
      render: (b: Book) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button small onClick={() => handleEditBook(b)}>
            Modifier
          </Button>
          <Button variant="danger" small onClick={() => handleDeleteBook(b.id)}>
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
      <PageHeader title="Librairie" description="Gestion des livres et ressources." />

      <div style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <Button onClick={() => setShowAddBook(true)}>+ Ajouter un livre</Button>
        </div>
        <DataTable
          rows={books}
          rowKey={(b) => b.id}
          columns={columns}
          emptyMessage="Aucun livre disponible."
        />
        {showAddBook && (
          <div style={{ marginTop: 20 }}>
            <Card>
              <h3>Ajouter un livre</h3>
              <Field label="Titre">
                <Input value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
              </Field>
              <Field label="Auteur">
                <Input value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
              </Field>
              <Field label="Description">
                <Textarea value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} />
              </Field>
              <Field label="Prix">
                <Input value={newBook.price} onChange={(e) => setNewBook({ ...newBook, price: e.target.value })} />
              </Field>
              <Field label="Ordre">
                <Input type="number" value={newBook.order} onChange={(e) => setNewBook({ ...newBook, order: parseInt(e.target.value) || 0 })} />
              </Field>
              <Field label="Image">
                <ImageUpload 
                  onImageUploaded={(url, publicId) => setNewBook({ ...newBook, imageUrl: url, imagePublicId: publicId })}
                  currentImage={newBook.imageUrl}
                  folder="books"
                />
              </Field>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <Button onClick={handleAddBook}>Enregistrer</Button>
                <Button onClick={() => setShowAddBook(false)}>Annuler</Button>
              </div>
            </Card>
          </div>
        )}
        {editingBook && (
          <div style={{ marginTop: 20 }}>
            <Card>
              <h3>Modifier le livre</h3>
              <Field label="Titre">
                <Input value={editingBook.title} onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })} />
              </Field>
              <Field label="Auteur">
                <Input value={editingBook.author} onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })} />
              </Field>
              <Field label="Description">
                <Textarea value={editingBook.description} onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })} />
              </Field>
              <Field label="Prix">
                <Input value={editingBook.price} onChange={(e) => setEditingBook({ ...editingBook, price: e.target.value })} />
              </Field>
              <Field label="Ordre">
                <Input type="number" value={editingBook.order} onChange={(e) => setEditingBook({ ...editingBook, order: parseInt(e.target.value) || 0 })} />
              </Field>
              <Field label="Image">
                <ImageUpload 
                  onImageUploaded={(url, publicId) => setEditingBook({ ...editingBook, imageUrl: url, imagePublicId: publicId })}
                  currentImage={editingBook.imageUrl}
                  folder="books"
                />
              </Field>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <Button onClick={handleSaveBook}>Enregistrer</Button>
                <Button onClick={() => setEditingBook(null)}>Annuler</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
