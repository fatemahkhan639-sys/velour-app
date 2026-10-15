import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductModal from "../components/ProductModal";
import usePageTitle from "../hooks/usePageTitle";

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
  }, [threshold]);
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
  usePageTitle();
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState({ orders: 0, products: 0, customers: 0 });
  const [statsRef, statsInView] = useInView();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios
      .get("/api/products")
      .then((r) => setProducts(r.data.products || []))
      .catch(() => setProducts([]));
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

  return (
    <div style={{ overflowX: "hidden" }}>
      <style>{`
        .product-card:hover { transform: translateY(-8px) !important; box-shadow: 0 24px 64px rgba(0,0,0,0.15) !important; }
        .product-img { transition: transform 0.6s ease !important; }
        .product-card:hover .product-img { transform: scale(1.08) !important; }
        .cat-card { transition: transform 0.4s ease, box-shadow 0.4s ease !important; }
        .cat-card:hover { transform: translateY(-6px) scale(1.02) !important; box-shadow: 0 20px 48px rgba(0,0,0,0.2) !important; }

        .stats-grid { grid-template-columns: repeat(3,1fr); }
        .category-grid { grid-template-columns: repeat(4,1fr); }
        .features-grid { grid-template-columns: repeat(4,1fr); }
        .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
        .footer-bottom { flex-direction: row; }
        .sale-title { font-size: 52px; }

        @media (max-width: 768px) {
          .featured-grid { grid-template-columns: repeat(2,1fr) !important; gap: 12px !important; }
          .featured-img { height: 200px !important; }
          .card-footer { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
          .card-btn { width: 100% !important; }
          .stats-grid { grid-template-columns: repeat(3,1fr) !important; gap: 8px !important; }
          .category-grid { grid-template-columns: repeat(2,1fr) !important; }
          .features-grid { grid-template-columns: repeat(2,1fr) !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .footer-bottom { flex-direction: column !important; gap: 8px !important; text-align: center !important; }
          .sale-title { font-size: 32px !important; }
        }

        @media (max-width: 480px) {
          .features-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <style>{`
          .hero { background: #f4f1ec; }
          .hero-inner {
            max-width: 1200px;
            margin: 0 auto;
            padding: 72px 24px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 64px;
            align-items: center;
          }
          .hero-label {
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #6b6560;
            margin-bottom: 20px;
          }
          .hero-heading {
            font-family: "Playfair Display", serif;
            font-weight: 400;
            font-size: 56px;
            line-height: 1.1;
            color: #1a1a1a;
            margin-bottom: 20px;
          }
          .hero-text {
            font-size: 16px;
            line-height: 1.7;
            color: #5c5750;
            max-width: 420px;
            margin-bottom: 32px;
          }
          .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
          .hero-btn {
            display: inline-block;
            padding: 14px 32px;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 1px;
            border: 1px solid #1a1a1a;
            border-radius: 2px;
            transition: background 0.2s, color 0.2s;
          }
          .hero-btn-primary { background: #1a1a1a; color: #fff; }
          .hero-btn-primary:hover { background: #333; }
          .hero-btn-secondary { background: transparent; color: #1a1a1a; }
          .hero-btn-secondary:hover { background: #1a1a1a; color: #fff; }
          .hero-image {
            display: block;
            width: 100%;
            aspect-ratio: 4 / 5;
            max-height: 640px;
            object-fit: cover;
            border-radius: 2px;
          }
          @media (max-width: 768px) {
            .hero-inner {
              grid-template-columns: 1fr;
              gap: 32px;
              padding: 40px 24px;
            }
            .hero-heading { font-size: 38px; }
          }
        `}</style>

        <div className="hero-inner">
          <div>
            <p className="hero-label">New season</p>
            <h1 className="hero-heading">Everyday clothing, well made.</h1>
            <p className="hero-text">
              Thoughtfully designed pieces in quality fabrics. Made to be worn
              often and to last.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="hero-btn hero-btn-primary">
                SHOP NOW
              </Link>
              <Link to="/shop?tag=sale" className="hero-btn hero-btn-secondary">
                VIEW SALE
              </Link>
            </div>
          </div>

          <img
            className="hero-image"
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=80"
            alt="Model wearing a blue coat from the new season collection"
          />
        </div>
      </section>

      {/* Stats */}
      <div
        ref={statsRef}
        style={{
          background: "#0f0f0f",
          padding: "40px 24px",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <div
          className="stats-grid"
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "grid",
            gap: 16,
            textAlign: "center",
          }}
        >
          {[
            {
              value: count.orders.toLocaleString() + "+",
              label: "Happy Orders",
            },
            { value: count.products + "+", label: "Products" },
            {
              value: count.customers.toLocaleString() + "+",
              label: "Customers",
            },
          ].map((stat) => (
            <div key={stat.label}>
              <p
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "Playfair Display, serif",
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: 10,
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
      <div style={{ maxWidth: 1200, margin: "60px auto", padding: "0 24px" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
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
                fontSize: 36,
                fontFamily: "Playfair Display, serif",
                fontWeight: 400,
              }}
            >
              Shop by Category
            </h2>
          </div>
        </AnimatedSection>
        <div className="category-grid" style={{ display: "grid", gap: 16 }}>
          {[
            {
              name: "Tops",
              img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
              delay: 0,
            },
            {
              name: "Bottoms",
              img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400",
              delay: 0.1,
            },
            {
              name: "Outerwear",
              img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400",
              delay: 0.2,
            },
            {
              name: "Accessories",
              img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
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
                    height: 280,
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
                <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                  <p
                    style={{
                      color: "#fff",
                      fontFamily: "Playfair Display, serif",
                      fontSize: 20,
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
      <div style={{ background: "#fafaf9", padding: "60px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <AnimatedSection>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 40,
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
                    fontSize: 36,
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
            className="featured-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {products.slice(0, 4).map((p, idx) => (
              <AnimatedSection key={p._id} delay={idx * 0.07}>
                <div
                  className="product-card cat-card"
                  onClick={() => setSelected(p)}
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    display: "block",
                  }}
                >
                  <img
                    className="product-img featured-img"
                    src={p.images[0]?.url}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: 280,
                      objectFit: "cover",
                      transition: "transform 0.5s",
                    }}
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
                      background:
                        "linear-gradient(transparent 50%, rgba(0,0,0,0.7))",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      right: 16,
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: 10,
                        letterSpacing: 2,
                        marginBottom: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      {p.category}
                    </p>
                    <p
                      style={{
                        color: "#fff",
                        fontFamily: "Playfair Display, serif",
                        fontSize: 16,
                        marginBottom: 6,
                      }}
                    >
                      {p.name}
                    </p>
                    <div
                      className="card-footer"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: 15,
                            fontWeight: 600,
                          }}
                        >
                          ${p.price}
                        </span>
                        {p.comparePrice && (
                          <span
                            style={{
                              fontSize: 12,
                              color: "rgba(255,255,255,0.5)",
                              textDecoration: "line-through",
                            }}
                          >
                            ${p.comparePrice}
                          </span>
                        )}
                      </div>
                      <button
                        className="card-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(p);
                        }}
                        style={{
                          background: "#fff",
                          color: "#1a1a1a",
                          border: "none",
                          borderRadius: 2,
                          padding: "8px 14px",
                          fontSize: 11,
                          letterSpacing: 1,
                          fontWeight: 500,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link
              to="/shop"
              style={{
                display: "inline-block",
                padding: "14px 36px",
                border: "1px solid #0f0f0f",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 1,
                color: "#0f0f0f",
              }}
            >
              VIEW ALL PRODUCTS
            </Link>
          </div>
        </div>
      </div>

      {/* Sale Banner */}
      <AnimatedSection>
        <div
          style={{
            background: "linear-gradient(135deg, #1a1410, #2a1f14)",
            color: "#fff",
            padding: "60px 24px",
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
            className="sale-title"
            style={{
              fontFamily: "Playfair Display, serif",
              fontWeight: 400,
              marginBottom: 16,
            }}
          >
            End of Season Sale
          </h2>
          <p style={{ color: "#a8a29a", marginBottom: 36, fontSize: 15 }}>
            Up to 40% off selected styles. While stocks last.
          </p>
          <Link
            to="/shop?tag=sale"
            style={{
              background: "#c4602a",
              color: "#fff",
              padding: "14px 36px",
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
      <div style={{ maxWidth: 1200, margin: "60px auto", padding: "0 24px" }}>
        <div className="features-grid" style={{ display: "grid", gap: 20 }}>
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
                  padding: "28px 16px",
                  borderRadius: 12,
                  border: "1px solid #e8e5e0",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 12, color: "#6b6560" }}>{f.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Product pop-up */}
      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}

      {/* Footer */}
      <footer
        style={{
          background: "#0f0f0f",
          color: "#fff",
          padding: "48px 24px 32px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            className="footer-grid"
            style={{ display: "grid", gap: 32, marginBottom: 40 }}
          >
            <div>
              <p
                style={{
                  fontSize: 22,
                  letterSpacing: 6,
                  fontFamily: "Playfair Display, serif",
                  marginBottom: 12,
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
                    marginBottom: 16,
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
                      marginBottom: 10,
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
            className="footer-bottom"
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
              Privacy Policy · Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
