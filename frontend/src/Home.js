import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://ccbs.onrender.com/api/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        background: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
        }}
      >
        {products.map((p) => (
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
              <h3
                style={{
                  marginBottom: "8px",
                  fontSize: "18px",
                }}
              >
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
        ))}
      </div>
    </div>
  );
}

export default Home;