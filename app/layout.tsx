import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";
import PopupComponent from "@/components/Popup";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Assemblée Mont Garizim — Église chrétienne à Abidjan | Cultes, Ministères, Événements",
  description:
    "Rejoignez l'Assemblée Mont Garizim, une église chrétienne dynamique à Abidjan. Participez à nos cultes, découvrez nos ministères, nos événements et grandissez dans votre foi au sein d'une communauté accueillante.",
  keywords: "église Abidjan, assemblée mont garizim, culte chrétien, église ivoirienne, communauté de foi, ministères chrétiens, événements religieux, église protestante",
  authors: [{ name: "Assemblée Mont Garizim" }],
  creator: "Assemblée Mont Garizim",
  publisher: "Assemblée Mont Garizim",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://assembleemontgarizim.com",
    title: "Assemblée Mont Garizim — Une communauté de foi, d'amour et d'espérance",
    description:
      "Site officiel de l'Assemblée Mont Garizim. Découvrez nos cultes, nos ministères, nos événements et rejoignez une communauté qui grandit dans la foi.",
    siteName: "Assemblée Mont Garizim",
    images: [
      {
        url: "/logo1.png",
        width: 1200,
        height: 630,
        alt: "Assemblée Mont Garizim",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Assemblée Mont Garizim — Une communauté de foi, d'amour et d'espérance",
    description:
      "Site officiel de l'Assemblée Mont Garizim. Découvrez nos cultes, nos ministères, nos événements et rejoignez une communauté qui grandit dans la foi.",
    images: ["/logo1.png"],
    creator: "@assembleemg",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo1.png",
    apple: "/logo1.png",
  },
  themeColor: "#0a2a4d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: "Assemblée Mont Garizim",
    description: "Église chrétienne dynamique à Abidjan, offrant des cultes, des ministères et des événements pour grandir dans la foi.",
    url: "https://assembleemontgarizim.com",
    logo: "https://assembleemontgarizim.com/logo1.png",
    image: "https://assembleemontgarizim.com/logo1.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Abidjan",
      addressCountry: "CI",
    },
    sameAs: [
      "https://www.facebook.com/assembleemontgarizim",
      "https://www.instagram.com/assembleemontgarizim",
    ],
  };

  return (
    <html lang="fr" className={`${fraunces.variable} ${manrope.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LoadingScreen />
        {children}
        <PopupComponent />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
