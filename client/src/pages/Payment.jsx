import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { countries, validatePostalCode } from "../data/countries";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ shippingAddress }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { items, total, shipping = 0, tax = 0, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("velour_token");
  const grandTotal = total + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/payment/create-intent",
        { amount: grandTotal },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }
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
          shippingAddress,
          paymentMethod: "stripe",
          paymentResult: {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      clearCart();
      toast.success("Payment successful! Order placed!");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          border: "1px solid #e8e5e0",
          borderRadius: 8,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "15px",
                color: "#0f0f0f",
                "::placeholder": { color: "#a8a29a" },
              },
            },
          }}
        />
      </div>
      <div
        style={{
          background: "#fafaf9",
          borderRadius: 8,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            fontSize: 14,
          }}
        >
          <span style={{ color: "#6b6560" }}>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            fontSize: 14,
          }}
        >
          <span style={{ color: "#6b6560" }}>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            fontSize: 14,
          }}
        >
          <span style={{ color: "#6b6560" }}>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e8e5e0",
            margin: "12px 0",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          width: "100%",
          padding: "14px",
          background: loading ? "#a8a29a" : "#0f0f0f",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing..." : `Pay $${grandTotal.toFixed(2)}`}
      </button>
      <p
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#a8a29a",
          marginTop: 12,
        }}
      >
        🔒 Secured by Stripe
      </p>
      <div
        style={{
          marginTop: 16,
          padding: 12,
          background: "#fff8e6",
          borderRadius: 8,
          fontSize: 12,
          color: "#b86e00",
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: 4 }}>Test Card Details:</p>
        <p>Card: 4242 4242 4242 4242</p>
        <p>Date: Any future date · CVV: Any 3 digits</p>
      </div>
    </form>
  );
};

import usePageTitle from "../hooks/usePageTitle";

const Payment = () => {
  usePageTitle("Checkout");
  const { items } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [step, setStep] = useState(1);
  const [postalError, setPostalError] = useState("");

  useEffect(() => {
    if (items.length === 0) navigate("/cart");
  }, [items]);

  return (
    <div style={{ maxWidth: 560, margin: "48px auto", padding: "0 24px" }}>
      <p
        style={{
          fontSize: 11,
          letterSpacing: 3,
          color: "#c4602a",
          marginBottom: 8,
          textTransform: "uppercase",
        }}
      >
        Checkout
      </p>
      <h1
        style={{
          fontSize: 32,
          fontFamily: "Playfair Display, serif",
          fontWeight: 400,
          marginBottom: 32,
        }}
      >
        {step === 1 ? "Shipping Details" : "Payment"}
      </h1>

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            placeholder="Full name"
            name="fullName"
            id="fullName"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            style={{
              padding: "12px 16px",
              border: "1px solid #e8e5e0",
              borderRadius: 8,
              fontSize: 14,
            }}
          />
          <input
            placeholder="Street address"
            name="street"
            id="street"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            style={{
              padding: "12px 16px",
              border: "1px solid #e8e5e0",
              borderRadius: 8,
              fontSize: 14,
            }}
          />
          <input
            placeholder="City"
            name="city"
            id="city"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            style={{
              padding: "12px 16px",
              border: "1px solid #e8e5e0",
              borderRadius: 8,
              fontSize: 14,
            }}
          />
          <div>
            <input
              placeholder="Postal code"
              name="postalCode"
              id="postalCode"
              value={form.postalCode}
              onChange={(e) => {
                setForm({ ...form, postalCode: e.target.value });
                setPostalError("");
              }}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 16px",
                border: postalError ? "1px solid #d32f2f" : "1px solid #e8e5e0",
                borderRadius: 8,
                fontSize: 14,
              }}
            />
            {postalError && (
              <div style={{ color: "#d32f2f", fontSize: 13, marginTop: 4 }}>
                {postalError}
              </div>
            )}
          </div>
         <select
         name="country"
            id="country"
            value={form.country}
            onChange={(e) => {
              setForm({ ...form, country: e.target.value });
              setPostalError("");
            }}
            style={{
              padding: "12px 16px",
              border: "1px solid #e8e5e0",
              borderRadius: 8,
              fontSize: 14,
              background: "#fff",
              color: form.country ? "#000" : "#a8a29a",
            }}
          >
            <option value="" disabled>
              Select country
            </option>
            {countries.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (
                !form.fullName ||
                !form.street ||
                !form.city ||
                !form.postalCode ||
                !form.country
              ) {
                toast.error("Please fill all fields");
                return;
              }
              if (!validatePostalCode(form.country, form.postalCode)) {
                setPostalError("Invalid postal code for the selected country");
                return;
              }
              setPostalError("");
              setStep(2);
            }}
            style={{
              padding: "14px",
              background: "#0f0f0f",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Continue to Payment
          </button>
        </div>
      )}

      {step === 2 && (
        <Elements stripe={stripePromise}>
          <CheckoutForm shippingAddress={form} />
        </Elements>
      )}
    </div>
  );
};

export default Payment;
