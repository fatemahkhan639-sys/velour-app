import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Cart = () => {
  const { items, removeItem, itemCount, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0)
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <p style={{ fontSize: 24, marginBottom: 16 }}>🛍 Your cart is empty</p>
        <Link
          to="/shop"
          style={{
            background: "#1a1a1a",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 24px" }}>
      <h1 style={{ fontSize: 32, marginBottom: 32 }}>Your Cart</h1>

      {/* Items */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 16,
              padding: 16,
              border: "1px solid #eee",
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <img
              src={item.images[0]?.url}
              alt={item.name}
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, marginBottom: 4 }}>{item.name}</h3>
              <p style={{ fontSize: 13, color: "#999" }}>
                Size: {item.size} · Color: {item.color}
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                ${item.price} × {item.qty}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                ${(item.price * item.qty).toFixed(2)}
              </p>
              <button
                onClick={() => {
                  removeItem(item._id, item.size, item.color);
                  toast.success("Removed");
                }}
                style={{
                  fontSize: 12,
                  color: "#999",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span style={{ color: "#666" }}>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span style={{ color: "#666" }}>Shipping</span>
          <span>{total > 75 ? "Free" : "$9.99"}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span style={{ color: "#666" }}>Tax (10%)</span>
          <span>${(total * 0.1).toFixed(2)}</span>
        </div>
        <hr
          style={{
            margin: "16px 0",
            border: "none",
            borderTop: "1px solid #eee",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700 }}>Total</span>
          <span style={{ fontSize: 18, fontWeight: 700 }}>
            ${(total + (total > 75 ? 0 : 9.99) + total * 0.1).toFixed(2)}
          </span>
        </div>
        <button
          onClick={() => navigate("/payment")}
          style={{
            width: "100%",
            padding: "14px",
            background: "#1a1a1a",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          Proceed to Checkout
        </button>
        <button
          onClick={() => {
            clearCart();
            toast.success("Cart cleared");
          }}
          style={{
            width: "100%",
            padding: "14px",
            background: "#fff",
            color: "#1a1a1a",
            border: "1px solid #ddd",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;
