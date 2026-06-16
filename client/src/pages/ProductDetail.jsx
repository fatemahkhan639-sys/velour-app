import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      .then((r) => setProduct(r.data.product))
      .catch(() => toast.error("Product not found"));
  }, [id]);

  const handleAddToCart = () => {
    if (!size) return toast.error("Please select a size");
    if (!color) return toast.error("Please select a color");
    addItem(product, size, color);
    toast.success("Added to cart!");
  };

  if (!product)
    return <div style={{ textAlign: "center", padding: 80 }}>Loading...</div>;

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "40px auto",
        padding: "0 24px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
      }}
    >
      {/* Image */}
      <img
        src={product.images[0]?.url}
        alt={product.name}
        style={{ width: "100%", borderRadius: 12, objectFit: "cover" }}
      />

      {/* Info */}
      <div>
        <p style={{ fontSize: 13, color: "#999", marginBottom: 8 }}>
          {product.category}
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
          {product.name}
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 700 }}>
            ${product.price}
          </span>
          {product.comparePrice && (
            <span
              style={{
                fontSize: 16,
                color: "#999",
                textDecoration: "line-through",
              }}
            >
              ${product.comparePrice}
            </span>
          )}
        </div>
        <p style={{ color: "#666", lineHeight: 1.7, marginBottom: 24 }}>
          {product.description}
        </p>

        {/* Sizes */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Size</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                style={{
                  padding: "8px 16px",
                  border: `1px solid ${size === s ? "#1a1a1a" : "#ddd"}`,
                  borderRadius: 8,
                  background: size === s ? "#1a1a1a" : "#fff",
                  color: size === s ? "#fff" : "#1a1a1a",
                  fontSize: 13,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Color</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  padding: "8px 16px",
                  border: `1px solid ${color === c ? "#1a1a1a" : "#ddd"}`,
                  borderRadius: 8,
                  background: color === c ? "#1a1a1a" : "#fff",
                  color: color === c ? "#fff" : "#1a1a1a",
                  fontSize: 13,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          style={{
            width: "100%",
            padding: "14px",
            background: "#1a1a1a",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Add to Cart
        </button>

        <p
          style={{
            marginTop: 16,
            fontSize: 13,
            color: "#999",
            textAlign: "center",
          }}
        >
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;
