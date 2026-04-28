import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://ccbs.onrender.com";

function Admin() {
  const [tab, setTab] = useState("orders");

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [filter, setFilter] = useState("All");

  // 🔥 PREVIEW STATES
  const [productPreview, setProductPreview] = useState("");
  const [categoryPreview, setCategoryPreview] = useState("");
  const [variantPreview, setVariantPreview] = useState("");

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

  // 🔥 FETCH
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

  // ✅ FIXED IMAGE UPLOAD
  const handleImageUpload = async (file, type) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${BASE_URL}/api/upload`, formData);

      if (type === "product") {
        setNewProduct((prev) => ({ ...prev, image: res.data.url }));
        setProductPreview(res.data.url);
      }

      if (type === "category") {
        setNewCategory((prev) => ({ ...prev, image: res.data.url }));
        setCategoryPreview(res.data.url);
      }

      if (type === "variant") {
        setNewVariant((prev) => ({ ...prev, image: res.data.url }));
        setVariantPreview(res.data.url);
      }
    } catch (err) {
      alert("Upload failed ❌");
    }
  };

  // eslint-disable-next-line no-unused-vars
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((o) => o.status === filter);

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

      {/* 🔥 PRODUCTS */}
      {tab === "products" && (
        <div>
          <h2>Add Product</h2>

          <input placeholder="Name" onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
          <input placeholder="Price" onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />

          {/* IMAGE UPLOAD */}
          <input type="file" onChange={(e) => handleImageUpload(e.target.files[0], "product")} />

          {/* PREVIEW */}
          {productPreview && <img src={productPreview} alt="Product Preview" width="120" style={{ marginTop: 10 }} />}

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

      {/* 🔥 CATEGORIES */}
      {tab === "categories" && (
        <div>
          <h2>Add Category</h2>

          <input placeholder="Name" onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />

          <input type="file" onChange={(e) => handleImageUpload(e.target.files[0], "category")} />

          {categoryPreview && <img src={categoryPreview} alt="Category Preview" width="120" />}

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

    {/* PRODUCT SELECT */}
    <select
      onChange={(e) =>
        setNewVariant({ ...newVariant, productId: e.target.value })
      }
      style={{ display: "block", marginBottom: "10px" }}
    >
      <option value="">Select Product</option>
      {products.map((p) => (
        <option key={p._id} value={p._id}>
          {p.name}
        </option>
      ))}
    </select>

    {/* NAME */}
    <input
      placeholder="Design Name"
      onChange={(e) =>
        setNewVariant({ ...newVariant, name: e.target.value })
      }
      style={{ display: "block", marginBottom: "10px" }}
    />

    {/* PRICE */}
    <input
      placeholder="Price"
      onChange={(e) =>
        setNewVariant({ ...newVariant, price: e.target.value })
      }
      style={{ display: "block", marginBottom: "10px" }}
    />

    {/* 🔥 FILE UPLOAD (IMPORTANT) */}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) handleImageUpload(file, "variant"); // ✅ FIXED
      }}
      style={{ marginBottom: "10px" }}
    />

    {/* 🔥 IMAGE PREVIEW */}
    {variantPreview && (
      <img
        src={variantPreview}
        alt="preview"
        width="150"
        style={{
          borderRadius: "10px",
          marginBottom: "10px",
          display: "block"
        }}
      />
    )}

    {/* ADD BUTTON */}
    <button
      onClick={() => {
        if (!newVariant.productId) {
          alert("Select product first ❗");
          return;
        }

        axios.post(`${BASE_URL}/api/variants`, newVariant)
          .then(() => {
            alert("Design added ✅");
            window.location.reload();
          });
      }}
    >
      Add Design
        </button>
      </div>
    )}
    </div>
  );
}

export default Admin;