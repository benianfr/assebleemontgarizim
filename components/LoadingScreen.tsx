"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <Image
          src="/logo.png"
          alt="Assemblée Mont Garizim"
          width={120}
          height={120}
          priority
          className="loading-logo"
        />
        <div className="loading-spinner"></div>
      </div>
      <style jsx global>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0a2a4d 0%, #1a4a7d 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeOut 0.5s ease-in-out 1.5s forwards;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .loading-logo {
          animation: pulse 1.5s ease-in-out infinite;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(232, 206, 122, 0.3);
          border-top-color: #E8CE7A;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
            visibility: hidden;
          }
        }
      `}</style>
    </div>
  );
}
