import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
};

const AnimatedSection = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [count, setCount] = useState({ orders: 0, products: 0, customers: 0 });
  const [statsRef, statsInView] = useInView();
  const heroRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100);
    axios
      .get("/api/products")
      .then((r) => setProducts(r.data.products || []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    const handleMouse = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    if (!statsInView) return;
    const targets = { orders: 1240, products: 86, customers: 4300 };
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setCount({
        orders: Math.floor(targets.orders * ease),
        products: Math.floor(targets.products * ease),
        customers: Math.floor(targets.customers * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [statsInView]);

  const parallax = (strength) => ({
    transform: `translate(${mousePos.x * strength}px, ${mousePos.y * strength}px)`,
    transition: "transform 0.1s ease-out",
  });

  return (
    <div style={{ overflowX: "hidden" }}>
      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(3deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(-2deg)} }
        @keyframes float3 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-24px) rotate(4deg)} }
        @keyframes spin3d { 0%{transform:rotateY(0deg)} 100%{transform:rotateY(360deg)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes scrollLine { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform:scaleY(1);transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes pulse3d { 0%,100%{box-shadow:0 0 0 0 rgba(196,96,42,0.3)} 50%{box-shadow:0 0 0 20px rgba(196,96,42,0)} }
        @keyframes textGlow { 0%,100%{text-shadow:0 0 20px rgba(196,96,42,0)} 50%{text-shadow:0 0 40px rgba(196,96,42,0.3)} }
        .product-card:hover { transform: translateY(-8px) !important; box-shadow: 0 24px 64px rgba(0,0,0,0.15) !important; }
        .product-img { transition: transform 0.6s ease !important; }
        .product-card:hover .product-img { transform: scale(1.08) !important; }
        .cat-card { transition: transform 0.4s ease, box-shadow 0.4s ease !important; }
        .cat-card:hover { transform: translateY(-6px) scale(1.02) !important; box-shadow: 0 20px 48px rgba(0,0,0,0.2) !important; }
      `}</style>

      {/* ═══════════ HERO ═══════════ */}
      <div
        ref={heroRef}
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0f0e0c 0%, #1a1610 40%, #2a1f14 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          perspective: "1000px",
        }}
      >
        {/* Animated gradient background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(45deg, rgba(196,96,42,0.08), rgba(212,160,23,0.05), rgba(196,96,42,0.08))",
            backgroundSize: "400% 400%",
            animation: "gradientShift 8s ease infinite",
          }}
        />

        {/* Grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            ...parallax(5),
          }}
        />

        {/* Floating 3D orbs */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "20%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 35%, rgba(196,96,42,0.4), rgba(196,96,42,0.05) 60%, transparent)",
            filter: "blur(1px)",
            animation: "float1 6s ease-in-out infinite",
            ...parallax(-15),
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "35%",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 40% 40%, rgba(212,160,23,0.3), transparent 70%)",
            animation: "float2 8s ease-in-out infinite",
            ...parallax(-10),
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            right: "8%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 40% 40%, rgba(196,96,42,0.5), transparent 70%)",
            animation: "float3 5s ease-in-out infinite",
            ...parallax(-20),
          }}
        />

        {/* Floating product cards — 3D */}
        <div
          style={{
            position: "absolute",
            right: "8%",
            top: "12%",
            animation: "float1 7s ease-in-out infinite",
            ...parallax(-12),
          }}
        >
          <div
            style={{
              width: 180,
              height: 240,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)",
              transform: `rotateY(-15deg) rotateX(5deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <img
              src="https://placehold.co/180x240/e8e4dc/5a5248?text=New+In"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(transparent 60%, rgba(0,0,0,0.4))",
                display: "flex",
                alignItems: "flex-end",
                padding: 16,
              }}
            >
              <p
                style={{
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: 1,
                }}
              >
                NEW IN
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: "22%",
            top: "18%",
            animation: "float2 9s ease-in-out infinite",
            ...parallax(-8),
          }}
        >
          <div
            style={{
              width: 200,
              height: 280,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow:
                "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
              transform: `rotateY(-8deg) rotateX(3deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <img
              src="https://placehold.co/200x280/d4cfc8/5a5248?text=Essentials"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(transparent 60%, rgba(0,0,0,0.4))",
                display: "flex",
                alignItems: "flex-end",
                padding: 16,
              }}
            >
              <p
                style={{
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: 1,
                }}
              >
                ESSENTIALS
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: "6%",
            bottom: "15%",
            animation: "float3 6s ease-in-out infinite",
            ...parallax(-18),
          }}
        >
          <div
            style={{
              width: 150,
              height: 200,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
              transform: `rotateY(-20deg) rotateX(8deg)`,
            }}
          >
            <img
              src="https://placehold.co/150x200/c8bfb4/5a5248?text=Sale"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(transparent 60%, rgba(196,96,42,0.6))",
                display: "flex",
                alignItems: "flex-end",
                padding: 12,
              }}
            >
              <p
                style={{
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: 1,
                }}
              >
                SALE
              </p>
            </div>
          </div>
        </div>

        {/* Floating badge */}
        <div
          style={{
            position: "absolute",
            right: "32%",
            bottom: "28%",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 12,
            padding: "12px 20px",
            animation: "float2 7s ease-in-out infinite",
            ...parallax(-6),
          }}
        >
          <p style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>
            ⭐ 4.9 Rating
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
            4,300+ reviews
          </p>
        </div>

        {/* Hero text */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 80px",
            position: "relative",
            zIndex: 10,
            width: "100%",
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <div
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "translateY(0)" : "translateY(30px)",
                transition: "all 1s ease 0.1s",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(196,96,42,0.15)",
                  border: "1px solid rgba(196,96,42,0.3)",
                  borderRadius: 20,
                  padding: "6px 16px",
                  marginBottom: 32,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#c4602a",
                    animation: "pulse3d 2s infinite",
                  }}
                />
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: 3,
                    color: "#c4602a",
                    textTransform: "uppercase",
                  }}
                >
                  Summer 2026 Collection
                </p>
              </div>
            </div>

            <div
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "translateY(0)" : "translateY(40px)",
                transition: "all 1s ease 0.3s",
              }}
            >
              <h1
                style={{
                  fontSize: 80,
                  lineHeight: 1.0,
                  marginBottom: 28,
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 400,
                  color: "#fff",
                  animation: heroLoaded ? "textGlow 4s ease infinite" : "none",
                }}
              >
                Style that
                <br />
                <em
                  style={{
                    fontStyle: "italic",
                    color: "transparent",
                    background:
                      "linear-gradient(90deg, #c4602a, #d4a017, #c4602a)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "shimmer 3s linear infinite",
                  }}
                >
                  speaks
                </em>
                <br />
                for itself.
              </h1>
            </div>

            <div
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "translateY(0)" : "translateY(40px)",
                transition: "all 1s ease 0.5s",
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.9,
                  marginBottom: 44,
                  maxWidth: 420,
                }}
              >
                Curated fashion for the modern wardrobe. Premium fabrics,
                timeless silhouettes, effortless elegance.
              </p>
              <div style={{ display: "flex", gap: 16 }}>
                <Link
                  to="/shop"
                  style={{
                    background: "linear-gradient(135deg, #c4602a, #d4a017)",
                    color: "#fff",
                    padding: "16px 40px",
                    borderRadius: 6,
                    fontSize: 13,
                    letterSpacing: 1,
                    fontWeight: 600,
                    boxShadow: "0 8px 32px rgba(196,96,42,0.4)",
                    transition: "all 0.3s",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 12px 40px rgba(196,96,42,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 8px 32px rgba(196,96,42,0.4)";
                  }}
                >
                  SHOP NOW
                </Link>
                <Link
                  to="/shop?tag=sale"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(10px)",
                    color: "#fff",
                    padding: "16px 40px",
                    borderRadius: 6,
                    fontSize: 13,
                    letterSpacing: 1,
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "inline-block",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.15)";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.08)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  VIEW SALE
                </Link>
              </div>
            </div>

            {/* Mini stats */}
            <div
              style={{
                display: "flex",
                gap: 32,
                marginTop: 56,
                opacity: heroLoaded ? 1 : 0,
                transition: "all 1s ease 0.8s",
              }}
            >
              {[
                ["4,300+", "Customers"],
                ["86+", "Products"],
                ["4.9★", "Rating"],
              ].map(([val, label]) => (
                <div key={label}>
                  <p
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "Playfair Display, serif",
                    }}
                  >
                    {val}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: heroLoaded ? 1 : 0,
            transition: "all 1s ease 1.2s",
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: 3,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </p>
          <div
            style={{
              width: 1,
              height: 48,
              background: "rgba(255,255,255,0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#c4602a",
                animation: "scrollLine 1.5s ease infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div
        ref={statsRef}
        style={{
          background: "#0f0f0f",
          padding: "48px 24px",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 24,
            textAlign: "center",
          }}
        >
          {[
            {
              value: count.orders.toLocaleString() + "+",
              label: "Happy Orders",
            },
            { value: count.products + "+", label: "Premium Products" },
            {
              value: count.customers.toLocaleString() + "+",
              label: "Customers Worldwide",
            },
          ].map((stat) => (
            <div key={stat.label}>
              <p
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "Playfair Display, serif",
                  marginBottom: 8,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "#6b6560",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ maxWidth: 1200, margin: "80px auto", padding: "0 24px" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: 3,
                color: "#c4602a",
                marginBottom: 12,
                textTransform: "uppercase",
              }}
            >
              Explore
            </p>
            <h2
              style={{
                fontSize: 40,
                fontFamily: "Playfair Display, serif",
                fontWeight: 400,
              }}
            >
              Shop by Category
            </h2>
          </div>
        </AnimatedSection>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 16,
          }}
        >
          {[
            {
              name: "Tops",
              img: "https://placehold.co/300x380/e8e4dc/5a5248?text=Tops",
              delay: 0,
            },
            {
              name: "Bottoms",
              img: "https://placehold.co/300x380/d4cfc8/5a5248?text=Bottoms",
              delay: 0.1,
            },
            {
              name: "Outerwear",
              img: "https://placehold.co/300x380/c8bfb4/5a5248?text=Outerwear",
              delay: 0.2,
            },
            {
              name: "Accessories",
              img: "https://placehold.co/300x380/e0d8d0/5a5248?text=Accessories",
              delay: 0.3,
            },
          ].map((cat) => (
            <AnimatedSection key={cat.name} delay={cat.delay}>
              <Link
                to={`/shop?category=${cat.name}`}
                className="cat-card"
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  position: "relative",
                  display: "block",
                }}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  style={{
                    width: "100%",
                    height: 380,
                    objectFit: "cover",
                    transition: "transform 0.5s",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(transparent 50%, rgba(0,0,0,0.6))",
                  }}
                />
                <div style={{ position: "absolute", bottom: 24, left: 24 }}>
                  <p
                    style={{
                      color: "#fff",
                      fontFamily: "Playfair Display, serif",
                      fontSize: 22,
                      marginBottom: 4,
                    }}
                  >
                    {cat.name}
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 11,
                      letterSpacing: 2,
                    }}
                  >
                    SHOP NOW →
                  </p>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ background: "#fafaf9", padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <AnimatedSection>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 48,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: 3,
                    color: "#c4602a",
                    marginBottom: 12,
                    textTransform: "uppercase",
                  }}
                >
                  Curated for you
                </p>
                <h2
                  style={{
                    fontSize: 40,
                    fontFamily: "Playfair Display, serif",
                    fontWeight: 400,
                  }}
                >
                  Featured Products
                </h2>
              </div>
              <Link
                to="/shop"
                style={{
                  fontSize: 13,
                  color: "#6b6560",
                  borderBottom: "1px solid #d0ccc5",
                  paddingBottom: 2,
                }}
              >
                View all →
              </Link>
            </div>
          </AnimatedSection>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {products.map((p, idx) => (
              <AnimatedSection key={p._id} delay={idx * 0.07}>
                <div
                  className="product-card"
                  onClick={() => navigate(`/product/${p._id}`)}
                  onMouseEnter={() => setHovered(p._id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    cursor: "pointer",
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "#fff",
                    border: "1px solid #e8e5e0",
                    transition: "all 0.3s",
                  }}
                >
                  <div style={{ overflow: "hidden", position: "relative" }}>
                    <img
                      className="product-img"
                      src={p.images[0]?.url}
                      alt={p.name}
                      style={{ width: "100%", height: 300, objectFit: "cover" }}
                    />
                    {p.comparePrice && (
                      <span
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          background: "#c4602a",
                          color: "#fff",
                          fontSize: 10,
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontWeight: 600,
                          letterSpacing: 1,
                        }}
                      >
                        SALE
                      </span>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.2)",
                        opacity: hovered === p._id ? 1 : 0,
                        transition: "opacity 0.3s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          background: "#fff",
                          color: "#0f0f0f",
                          padding: "10px 24px",
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        Quick View
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: 18 }}>
                    <p
                      style={{
                        fontSize: 10,
                        color: "#a8a29a",
                        letterSpacing: 2,
                        marginBottom: 6,
                        textTransform: "uppercase",
                      }}
                    >
                      {p.category}
                    </p>
                    <h3
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        marginBottom: 10,
                        fontFamily: "Playfair Display, serif",
                      }}
                    >
                      {p.name}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{ fontSize: 16, fontWeight: 600 }}>
                          ${p.price}
                        </span>
                        {p.comparePrice && (
                          <span
                            style={{
                              fontSize: 13,
                              color: "#a8a29a",
                              textDecoration: "line-through",
                            }}
                          >
                            ${p.comparePrice}
                          </span>
                        )}
                      </div>
                      <div>
                        {"★★★★★".split("").map((s, i) => (
                          <span
                            key={i}
                            style={{
                              color:
                                i < Math.round(p.rating)
                                  ? "#d4a017"
                                  : "#e8e5e0",
                              fontSize: 12,
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* Sale Banner */}
      <AnimatedSection>
        <div
          style={{
            background: "linear-gradient(135deg, #1a1410, #2a1f14)",
            color: "#fff",
            padding: "80px 24px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "rgba(196,96,42,0.15)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              left: -60,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(196,96,42,0.1)",
            }}
          />
          <p
            style={{
              fontSize: 11,
              letterSpacing: 4,
              color: "#c4602a",
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            Limited Time
          </p>
          <h2
            style={{
              fontSize: 52,
              fontFamily: "Playfair Display, serif",
              fontWeight: 400,
              marginBottom: 16,
            }}
          >
            End of Season Sale
          </h2>
          <p style={{ color: "#a8a29a", marginBottom: 40, fontSize: 16 }}>
            Up to 40% off selected styles. While stocks last.
          </p>
          <Link
            to="/shop?tag=sale"
            style={{
              background: "#c4602a",
              color: "#fff",
              padding: "15px 40px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: 1,
              display: "inline-block",
            }}
          >
            SHOP SALE
          </Link>
        </div>
      </AnimatedSection>

      {/* Features */}
      <div style={{ maxWidth: 1200, margin: "80px auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 24,
          }}
        >
          {[
            {
              icon: "🚚",
              title: "Free Shipping",
              desc: "On all orders over $75",
            },
            { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
            {
              icon: "🔒",
              title: "Secure Payment",
              desc: "SSL encrypted checkout",
            },
            {
              icon: "✨",
              title: "Premium Quality",
              desc: "Carefully curated pieces",
            },
          ].map((f, i) => (
            <AnimatedSection key={f.title} delay={i * 0.1}>
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 16px",
                  borderRadius: 12,
                  border: "1px solid #e8e5e0",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: "#6b6560" }}>{f.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: "#0f0f0f",
          color: "#fff",
          padding: "64px 24px 32px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 48,
              marginBottom: 48,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 24,
                  letterSpacing: 6,
                  fontFamily: "Playfair Display, serif",
                  marginBottom: 16,
                }}
              >
                VELOUR
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#6b6560",
                  lineHeight: 1.8,
                  maxWidth: 280,
                }}
              >
                Thoughtfully designed fashion for the modern wardrobe.
              </p>
            </div>
            {[
              { title: "Company", links: ["About us", "Careers", "Press"] },
              { title: "Help", links: ["FAQ", "Shipping", "Returns"] },
              { title: "Shop", links: ["New In", "Sale", "All Products"] },
            ].map((col) => (
              <div key={col.title}>
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: 2,
                    color: "#a8a29a",
                    marginBottom: 20,
                    textTransform: "uppercase",
                  }}
                >
                  {col.title}
                </p>
                {col.links.map((l) => (
                  <p
                    key={l}
                    style={{
                      fontSize: 13,
                      color: "#6b6560",
                      marginBottom: 12,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#fff")}
                    onMouseLeave={(e) => (e.target.style.color = "#6b6560")}
                  >
                    {l}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <div
            style={{
              borderTop: "1px solid #1a1a1a",
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontSize: 12, color: "#6b6560" }}>
              © 2026 Velour. All rights reserved.
            </p>
            <p style={{ fontSize: 12, color: "#6b6560" }}>
              Made with ♥ for fashion lovers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
