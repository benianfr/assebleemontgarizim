"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Don't show PWA install prompt on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const playSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  useEffect(() => {
    // Check if user already dismissed or app is installed
    const wasDismissed = localStorage.getItem("pwa-install-dismissed");
    const isInstalled = localStorage.getItem("pwa-installed");
    if (wasDismissed || isInstalled) {
      setDismissed(true);
      return;
    }

    // Check if app is already running in standalone mode (installed)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      localStorage.setItem("pwa-installed", "true");
      setDismissed(true);
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Show prompt every 5 seconds with sound
    const showNotification = () => {
      setShowPrompt(true);
      playSound();
    };

    // Initial delay of 5 seconds
    const initialTimer = setTimeout(() => {
      showNotification();
      // Then show every 5 seconds
      intervalRef.current = setInterval(() => {
        showNotification();
      }, 5000);
    }, 5000);

    // For Android/Desktop, also listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
      playSound();
    };

    // Listen for appinstalled event to mark app as installed
    const handleAppInstalled = () => {
      localStorage.setItem("pwa-installed", "true");
      setShowPrompt(false);
      setDeferredPrompt(null);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      clearTimeout(initialTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem("pwa-install-dismissed", "true");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        right: 20,
        maxWidth: 400,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
        animation: "slideUp 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            background: "#0a2a4d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <img src="/logo1.png" alt="Logo" style={{ width: 32, height: 32 }} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#0a2a4d" }}>
            Installer l'application
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#666", lineHeight: 1.4 }}>
            {isIOS
              ? "Ajoutez l'Assemblée Mont Garizim à votre écran d'accueil pour une expérience optimale."
              : "Installez notre application pour accéder rapidement à nos contenus."}
          </p>
          {isIOS && (
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#888" }}>
              Appuyez sur <strong>Partager</strong> puis <strong>Ajouter à l'écran d'accueil</strong>
            </p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            color: "#999",
            padding: 4,
          }}
        >
          ×
        </button>
      </div>
      {!isIOS && (
        <button
          onClick={handleInstall}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 12,
            background: "#0a2a4d",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Installer
        </button>
      )}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
