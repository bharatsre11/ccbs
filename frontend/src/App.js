import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ProductPage from "./ProductPage";
import Login from "./Login";
import Signup from "./Signup";
import MyOrders from "./MyOrders";
import Navbar from "./Navbar";
import Admin from "./Admin";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
    
  );
}

export default App;