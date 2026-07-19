"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    console.log("PWA Install Prompt - wasDismissed:", wasDismissed, "isInstalled:", isInstalled);
    
    if (wasDismissed || isInstalled) {
      setDismissed(true);
      console.log("PWA Install Prompt - dismissed or installed, not showing");
      return;
    }

    // Check if app is already running in standalone mode (installed)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      localStorage.setItem("pwa-installed", "true");
      setDismissed(true);
      console.log("PWA Install Prompt - running in standalone mode");
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    console.log("PWA Install Prompt - isIOS:", isIOSDevice);

    // Show prompt after 3 seconds
    const showNotification = () => {
      console.log("PWA Install Prompt - showing notification");
      setShowPrompt(true);
      playSound();
      
      // Auto-hide after 10 seconds if not dismissed
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowPrompt(false);
      }, 10000);
    };

    // Initial delay of 3 seconds
    const initialTimer = setTimeout(() => {
      showNotification();
    }, 3000);

    // For Android/Desktop, also listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
      console.log("PWA Install Prompt - beforeinstallprompt event fired");
      showNotification();
    };

    // Listen for appinstalled event to mark app as installed
    const handleAppInstalled = () => {
      localStorage.setItem("pwa-installed", "true");
      setShowPrompt(false);
      setDeferredPrompt(null);
      setCanInstall(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      console.log("PWA Install Prompt - app installed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      clearTimeout(initialTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("PWA Install Prompt - user choice:", outcome);
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setShowPrompt(false);
        setCanInstall(false);
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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleLater = () => {
    setShowPrompt(false);
    // Show again after 30 seconds
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setTimeout(() => {
      setShowPrompt(true);
      playSound();
    }, 30000);
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        right: 20,
        maxWidth: 420,
        margin: "0 auto",
        background: "linear-gradient(135deg, #07213D 0%, #0a2a4d 100%)",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
        animation: "slideUp 0.5s ease",
        color: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: "rgba(232, 206, 122, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: "2px solid rgba(232, 206, 122, 0.3)",
          }}
        >
          <img src="/logo1.png" alt="Logo" style={{ width: 36, height: 36 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#E8CE7A" }}>
              Installer l'application
            </h3>
            <span 
              style={{
                background: "rgba(232, 206, 122, 0.3)",
                color: "#E8CE7A",
                fontSize: "10px",
                fontWeight: "600",
                padding: "2px 8px",
                borderRadius: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Nouveau
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.5 }}>
            {isIOS
              ? "Ajoutez l'Assemblée Mont Garizim à votre écran d'accueil pour une expérience optimale."
              : "Installez notre application pour accéder rapidement à nos contenus sans passer par le navigateur."}
          </p>
          {isIOS && (
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "rgba(255, 255, 255, 0.7)" }}>
              Appuyez sur <strong style={{ color: "#E8CE7A" }}>Partager</strong> puis <strong style={{ color: "#E8CE7A" }}>Ajouter à l'écran d'accueil</strong>
            </p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: "none",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            color: "rgba(255, 255, 255, 0.6)",
            padding: 4,
            lineHeight: 1,
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 1)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"}
        >
          ×
        </button>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        {!isIOS && canInstall && (
          <button
            onClick={handleInstall}
            style={{
              flex: 1,
              padding: 14,
              background: "#E8CE7A",
              color: "#07213D",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#C9A227"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#E8CE7A"}
          >
            Installer maintenant
          </button>
        )}
        <button
          onClick={handleLater}
          style={{
            flex: 1,
            padding: 14,
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
        >
          Plus tard
        </button>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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
