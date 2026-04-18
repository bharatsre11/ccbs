import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get("http://localhost:5000/api/orders")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => console.log(err));
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/status/${id}`,
        { status }
      );

      alert("Status updated");
      fetchOrders();
    } catch (err) {
      console.log(err);
      alert("Error updating status");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard 🛠️</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ccc",
            margin: "15px 0",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <h3>{order.productId?.name}</h3>
          <p>Price: ₹{order.productId?.price}</p>
          <p>User: {order.userId?.email}</p>
          <p>Address: {order.address}</p>

          <h4>Custom Details:</h4>
          {order.customData.map((item, i) => (
            <p key={i}>
              {item.label}: {item.value}
            </p>
          ))}

          <p>Status: {order.status || "Processing"}</p>

          <div style={{ marginTop: "10px" }}>
            <button onClick={() => updateStatus(order._id, "Processing")}>
              Processing
            </button>

            <button
              onClick={() => updateStatus(order._id, "Shipped")}
              style={{ marginLeft: "10px" }}
            >
              Shipped
            </button>

            <button
              onClick={() => updateStatus(order._id, "Delivered")}
              style={{ marginLeft: "10px" }}
            >
              Delivered
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Admin;