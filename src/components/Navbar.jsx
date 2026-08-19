import { Link, useNavigate } from "react-router-dom";

function Navbar({ cart }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const userData =
    localStorage.getItem("user");

  const user = userData
    ? JSON.parse(userData)
    : null;

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");

    window.location.reload();
  };

  // =========================
  // NAVBAR
  // =========================

  return (
    <nav className="navbar">

      {/* ========================= */}
      {/* LOGO */}
      {/* ========================= */}

      <Link
        to="/"
        className="logo"
      >
        MakhanaMart
      </Link>

      {/* ========================= */}
      {/* MAIN NAVIGATION */}
      {/* ========================= */}

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/products">
          Products
        </Link>

        <a href="#about">
          About
        </a>

        <a href="#contact">
          Contact
        </a>

      </div>

      {/* ========================= */}
      {/* USER ACTIONS */}
      {/* ========================= */}

      <div className="nav-actions">

        {token ? (
          <>

            {/* USER NAME */}

            <span className="welcome">
              Hi, {user?.name}
            </span>

            {/* MY ORDERS */}

            <Link
              to="/my-orders"
              className="orders-button"
            >
              📦 My Orders
            </Link>

            {/* ADMIN DASHBOARD */}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="admin-button"
              >
                ⚙️ Admin
              </Link>
            )}

            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>

          </>
        ) : (
          <>

            {/* LOGIN */}

            <Link
              to="/login"
              className="login-button"
            >
              Login
            </Link>

            {/* SIGN UP */}

            <Link
              to="/signup"
              className="signup-button"
            >
              Sign Up
            </Link>

          </>
        )}

        {/* ========================= */}
        {/* CART */}
        {/* ========================= */}

        <Link
          to="/cart"
          className="cart-button"
        >
          🛒 Cart ({cart.length})
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;