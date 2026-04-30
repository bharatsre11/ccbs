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

  // 🔥 Modal States
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showVariantForm, setShowVariantForm] = useState(false);

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingVariant, setIsEditingVariant] = useState(false);

  // 🔥 FETCH
  useEffect(() => {
    axios.get(`${BASE_URL}/api/categories`).then((res) => setCategories(res.data));
    axios.get(`${BASE_URL}/api/products`).then((res) => setProducts(res.data));
    axios.get(`${BASE_URL}/api/variants`).then((res) => setVariants(res.data));

    if (tab === "orders") axios.get(`${BASE_URL}/api/orders`).then((res) => setOrders(res.data));
    if (tab === "users") axios.get(`${BASE_URL}/api/users`).then((res) => setUsers(res.data));
  }, [tab]);

  // 🔥 UPLOAD
  const handleImageUpload = async (file, type) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (type === "product") {
      setNewProduct(p => ({ ...p, image: res.data.url }));
      setProductPreview(res.data.url);
    }
    if (type === "category") {
      setNewCategory(c => ({ ...c, image: res.data.url }));
      setCategoryPreview(res.data.url);
    }
    if (type === "variant") {
      setNewVariant(v => ({ ...v, image: res.data.url }));
      setVariantPreview(res.data.url);
    }
  };

  // 🔥 DELETE
  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete?")) return;

    await axios.delete(`${BASE_URL}/api/${type}/${id}`);

    if (type === "products") setProducts(products.filter(p => p._id !== id));
    if (type === "categories") setCategories(categories.filter(c => c._id !== id));
    if (type === "variants") setVariants(variants.filter(v => v._id !== id));
  };

  const card = { background: "#fff", padding: 15, borderRadius: 12, marginBottom: 10 };

  return (
    <div style={{ padding: 30, background: "#f5f6fa" }}>
      <h1>Admin Dashboard 🚀</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {["orders", "products", "users", "categories", "variants"].map(t => (
          <button key={t} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* PRODUCTS */}
      {tab === "products" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Products</h2>
            <button onClick={() => {
              setNewProduct({ name: "", price: "", image: "", category: "" });
              setProductPreview("");
              setIsEditingProduct(false);
              setShowProductForm(true);
            }}>+ Add</button>
          </div>

          {products.map(p => (
            <div key={p._id} style={card}>
              <p>{p.name} - ₹{p.price}</p>
              <img src={p.image} width="60" />
              <br />
              <button onClick={() => handleDelete("products", p._id)}>Delete</button>
              <button onClick={() => {
                setNewProduct(p);
                setProductPreview(p.image);
                setIsEditingProduct(true);
                setShowProductForm(true);
              }}>Edit</button>
            </div>
          ))}

          {showProductForm && (
            <Modal onClose={() => setShowProductForm(false)}>
              <h3>{isEditingProduct ? "Edit" : "Add"} Product</h3>
              <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}/>
              <input placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}/>
              <input type="file" onChange={e => handleImageUpload(e.target.files[0], "product")} />
              {productPreview && <img src={productPreview} width="80"/>}
              <select onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                <option>Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <button onClick={async () => {
                if (isEditingProduct) {
                  const res = await axios.put(`${BASE_URL}/api/products/${newProduct._id}`, newProduct);
                  setProducts(products.map(p => p._id === res.data._id ? res.data : p));
                } else {
                  const res = await axios.post(`${BASE_URL}/api/products`, newProduct);
                  setProducts([...products, res.data]);
                }
                setShowProductForm(false);
              }}>Save</button>
            </Modal>
          )}
        </>
      )}

      {/* CATEGORIES */}
      {tab === "categories" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Categories</h2>
            <button onClick={() => {
              setNewCategory({ name: "", image: "" });
              setCategoryPreview("");
              setIsEditingCategory(false);
              setShowCategoryForm(true);
            }}>+ Add</button>
          </div>

          {categories.map(c => (
            <div key={c._id} style={card}>
              <p>{c.name}</p>
              <img src={c.image} width="60"/>
              <br />
              <button onClick={() => handleDelete("categories", c._id)}>Delete</button>
              <button onClick={() => {
                setNewCategory(c);
                setCategoryPreview(c.image);
                setIsEditingCategory(true);
                setShowCategoryForm(true);
              }}>Edit</button>
            </div>
          ))}

          {showCategoryForm && (
            <Modal onClose={() => setShowCategoryForm(false)}>
              <h3>{isEditingCategory ? "Edit" : "Add"} Category</h3>
              <input value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})}/>
              <input type="file" onChange={e => handleImageUpload(e.target.files[0], "category")} />
              {categoryPreview && <img src={categoryPreview} width="80"/>}
              <button onClick={async () => {
                if (isEditingCategory) {
                  const res = await axios.put(`${BASE_URL}/api/categories/${newCategory._id}`, newCategory);
                  setCategories(categories.map(c => c._id === res.data._id ? res.data : c));
                } else {
                  const res = await axios.post(`${BASE_URL}/api/categories`, newCategory);
                  setCategories([...categories, res.data]);
                }
                setShowCategoryForm(false);
              }}>Save</button>
            </Modal>
          )}
        </>
      )}

      {/* VARIANTS */}
      {tab === "variants" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Variants</h2>
            <button onClick={() => {
              setNewVariant({ productId: "", name: "", image: "", price: "" });
              setVariantPreview("");
              setIsEditingVariant(false);
              setShowVariantForm(true);
            }}>+ Add</button>
          </div>

          {variants.map(v => (
            <div key={v._id} style={card}>
              <p>{v.name} - ₹{v.price}</p>
              <img src={v.image} width="60"/>
              <br />
              <button onClick={() => handleDelete("variants", v._id)}>Delete</button>
              <button onClick={() => {
                setNewVariant(v);
                setVariantPreview(v.image);
                setIsEditingVariant(true);
                setShowVariantForm(true);
              }}>Edit</button>
            </div>
          ))}

          {showVariantForm && (
            <Modal onClose={() => setShowVariantForm(false)}>
              <h3>{isEditingVariant ? "Edit" : "Add"} Variant</h3>
              <select onChange={e => setNewVariant({...newVariant, productId: e.target.value})}>
                <option>Select Product</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
              <input value={newVariant.name} onChange={e => setNewVariant({...newVariant, name: e.target.value})}/>
              <input value={newVariant.price} onChange={e => setNewVariant({...newVariant, price: e.target.value})}/>
              <input type="file" onChange={e => handleImageUpload(e.target.files[0], "variant")} />
              {variantPreview && <img src={variantPreview} width="80"/>}
              <button onClick={async () => {
                if (isEditingVariant) {
                  const res = await axios.put(`${BASE_URL}/api/variants/${newVariant._id}`, newVariant);
                  setVariants(variants.map(v => v._id === res.data._id ? res.data : v));
                } else {
                  const res = await axios.post(`${BASE_URL}/api/variants`, newVariant);
                  setVariants([...variants, res.data]);
                }
                setShowVariantForm(false);
              }}>Save</button>
            </Modal>
          )}
        </>
      )}
    </div>
  );
}

// 🔥 Reusable Modal
function Modal({ children, onClose }) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.4)",
      display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
        <button onClick={onClose} style={{ float: "right" }}>X</button>
        {children}
      </div>
    </div>
  );
}

export default Admin;