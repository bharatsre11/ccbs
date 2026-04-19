import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://ccbs.onrender.com"; 

function Admin() {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // 🔥 Fetch data
  useEffect(() => {
    if (tab === "orders") {
      axios.get(`${BASE_URL}/api/orders`)
        .then(res => setOrders(res.data))
        .catch(err => console.log(err));
    }

    if (tab === "products") {
      axios.get(`${BASE_URL}/api/products`)
        .then(res => setProducts(res.data))
        .catch(err => console.log(err));
    }

    if (tab === "users") {
      axios.get(`${BASE_URL}/api/users`)
        .then(res => setUsers(res.data))
        .catch(err => console.log(err));
    }

  }, [tab]);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Admin Dashboard 🚀</h1>

      {/* 🔹 Tabs */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
  {["orders", "products", "users"].map((t) => (
    <button
      key={t}
      onClick={() => setTab(t)}
      style={{
        padding: "8px 16px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        background: tab === t ? "#ff4d6d" : "#ddd",
        color: tab === t ? "white" : "black"
      }}
    >
      {t.toUpperCase()}
    </button>
  ))}
</div>

      {/* 🔹 ORDERS */}
      {tab === "orders" && (
        <div>
          <h2>Orders</h2>
          {orders.map(o => (
            <div key={o._id} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}>
              <p><b>User:</b> {o.userId?.name}</p>
              <p><b>Product:</b> {o.productId?.name}</p>
              <p><b>Status:</b> {o.status}</p>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 PRODUCTS */}
      {tab === "products" && (
        <div>
          <h2>Products</h2>
          {products.map(p => (
            <div key={p._id} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}>
              <p>{p.name}</p>
              <p>₹{p.price}</p>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 USERS */}
      {tab === "users" && (
        <div>
          <h2>Users</h2>
          {users.map(u => (
            <div key={u._id} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}>
              <p>{u.name}</p>
              <p>{u.email}</p>
              <p><b>Role:</b> {u.role || "user"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;