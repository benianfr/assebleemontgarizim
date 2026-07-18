"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import styles from "./AdminLayout.module.css";
import {
  GridIcon,
  InfoIcon,
  CalendarIcon,
  MicIcon,
  ImageIcon,
  MessageIcon,
  UsersIcon,
  GemIcon,
  MailIcon,
  SettingsIcon,
  WalletIcon,
  LogoutIcon,
  MenuIcon,
  CloseIcon,
} from "./icons";

export const MENU_ITEMS = [
  { path: "/admin/dashboard", label: "Tableau de bord", Icon: GridIcon },
  { path: "/admin/dashboard/notre-eglise", label: "Notre église", Icon: InfoIcon },
  { path: "/admin/dashboard/a-propos", label: "À propos", Icon: InfoIcon },
  { path: "/admin/dashboard/evenements", label: "Événements", Icon: CalendarIcon },
  { path: "/admin/dashboard/predications", label: "Prédications", Icon: MicIcon },
  { path: "/admin/dashboard/galerie", label: "Galerie", Icon: ImageIcon },
  { path: "/admin/dashboard/temoignages", label: "Témoignages", Icon: MessageIcon },
  { path: "/admin/dashboard/ministeres", label: "Ministères", Icon: UsersIcon },
  { path: "/admin/dashboard/valeurs", label: "Valeurs", Icon: GemIcon },
  { path: "/admin/dashboard/librairie", label: "Librairie", Icon: InfoIcon },
  { path: "/admin/dashboard/messages", label: "Messages", Icon: MailIcon },
  { path: "/admin/dashboard/popup", label: "Popup", Icon: MessageIcon },
  { path: "/admin/dashboard/parametres", label: "Paramètres", Icon: SettingsIcon },
  { path: "/admin/dashboard/dons", label: "Dons", Icon: WalletIcon },
];

function initials(email?: string | null) {
  if (!email) return "?";
  const name = email.split("@")[0];
  return name.slice(0, 2).toUpperCase();
}

export default function AdminLayout({
  userEmail,
  children,
}: {
  userEmail?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const activeItem =
    MENU_ITEMS.find((item) => item.path === pathname) ||
    [...MENU_ITEMS].reverse().find((item) => pathname?.startsWith(item.path) && item.path !== "/admin/dashboard");

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <div className={styles.shell}>
      {/* Mobile top bar */}
      <header className={styles.topbar}>
        <button
          type="button"
          aria-label="Ouvrir le menu"
          className={styles.menuButton}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon width={22} height={22} />
        </button>
        <div className={styles.topbarBrand}>
          <span className={styles.markRule} aria-hidden="true" />
          <span className={styles.topbarTitle}>
            {activeItem?.label ?? "Administration"}
          </span>
        </div>
        <div className={styles.topbarAvatar} title={userEmail ?? undefined}>
          {initials(userEmail)}
        </div>
      </header>

      {/* Overlay behind the mobile drawer */}
      {drawerOpen && (
        <div
          className={styles.overlay}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: fixed on desktop, off-canvas drawer on mobile */}
      <aside className={`${styles.sidebar} ${drawerOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}>
          <img src="/logo1.png" alt="Logo Assemblée Mont Garizim" style={{ width: "48px", height: "48px", borderRadius: "8px" }} />
          <div>
            <p className={styles.brandTitle}>Assemblée Mont Garizim</p>
            <p className={styles.brandSubtitle}>Espace d&rsquo;administration</p>
          </div>
          <button
            type="button"
            aria-label="Fermer le menu"
            className={styles.closeButton}
            onClick={() => setDrawerOpen(false)}
          >
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          {MENU_ITEMS.map((item) => {
            const isActive = item === activeItem;
            const Icon = item.Icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              >
                <Icon width={19} height={19} className={styles.navIcon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userRow}>
            <div className={styles.userAvatar}>{initials(userEmail)}</div>
            <div className={styles.userInfo}>
              <p className={styles.userEmail}>{userEmail ?? "Administrateur"}</p>
              <p className={styles.userRole}>Administrateur</p>
            </div>
          </div>
          <button type="button" className={styles.logoutButton} onClick={handleLogout}>
            <LogoutIcon width={18} height={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        <div className={styles.contentInner}>{children}</div>
      </main>
    </div>
  );
}
