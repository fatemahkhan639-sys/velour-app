import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (sort) params.append("sort", sort);
    axios
      .get(`/api/products?${params}`)
      .then((r) => setProducts(r.data.products || []));
  }, [category, sort]);

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 24px" }}>
      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 3,
            color: "#c4602a",
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          Browse
        </p>
        <h1
          style={{
            fontSize: 36,
            fontFamily: "Playfair Display, serif",
            fontWeight: 400,
          }}
        >
          All Products
        </h1>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 32,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {["", "Tops", "Bottoms", "Outerwear", "Accessories"].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={{
              padding: "8px 20px",
              borderRadius: 20,
              border: "1px solid #e8e5e0",
              background: category === c ? "#0f0f0f" : "#fff",
              color: category === c ? "#fff" : "#0f0f0f",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {c || "All"}
          </button>
        ))}
        <select
          onChange={(e) => setSort(e.target.value)}
          style={{
            marginLeft: "auto",
            padding: "8px 16px",
            border: "1px solid #e8e5e0",
            borderRadius: 8,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          <option value="">Sort: Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 24,
        }}
      >
        {products.map((p) => (
          <div
            key={p._id}
            onMouseEnter={() => setHovered(p._id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              borderRadius: 12,
              overflow: "hidden",
              background: "#fff",
              border: "1px solid #e8e5e0",
              transition: "all 0.3s",
              boxShadow:
                hovered === p._id ? "0 16px 48px rgba(0,0,0,0.1)" : "none",
              transform:
                hovered === p._id ? "translateY(-4px)" : "translateY(0)",
            }}
          >
            {/* Image */}
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/product/${p._id}`)}
            >
              <img
                src={p.images[0]?.url}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 300,
                  objectFit: "cover",
                  transition: "transform 0.5s",
                  transform: hovered === p._id ? "scale(1.05)" : "scale(1)",
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
                  }}
                >
                  SALE
                </span>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: 16 }}>
              <p
                style={{
                  fontSize: 10,
                  color: "#a8a29a",
                  letterSpacing: 2,
                  marginBottom: 4,
                  textTransform: "uppercase",
                }}
              >
                {p.category}
              </p>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  marginBottom: 8,
                  fontFamily: "Playfair Display, serif",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/product/${p._id}`)}
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
                <div>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>
                    ${p.price}
                  </span>
                  {p.comparePrice && (
                    <span
                      style={{
                        fontSize: 13,
                        color: "#a8a29a",
                        textDecoration: "line-through",
                        marginLeft: 8,
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
                        color: i < Math.round(p.rating) ? "#d4a017" : "#e8e5e0",
                        fontSize: 12,
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* View Product button */}
              <button
                onClick={() => navigate(`/product/${p._id}`)}
                style={{
                  width: "100%",
                  marginTop: 12,
                  padding: "10px",
                  background: "#0f0f0f",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#3a3530")}
                onMouseLeave={(e) => (e.target.style.background = "#0f0f0f")}
              >
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
