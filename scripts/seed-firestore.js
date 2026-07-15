// Run this script to populate Firestore with initial data
// Usage: node scripts/seed-firestore.js

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, setDoc } = require("firebase/firestore");

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your_api_key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mont-garizim.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mont-garizim",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mont-garizim.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedFirestore() {
  console.log("Seeding Firestore database...");

  // Seed history
  const historyData = [
    { year: "2006", title: "Fondation de l'église", description: "L'Assemblée Mont Garizim voit le jour avec une poignée de fidèles réunis dans un salon à Abidjan.", order: 1 },
    { year: "2010", title: "Premier lieu de culte", description: "Acquisition de notre premier local permettant d'accueillir jusqu'à 200 personnes.", order: 2 },
    { year: "2015", title: "Développement des ministères", description: "Création des ministères jeunesse, enfants et femmes pour mieux servir chaque génération.", order: 3 },
    { year: "2020", title: "Expansion communautaire", description: "Lancement de groupes de maison et d'actions sociales dans les quartiers d'Abidjan.", order: 4 },
    { year: "2024", title: "Nouvelle vision", description: "Plus de 500 membres actifs et une présence accrue dans la communauté locale.", order: 5 },
  ];

  for (const item of historyData) {
    await setDoc(doc(collection(db, "history"), item.year), item);
    console.log(`✓ Added history item: ${item.year}`);
  }

  // Seed founder
  const founderData = {
    name: "Pasteur Emmanuel Kouassi",
    title: "Fondateur de l'Assemblée Mont Garizim",
    ph: "ph-1",
    description: "En 2006, le Pasteur Emmanuel Kouassi a fondé l'Assemblée Mont Garizim avec une vision claire : créer une communauté de foi authentique qui transforme les vies et la ville d'Abidjan. Avec plus de 20 ans de ministère, il reste passionné par l'enseignement biblique et l'accompagnement spirituel de chaque personne.",
    verse: "Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux. — Matthieu 18:20",
  };

  await setDoc(doc(db, "about", "founder"), founderData);
  console.log("✓ Added founder document");

  // Seed locations
  const locationsData = [
    { ph: "ph-1", name: "Temple principal - Cocody", pastor: "Pasteur Emmanuel Kouassi", address: "Cocody, Abidjan", schedule: "Dimanche 9h30 · Mercredi 18h00", order: 1 },
    { ph: "ph-3", name: "Antenne Yopougon", pastor: "Pasteur Marie-Claire Diallo", address: "Yopougon, Abidjan", schedule: "Dimanche 10h00 · Samedi 17h00", order: 2 },
    { ph: "ph-5", name: "Antenne Marcory", pastor: "Pasteur Jean Koffi", address: "Marcory, Abidjan", schedule: "Dimanche 10h30 · Mardi 18h30", order: 3 },
    { ph: "ph-2", name: "Antenne Treichville", pastor: "Pasteur Philippe Assamoi", address: "Treichville, Abidjan", schedule: "Dimanche 11h00 · Jeudi 18h00", order: 4 },
  ];

  for (const location of locationsData) {
    await setDoc(doc(collection(db, "locations"), location.name), location);
    console.log(`✓ Added location: ${location.name}`);
  }

  console.log("\n✅ Firestore database seeded successfully!");
}

seedFirestore().catch(console.error);
