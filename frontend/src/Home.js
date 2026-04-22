import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🔥 Skeleton animation style
  const skeletonStyle = {
    background: "linear-gradient(90deg, #eee, #ddd, #eee)",
    backgroundSize: "200% 100%",
    animation: "shine 1.5s infinite",
  };

  // 🔥 Fetch products
  useEffect(() => {
    axios
      .get("https://ccbs.onrender.com/api/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
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

  // 🔥 FILTER FIX
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category?._id === selectedCategory)
    : products;

  // 🔥 LOADING UI (SAFE)
  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <style>
          {`
            @keyframes shine {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
          `}
        </style>

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
              <div
                style={{
                  height: "200px",
                  borderRadius: "10px",
                  ...skeletonStyle,
                }}
              />

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

  // 🔥 MAIN UI
  return (
    <div style={{ background: "#f6f6f6", minHeight: "100vh" }}>
      {/* HERO */}
      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
          background: "linear-gradient(135deg, #000, #333)",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>
          Crafted Charms by Saloni ✨
        </h1>
        <p style={{ fontSize: "16px", opacity: 0.8 }}>
          Handmade memories, designed just for you
        </p>
      </div>

      <div style={{ padding: "30px" }}>
        {/* CATEGORIES */}
        <h2 style={{ marginBottom: "15px" }}>Shop by Category</h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: "8px 18px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: selectedCategory === null ? "#ff4d6d" : "white",
              color: selectedCategory === null ? "white" : "#333",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            All
          </button>

          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelectedCategory(c._id)}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                background:
                  selectedCategory === c._id ? "#ff4d6d" : "white",
                color:
                  selectedCategory === c._id ? "white" : "#333",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* PRODUCTS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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
                  borderRadius: "14px",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-6px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
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
                    height: "220px",
                    objectFit: "cover",
                  }}
                />

                <div style={{ padding: "15px" }}>
                  <h3 style={{ marginBottom: "6px", fontSize: "18px" }}>
                    {p.name}
                  </h3>

                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#ff4d6d",
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
    </div>
  );
}

export default Home;