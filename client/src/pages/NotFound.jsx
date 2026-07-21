import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

const NotFound = () => {
  usePageTitle("Page Not Found");

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 24px",
      }}
    >
      <p
        style={{
          fontSize: 100,
          fontFamily: "Playfair Display, serif",
          fontWeight: 400,
          color: "#e8e5e0",
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        404
      </p>
      <h1
        style={{
          fontSize: 24,
          fontFamily: "Playfair Display, serif",
          fontWeight: 400,
          marginBottom: 12,
        }}
      >
        Page not found
      </h1>
      <p style={{ color: "#6b6560", fontSize: 14, marginBottom: 32, maxWidth: 360 }}>
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        style={{
          padding: "14px 32px",
          background: "#0f0f0f",
          color: "#fff",
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        BACK TO HOME
      </Link>
    </div>
  );
};

export default NotFound;