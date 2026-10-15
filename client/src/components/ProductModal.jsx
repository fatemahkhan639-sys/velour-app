import { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const ProductModal = ({ product, onClose }) => {
  const { addItem } = useCart();
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  const handleAdd = () => {
    if (!size) return toast.error("Please select a size");
    if (!color) return toast.error("Please select a color");
    addItem(product, size, color);
    toast.success("Added to cart!");
    onClose();
  };

  const optionStyle = (active) => ({
    padding: "8px 14px",
    border: `1px solid ${active ? "#1a1a1a" : "#ddd"}`,
    borderRadius: 2,
    background: active ? "#1a1a1a" : "#fff",
    color: active ? "#fff" : "#1a1a1a",
    fontSize: 13,
    cursor: "pointer",
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 8,
          maxWidth: 820,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 12,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            color: "#1a1a1a",
          }}
        >
          ×
        </button>

        <img
          src={product.images[0]?.url}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            minHeight: 320,
            objectFit: "cover",
          }}
        />

        <div style={{ padding: 32 }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: 2,
              color: "#6b6560",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {product.category}
          </p>
          <h3
            style={{
              fontFamily: "Playfair Display, serif",
              fontWeight: 400,
              fontSize: 28,
              marginBottom: 12,
            }}
          >
            {product.name}
          </h3>
          <p style={{ fontSize: 20, marginBottom: 16 }}>
            ${product.price}
            {product.comparePrice && (
              <span
                style={{
                  fontSize: 14,
                  color: "#999",
                  textDecoration: "line-through",
                  marginLeft: 10,
                }}
              >
                ${product.comparePrice}
              </span>
            )}
          </p>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: "#5c5750",
              marginBottom: 20,
            }}
          >
            {product.description}
          </p>

          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Size</p>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                style={optionStyle(size === s)}
              >
                {s}
              </button>
            ))}
          </div>

          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Color
          </p>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={optionStyle(color === c)}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            style={{
              width: "100%",
              padding: 14,
              background: "#1a1a1a",
              color: "#fff",
              border: "none",
              borderRadius: 2,
              fontSize: 13,
              letterSpacing: 1,
              fontWeight: 500,
              cursor: "pointer",
              opacity: product.stock <= 0 ? 0.5 : 1,
            }}
          >
            {product.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
