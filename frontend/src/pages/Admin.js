import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://ccbs.onrender.com";

function Admin() {
  const [tab, setTab] = useState("orders");

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filter, setFilter] = useState("All");

  const [newCategory, setNewCategory] = useState({ name: "", image: "" });
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });
  const [newVariant, setNewVariant] = useState({
    productId: "",
    name: "",
    image: "",
    price: "",
  });

  // 🔥 SINGLE FETCH (OPTIMIZED)
  useEffect(() => {
    axios.get(`${BASE_URL}/api/categories`).then((res) => setCategories(res.data));
    axios.get(`${BASE_URL}/api/products`).then((res) => setProducts(res.data));

    if (tab === "orders") {
      axios.get(`${BASE_URL}/api/orders`).then((res) => setOrders(res.data));
    }

    if (tab === "users") {
      axios.get(`${BASE_URL}/api/users`).then((res) => setUsers(res.data));
    }
  }, [tab]);

  // 🔥 DASHBOARD STATS
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce((acc, o) => acc + (o.price || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;

  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

  // 🔥 FILTER
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((o) => o.status === filter);

  const cardStyle = {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    fontWeight: "bold",
  };

  return (
    <div style={{ padding: "30px", background: "#f5f6fa", minHeight: "100vh" }}>
      <h1>Admin Dashboard 🚀</h1>

      {/* 🔹 TABS */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        {["orders", "products", "users", "categories", "variants"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              background: tab === t ? "#ff4d6d" : "#ddd",
              color: tab === t ? "white" : "black",
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🔥 ORDERS */}
      {tab === "orders" && (
        <div>
          {/* DASHBOARD */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <div style={cardStyle}>📦 Orders: {totalOrders}</div>
            <div style={cardStyle}>💰 Revenue: ₹{totalRevenue}</div>
            <div style={cardStyle}>⏳ Pending: {pendingOrders}</div>
            <div style={cardStyle}>✅ Delivered: {deliveredOrders}</div>
          </div>

          {/* FILTER */}
          <div style={{ marginBottom: "20px" }}>
            {["All", "Pending", "Processing", "Shipped", "Delivered"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  marginRight: "10px",
                  padding: "8px 15px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: filter === f ? "#ff4d6d" : "#ddd",
                  color: filter === f ? "white" : "black",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* ORDERS LIST */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {filteredOrders.map((o) => (
              <div
                key={o._id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "15px",
                  width: "300px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={
                    o.variantId?.image ||
                    o.productId?.image ||
                    "https://via.placeholder.com/300"
                  }
                  alt=""
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />

                <p><b>User:</b> {o.userId?.name}</p>
                <h3>{o.productId?.name}</h3>

                {o.variantId && (
                  <p style={{ fontSize: "13px" }}>
                    🎨 {o.variantId.name}
                  </p>
                )}

                <p><b>₹{o.price}</b></p>
                <p style={{ fontSize: "12px" }}>📍 {o.address}</p>

                {/* STATUS */}
                <select
                  value={o.status}
                  onChange={(e) => {
                    axios
                      .put(`${BASE_URL}/api/orders/status/${o._id}`, {
                        status: e.target.value,
                      })
                      .then(() => {
                        axios.get(`${BASE_URL}/api/orders`)
                          .then(res => setOrders(res.data));
                      });
                  }}
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 PRODUCTS */}
      {tab === "products" && (
        <div>
          <h2>Add Product</h2>

          <input placeholder="Name" onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
          <input placeholder="Price" onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
          <input placeholder="Image URL" onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />

          <select onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
            <option>Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <button onClick={() => {
            axios.post(`${BASE_URL}/api/products`, newProduct)
              .then(() => window.location.reload());
          }}>
            Add Product
          </button>
        </div>
      )}

      {/* 🔥 USERS */}
      {tab === "users" && (
        <div>
          <h2>Users</h2>
          {users.map((u) => (
            <div key={u._id}>
              <p>{u.name} - {u.email} ({u.role || "user"})</p>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 CATEGORIES */}
      {tab === "categories" && (
        <div>
          <h2>Add Category</h2>

          <input placeholder="Name" onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
          <input placeholder="Image" onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })} />

          <button onClick={() => {
            axios.post(`${BASE_URL}/api/categories`, newCategory)
              .then(() => window.location.reload());
          }}>
            Add Category
          </button>
        </div>
      )}

      {/* 🔥 VARIANTS */}
      {tab === "variants" && (
        <div>
          <h2>Add Design</h2>

          <select onChange={(e) => setNewVariant({ ...newVariant, productId: e.target.value })}>
            <option>Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

          <input placeholder="Name" onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })} />
          <input placeholder="Image" onChange={(e) => setNewVariant({ ...newVariant, image: e.target.value })} />
          <input placeholder="Price" onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })} />

          <button onClick={() => {
            axios.post(`${BASE_URL}/api/variants`, newVariant)
              .then(() => window.location.reload());
          }}>
            Add Design
          </button>
        </div>
      )}
    </div>
  );
}

export default Admin;