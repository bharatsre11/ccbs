import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Reusable button style
  const buttonStyle = {
    padding: "6px 12px",
    marginRight: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px"
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        background: "linear-gradient(90deg, #000, #333)",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      {/* LOGO */}
      <h2
        style={{
          cursor: "pointer",
          fontWeight: "600",
          letterSpacing: "1px"
        }}
        onClick={() => navigate("/")}
      >
        CCBS 🎨
      </h2>

      {/* RIGHT SIDE */}
      <div>
        {user ? (
          <>
            {/* 🔥 ROLE BASED BUTTON */}
            {user.role === "admin" ? (
              <button
                onClick={() => navigate("/admin")}
                style={{
                  ...buttonStyle,
                  background: "#4caf50",
                  color: "white"
                }}
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate("/my-orders")}
                style={buttonStyle}
              >
                My Orders
              </button>
            )}

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              style={{
                ...buttonStyle,
                background: "#ff4d6d",
                color: "white"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              style={buttonStyle}
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              style={{
                ...buttonStyle,
                background: "#ff4d6d",
                color: "white"
              }}
            >
              Signup
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;