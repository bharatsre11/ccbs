    import { useEffect, useState } from "react";
    import axios from "axios";

    function MyOrders() {
    const [orders, setOrders] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) return;

        axios
        .get(`http://ccbs.onrender.com/api/orders/user/${user._id}`)
        .then((res) => {
            console.log("Orders:", res.data); // ✅ Debug log
            setOrders(res.data);
        })
        .catch((err) => console.log(err));
    }, [user]);

    if (!user) return <h2>Please login to see your orders</h2>;

    return (
    <div style={{ padding: "20px", background: "#f8f9fa", minHeight: "100vh" }}>
        <h1 style={{ marginBottom: "20px" }}>My Orders 📦</h1>

        {orders.length === 0 ? (
        <p>No orders yet</p>
        ) : (
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px"
        }}>
            {orders.map((order, index) => (
            <div
                key={index}
                style={{
                background: "white",
                borderRadius: "12px",
                padding: "15px",
                width: "280px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                }}
            >
                <img
                src={order.productId?.image}
                alt=""
                style={{
                    width: "100%",
                    borderRadius: "10px",
                    marginBottom: "10px"
                }}
                />

                <h3>{order.productId?.name}</h3>
                <p style={{ fontWeight: "bold" }}>
                ₹{order.productId?.price}
                </p>

                <p style={{ fontSize: "12px", color: "#555" }}>
                📍 {order.address}
                </p>

                <div style={{ marginTop: "10px" }}>
                <strong>Custom Details:</strong>
                {order.customData.map((item, i) => (
                    <p key={i} style={{ fontSize: "13px" }}>
                    {item.label}: {item.value}
                    </p>
                ))}
                </div>

                <div style={{
                marginTop: "10px",
                padding: "5px 10px",
                background: "#ffe0e6",
                borderRadius: "6px",
                display: "inline-block",
                fontSize: "12px"
                }}>
                Status: {order.status || "Processing"}
                </div>
            </div>
            ))}
        </div>
        )}
    </div>
    );
}

export default MyOrders;