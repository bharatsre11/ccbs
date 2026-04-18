import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://ccbs.onrender.com/api/auth/login", data);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful 🎉");
      navigate("/");
    } catch (err) {
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;