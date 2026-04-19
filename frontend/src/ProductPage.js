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

  // 🔥 Fetch product
  useEffect(() => {
    axios.get(`https://ccbs.onrender.com/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.log(err));
  }, [id]);

  // 🔥 Fetch variants
  useEffect(() => {
    axios
      .get(`https://ccbs.onrender.com/api/variants/${id}`)
      .then((res) => setVariants(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handleChange = (label, value) => {
    setFormData(prev => ({
      ...prev,
      [label]: value
    }));
  };

  const handleOrder = async () => {
    try {
      if (!user) {
        alert("Please login first ❗");
        return;
      }

      if (!selectedVariant) {
        alert("Please select a design ❗");
        return;
      }

      if (!address) {
        alert("Please enter delivery address ❗");
        return;
      }

      const orderData = {
        userId: user._id,
        productId: product._id,
        variantId: selectedVariant._id, // 🔥 NEW
        quantity: 1,
        price: selectedVariant.price,   // 🔥 use variant price
        customData: Object.keys(formData).map(key => ({
          label: key,
          value: formData[key]
        })),
        address: address
      };

      const res = await axios.post(
        "https://ccbs.onrender.com/api/orders/place",
        orderData
      );

      alert("Order placed successfully 🎉");
      console.log(res.data);

    } catch (err) {
      console.log(err);
      alert("Error placing order");
    }
  };

  if (!product) return <h2>Loading...</h2>;

  return (
    <div style={{
      padding: "30px",
      maxWidth: "700px",
      margin: "auto"
    }}>
      <h1>{product.name}</h1>

      <img
        src={product.image}
        alt={product.name}
        width="300"
        style={{ borderRadius: "10px" }}
      />

      <h2>
        ₹{selectedVariant ? selectedVariant.price : product.price}
      </h2>

      {/* 🔥 VARIANTS (DESIGNS) */}
      <div style={{ marginTop: "20px" }}>
        <h3>Select Design</h3>

        <div style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap"
        }}>
          {variants.map((v) => (
            <div
              key={v._id}
              onClick={() => setSelectedVariant(v)}
              style={{
                border: selectedVariant?._id === v._id
                  ? "2px solid #ff4d6d"
                  : "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                width: "140px"
              }}
            >
              <img
                src={v.image}
                alt={v.name}
                width="100%"
                style={{ borderRadius: "6px" }}
              />
              <p>{v.name}</p>
              <p>₹{v.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOMIZATION */}
      {product.isCustomizable && (
        <div style={{ marginTop: "20px" }}>
          <h3>Customize your product</h3>

          {product.customFields.map((field, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <label>{field.label}</label><br />

              <input
                type="text"
                placeholder={`Enter ${field.label}`}
                onChange={(e) =>
                  handleChange(field.label, e.target.value)
                }
                style={{ padding: "5px", width: "250px" }}
              />
            </div>
          ))}
        </div>
      )}

      {/* ADDRESS */}
      <div style={{ marginTop: "20px" }}>
        <label>Delivery Address</label><br />
        <input
          type="text"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
      </div>

      {/* ORDER BUTTON */}
      <button
        onClick={handleOrder}
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          background: "#ff4d6d",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Place Order
      </button>
    </div>
  );
}

export default ProductPage;