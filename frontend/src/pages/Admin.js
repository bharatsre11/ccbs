import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://ccbs.onrender.com";

function Admin() {
  const [tab, setTab] = useState("dashboard");
  const [search, setSearch] = useState("");

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [users, setUsers] = useState([]);

  const [newProduct, setNewProduct] = useState({});
  const [newCategory, setNewCategory] = useState({});
  const [newVariant, setNewVariant] = useState({});

  const [productPreview, setProductPreview] = useState("");
  const [variantPreview, setVariantPreview] = useState("");

  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showVariantForm, setShowVariantForm] = useState(false);

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingVariant, setIsEditingVariant] = useState(false);
  const btn = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginRight: "6px",
    fontWeight: "500",
    transition: "0.2s ease"
  };
  useEffect(() => {
    axios.get(`${BASE_URL}/api/orders`).then(res => setOrders(res.data));
    axios.get(`${BASE_URL}/api/products`).then(res => setProducts(res.data));
    axios.get(`${BASE_URL}/api/categories`).then(res => setCategories(res.data));
    axios.get(`${BASE_URL}/api/variants`).then(res => setVariants(res.data));
    axios.get(`${BASE_URL}/api/users`).then(res => setUsers(res.data));
  }, []);

  const filter = (arr, key) =>
    arr.filter(i => i[key]?.toLowerCase().includes(search.toLowerCase()));

  const totalRevenue = orders.reduce((a, b) => a + (b.total || 0), 0);

  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete?")) return;
    await axios.delete(`${BASE_URL}/api/${type}/${id}`);

    if (type === "products") setProducts(products.filter(p => p._id !== id));
    if (type === "categories") setCategories(categories.filter(c => c._id !== id));
    if (type === "variants") setVariants(variants.filter(v => v._id !== id));
  };

  const updateOrderStatus = async (id, status) => {
    const res = await axios.put(`${BASE_URL}/api/orders/${id}`, { status });
    setOrders(orders.map(o => (o._id === id ? res.data : o)));
  };

  const upload = async (file, type) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await axios.post(`${BASE_URL}/api/upload`, fd);

    if (type === "product") {
      setNewProduct(p => ({ ...p, image: res.data.url }));
      setProductPreview(res.data.url);
    }
    if (type === "variant") {
      setNewVariant(v => ({ ...v, image: res.data.url }));
      setVariantPreview(res.data.url);
    }
  };

  const card = { background:"#fff", padding:15, borderRadius:10, marginBottom:10 };

  return (
    <div style={{ padding: 30, background:"#f5f6fa" }}>
      <h1>Admin 🚀</h1>

      <div style={{ display:"flex", gap:10 }}>
        {["dashboard","orders","products","categories","variants","users"].map(t =>
          <button key={t} onClick={()=>setTab(t)}>{t}</button>
        )}
      </div>

      {tab !== "dashboard" &&
        <input placeholder="Search" value={search} onChange={e=>setSearch(e.target.value)} />
      }

      {/* DASHBOARD */}
      {tab==="dashboard" &&
        <div>
          <div style={card}>Orders: {orders.length}</div>
          <div style={card}>Revenue: ₹{totalRevenue}</div>
          <div style={card}>Products: {products.length}</div>
          <div style={card}>Users: {users.length}</div>
        </div>
      }

      {/* ORDERS */}
      {tab==="orders" &&
        filter(orders,"_id").map(o=>(
          <div key={o._id} style={card}>
            <p>{o._id}</p>
            <p>₹{o.total}</p>
            <select value={o.status} onChange={e=>updateOrderStatus(o._id,e.target.value)}>
              <option>Pending</option>
              <option>Processing</option>
              <option>Delivered</option>
            </select>
          </div>
        ))
      }

      {/* PRODUCTS */}
      {tab === "products" && (
      <div>

        {/* 🔥 HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20
        }}>
          <h2>Products</h2>

          <button
            onClick={() => {
              setNewProduct({ name: "", price: "", image: "", category: "" });
              setProductPreview("");
              setIsEditingProduct(false);
              setShowProductForm(true);
            }}
            style={{
              padding: "8px 16px",
              background: "#ff4d6d",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            + Add Product
          </button>
        </div>

        {/* 🔥 LIST */}
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          filter(products, "name").map((p) => (
            <div key={p._id} style={card}>
              <p><b>{p.name}</b> - ₹{p.price}</p>

              {/* Category name */}
              <small style={{ color: "#777" }}>
                {categories.find(c => c._id === p.category)?.name}
              </small>

              <br />

              <img
                src={p.image}
                alt={p.name}
                width="70"
                style={{ marginTop: 10, borderRadius: 8 }}
              />

              <div style={{ marginTop: 10 }}>
                <button
                  style={{ ...btn, background: "#ff4d4d", color: "#fff" }}
                  onClick={() => handleDelete("products", p._id)}
                >
                  Delete
                </button>

                <button
                  style={{ ...btn, background: "#ffa500", color: "#fff" }}
                  onClick={() => {
                    setNewProduct(p);
                    setProductPreview(p.image);
                    setIsEditingProduct(true);
                    setShowProductForm(true);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}

        {/* 🔥 MODAL */}
        {showProductForm && (
          <Modal close={() => setShowProductForm(false)}>

            <h3 style={{ marginBottom: 10 }}>
              {isEditingProduct ? "Edit Product" : "Add Product"}
            </h3>

            {/* CATEGORY */}
            <select
              value={newProduct.category || ""}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              style={{ display: "block", marginBottom: 10, width: "100%" }}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* NAME */}
            <input
              placeholder="Product Name"
              value={newProduct.name || ""}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              style={{ display: "block", marginBottom: 10, width: "100%" }}
            />

            {/* PRICE */}
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price || ""}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              style={{ display: "block", marginBottom: 10, width: "100%" }}
            />

            {/* IMAGE */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => upload(e.target.files[0], "product")}
              style={{ marginBottom: 10 }}
            />

            {/* PREVIEW */}
            {productPreview && (
              <img
                src={productPreview}
                alt={newProduct.name || "Product preview"}
                width="100"
                style={{ borderRadius: 10, marginBottom: 10 }}
              />
            )}

            {/* SAVE */}
            <button
              style={{
                width: "100%",
                padding: "10px",
                background: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={async () => {

                if (!newProduct.category) {
                  alert("Select category first ❗");
                  return;
                }

                if (isEditingProduct) {
                  const res = await axios.put(
                    `${BASE_URL}/api/products/${newProduct._id}`,
                    newProduct
                  );

                  setProducts(
                    products.map((p) =>
                      p._id === res.data._id ? res.data : p
                    )
                  );
                } else {
                  const res = await axios.post(
                    `${BASE_URL}/api/products`,
                    newProduct
                  );

                  setProducts([...products, res.data]);
                }

                // RESET
                setNewProduct({ name: "", price: "", image: "", category: "" });
                setProductPreview("");
                setShowProductForm(false);
                setIsEditingProduct(false);
              }}
            >
              {isEditingProduct ? "Update Product" : "Add Product"}
            </button>

          </Modal>
        )}

      </div>
    )}

      {/* CATEGORIES */}
      {tab === "categories" && (
      <div>

        {/* 🔥 HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20
        }}>
          <h2>Categories</h2>

          <button
            onClick={() => {
              setNewCategory({ name: ""});
              setIsEditingCategory(false);
              setShowCategoryForm(true);
            }}
            style={{
              padding: "8px 16px",
              background: "#ff4d6d",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            + Add Category
          </button>
        </div>

        {/* 🔥 LIST */}
        {categories.length === 0 ? (
          <p>No categories found</p>
        ) : (
          filter(categories, "name").map((c) => (
            <div key={c._id} style={card}>
              <p><b>{c.name}</b></p>

              <img
                src={c.image}
                alt={c.name}
                width="70"
                style={{ marginTop: 10, borderRadius: 8 }}
              />

              <div style={{ marginTop: 10 }}>
                <button
                  style={{ ...btn, background: "#ff4d4d", color: "#fff" }}
                  onClick={() => handleDelete("categories", c._id)}
                >
                  Delete
                </button>

                <button
                  style={{ ...btn, background: "#ffa500", color: "#fff" }}
                  onClick={() => {
                    setNewCategory(c);
                    setIsEditingCategory(true);
                    setShowCategoryForm(true);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}

        {/* 🔥 MODAL */}
        {showCategoryForm && (
          <Modal close={() => setShowCategoryForm(false)}>

            <h3 style={{ marginBottom: 10 }}>
              {isEditingCategory ? "Edit Category" : "Add Category"}
            </h3>

            {/* NAME */}
            <input
              placeholder="Category Name"
              value={newCategory.name || ""}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              style={{ display: "block", marginBottom: 10, width: "100%" }}
            />           

            {/* SAVE */}
            <button
              style={{
                width: "100%",
                padding: "10px",
                background: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={async () => {

                if (!newCategory.name) {
                  alert("Category name required ❗");
                  return;
                }

                if (isEditingCategory) {
                  const res = await axios.put(
                    `${BASE_URL}/api/categories/${newCategory._id}`,
                    newCategory
                  );

                  setCategories(
                    categories.map((c) =>
                      c._id === res.data._id ? res.data : c
                    )
                  );
                } else {
                  try {
                    console.log("Creating category:", newCategory);

                    const res = await axios.post(
                      `${BASE_URL}/api/categories`,
                      {
                        name: newCategory.name.trim()
                      }
                    );

                    console.log("Response:", res.data);

                    setCategories([...categories, res.data]);
                  } catch (err) {
                    console.log("ERROR:", err.response?.data);
                    alert(JSON.stringify(err.response?.data));
                  }
                }

                // RESET
                setNewCategory({ name: ""});
                setShowCategoryForm(false);
                setIsEditingCategory(false);
              }}
            >
              {isEditingCategory ? "Update Category" : "Add Category"}
            </button>

          </Modal>
        )}

      </div>
    )}

      {/* VARIANTS */}
      {tab === "variants" && (
      <div>

        {/* 🔥 HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20
        }}>
          <h2>Variants</h2>

          <button
            onClick={() => {
              setNewVariant({ productId: "", name: "", price: "", image: "" });
              setVariantPreview("");
              setIsEditingVariant(false);
              setShowVariantForm(true);
            }}
            style={{
              padding: "8px 16px",
              background: "#ff4d6d",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            + Add Variant
          </button>
        </div>

        {/* 🔥 LIST */}
        {variants.length === 0 ? (
          <p>No variants found</p>
        ) : (
          filter(variants, "name").map((v) => (
            <div key={v._id} style={card}>
              <p><b>{v.name}</b> - ₹{v.price}</p>

              {/* Product name */}
              <small style={{ color: "#777" }}>
                {products.find(p => p._id === v.productId)?.name}
              </small>

              <br />

              <img
                src={v.image}
                alt={v.name}
                width="70"
                style={{ marginTop: 10, borderRadius: 8 }}
              />

              <div style={{ marginTop: 10 }}>
                <button
                  style={{ ...btn, background: "#ff4d4d", color: "#fff" }}
                  onClick={() => handleDelete("variants", v._id)}
                >
                  Delete
                </button>

                <button
                  style={{ ...btn, background: "#ffa500", color: "#fff" }}
                  onClick={() => {
                    setNewVariant(v);
                    setVariantPreview(v.image);
                    setIsEditingVariant(true);
                    setShowVariantForm(true);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}

        {/* 🔥 MODAL */}
        {showVariantForm && (
          <Modal close={() => setShowVariantForm(false)}>

            <h3 style={{ marginBottom: 10 }}>
              {isEditingVariant ? "Edit Variant" : "Add Variant"}
            </h3>

            {/* PRODUCT */}
            <select
              value={newVariant.productId || ""}
              onChange={(e) =>
                setNewVariant({ ...newVariant, productId: e.target.value })
              }
              style={{ display: "block", marginBottom: 10, width: "100%" }}
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
              placeholder="Variant Name"
              value={newVariant.name || ""}
              onChange={(e) =>
                setNewVariant({ ...newVariant, name: e.target.value })
              }
              style={{ display: "block", marginBottom: 10, width: "100%" }}
            />

            {/* PRICE */}
            <input
              type="number"
              placeholder="Price"
              value={newVariant.price || ""}
              onChange={(e) =>
                setNewVariant({ ...newVariant, price: e.target.value })
              }
              style={{ display: "block", marginBottom: 10, width: "100%" }}
            />

            {/* IMAGE */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => upload(e.target.files[0], "variant")}
              style={{ marginBottom: 10 }}
            />

            {/* PREVIEW */}
            {variantPreview && (
              <img
                src={variantPreview}
                alt={newVariant.name || "Variant preview"}
                width="100"
                style={{ borderRadius: 10, marginBottom: 10 }}
              />
            )}

            {/* SAVE */}
            <button
              style={{
                width: "100%",
                padding: "10px",
                background: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={async () => {
                if (!newVariant.productId) {
                  alert("Select product first ❗");
                  return;
                }

                if (isEditingVariant) {
                  const res = await axios.put(
                    `${BASE_URL}/api/variants/${newVariant._id}`,
                    newVariant
                  );

                  setVariants(
                    variants.map((v) =>
                      v._id === res.data._id ? res.data : v
                    )
                  );
                } else {
                  const res = await axios.post(
                    `${BASE_URL}/api/variants`,
                    newVariant
                  );

                  setVariants([...variants, res.data]);
                }

                // RESET
                setNewVariant({ productId: "", name: "", price: "", image: "" });
                setVariantPreview("");
                setShowVariantForm(false);
                setIsEditingVariant(false);
              }}
            >
              {isEditingVariant ? "Update Variant" : "Add Variant"}
            </button>
          </Modal>
        )}
      </div>
      )}

      {/* USERS */}
      {tab==="users" &&
        filter(users,"name").map(u=>(
          <div key={u._id} style={card}>
            <p>{u.name}</p>
            <p>{u.email}</p>
          </div>
        ))
      }
    </div>
  );
}

function Modal({ children, close }) {
  return (
    <div style={{
      position:"fixed", top:0,left:0,width:"100%",height:"100%",
      background:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center"
    }}>
      <div style={{ background:"#fff", padding:20 }}>
        <button onClick={close}>X</button>
        {children}
      </div>
    </div>
  );
}

export default Admin;