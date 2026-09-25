import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =========================
  // LOAD CART FROM DATABASE
  // =========================

  const loadCart = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
  "http://13.53.176.17:5051/api/cart",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Cart API error:", data);

        alert(
          data.message ||
            "Failed to load cart"
        );

        return;
      }

      setCart(data);
    } catch (error) {
      console.error(
        "Cart loading error:",
        error
      );

      alert(
        "Failed to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD CART ON PAGE LOAD
  // =========================

  useEffect(() => {
    loadCart();
  }, []);

  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = async (
    cartItemId,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      const response = await fetch(
  `http://13.53.176.17:5051/api/cart/${cartItemId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            quantity: newQuantity,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Quantity update response:",
        data
      );

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update quantity"
        );

        return;
      }

      // Reload from PostgreSQL
      await loadCart();

    } catch (error) {
      console.error(
        "Quantity update error:",
        error
      );

      alert(
        "Failed to update quantity"
      );
    }
  };

  // =========================
  // REMOVE ITEM
  // =========================

  const removeFromCart = async (
    cartItemId
  ) => {
    try {
      const response = await fetch(
  `http://13.53.176.17:5051/api/cart/${cartItemId}`,
        {
          method: "DELETE",

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
            "Failed to remove item"
        );

        return;
      }

      await loadCart();

    } catch (error) {
      console.error(
        "Remove cart error:",
        error
      );

      alert(
        "Failed to remove item"
      );
    }
  };

  // =========================
  // PROCEED TO CHECKOUT
  // =========================

  const handleCheckout = () => {
    if (!token) {
      alert("Please login first.");

      navigate("/login");

      return;
    }

    if (cart.length === 0) {
      alert(
        "Your cart is empty."
      );

      return;
    }

    navigate("/checkout");
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
          🛒 Your Cart
        </h1>

        <p>
          Please login to view
          your cart.
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
  // LOADING
  // =========================

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
        }}
      >
        <h1>
          Loading cart...
        </h1>
      </div>
    );
  }

  // =========================
  // CALCULATE TOTAL
  // =========================

  const total = cart.reduce(
    (sum, item) => {
      return (
        sum +
        Number(item.price) *
          Number(item.quantity)
      );
    },
    0
  );

  // =========================
  // CART UI
  // =========================

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >

      <h1>
        🛒 Your Cart
      </h1>

      {/* ========================= */}
      {/* EMPTY CART */}
      {/* ========================= */}

      {cart.length === 0 ? (
        <div
          style={{
            padding: "30px",
            textAlign: "center",
          }}
        >
          <h2>
            Your cart is empty
          </h2>

          <p>
            Add some delicious
            makhana!
          </p>

          <button
            onClick={() =>
              navigate("/products")
            }
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>

          {/* ========================= */}
          {/* CART ITEMS */}
          {/* ========================= */}

          {cart.map((item) => (

            <div
              key={item.id}
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: "center",

                padding: "20px",

                marginBottom: "15px",

                border:
                  "1px solid #ddd",

                borderRadius: "10px",

                background: "#fff",
              }}
            >

              {/* PRODUCT INFORMATION */}

              <div>

                <h3>
                  {item.name}
                </h3>

                <p>
                  ₹{item.price}
                  {" "}per item
                </p>

                <p>
                  Weight:{" "}
                  {item.weight}
                </p>

                {/* ========================= */}
                {/* QUANTITY CONTROLS */}
                {/* ========================= */}

                <div
                  style={{
                    display: "flex",

                    alignItems:
                      "center",

                    gap: "12px",

                    marginTop:
                      "15px",
                  }}
                >

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        Number(
                          item.quantity
                        ) - 1
                      )
                    }

                    disabled={
                      Number(
                        item.quantity
                      ) <= 1
                    }

                    style={{
                      width: "35px",
                      height: "35px",

                      cursor:
                        Number(
                          item.quantity
                        ) <= 1
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    −
                  </button>

                  <strong
                    style={{
                      fontSize:
                        "18px",

                      minWidth:
                        "25px",

                      textAlign:
                        "center",
                    }}
                  >
                    {item.quantity}
                  </strong>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        Number(
                          item.quantity
                        ) + 1
                      )
                    }

                    style={{
                      width: "35px",
                      height: "35px",
                    }}
                  >
                    +
                  </button>

                </div>

              </div>

              {/* PRICE + REMOVE */}

              <div
                style={{
                  textAlign:
                    "right",
                }}
              >

                <strong
                  style={{
                    fontSize:
                      "20px",
                  }}
                >
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

                <br />

                <button
                  onClick={() =>
                    removeFromCart(
                      item.id
                    )
                  }

                  style={{
                    marginTop:
                      "12px",
                  }}
                >
                  🗑️ Remove
                </button>

              </div>

            </div>

          ))}

          {/* ========================= */}
          {/* ORDER SUMMARY */}
          {/* ========================= */}

          <div
            style={{
              marginTop: "30px",

              padding: "25px",

              borderTop:
                "2px solid #ddd",

              textAlign:
                "right",
            }}
          >

            <h2>
              Total: ₹
              {total.toFixed(2)}
            </h2>

            <button
              onClick={
                handleCheckout
              }

              style={{
                padding:
                  "12px 25px",

                fontSize:
                  "16px",

                cursor:
                  "pointer",
              }}
            >
              Proceed to Checkout
            </button>

          </div>

        </>
      )}

    </div>
  );
}

export default Cart;