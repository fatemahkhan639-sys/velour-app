import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const Navbar = () => {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("velour_user") || "null");
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("velour_token");
    localStorage.removeItem("velour_user");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      {/* Announcement bar */}
      <div
        style={{
          background: "#0f0f0f",
          color: "#fff",
          textAlign: "center",
          padding: "10px 24px",
          fontSize: 12,
          letterSpacing: 1,
        }}
      >
        FREE SHIPPING ON ORDERS OVER $75 · NEW COLLECTION NOW LIVE
      </div>

      {/* Main navbar */}
      <nav
        style={{
          borderBottom: "1px solid #e8e5e0",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          {/* Left links */}
          <div
            style={{
              display: "flex",
              gap: 32,
              fontSize: 13,
              letterSpacing: 0.5,
            }}
          >
            <Link to="/shop" style={{ color: "#6b6560" }}>
              Shop
            </Link>
            <Link to="/shop?category=Tops" style={{ color: "#6b6560" }}>
              Tops
            </Link>
            <Link to="/shop?category=Outerwear" style={{ color: "#6b6560" }}>
              Outerwear
            </Link>
            <Link
              to="/shop?tag=sale"
              style={{ color: "#c4602a", fontWeight: 500 }}
            >
              Sale
            </Link>
          </div>

          {/* Logo center */}
          <Link
            to="/"
            style={{
              fontSize: 22,
              letterSpacing: 6,
              fontFamily: "Playfair Display, serif",
              fontWeight: 400,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            VELOUR
          </Link>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {user ? (
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <span
                  style={{ fontSize: 13, color: "#6b6560", cursor: "pointer" }}
                >
                  Hi, {user.name.split(" ")[0]}
                </span>
                {menuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      background: "#fff",
                      border: "1px solid #e8e5e0",
                      borderRadius: 8,
                      padding: "8px 0",
                      minWidth: 180,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      zIndex: 200,
                    }}
                  >
                    {/* Admin link — only for admin */}
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "10px 16px",
                          fontSize: 13,
                          color: "#c4602a",
                          fontWeight: 600,
                          borderBottom: "1px solid #f4f3f0",
                        }}
                      >
                        ⚙️ Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      style={{
                        display: "block",
                        padding: "10px 16px",
                        fontSize: 13,
                        color: "#0f0f0f",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#fafaf9")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "transparent")
                      }
                    >
                      📦 My Orders
                    </Link>

                    <Link
                      to="/profile"
                      style={{
                        display: "block",
                        padding: "10px 16px",
                        fontSize: 13,
                        color: "#0f0f0f",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#fafaf9")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "transparent")
                      }
                    >
                      👤 My Profile
                    </Link>

                    <button
                      onClick={logout}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 16px",
                        fontSize: 13,
                        color: "#c0392b",
                        background: "none",
                        border: "none",
                        borderTop: "1px solid #f4f3f0",
                        cursor: "pointer",
                      }}
                    >
                      🚪 Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 16 }}>
                <Link to="/login" style={{ fontSize: 13, color: "#6b6560" }}>
                  Sign in
                </Link>
                <Link
                  to="/register"
                  style={{ fontSize: 13, color: "#0f0f0f", fontWeight: 500 }}
                >
                  Register
                </Link>
              </div>
            )}

            <Link
              to="/cart"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "#0f0f0f",
                fontWeight: 500,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {itemCount > 0 && (
                <span
                  style={{
                    background: "#0f0f0f",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    fontSize: 11,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
