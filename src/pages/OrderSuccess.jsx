import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();

  const order = location.state?.order;

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "40px",
          textAlign: "center",
          border: "1px solid #ddd",
          borderRadius: "15px",
          background: "#fff",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            fontSize: "60px",
            marginBottom: "15px",
          }}
        >
          🎉
        </div>

        <h1>
          Order Placed Successfully!
        </h1>

        <p>
          Thank you for shopping
          with MakhanaMart.
        </p>

        {order && (
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              borderRadius: "10px",
              background: "#f7f7f7",
              textAlign: "left",
            }}
          >
            <p>
              <strong>
                Order ID:
              </strong>{" "}
              #{order.id}
            </p>

            <p>
              <strong>
                Total:
              </strong>{" "}
              ₹
              {Number(
                order.total_amount
              ).toFixed(2)}
            </p>

            <p>
              <strong>
                Payment:
              </strong>{" "}
              Cash on Delivery
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {order.status}
            </p>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            marginTop: "30px",
            flexWrap: "wrap",
          }}
        >
          <Link to="/my-orders">
            <button>
              📦 View My Orders
            </button>
          </Link>

          <Link to="/products">
            <button>
              🛍️ Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;