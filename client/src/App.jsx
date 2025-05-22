import Home from "./pages/Home/Home";
import "./index.css";
import ContactUs from "./pages/ContactUs/ContactUs";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/SignUp";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<ContactUs />} />
      <Route path="/profile" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
