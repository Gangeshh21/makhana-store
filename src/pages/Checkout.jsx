import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ cart, setCart }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // CALCULATE TOTAL
  // =========================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      navigate("/products");
      return;
    }

    // Currently only COD is processed.
    // Online payment will be integrated later.
    if (paymentMethod === "online") {
      alert(
        "Online payment is not available yet. Please select Cash on Delivery."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "${import.meta.env.VITE_API_URL}/api/orders",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to place order"
        );

        return;
      }

      // Clear React cart
      setCart([]);

      // Go to Order Success page
      navigate("/order-success", {
        state: {
          order: data.order,
          delivery: form,
          paymentMethod:
            paymentMethod,
        },
      });

    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      alert(
        "Failed to connect to server."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!token) {
    return (
      <div
        style={{
          padding: "40px",
        }}
      >
        <h1>
          🧾 Checkout
        </h1>

        <p>
          Please login to continue.
        </p>

        <button
          onClick={() =>
            navigate("/login")
          }
        >
          Login
        </button>
      </div>
    );
  }

  // =========================
  // EMPTY CART
  // =========================

  if (cart.length === 0) {
    return (
      <div
        style={{
          padding: "40px",
        }}
      >
        <h1>
          🧾 Checkout
        </h1>

        <h2>
          Your cart is empty.
        </h2>

        <button
          onClick={() =>
            navigate("/products")
          }
        >
          Browse Products
        </button>
      </div>
    );
  }

  // =========================
  // CHECKOUT UI
  // =========================

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >

      <h1>
        🧾 Checkout
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "40px",
        }}
      >

        {/* ========================= */}
        {/* DELIVERY DETAILS */}
        {/* ========================= */}

        <div>

          <h2>
            📍 Delivery Details
          </h2>

          <form
            onSubmit={
              handlePlaceOrder
            }
            style={{
              display: "grid",
              gap: "15px",
            }}
          >

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={
                handleChange
              }
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={
                handleChange
              }
              required
            />

            <textarea
              name="address"
              placeholder="Full Address"
              value={form.address}
              onChange={
                handleChange
              }
              rows="4"
              required
            />

            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={
                handleChange
              }
              required
            />

            <input
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={
                handleChange
              }
              required
            />

            {/* ========================= */}
            {/* PAYMENT */}
            {/* ========================= */}

            <h2>
              💳 Payment Method
            </h2>

            <label>
              <input
                type="radio"
                value="cod"
                checked={
                  paymentMethod ===
                  "cod"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              {" "}Cash on Delivery
            </label>

            <label>
              <input
                type="radio"
                value="online"
                checked={
                  paymentMethod ===
                  "online"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              {" "}Online Payment
            </label>

            {/* ========================= */}
            {/* PLACE ORDER */}
            {/* ========================= */}

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : paymentMethod ===
                  "cod"
                ? "Place Order"
                : "Pay & Place Order"}
            </button>

          </form>

        </div>

        {/* ========================= */}
        {/* ORDER SUMMARY */}
        {/* ========================= */}

        <div>

          <h2>
            🛒 Order Summary
          </h2>

          {cart.map(
            (item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",

                  justifyContent:
                    "space-between",

                  padding: "15px",

                  marginBottom:
                    "10px",

                  border:
                    "1px solid #ddd",

                  borderRadius:
                    "8px",
                }}
              >

                <div>

                  <strong>
                    {item.name}
                  </strong>

                  <p>
                    ₹{item.price} ×{" "}
                    {item.quantity}
                  </p>

                  <small>
                    Weight:{" "}
                    {item.weight}
                  </small>

                </div>

                <strong>
                  ₹
                  {(
                    Number(
                      item.price
                    ) *
                    Number(
                      item.quantity
                    )
                  ).toFixed(2)}
                </strong>

              </div>
            )
          )}

          {/* TOTAL */}

          <div
            style={{
              marginTop:
                "20px",

              paddingTop:
                "20px",

              borderTop:
                "2px solid #ddd",
            }}
          >

            <h2>
              Total: ₹
              {total.toFixed(2)}
            </h2>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;