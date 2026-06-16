import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const shipping = total > 75 ? 0 : 9.99;
  const tax = total * 0.1;
  const grandTotal = total + shipping + tax;

  const handle = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("velour_token");
    if (!token) {
      toast.error("Please login first");
      return navigate("/login");
    }
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        product: i._id,
        name: i.name,
        image: i.images[0]?.url,
        price: i.price,
        size: i.size,
        color: i.color,
        qty: i.qty,
      }));
      await axios.post(
        "/api/orders",
        {
          orderItems,
          shippingAddress: form,
          paymentMethod: "cod",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: "0 24px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 40,
      }}
    >
      {/* Form */}
      <div>
        <h1 style={{ fontSize: 28, marginBottom: 24 }}>Shipping Details</h1>
        <form
          onSubmit={handle}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <input
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            style={{
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: 8,
              fontSize: 14,
            }}
            required
          />
          <input
            placeholder="Street address"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            style={{
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: 8,
              fontSize: 14,
            }}
            required
          />
          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            style={{
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: 8,
              fontSize: 14,
            }}
            required
          />
          <input
            placeholder="Postal code"
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            style={{
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: 8,
              fontSize: 14,
            }}
            required
          />
          <input
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            style={{
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: 8,
              fontSize: 14,
            }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              background: "#1a1a1a",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </form>
      </div>

      {/* Summary */}
      <div>
        <h2 style={{ fontSize: 22, marginBottom: 24 }}>Order Summary</h2>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
              fontSize: 14,
            }}
          >
            <span>
              {item.name} × {item.qty}
            </span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
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
            marginBottom: 8,
            fontSize: 14,
          }}
        >
          <span style={{ color: "#666" }}>Shipping</span>
          <span>{shipping === 0 ? "Free" : "$9.99"}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            fontSize: 14,
          }}
        >
          <span style={{ color: "#666" }}>Tax</span>
          <span>${tax.toFixed(2)}</span>
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
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
