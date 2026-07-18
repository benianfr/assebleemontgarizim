"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getPopup, type Popup } from "@/lib/firestore";

export default function PopupComponent() {
  const pathname = usePathname();
  const [popup, setPopup] = useState<Popup | null>(null);
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  // Don't show popup on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    async function fetchPopup() {
      const result = await getPopup();
      if (result.success && result.popup) {
        setPopup(result.popup);
        
        // Check if popup is enabled and hasn't been closed
        if (result.popup.enabled && !closed) {
          const delay = (result.popup.showDelay || 2) * 1000;
          setTimeout(() => {
            setVisible(true);
          }, delay);
        }
      }
    }

    fetchPopup();
  }, [closed]);

  const handleClose = () => {
    setVisible(false);
    setClosed(true);
  };

  if (!popup || !visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          animation: "slideIn 0.3s ease",
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(0, 0, 0, 0.5)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            color: "#fff",
            fontSize: "20px",
            cursor: "pointer",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>

        {popup.imageUrl && (
          <img
            src={popup.imageUrl}
            alt={popup.title}
            style={{
              width: "100%",
              height: "250px",
              objectFit: "cover",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
            }}
          />
        )}

        <div style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "12px", color: "var(--deep-blue, #0a2a4d)" }}>
            {popup.title}
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", color: "var(--text-mid, #4a5568)", marginBottom: "20px" }}>
            {popup.description}
          </p>
          {popup.buttonText && popup.buttonLink && (
            <a
              href={popup.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              style={{
                display: "inline-block",
                padding: "12px 24px",
                background: "var(--gold, #d4a017)",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#b8860b"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#d4a017"}
            >
              {popup.buttonText}
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
