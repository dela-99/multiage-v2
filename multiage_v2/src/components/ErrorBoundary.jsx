import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "An unexpected error occurred." };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary] Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg,#0c0603 0%,#1a0800 25%,#110500 55%,#040404 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "'DM Sans',sans-serif",
          color: "#f5f0e8",
        }}>
          <div style={{ maxWidth: 520, textAlign: "center" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 16px",
              borderRadius: 100,
              marginBottom: 20,
              background: "rgba(197,98,11,0.12)",
              border: "1px solid rgba(197,98,11,0.28)",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#C5620B", textTransform: "uppercase" }}>
                Something went wrong
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "clamp(24px,4vw,36px)",
              fontWeight: 800,
              marginBottom: 16,
              letterSpacing: -0.5,
            }}>
              Multiage Technologies
            </h1>
            <p style={{ fontSize: 15, color: "rgba(245,240,232,0.72)", lineHeight: 1.7, marginBottom: 28 }}>
              The application encountered an unexpected error and could not continue.
              Please refresh the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "13px 28px",
                borderRadius: 12,
                background: "linear-gradient(135deg,#C5620B,#6A2B09)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 28px rgba(197,98,11,0.35)",
                fontFamily: "inherit",
              }}
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
