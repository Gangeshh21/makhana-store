import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import MyOrders from "./pages/MyOrders";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

function App() {
  const [cart, setCart] = useState([]);

  return (
    <BrowserRouter>
      <Navbar cart={cart} />

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={<Home setCart={setCart} />}
        />

        {/* Products */}
        <Route
          path="/products"
          element={<Products setCart={setCart} />}
        />

        {/* Product Details */}
        <Route
          path="/products/:id"
          element={<ProductDetails setCart={setCart} />}
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
            />
          }
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
  path="/my-orders"
  element={<MyOrders />}
/>

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
        <Route
  path="/checkout"
  element={
    <Checkout
      cart={cart}
      setCart={setCart}
    />
  }
/>
<Route
  path="/checkout"
  element={
    <Checkout
      cart={cart}
      setCart={setCart}
    />
  }
/>

<Route
  path="/order-success"
  element={<OrderSuccess />}
/>

<Route
  path="/my-orders"
  element={<MyOrders />}
/>
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;