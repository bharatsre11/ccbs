import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://ccbs.onrender.com";

function Admin() {
  const [tab, setTab] = useState("orders");

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);

  const [productPreview, setProductPreview] = useState("");
  const [categoryPreview, setCategoryPreview] = useState("");
  const [variantPreview, setVariantPreview] = useState("");

  const [newCategory, setNewCategory] = useState({ name: "", image: "" });
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "", category: "" });
  const [newVariant, setNewVariant] = useState({ productId: "", name: "", image: "", price: "" });

  // 🔥 FETCH
  useEffect(() => {
    axios.get(`${BASE_URL}/api/categories`).then((res) => setCategories(res.data));
    axios.get(`${BASE_URL}/api/products`).then((res) => setProducts(res.data));
    axios.get(`${BASE_URL}/api/variants`).then((res) => setVariants(res.data));

    if (tab === "orders") {
      axios.get(`${BASE_URL}/api/orders`).then((res) => setOrders(res.data));
    }

    if (tab === "users") {
      axios.get(`${BASE_URL}/api/users`).then((res) => setUsers(res.data));
    }
  }, [tab]);

  // 🔥 UPLOAD
  const handleImageUpload = async (file, type) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (type === "product") {
        setNewProduct((p) => ({ ...p, image: res.data.url }));
        setProductPreview(res.data.url);
      }
      if (type === "category") {
        setNewCategory((c) => ({ ...c, image: res.data.url }));
        setCategoryPreview(res.data.url);
      }
      if (type === "variant") {
        setNewVariant((v) => ({ ...v, image: res.data.url }));
        setVariantPreview(res.data.url);
      }
    } catch (err) {
      alert("Upload failed ❌");
    }
  };

  // 🔥 DELETE
  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure?")) return;

    await axios.delete(`${BASE_URL}/api/${type}/${id}`);

    if (type === "products") setProducts(products.filter((p) => p._id !== id));
    if (type === "categories") setCategories(categories.filter((c) => c._id !== id));
    if (type === "variants") setVariants(variants.filter((v) => v._id !== id));
  };

  // 🎨 UI styles
  const card = {
    background: "#fff",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: 12,
  };

  const btn = {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    marginRight: 6,
  };

  return (
    <div style={{ padding: 30, background: "#f5f6fa", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 20 }}>Admin Dashboard 🚀</h1>

      {/* 🔹 Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {["orders", "products", "users", "categories", "variants"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              ...btn,
              background: tab === t ? "#ff4d6d" : "#ddd",
              color: tab === t ? "#fff" : "#000",
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🔥 PRODUCTS */}
      {tab === "products" && (
        <div>
          <h2>{newProduct._id ? "Edit Product" : "Add Product"}</h2>

          <input placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
          <input placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />

          <input type="file" onChange={(e) => handleImageUpload(e.target.files[0], "product")} />
          {productPreview && <img src={productPreview} width="100" />}

          <select onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
            <option>Select Category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          <button
            style={{ ...btn, background: "#4CAF50", color: "#fff" }}
            onClick={async () => {
              if (newProduct._id) {
                const res = await axios.put(`${BASE_URL}/api/products/${newProduct._id}`, newProduct);
                setProducts(products.map(p => p._id === res.data._id ? res.data : p));
              } else {
                const res = await axios.post(`${BASE_URL}/api/products`, newProduct);
                setProducts([...products, res.data]);
              }
              setNewProduct({ name: "", price: "", image: "", category: "" });
              setProductPreview("");
            }}
          >
            Save
          </button>

          {products.map((p) => (
            <div key={p._id} style={card}>
              <p>{p.name} - ₹{p.price}</p>
              <img src={p.image} width="70" />
              <br />
              <button style={{ ...btn, background: "#ff4d4d", color: "#fff" }} onClick={() => handleDelete("products", p._id)}>Delete</button>
              <button style={{ ...btn, background: "#ffa500", color: "#fff" }} onClick={() => { setNewProduct(p); setProductPreview(p.image); }}>Edit</button>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 CATEGORIES */}
      {tab === "categories" && (
        <div>
          <h2>{newCategory._id ? "Edit Category" : "Add Category"}</h2>

          <input placeholder="Name" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
          <input type="file" onChange={(e) => handleImageUpload(e.target.files[0], "category")} />
          {categoryPreview && <img src={categoryPreview} width="100" />}

          <button
            style={{ ...btn, background: "#4CAF50", color: "#fff" }}
            onClick={async () => {
              if (newCategory._id) {
                const res = await axios.put(`${BASE_URL}/api/categories/${newCategory._id}`, newCategory);
                setCategories(categories.map(c => c._id === res.data._id ? res.data : c));
              } else {
                const res = await axios.post(`${BASE_URL}/api/categories`, newCategory);
                setCategories([...categories, res.data]);
              }
              setNewCategory({ name: "", image: "" });
              setCategoryPreview("");
            }}
          >
            Save
          </button>

          {categories.map((c) => (
            <div key={c._id} style={card}>
              <p>{c.name}</p>
              <img src={c.image} width="70" />
              <br />
              <button style={{ ...btn, background: "#ff4d4d", color: "#fff" }} onClick={() => handleDelete("categories", c._id)}>Delete</button>
              <button style={{ ...btn, background: "#ffa500", color: "#fff" }} onClick={() => { setNewCategory(c); setCategoryPreview(c.image); }}>Edit</button>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 VARIANTS */}
      {tab === "variants" && (
        <div>
          <h2>{newVariant._id ? "Edit Design" : "Add Design"}</h2>

          <select onChange={(e) => setNewVariant({ ...newVariant, productId: e.target.value })}>
            <option>Select Product</option>
            {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>

          <input placeholder="Name" value={newVariant.name} onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })} />
          <input placeholder="Price" value={newVariant.price} onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })} />

          <input type="file" onChange={(e) => handleImageUpload(e.target.files[0], "variant")} />
          {variantPreview && <img src={variantPreview} width="100" />}

          <button
            style={{ ...btn, background: "#4CAF50", color: "#fff" }}
            onClick={async () => {
              if (newVariant._id) {
                const res = await axios.put(`${BASE_URL}/api/variants/${newVariant._id}`, newVariant);
                setVariants(variants.map(v => v._id === res.data._id ? res.data : v));
              } else {
                const res = await axios.post(`${BASE_URL}/api/variants`, newVariant);
                setVariants([...variants, res.data]);
              }
              setNewVariant({ productId: "", name: "", image: "", price: "" });
              setVariantPreview("");
            }}
          >
            Save
          </button>

          {variants.map((v) => (
            <div key={v._id} style={card}>
              <p>{v.name} - ₹{v.price}</p>
              <img src={v.image} width="70" />
              <br />
              <button style={{ ...btn, background: "#ff4d4d", color: "#fff" }} onClick={() => handleDelete("variants", v._id)}>Delete</button>
              <button style={{ ...btn, background: "#ffa500", color: "#fff" }} onClick={() => { setNewVariant(v); setVariantPreview(v.image); }}>Edit</button>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 ORDERS */}
      {tab === "orders" && orders.map((o) => (
        <div key={o._id} style={card}>
          <p>ID: {o._id}</p>
          <p>Status: {o.status}</p>
          <p>Total: ₹{o.total}</p>
        </div>
      ))}

      {/* 🔥 USERS */}
      {tab === "users" && users.map((u) => (
        <div key={u._id} style={card}>
          <p>{u.name}</p>
          <p>{u.email}</p>
        </div>
      ))}
    </div>
  );
}

export default Admin;