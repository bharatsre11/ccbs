import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const skeletonStyle = {
  background: "linear-gradient(90deg, #eee, #ddd, #eee)",
  backgroundSize: "200% 100%",
  animation: "shine 1.5s infinite"
  };
  const navigate = useNavigate();

  // 🔥 Fetch products
  useEffect(() => {
    axios.get("https://ccbs.onrender.com/api/products")
    .then(res => {
      setProducts(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.log(err);
      setLoading(false);
    });
  }, []);

  // 🔥 Fetch categories
  useEffect(() => {
    axios
      .get("https://ccbs.onrender.com/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (loading) {
  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Loading products...
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
        }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              padding: "10px",
            }}
          >
            {/* IMAGE SKELETON */}
            <div
              style={{
                height: "200px",
                borderRadius: "10px",
                ...skeletonStyle,
              }}
            />

            {/* TEXT SKELETON */}
            <div style={{ marginTop: "10px" }}>
              <div
                style={{
                  height: "15px",
                  width: "70%",
                  marginBottom: "8px",
                  borderRadius: "5px",
                  ...skeletonStyle,
                }}
              />

              <div
                style={{
                  height: "15px",
                  width: "40%",
                  borderRadius: "5px",
                  ...skeletonStyle,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
   );
  }

  // 🔥 FIXED FILTER (IMPORTANT)
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category?._id === selectedCategory)
    : products;

  return (
    <div
      style={{
        padding: "30px",
        background: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
    <style>
      {`
      @keyframes shine {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
      }
    `}
    </style>
      {/* 🔹 TITLE */}
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "32px",
          fontWeight: "600",
        }}
      >
        CCBS Art Store 🎨
      </h1>

      {/* 🔥 CATEGORIES */}
      <h2 style={{ marginBottom: "15px" }}>Shop by Category</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        {/* ALL */}
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            background: selectedCategory === null ? "#ff4d6d" : "#ddd",
            color: selectedCategory === null ? "white" : "black",
          }}
        >
          ALL
        </button>

        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => setSelectedCategory(c._id)}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              background:
                selectedCategory === c._id ? "#ff4d6d" : "#ddd",
              color:
                selectedCategory === c._id ? "white" : "black",
            }}
          >
            {c.name}
          </button>
        ))}
      </div>
      
      {/* 🔥 PRODUCTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
        }}
      >
        {filteredProducts.length === 0 ? (
          <h3>No products found 😕</h3>
        ) : (
          filteredProducts.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)}
              style={{
                background: "white",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={p.image}
                alt={p.name}
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/300")
                }
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "15px" }}>
                <h3 style={{ marginBottom: "8px", fontSize: "18px" }}>
                  {p.name}
                </h3>

                <p
                  style={{
                    fontWeight: "bold",
                    color: "#ff4d6d",
                    fontSize: "16px",
                  }}
                >
                  ₹{p.price}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;