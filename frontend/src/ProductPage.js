import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [address, setAddress] = useState("");

  // Get logged in user
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => {
        const found = res.data.find(p => p._id === id);
        setProduct(found);
      })
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

      if (!address) {
        alert("Please enter delivery address ❗");
        return;
      }

      const orderData = {
        userId: user._id,
        productId: product._id,
        quantity: 1,
        customData: Object.keys(formData).map(key => ({
          label: key,
          value: formData[key]
        })),
        address: address
      };

      const res = await axios.post(
        "http://localhost:5000/api/orders/place",
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
        maxWidth: "600px",
        margin: "auto"
        }}>
      <h1>{product.name}</h1>

      <img
        src={product.image}
        alt={product.name}
        width="300"
        style={{ borderRadius: "10px" }}
      />

      <h2>₹{product.price}</h2>
      <p>{product.description}</p>

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