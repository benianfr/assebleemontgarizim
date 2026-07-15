"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Fraunces, Inter } from "next/font/google";
import AdminLayout from "@/components/admin/AdminLayout";

const fontDisplay = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
  display: "swap",
});

const fontBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/admin/login");
      } else {
        setUser(u);
      }
      setChecking(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (checking || !user) {
    return (
      <div
        className={`${fontDisplay.variable} ${fontBody.variable}`}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f3ec",
          color: "#0a2540",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
        }}
      >
        Chargement…
      </div>
    );
  }

  return (
    <div className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <AdminLayout userEmail={user.email}>{children}</AdminLayout>
    </div>
  );
}
