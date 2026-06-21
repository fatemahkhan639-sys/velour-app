import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Admin = () => {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("velour_token");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/orders", { headers });
      setOrders(data.orders || []);
    } catch {
      toast.error("Failed to load orders");
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data.products || []);
    } catch {
      toast.error("Failed to load products");
    }
  };
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Tops",
    stock: "",
    sizes: "XS,S,M,L,XL",
    colors: "Black,White",
    images: [{ url: "", alt: "" }],
  });

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        sizes: newProduct.sizes.split(",").map((s) => s.trim()),
        colors: newProduct.colors.split(",").map((c) => c.trim()),
      };
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, payload, { headers });
        toast.success("Product updated!");
      } else {
        await axios.post("/api/products", payload, { headers });
        toast.success("Product added!");
      }
      setShowForm(false);
      setEditingId(null);
      fetchProducts();
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "Tops",
        stock: "",
        sizes: "XS,S,M,L,XL",
        colors: "Black,White",
        images: [{ url: "", alt: "" }],
      });
    } catch {
      toast.error(
        editingId ? "Failed to update product" : "Failed to add product",
      );
    }
  };
  const startEdit = (product) => {
    setEditingId(product._id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      sizes: product.sizes.join(","),
      colors: product.colors.join(","),
      images: product.images,
    });
    setShowForm(true);
  };
  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`, { headers });
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { status }, { headers });
      toast.success("Status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update");
    }
  };

  const tabStyle = (t) => ({
    padding: "10px 24px",
    border: "none",
    borderBottom: `2px solid ${tab === t ? "#1a1a1a" : "transparent"}`,
    background: "none",
    fontSize: 15,
    fontWeight: tab === t ? 600 : 400,
    cursor: "pointer",
    color: tab === t ? "#1a1a1a" : "#999",
  });

  if (loading)
    return <div style={{ textAlign: "center", padding: 80 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 24px" }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Admin Dashboard</h1>
      <p style={{ color: "#999", marginBottom: 32 }}>Manage your store</p>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 40,
        }}
      >
        {[
          { label: "Total Orders", value: orders.length },
          { label: "Total Products", value: products.length },
          {
            label: "Revenue",
            value:
              "$" + orders.reduce((s, o) => s + o.totalPrice, 0).toFixed(2),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{ border: "1px solid #eee", borderRadius: 12, padding: 24 }}
          >
            <p style={{ color: "#999", fontSize: 13, marginBottom: 8 }}>
              {stat.label}
            </p>
            <p style={{ fontSize: 28, fontWeight: 700 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #eee", marginBottom: 32 }}>
        <button style={tabStyle("orders")} onClick={() => setTab("orders")}>
          Orders
        </button>
        <button style={tabStyle("products")} onClick={() => setTab("products")}>
          Products
        </button>
      </div>

      {/* Orders Tab */}
      {tab === "orders" && (
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>All Orders</h2>
          {orders.length === 0 ? (
            <p style={{ color: "#999" }}>No orders yet</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  {[
                    "Order ID",
                    "Customer",
                    "Items",
                    "Total",
                    "Status",
                    "Date",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 8px",
                        textAlign: "left",
                        color: "#999",
                        fontWeight: 500,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <td
                      style={{
                        padding: "12px 8px",
                        fontFamily: "monospace",
                        fontSize: 12,
                      }}
                    >
                      {o._id.slice(-6)}
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      {o.shippingAddress.fullName}
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      {o.orderItems.length} item(s)
                    </td>
                    <td style={{ padding: "12px 8px", fontWeight: 600 }}>
                      ${o.totalPrice.toFixed(2)}
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 500,
                          background:
                            o.status === "delivered"
                              ? "#e8f4ec"
                              : o.status === "shipped"
                                ? "#e8f0fe"
                                : "#fff8e6",
                          color:
                            o.status === "delivered"
                              ? "#1a6b38"
                              : o.status === "shipped"
                                ? "#1a47b8"
                                : "#b86e00",
                        }}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px", color: "#999" }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <select
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        defaultValue={o.status}
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #ddd",
                          borderRadius: 6,
                          fontSize: 12,
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Products Tab */}
      {tab === "products" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontSize: 20 }}>All Products</h2>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
              }}
              style={{
                padding: "10px 20px",
                background: "#1a1a1a",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {showForm ? "Cancel" : "+ Add Product"}
            </button>
          </div>

          {/* Add Product Form */}
          {showForm && (
            <form
              onSubmit={saveProduct}
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 24,
                marginBottom: 32,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <p style={{ fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
                  Product Name
                </p>
                <input
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  placeholder="e.g. Silk Blouse"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
              </div>
              <div>
                <p style={{ fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
                  Category
                </p>
                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                >
                  <option>Tops</option>
                  <option>Bottoms</option>
                  <option>Outerwear</option>
                  <option>Accessories</option>
                  <option>Shoes</option>
                </select>
              </div>
              <div>
                <p style={{ fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
                  Price ($)
                </p>
                <input
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  placeholder="e.g. 89"
                  type="number"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
              </div>
              <div>
                <p style={{ fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
                  Stock
                </p>
                <input
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                  placeholder="e.g. 50"
                  type="number"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
              </div>
              <div>
                <p style={{ fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
                  Sizes (comma separated)
                </p>
                <input
                  value={newProduct.sizes}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, sizes: e.target.value })
                  }
                  placeholder="XS,S,M,L,XL"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
              </div>
              <div>
                <p style={{ fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
                  Colors (comma separated)
                </p>
                <input
                  value={newProduct.colors}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, colors: e.target.value })
                  }
                  placeholder="Black,White,Red"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <p style={{ fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
                  Image URL
                </p>
                <input
                  value={newProduct.images[0].url}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      images: [{ url: e.target.value, alt: newProduct.name }],
                    })
                  }
                  placeholder="https://example.com/image.jpg"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <p style={{ fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
                  Description
                </p>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Product description..."
                  required
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    fontSize: 14,
                    resize: "vertical",
                  }}
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <button
                  type="submit"
                  style={{
                    padding: "12px 32px",
                    background: "#1a1a1a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {editingId ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          )}
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #eee" }}>
                {["Image", "Name", "Category", "Price", "Stock", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 8px",
                        textAlign: "left",
                        color: "#999",
                        fontWeight: 500,
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "12px 8px" }}>
                    <img
                      src={p.images[0]?.url}
                      alt={p.name}
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </td>
                  <td style={{ padding: "12px 8px", fontWeight: 500 }}>
                    {p.name}
                  </td>
                  <td style={{ padding: "12px 8px", color: "#999" }}>
                    {p.category}
                  </td>
                  <td style={{ padding: "12px 8px", fontWeight: 600 }}>
                    ${p.price}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <span
                      style={{
                        color: p.stock < 10 ? "#c0392b" : "#1a6b38",
                        fontWeight: 500,
                      }}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <button
                      onClick={() => startEdit(p)}
                      style={{
                        padding: "6px 14px",
                        background: "#fff",
                        border: "1px solid #ddd",
                        color: "#1a1a1a",
                        borderRadius: 6,
                        fontSize: 12,
                        cursor: "pointer",
                        marginRight: 8,
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      style={{
                        padding: "6px 14px",
                        background: "#fff",
                        border: "1px solid #ffcccc",
                        color: "#c0392b",
                        borderRadius: 6,
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
