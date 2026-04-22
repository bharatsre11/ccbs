import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [formData, setFormData] = useState({});
  const [address, setAddress] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const WHATSAPP_NUMBER = "919045120279";
  // 🔥 Fetch product
  useEffect(() => {
    axios
      .get(`https://ccbs.onrender.com/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  // 🔥 Fetch variants
  useEffect(() => {
    axios
      .get(`https://ccbs.onrender.com/api/variants/${id}`)
      .then((res) => setVariants(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (label, value) => {
    setFormData((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const handleOrder = async () => {
    try {
      if (!user) return alert("Please login first ❗");
      if (!selectedVariant) return alert("Please select a design ❗");
      if (!address) return alert("Please enter delivery address ❗");

      await axios.post(
        "https://ccbs.onrender.com/api/orders/place",
        {
          userId: user._id,
          productId: product._id,
          variantId: selectedVariant._id,
          quantity: 1,
          price: selectedVariant.price,
          customData: Object.keys(formData).map((key) => ({
            label: key,
            value: formData[key],
          })),
          address,
        }
      );

      const WHATSAPP_NUMBER = "919045869279"; // 👈 your number

      const message = `
      🛍️ New Order Received!

      👤 Customer: ${user.name}
      📦 Product: ${product.name}
      🎨 Design: ${selectedVariant.name}
      💰 Price: ₹${selectedVariant.price}

      ${Object.keys(formData).length > 0 ? "📝 Custom Details:\n" +
      Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join("\n") : ""}

      📍 Address: ${address}
      `;

      const encodedMessage = encodeURIComponent(message);

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`,
        "_blank"
      );

      alert("Order placed successfully 🎉");

    } catch (err) {
      console.log(err);
      alert("Error placing order");
    }
  };

  if (!product)
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  const handleWhatsAppOrder = () => {
    if (!selectedVariant) {
      alert("Please select a design ❗");
      return;
    }

    const message = `
  🛍️ New Order Request

  Product: ${product.name}
  Design: ${selectedVariant.name}
  Price: ₹${selectedVariant.price}

  ${Object.keys(formData).length > 0 ? "Custom Details:\n" +
  Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join("\n") : ""}

   Address: ${address || "Will share on chat"}
    `;

    const encodedMessage = encodeURIComponent(message);

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`,
      "_blank"
    );
  };
  return (
    <div style={{ background: "#f6f6f6", minHeight: "100vh", padding: "30px" }}>
      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {/* 🔥 LEFT - IMAGE */}
        <div style={{ flex: 1 }}>
          <img
            src={selectedVariant?.image || product.image}
            alt=""
            style={{
              width: "100%",
              borderRadius: "12px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            }}
          />
        </div>

        {/* 🔥 RIGHT - DETAILS */}
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: "10px" }}>{product.name}</h1>

          <h2 style={{ color: "#ff4d6d", marginBottom: "10px" }}>
            ₹{selectedVariant ? selectedVariant.price : product.price}
          </h2>

          <p style={{ color: "#555", marginBottom: "20px" }}>
            {product.description}
          </p>

          {/* 🔥 DESIGN SELECTION */}
          <h3>Select Design</h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            {variants.map((v) => (
              <img
                key={v._id}
                src={v.image}
                alt=""
                onClick={() => setSelectedVariant(v)}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border:
                    selectedVariant?._id === v._id
                      ? "3px solid #ff4d6d"
                      : "2px solid #ddd",
                }}
              />
            ))}
          </div>

          {/* 🔥 CUSTOMIZATION */}
          {product.isCustomizable && (
            <div style={{ marginBottom: "20px" }}>
              <h3>Customize</h3>

              {product.customFields.map((field, i) => (
                <input
                  key={i}
                  placeholder={field.label}
                  onChange={(e) =>
                    handleChange(field.label, e.target.value)
                  }
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              ))}
            </div>
          )}

          {/* 🔥 ADDRESS */}
          <input
            placeholder="Enter delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginBottom: "15px",
            }}
          />

          <button
            onClick={handleWhatsAppOrder}
            style={{
              width: "100%",
              padding: "15px",
              background: "#25D366",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              marginTop: "10px",
              fontWeight: "bold",
            }}
          >
            Order on WhatsApp 💬
          </button>

          {/* 🔥 CTA */}
          <button
            onClick={handleOrder}
            style={{
              width: "100%",
              padding: "15px",
              background: "#ff4d6d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Place Order 🚀
          </button>

          {/* 🔥 TRUST SIGNALS */}
          <div style={{ marginTop: "15px", fontSize: "13px", color: "#666" }}>
            ✔ Handmade with love <br />
            ✔ 100% Customizable <br />
            ✔ Delivery in 5-7 days <br />
            ✔ Secure & trusted orders ❤️
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;