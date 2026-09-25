import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyOrders() {
  const token =
    localStorage.getItem("token");

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [orderItems, setOrderItems] =
    useState([]);

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  const loadOrders = async () => {
    try {
      const response =
        await fetch(
          "${import.meta.env.VITE_API_URL}/api/orders/my-orders",
          {
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
            "Failed to load orders"
        );
        return;
      }

      setOrders(data);

    } catch (error) {
      console.error(
        "Orders error:",
        error
      );

      alert(
        "Failed to connect to server"
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ORDER DETAILS
  // =====================================================

  const viewOrder = async (
    orderId
  ) => {
    try {
      const response =
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/my-orders/${orderId}`,
          {
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
            "Failed to load order"
        );
        return;
      }

      setSelectedOrder(
        data.order
      );

      setOrderItems(
        data.items
      );

    } catch (error) {
      console.error(
        "Order details error:",
        error
      );

      alert(
        "Failed to load order details"
      );
    }
  };

  useEffect(() => {
    if (token) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!token) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h1>
          📦 My Orders
        </h1>

        <p>
          Please login to view
          your orders.
        </p>

        <Link to="/login">
          <button>
            Login
          </button>
        </Link>
      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
        }}
      >
        <h1>
          Loading orders...
        </h1>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >

      <h1>
        📦 My Orders
      </h1>

      {/* ================================================= */}
      {/* NO ORDERS */}
      {/* ================================================= */}

      {orders.length === 0 ? (
        <div
          style={{
            padding: "30px",
            textAlign: "center",
          }}
        >
          <h2>
            No orders yet
          </h2>

          <p>
            Start shopping for
            delicious makhana!
          </p>

          <Link to="/products">
            <button>
              Browse Products
            </button>
          </Link>
        </div>
      ) : (
        <div>

          {/* ================================================= */}
          {/* ORDER LIST */}
          {/* ================================================= */}

          {orders.map(
            (order) => (
              <div
                key={
                  order.id
                }
                style={{
                  padding: "20px",
                  marginBottom:
                    "15px",

                  border:
                    "1px solid #ddd",

                  borderRadius:
                    "10px",

                  background:
                    "#fff",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",
                  }}
                >

                  <div>

                    <h3>
                      Order #
                      {
                        order.id
                      }
                    </h3>

                    <p>
                      Date:{" "}
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </p>

                    <p>
                      Total: ₹
                      {
                        Number(
                          order.total_amount
                        ).toFixed(2)
                      }
                    </p>

                  </div>

                  <div>

                    <strong>
                      Status:{" "}
                    </strong>

                    <span>
                      {order.status}
                    </span>

                    <br />

                    <button
                      onClick={() =>
                        viewOrder(
                          order.id
                        )
                      }
                      style={{
                        marginTop:
                          "10px",
                      }}
                    >
                      View Details
                    </button>

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

      {/* ================================================= */}
      {/* ORDER DETAILS */}
      {/* ================================================= */}

      {selectedOrder && (
        <div
          style={{
            marginTop: "40px",

            padding: "25px",

            border:
              "2px solid #ddd",

            borderRadius:
              "10px",

            background:
              "#fafafa",
          }}
        >

          <h2>
            🧾 Order #
            {
              selectedOrder.id
            }
          </h2>

          <p>
            Status:{" "}
            <strong>
              {
                selectedOrder.status
              }
            </strong>
          </p>

          <p>
            Date:{" "}
            {new Date(
              selectedOrder.created_at
            ).toLocaleString()}
          </p>

          <h3>
            Products
          </h3>

          {/* ITEMS */}

          {orderItems.map(
            (item) => (
              <div
                key={
                  item.id
                }
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  padding:
                    "15px",

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
                    {
                      item.name
                    }
                  </strong>

                  <p>
                    Weight:{" "}
                    {
                      item.weight
                    }
                  </p>

                  <p>
                    ₹
                    {
                      item.price
                    } ×{" "}
                    {
                      item.quantity
                    }
                  </p>

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

          <h2
            style={{
              textAlign:
                "right",
            }}
          >
            Total: ₹
            {Number(
              selectedOrder.total_amount
            ).toFixed(2)}
          </h2>

          <button
            onClick={() =>
              setSelectedOrder(
                null
              )
            }
          >
            Close
          </button>

        </div>
      )}

    </div>
  );
}

export default MyOrders;