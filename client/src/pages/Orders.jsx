import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("velour_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .get("/api/orders/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => {
        console.log("orders data:", r.data);
        setOrders(r.data.orders || []);
      })
      .catch((err) => {
        console.log("orders error:", err.response?.data);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: 80,
          fontSize: 16,
          color: "#6b6560",
        }}
      >
        Loading your orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>📦</p>
        <h2
          style={{
            fontSize: 24,
            marginBottom: 8,
            fontFamily: "Playfair Display, serif",
            fontWeight: 400,
          }}
        >
          No orders yet
        </h2>
        <p style={{ color: "#6b6560", marginBottom: 32 }}>
          Looks like you haven't placed any orders yet.
        </p>
        <Link
          to="/shop"
          style={{
            background: "#0f0f0f",
            color: "#fff",
            padding: "13px 32px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Start Shopping
        </Link>
      </div>
    );

  const statusColor = (status) => {
    const map = {
      pending: { bg: "#fff8e6", color: "#b86e00" },
      processing: { bg: "#e8f0fe", color: "#1a47b8" },
      shipped: { bg: "#e8f4f8", color: "#0a6e8a" },
      delivered: { bg: "#e8f4ec", color: "#1a6b38" },
      cancelled: { bg: "#fdecea", color: "#c0392b" },
    };
    return map[status] || { bg: "#f4f3f0", color: "#6b6560" };
  };

  return (
    <div style={{ maxWidth: 900, margin: "48px auto", padding: "0 24px" }}>
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
          Account
        </p>
        <h1
          style={{
            fontSize: 36,
            fontFamily: "Playfair Display, serif",
            fontWeight: 400,
          }}
        >
          My Orders
        </h1>
        <p style={{ color: "#6b6560", marginTop: 8 }}>
          {orders.length} order{orders.length !== 1 ? "s" : ""} placed
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {orders.map((order) => {
          const { bg, color } = statusColor(order.status);
          return (
            <div
              key={order._id}
              style={{
                border: "1px solid #e8e5e0",
                borderRadius: 12,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <div
                style={{
                  background: "#fafaf9",
                  padding: "16px 24px",
                  borderBottom: "1px solid #e8e5e0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", gap: 32 }}>
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#a8a29a",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      Order ID
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "monospace",
                      }}
                    >
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#a8a29a",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      Date
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#a8a29a",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      Total
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    background: bg,
                    color,
                    fontSize: 12,
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                >
                  {order.status}
                </span>
              </div>

              <div style={{ padding: "20px 24px" }}>
                {order.orderItems.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "center",
                      paddingBottom: i < order.orderItems.length - 1 ? 16 : 0,
                      marginBottom: i < order.orderItems.length - 1 ? 16 : 0,
                      borderBottom:
                        i < order.orderItems.length - 1
                          ? "1px solid #f4f3f0"
                          : "none",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 72,
                        height: 72,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #e8e5e0",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          marginBottom: 4,
                        }}
                      >
                        {item.name}
                      </h3>
                      <p style={{ fontSize: 13, color: "#6b6560" }}>
                        Size: {item.size} · Color: {item.color} · Qty:{" "}
                        {item.qty}
                      </p>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "#fafaf9",
                  padding: "14px 24px",
                  borderTop: "1px solid #e8e5e0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ fontSize: 12, color: "#a8a29a" }}>
                    Shipping to: {order.shippingAddress.city},{" "}
                    {order.shippingAddress.country}
                  </p>
                  <p style={{ fontSize: 12, color: "#a8a29a", marginTop: 2 }}>
                    Payment:{" "}
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Card"}{" "}
                    · Shipping:{" "}
                    {order.shippingPrice === 0
                      ? "Free"
                      : `$${order.shippingPrice}`}
                  </p>
                </div>
                <Link
                  to="/shop"
                  style={{
                    fontSize: 13,
                    color: "#0f0f0f",
                    borderBottom: "1px solid #d0ccc5",
                    paddingBottom: 1,
                  }}
                >
                  Buy again →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
