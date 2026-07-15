# Assemblée Mont Garizim — Site officiel (Next.js)

Page d'accueil de l'Assemblée Mont Garizim, construite avec Next.js 14 (App Router) et TypeScript.

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvrez [http://localhost:3000](http://localhost:3000).

## Build de production

```bash
npm run build
npm start
```

## Structure du projet

```
app/
  layout.tsx        Layout racine, polices (Fraunces + Manrope via next/font), métadonnées SEO
  page.tsx           Assemble toutes les sections de la page d'accueil
  globals.css         Design system complet (couleurs, typographie, composants, responsive)
components/
  SiteHeader.tsx      Header sticky + menu mobile (état partagé, effet blur au scroll)
  Logo.tsx            Emblème SVG (montagne + rayon de lumière)
  Hero.tsx            Section d'accueil immersive
  About.tsx           Section "Notre Église"
  Ministries.tsx      Section "Nos Ministères"
  Values.tsx          Section "Nos Valeurs"
  Events.tsx          Timeline des événements
  Sermons.tsx         Dernières prédications
  Gallery.tsx         Galerie avec lightbox
  Testimonials.tsx    Slider de témoignages automatique
  Stats.tsx           Statistiques avec compteurs animés
  Cta.tsx             Appel à l'action
  Contact.tsx         Coordonnées + formulaire de contact
  Footer.tsx          Pied de page
  useRevealOnScroll.ts  Hook client pour les animations d'apparition au scroll
```

## À personnaliser avant mise en production

- **Logo** : remplacez le composant `Logo.tsx` par votre logo officiel (SVG ou `next/image`).
- **Photos** : les blocs `.ph` / `.ph-1` à `.ph-6` sont des dégradés de substitution. Remplacez-les par de vraies photos avec le composant `next/image` pour l'optimisation automatique.
- **Formulaire de contact** : `Contact.tsx` ne fait qu'un `console.log` à la soumission. Branchez-le sur une API route Next.js (`app/api/contact/route.ts`), un service d'emailing, ou un webhook.
- **Contenu** : coordonnées, horaires, événements et prédications sont des données d'exemple, modifiables directement dans chaque composant (`Events.tsx`, `Sermons.tsx`, `Contact.tsx`, etc.).

## Accessibilité et performance

- Respect de `prefers-reduced-motion` pour toutes les animations.
- Polices chargées via `next/font/google` (auto-hébergées, sans blocage de rendu).
- Mobile-first, testé de 360px à grand écran.
