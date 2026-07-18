import { db } from "./firebase";
import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp, doc, getDoc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";

export { doc, onSnapshot, collection, getDocs, query, orderBy };

// Testimonials collection
export interface Testimonial {
  nom: string;
  prenom: string;
  telephone: string;
  titre: string;
  temoignage: string;
  approved: boolean;
  createdAt: Timestamp | string;
}

export async function submitTestimonial(testimonial: Omit<Testimonial, "approved" | "createdAt">) {
  try {
    const docRef = await addDoc(collection(db, "testimonials"), {
      ...testimonial,
      approved: false,
      createdAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    return { success: false, error };
  }
}

export async function getApprovedTestimonials(limitCount = 10) {
  try {
    const q = query(
      collection(db, "testimonials"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const testimonials = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : data.createdAt || '';
      return {
        id: doc.id,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        titre: data.titre,
        temoignage: data.temoignage,
        approved: data.approved,
        createdAt
      };
    }).filter((t) => t.approved);
    return { success: true, testimonials };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return { success: false, error, testimonials: [] };
  }
}

export async function getTestimonials() {
  try {
    const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const testimonials = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : data.createdAt || '';
      return {
        id: doc.id,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        titre: data.titre,
        temoignage: data.temoignage,
        approved: data.approved,
        createdAt
      };
    });
    return { success: true, testimonials };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return { success: false, error, testimonials: [] };
  }
}

// History collection
export interface HistoryItem {
  imageUrl: string;
  imagePublicId: string;
  year: string;
  title: string;
  description: string;
  order: number;
}

export interface HistorySection {
  imageUrl: string;
  imagePublicId: string;
}

export async function getHistorySection() {
  try {
    const docRef = doc(db, "about", "historySection");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, historySection: docSnap.data() as HistorySection };
    }
    return { success: true, historySection: { imageUrl: "", imagePublicId: "" } };
  } catch (error) {
    console.error("Error fetching history section:", error);
    return { success: false, error, historySection: { imageUrl: "", imagePublicId: "" } };
  }
}

export async function updateHistorySection(item: HistorySection) {
  try {
    await setDoc(doc(db, "about", "historySection"), item);
    return { success: true };
  } catch (error) {
    console.error("Error updating history section:", error);
    return { success: false, error };
  }
}

export async function getHistory() {
  try {
    const q = query(collection(db, "history"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const history = querySnapshot.docs.map((doc) => doc.data() as HistoryItem);
    return { success: true, history };
  } catch (error) {
    console.error("Error fetching history:", error);
    return { success: false, error, history: [] };
  }
}

export async function addHistoryItem(item: Omit<HistoryItem, "order">) {
  try {
    const q = query(collection(db, "history"), orderBy("order", "desc"));
    const querySnapshot = await getDocs(q);
    const maxOrder = querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data().order : 0;
    const newItem = { ...item, order: maxOrder + 1 };
    const docRef = await addDoc(collection(db, "history"), newItem);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding history item:", error);
    return { success: false, error };
  }
}

// Founder document
export interface Founder {
  name: string;
  title: string;
  imageUrl: string;
  imagePublicId: string;
  description: string;
  verse: string;
}

export async function getFounder() {
  try {
    const docRef = doc(db, "about", "founder");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, founder: docSnap.data() as Founder };
    } else {
      return { success: false, error: "Founder document not found", founder: null };
    }
  } catch (error) {
    console.error("Error fetching founder:", error);
    return { success: false, error, founder: null };
  }
}

export interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

// Locations collection
export interface Location {
  id: string;
  imageUrl: string;
  imagePublicId: string;
  name: string;
  pastor: string;
  address: string;
  city: string;
  schedules: Schedule[];
  order: number;
}

export async function getLocations() {
  try {
    const q = query(collection(db, "locations"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const locations = querySnapshot.docs.map((doc) => doc.data() as Location);
    return { success: true, locations };
  } catch (error) {
    console.error("Error fetching locations:", error);
    return { success: false, error, locations: [] };
  }
}

export async function addLocationItem(item: Omit<Location, "order" | "id">) {
  try {
    const q = query(collection(db, "locations"), orderBy("order", "desc"));
    const querySnapshot = await getDocs(q);
    const maxOrder = querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data().order : 0;
    const newItem = { ...item, order: maxOrder + 1 };
    const docRef = await addDoc(collection(db, "locations"), newItem);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding location item:", error);
    return { success: false, error };
  }
}

// Ministries collection
export interface Ministry {
  id: string;
  imageUrl: string;
  imagePublicId: string;
  title: string;
  description: string;
  schedule: string;
  leader: string;
  order: number;
}

export async function getMinistries() {
  try {
    const q = query(collection(db, "ministries"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const ministries = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as Ministry));
    return { success: true, ministries };
  } catch (error) {
    console.error("Error fetching ministries:", error);
    return { success: false, error, ministries: [] };
  }
}

export async function addMinistry(item: Omit<Ministry, "order" | "id">) {
  try {
    const q = query(collection(db, "ministries"), orderBy("order", "desc"));
    const querySnapshot = await getDocs(q);
    const maxOrder = querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data().order : 0;
    const newItem = { ...item, order: maxOrder + 1 };
    const docRef = await addDoc(collection(db, "ministries"), newItem);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding ministry:", error);
    return { success: false, error };
  }
}

// Values collection
export interface Value {
  id: string;
  title: string;
  text: string;
  order: number;
}

export async function getValues() {
  try {
    const q = query(collection(db, "values"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const values = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as Value));
    return { success: true, values };
  } catch (error) {
    console.error("Error fetching values:", error);
    return { success: false, error, values: [] };
  }
}

export async function addValue(item: Omit<Value, "order" | "id">) {
  try {
    const q = query(collection(db, "values"), orderBy("order", "desc"));
    const querySnapshot = await getDocs(q);
    const maxOrder = querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data().order : 0;
    const newItem = { ...item, order: maxOrder + 1 };
    const docRef = await addDoc(collection(db, "values"), newItem);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding value:", error);
    return { success: false, error };
  }
}

// Events collection
export interface Event {
  id: string;
  imageUrl: string;
  imagePublicId: string;
  date: Timestamp | Date | string | null;
  title: string;
  place: string;
  time: string;
  description: string;
  category: string;
  order: number;
}

export async function getUpcomingEvents() {
  try {
    const q = query(collection(db, "events"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const date = data.date?.toDate ? data.date.toDate().toLocaleDateString('fr-FR') : data.date || '';
      return {
        ...data,
        id: doc.id,
        date
      } as Event;
    });
    return { success: true, events };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { success: false, error, events: [] };
  }
}

export async function addEvent(item: Omit<Event, "order" | "id">) {
  try {
    const q = query(collection(db, "events"), orderBy("order", "desc"));
    const querySnapshot = await getDocs(q);
    const maxOrder = querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data().order : 0;
    const newItem = { ...item, order: maxOrder + 1 };
    const docRef = await addDoc(collection(db, "events"), newItem);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding event:", error);
    return { success: false, error };
  }
}

export async function updateEvent(id: string, item: Omit<Event, "id">) {
  try {
    await setDoc(doc(db, "events", id), item);
    return { success: true };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error };
  }
}

export interface PastEvent {
  id: string;
  imageUrl: string;
  imagePublicId: string;
  date: string;
  title: string;
  place: string;
  time: string;
  description: string;
  category: string;
  order: number;
}

export async function getPastEvents() {
  try {
    const q = query(collection(db, "pastEvents"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const pastEvents = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const date = data.date?.toDate ? data.date.toDate().toLocaleDateString('fr-FR') : data.date || '';
      return {
        ...data,
        id: doc.id,
        date
      } as Event;
    });
    return { success: true, pastEvents };
  } catch (error) {
    console.error("Error fetching past events:", error);
    return { success: false, error, pastEvents: [] };
  }
}

// Sermons collection
export interface Sermon {
  id: string;
  imageUrl: string;
  imagePublicId: string;
  title: string;
  preacher: string;
  date: string;
  duration: string;
  description: string;
  category: string;
  scripture: string;
  videoUrl: string;
  order: number;
}

export async function getSermons() {
  try {
    const q = query(collection(db, "sermons"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const sermons = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        date: data.date instanceof Date ? data.date.toLocaleDateString('fr-FR') : 
              data.date?.seconds ? new Date(data.date.seconds * 1000).toLocaleDateString('fr-FR') : 
              data.date || ''
      } as Sermon;
    });
    return { success: true, sermons };
  } catch (error) {
    console.error("Error fetching sermons:", error);
    return { success: false, error, sermons: [] };
  }
}

export async function addSermon(item: Omit<Sermon, "order" | "id">) {
  try {
    const q = query(collection(db, "sermons"), orderBy("order", "desc"));
    const querySnapshot = await getDocs(q);
    const maxOrder = querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data().order : 0;
    const newItem = { ...item, order: maxOrder + 1 };
    const docRef = await addDoc(collection(db, "sermons"), newItem);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding sermon:", error);
    return { success: false, error };
  }
}

export async function updateSermon(id: string, item: Omit<Sermon, "order" | "id">) {
  try {
    await setDoc(doc(db, "sermons", id), item, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating sermon:", error);
    return { success: false, error };
  }
}

// Gallery collection
export interface GalleryImage {
  id: string;
  imageUrl: string;
  imagePublicId: string;
  caption: string;
  category: string;
  order: number;
}

export async function getGalleryImages() {
  try {
    const q = query(collection(db, "gallery"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const images = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as GalleryImage));
    return { success: true, images };
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return { success: false, error, images: [] };
  }
}

export async function addGalleryImage(item: Omit<GalleryImage, "order" | "id">) {
  try {
    const q = query(collection(db, "gallery"), orderBy("order", "desc"));
    const querySnapshot = await getDocs(q);
    const maxOrder = querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data().order : 0;
    const newItem = { ...item, order: maxOrder + 1 };
    const docRef = await addDoc(collection(db, "gallery"), newItem);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding gallery image:", error);
    return { success: false, error };
  }
}

// Contact info collection
export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
  whatsapp?: string;
}

export async function getContactInfo() {
  try {
    const docRef = doc(db, "contact", "info");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, contactInfo: docSnap.data() as ContactInfo };
    }
    return { success: false, error: "Contact info not found", contactInfo: null };
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return { success: false, error, contactInfo: null };
  }
}

export async function updateContactInfo(contactInfo: ContactInfo) {
  try {
    await setDoc(doc(db, "contact", "info"), contactInfo);
    return { success: true };
  } catch (error) {
    console.error("Error updating contact info:", error);
    return { success: false, error };
  }
}

// Donation options collection
export interface DonationOption {
  title: string;
  description: string;
  details: { label: string; value: string }[];
  order: number;
}

export async function getDonationOptions() {
  try {
    const q = query(collection(db, "donationOptions"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const options = querySnapshot.docs.map((doc) => doc.data() as DonationOption);
    return { success: true, options };
  } catch (error) {
    console.error("Error fetching donation options:", error);
    return { success: false, error, options: [] };
  }
}

// Donation purposes collection
export interface DonationPurpose {
  title: string;
  description: string;
  icon: string;
  order: number;
}

export async function getDonationPurposes() {
  try {
    const q = query(collection(db, "donationPurposes"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const purposes = querySnapshot.docs.map((doc) => doc.data() as DonationPurpose);
    return { success: true, purposes };
  } catch (error) {
    console.error("Error fetching donation purposes:", error);
    return { success: false, error, purposes: [] };
  }
}

// Donation FAQs collection
export interface DonationFAQ {
  question: string;
  answer: string;
  order: number;
}

export async function getDonationFAQs() {
  try {
    const q = query(collection(db, "donationFAQs"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const faqs = querySnapshot.docs.map((doc) => doc.data() as DonationFAQ);
    return { success: true, faqs };
  } catch (error) {
    console.error("Error fetching donation FAQs:", error);
    return { success: false, error, faqs: [] };
  }
}

// Theme of month document
export interface ThemeOfMonth {
  month: string;
  title: string;
  verse: string;
}

export async function getThemeOfMonth() {
  try {
    const docRef = doc(db, "home", "themeOfMonth");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, theme: docSnap.data() as ThemeOfMonth };
    }
    return { success: false, error: "Theme of month not found", theme: null };
  } catch (error) {
    console.error("Error fetching theme of month:", error);
    return { success: false, error, theme: null };
  }
}

// Next service document
export interface NextService {
  day: string;
  time: string;
  location: string;
}

export async function getNextService() {
  try {
    const docRef = doc(db, "home", "nextService");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, service: docSnap.data() as NextService };
    }
    return { success: false, error: "Next service not found", service: null };
  } catch (error) {
    console.error("Error fetching next service:", error);
    return { success: false, error, service: null };
  }
}

// About section document
export interface AboutSection {
  title: string;
  subtitle: string;
  description: string;
  years: number;
  yearsText: string;
  imageUrl: string;
  imagePublicId: string;
}

export async function getAboutSection() {
  try {
    const docRef = doc(db, "home", "aboutSection");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, aboutSection: docSnap.data() as AboutSection };
    }
    return { success: false, error: "About section not found", aboutSection: null };
  } catch (error) {
    console.error("Error fetching about section:", error);
    return { success: false, error, aboutSection: null };
  }
}

export async function updateAboutSection(item: AboutSection) {
  try {
    await setDoc(doc(db, "home", "aboutSection"), item);
    return { success: true };
  } catch (error) {
    console.error("Error updating about section:", error);
    return { success: false, error };
  }
}

// Popup document
export interface Popup {
  enabled: boolean;
  imageUrl: string;
  imagePublicId: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  showDelay: number; // in seconds
}

export async function getPopup() {
  try {
    const docRef = doc(db, "home", "popup");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, popup: docSnap.data() as Popup };
    }
    return { success: false, error: "Popup not found", popup: null };
  } catch (error) {
    console.error("Error fetching popup:", error);
    return { success: false, error, popup: null };
  }
}

export async function updatePopup(item: Popup) {
  try {
    await setDoc(doc(db, "home", "popup"), item);
    return { success: true };
  } catch (error) {
    console.error("Error updating popup:", error);
    return { success: false, error };
  }
}

// Books collection
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: string;
  imageUrl: string;
  imagePublicId: string;
  order: number;
}

export async function getBooks() {
  try {
    const q = query(collection(db, "books"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const books = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Book[];
    return { success: true, books };
  } catch (error) {
    console.error("Error fetching books:", error);
    return { success: false, error, books: [] };
  }
}

export async function addBook(book: Omit<Book, "id">) {
  try {
    const docRef = await addDoc(collection(db, "books"), book);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding book:", error);
    return { success: false, error };
  }
}

export async function updateBook(id: string, book: Omit<Book, "id">) {
  try {
    await setDoc(doc(db, "books", id), book);
    return { success: true };
  } catch (error) {
    console.error("Error updating book:", error);
    return { success: false, error };
  }
}

export async function deleteBook(id: string) {
  try {
    await deleteDoc(doc(db, "books", id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting book:", error);
    return { success: false, error };
  }
}
