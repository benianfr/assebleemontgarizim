"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    }

    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #07213D 0%, #0a2d52 100%)",
      padding: "20px"
    }}>
      <div style={{ 
        background: "#fff", 
        borderRadius: "12px", 
        padding: "40px", 
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ 
            fontSize: "28px", 
            color: "#07213D", 
            marginBottom: "8px",
            fontWeight: 700
          }}>
            Admin
          </h1>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Église Mont Garizim
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              fontSize: "14px", 
              fontWeight: 600, 
              marginBottom: "8px", 
              color: "#07213D" 
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "15px",
                transition: "border-color 0.3s",
                boxSizing: "border-box"
              }}
              placeholder="admin@montgarizim.org"
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ 
              display: "block", 
              fontSize: "14px", 
              fontWeight: 600, 
              marginBottom: "8px", 
              color: "#07213D" 
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "15px",
                transition: "border-color 0.3s",
                boxSizing: "border-box"
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{
              background: "#fee",
              color: "#c33",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "14px",
              marginBottom: "16px"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "#C9A227",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.3s"
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div style={{ 
          marginTop: "24px", 
          paddingTop: "24px", 
          borderTop: "1px solid #e0e0e0",
          textAlign: "center"
        }}>
          <a 
            href="/" 
            style={{ 
              color: "#666", 
              textDecoration: "none",
              fontSize: "14px"
            }}
          >
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  );
}
