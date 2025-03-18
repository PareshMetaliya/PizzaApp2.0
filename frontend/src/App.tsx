import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/landingpage/LandingPage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Cart from "./components/Cart";
import Menu from "./components/Menu";
import PizzaDetails from "./components/PizzaDetails";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AdminDashboard from "./components/adminpage/AdminPage";
import UserProfile from "./components/UserProfile";
import OrderStatus from "./components/OrderStatus";
import ProtectedRoute from "./components/adminpage/ProtectedRoute";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 750, // Animation duration (in ms)
      once: true, // Whether animation happens only once
    });
  }, []);
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/:path" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/menu/:id" element={<PizzaDetails />} />
          <Route path="/order-status/:orderId" element={<OrderStatus />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
