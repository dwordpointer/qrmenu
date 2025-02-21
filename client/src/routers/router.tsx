import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import Category from "../pages/Category";
import Product from "../pages/Product";

const NotFound: React.FC = () => (
  <div className="h-screen flex justify-center items-center text-white bg-black">
    Sayfa bulunamadı.
  </div>
);

const App: React.FC = () => {
  return (
    <div style={{backgroundColor:"#1d1d1d"}}>
      <Router>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/category/:catid" element={<Category />} />
          <Route path="/product/:catid/:prodid" element={<Product />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
