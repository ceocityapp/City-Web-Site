"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", fontFamily: "system-ui, sans-serif" }}>
          <div style={{ maxWidth: "32rem", textAlign: "center" }}>
            <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>⚠️</div>
            <h1 style={{ fontSize: "1.875rem", fontWeight: 900, marginBottom: "0.5rem" }}>Algo salió mal</h1>
            <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
              Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.
            </p>
            <button
              onClick={reset}
              style={{
                background: "#00D47E",
                color: "white",
                fontWeight: 700,
                padding: "0.75rem 2rem",
                borderRadius: "9999px",
                border: 0,
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
