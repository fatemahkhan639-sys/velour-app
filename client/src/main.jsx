import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import App from "./App";
import "./index.css";

import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CartProvider>
      <App />
      <Toaster position="bottom-center" />
    </CartProvider>
  </BrowserRouter>,
);