import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";
import PopupComponent from "@/components/Popup";

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
  title: "Assemblée Mont Garizim — Une communauté de foi, d'amour et d'espérance",
  description:
    "Site officiel de l'Assemblée Mont Garizim. Découvrez nos cultes, nos ministères, nos événements et rejoignez une communauté qui grandit dans la foi.",
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
  return (
    <html lang="fr" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <LoadingScreen />
        {children}
        <PopupComponent />
      </body>
    </html>
  );
}
