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
  const [categoryPreview, setCategoryPreview] = useState("");
  const [variantPreview, setVariantPreview] = useState("");

  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showVariantForm, setShowVariantForm] = useState(false);

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingVariant, setIsEditingVariant] = useState(false);

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
    if (type === "category") {
      setNewCategory(c => ({ ...c, image: res.data.url }));
      setCategoryPreview(res.data.url);
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
      {tab==="products" && <>
        <button onClick={()=>{setNewProduct({}); setShowProductForm(true);}}>+ Add</button>

        {filter(products,"name").map(p=>(
          <div key={p._id} style={card}>
            <p>{p.name}</p>
            <button onClick={()=>handleDelete("products",p._id)}>Delete</button>
            <button onClick={()=>{setNewProduct(p); setShowProductForm(true); setIsEditingProduct(true);}}>Edit</button>
          </div>
        ))}

        {showProductForm && (
          <Modal close={()=>setShowProductForm(false)}>
            <input value={newProduct.name||""} onChange={e=>setNewProduct({...newProduct,name:e.target.value})}/>
            <input value={newProduct.price||""} onChange={e=>setNewProduct({...newProduct,price:e.target.value})}/>
            <input type="file" onChange={e=>upload(e.target.files[0],"product")}/>
            {productPreview && (
              <img
                src={productPreview}
                alt={newProduct.name || "Variant preview"}
                alt="product image"
                width="80"
                style={{
                  marginTop: 10,
                  borderRadius: 8,
                  display: "block"
                }}
              />
            )}
            <button onClick={async ()=>{
              if(isEditingProduct){
                const res = await axios.put(`${BASE_URL}/api/products/${newProduct._id}`, newProduct);
                setProducts(products.map(p=>p._id===res.data._id?res.data:p));
              } else {
                const res = await axios.post(`${BASE_URL}/api/products`, newProduct);
                setProducts([...products,res.data]);
              }
              setShowProductForm(false);
            }}>Save</button>
          </Modal>
        )}
      </>}

      {/* CATEGORIES */}
      {tab==="categories" && <>
        <button onClick={()=>{setNewCategory({}); setShowCategoryForm(true);}}>+ Add</button>

        {filter(categories,"name").map(c=>(
          <div key={c._id} style={card}>
            <p>{c.name}</p>
            <button onClick={()=>handleDelete("categories",c._id)}>Delete</button>
            <button onClick={()=>{setNewCategory(c); setShowCategoryForm(true); setIsEditingCategory(true);}}>Edit</button>
          </div>
        ))}

        {showCategoryForm && (
          <Modal close={()=>setShowCategoryForm(false)}>
            <input value={newCategory.name||""} onChange={e=>setNewCategory({...newCategory,name:e.target.value})}/>
            <input type="file" onChange={e=>upload(e.target.files[0],"category")}/>
            {categoryPreview && (
              <img
                src={categoryPreview}
                alt={newCategory.name || "Category preview"}
                width="80"
                style={{
                  marginTop: 10,
                  borderRadius: 8,
                  display: "block"
                }}
              />
            )}
            <button onClick={async ()=>{
              if(isEditingCategory){
                const res = await axios.put(`${BASE_URL}/api/categories/${newCategory._id}`, newCategory);
                setCategories(categories.map(c=>c._id===res.data._id?res.data:c));
              } else {
                const res = await axios.post(`${BASE_URL}/api/categories`, newCategory);
                setCategories([...categories,res.data]);
              }
              setShowCategoryForm(false);
            }}>Save</button>
          </Modal>
        )}
      </>}

      {/* VARIANTS */}
      {tab==="variants" && <>
        <button onClick={()=>{setNewVariant({}); setShowVariantForm(true);}}>+ Add</button>

        {filter(variants,"name").map(v=>(
          <div key={v._id} style={card}>
            <p>{v.name}</p>
            <button onClick={()=>handleDelete("variants",v._id)}>Delete</button>
            <button onClick={()=>{setNewVariant(v); setShowVariantForm(true); setIsEditingVariant(true);}}>Edit</button>
          </div>
        ))}

        {showVariantForm && (
          <Modal close={()=>setShowVariantForm(false)}>
            <input value={newVariant.name||""} onChange={e=>setNewVariant({...newVariant,name:e.target.value})}/>
            <input value={newVariant.price||""} onChange={e=>setNewVariant({...newVariant,price:e.target.value})}/>
            <input type="file" onChange={e=>upload(e.target.files[0],"variant")}/>
            {variantPreview && (
              <img
                src={variantPreview}
                alt={newVariant.name || "Variant preview"}
                width="80"
                style={{
                  marginTop: 10,
                  borderRadius: 8,
                  display: "block"
                }}
              />
            )}
            <button onClick={async ()=>{
              if(isEditingVariant){
                const res = await axios.put(`${BASE_URL}/api/variants/${newVariant._id}`, newVariant);
                setVariants(variants.map(v=>v._id===res.data._id?res.data:v));
              } else {
                const res = await axios.post(`${BASE_URL}/api/variants`, newVariant);
                setVariants([...variants,res.data]);
              }
              setShowVariantForm(false);
            }}>Save</button>
          </Modal>
        )}
      </>}

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