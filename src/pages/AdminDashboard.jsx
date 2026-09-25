import { useEffect, useState } from "react";

function AdminDashboard() {
  const token =
    localStorage.getItem("token");

  const [stats, setStats] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [orderItems, setOrderItems] =
    useState({});

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    stock: "",
  });

  // =====================================================
  // LOAD EVERYTHING
  // =====================================================

  useEffect(() => {
    loadDashboard();
    loadProducts();
    loadUsers();
    loadOrders();
  }, []);

  // =====================================================
  // DASHBOARD
  // =====================================================

  const loadDashboard = async () => {
    try {
      const response = await fetch(
        "${import.meta.env.VITE_API_URL}/api/admin/dashboard",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setStats(
          data.statistics
        );
      }

    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );
    }
  };

  // =====================================================
  // PRODUCTS
  // =====================================================

  const loadProducts = async () => {
    try {
      const response = await fetch(
        "${import.meta.env.VITE_API_URL}/api/admin/products",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setProducts(data);
      }

    } catch (error) {
      console.error(
        "Products error:",
        error
      );
    }
  };

  // =====================================================
  // USERS
  // =====================================================

  const loadUsers = async () => {
    try {
      const response = await fetch(
        "${import.meta.env.VITE_API_URL}/api/admin/users",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setUsers(data);
      }

    } catch (error) {
      console.error(
        "Users error:",
        error
      );
    }
  };

  // =====================================================
  // ORDERS
  // =====================================================

  const loadOrders = async () => {
    try {
      const response = await fetch(
        "${import.meta.env.VITE_API_URL}/api/admin/orders",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setOrders(data);
      }

    } catch (error) {
      console.error(
        "Orders error:",
        error
      );
    }
  };

  // =====================================================
  // ORDER ITEMS
  // =====================================================

  const loadOrderItems =
    async (orderId) => {
      try {
        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}/items`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (response.ok) {
          setOrderItems(
            (previous) => ({
              ...previous,
              [orderId]: data,
            })
          );
        }

      } catch (error) {
        console.error(
          "Order items error:",
          error
        );
      }
    };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus =
    async (
      orderId,
      status
    ) => {
      try {
        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}/status`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                status,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          alert(
            data.message
          );
          return;
        }

        alert(
          "Order status updated"
        );

        loadOrders();
        loadDashboard();

      } catch (error) {
        console.error(
          "Status error:",
          error
        );

        alert(
          "Failed to update order"
        );
      }
    };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (
    e
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // =====================================================
  // ADD / UPDATE PRODUCT
  // =====================================================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const url =
          editingProduct
            ? `${import.meta.env.VITE_API_URL}/api/admin/products/${editingProduct.id}`
            : "${import.meta.env.VITE_API_URL}/api/admin/products";

        const method =
          editingProduct
            ? "PUT"
            : "POST";

        const response =
          await fetch(url, {
            method,

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              name: form.name,
              description:
                form.description,
              price:
                Number(
                  form.price
                ),
              weight:
                form.weight,
              stock:
                Number(
                  form.stock
                ),
            }),
          });

        const data =
          await response.json();

        alert(
          data.message
        );

        if (response.ok) {
          resetForm();
          loadProducts();
          loadDashboard();
        }

      } catch (error) {
        console.error(
          "Save product error:",
          error
        );

        alert(
          "Failed to save product"
        );
      }
    };

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const editProduct =
    (product) => {
      setEditingProduct(
        product
      );

      setForm({
        name:
          product.name || "",

        description:
          product.description ||
          "",

        price:
          product.price || "",

        weight:
          product.weight || "",

        stock:
          product.stock || 0,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct =
    async (id) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this product?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/api/admin/products/${id}`,
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

        alert(
          data.message
        );

        if (response.ok) {
          loadProducts();
          loadDashboard();
        }

      } catch (error) {
        console.error(
          "Delete error:",
          error
        );

        alert(
          "Failed to delete product"
        );
      }
    };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm =
    () => {
      setEditingProduct(
        null
      );

      setForm({
        name: "",
        description: "",
        price: "",
        weight: "",
        stock: "",
      });
    };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "auto",
      }}
    >

      <h1>
        🔥 MakhanaMart
        Admin Dashboard
      </h1>

      <p>
        Manage products,
        users, inventory
        and orders.
      </p>

      {/* ================================================= */}
      {/* STATISTICS */}
      {/* ================================================= */}

      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, 1fr)",
            gap: "20px",
            margin:
              "30px 0",
          }}
        >

          <div className="stat-card">
            <h3>
              📦 Products
            </h3>

            <h2>
              {stats.products}
            </h2>
          </div>

          <div className="stat-card">
            <h3>
              👥 Users
            </h3>

            <h2>
              {stats.users}
            </h2>
          </div>

          <div className="stat-card">
            <h3>
              🛒 Orders
            </h3>

            <h2>
              {stats.orders}
            </h2>
          </div>

          <div className="stat-card">
            <h3>
              💰 Revenue
            </h3>

            <h2>
              ₹
              {Number(
                stats.revenue
              ).toFixed(2)}
            </h2>
          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* PRODUCT FORM */}
      {/* ================================================= */}

      <section>

        <h2>
          {editingProduct
            ? "✏️ Edit Product"
            : "➕ Add Product"}
        </h2>

        <form
          onSubmit={
            handleSubmit
          }
          style={{
            display: "grid",
            gap: "12px",
            maxWidth:
              "500px",
          }}
        >

          <input
            name="name"
            placeholder="Product name"
            value={
              form.name
            }
            onChange={
              handleChange
            }
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={
              form.description
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={
              form.price
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            name="weight"
            placeholder="Weight e.g. 250g"
            value={
              form.weight
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={
              form.stock
            }
            onChange={
              handleChange
            }
            required
          />

          <button type="submit">
            {editingProduct
              ? "Update Product"
              : "Add Product"}
          </button>

          {editingProduct && (
            <button
              type="button"
              onClick={
                resetForm
              }
            >
              Cancel Edit
            </button>
          )}

        </form>

      </section>

      {/* ================================================= */}
      {/* PRODUCTS */}
      {/* ================================================= */}

      <section
        style={{
          marginTop:
            "50px",
        }}
      >

        <h2>
          📦 Products
        </h2>

        {products.map(
          (product) => (
            <div
              key={
                product.id
              }
              style={{
                padding:
                  "20px",
                marginBottom:
                  "15px",
                border:
                  "1px solid #ddd",
                borderRadius:
                  "10px",
              }}
            >

              <h3>
                {product.name}
              </h3>

              <p>
                {
                  product.description
                }
              </p>

              <p>
                ₹
                {
                  product.price
                }
                {" · "}
                {
                  product.weight
                }
                {" · Stock: "}
                {
                  product.stock
                }
              </p>

              <button
                onClick={() =>
                  editProduct(
                    product
                  )
                }
              >
                ✏️ Edit
              </button>

              {" "}

              <button
                onClick={() =>
                  deleteProduct(
                    product.id
                  )
                }
              >
                🗑️ Delete
              </button>

            </div>
          )
        )}

      </section>

      {/* ================================================= */}
      {/* USERS */}
      {/* ================================================= */}

      <section
        style={{
          marginTop:
            "50px",
        }}
      >

        <h2>
          👥 Users
        </h2>

        {users.map(
          (user) => (
            <div
              key={
                user.id
              }
              style={{
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

              <strong>
                {user.name}
              </strong>

              <p>
                {user.email}
              </p>

              <p>
                Role:{" "}
                {user.role}
              </p>

              <small>
                Joined:{" "}
                {new Date(
                  user.created_at
                ).toLocaleDateString()}
              </small>

            </div>
          )
        )}

      </section>

      {/* ================================================= */}
      {/* ORDERS */}
      {/* ================================================= */}

      <section
        style={{
          marginTop:
            "50px",
        }}
      >

        <h2>
          🛒 Orders
        </h2>

        {orders.length ===
        0 ? (
          <p>
            No orders found.
          </p>
        ) : (
          orders.map(
            (order) => (
              <div
                key={
                  order.id
                }
                style={{
                  padding:
                    "20px",
                  marginBottom:
                    "20px",
                  border:
                    "1px solid #ddd",
                  borderRadius:
                    "10px",
                }}
              >

                <h3>
                  Order #
                  {
                    order.id
                  }
                </h3>

                <p>
                  Customer:{" "}
                  {
                    order.user_name
                  }
                </p>

                <p>
                  Email:{" "}
                  {
                    order.user_email
                  }
                </p>

                <p>
                  Total: ₹
                  {
                    order.total_amount
                  }
                </p>

                <p>
                  Date:{" "}
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </p>

                {/* STATUS */}

                <select
                  value={
                    order.status
                  }
                  onChange={(
                    e
                  ) =>
                    updateOrderStatus(
                      order.id,
                      e.target
                        .value
                    )
                  }
                >

                  <option value="pending">
                    Pending
                  </option>

                  <option value="confirmed">
                    Confirmed
                  </option>

                  <option value="shipped">
                    Shipped
                  </option>

                  <option value="delivered">
                    Delivered
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>

                </select>

                {" "}

                <button
                  onClick={() =>
                    loadOrderItems(
                      order.id
                    )
                  }
                >
                  View Items
                </button>

                {/* ORDER ITEMS */}

                {orderItems[
                  order.id
                ] && (
                  <div
                    style={{
                      marginTop:
                        "15px",
                      padding:
                        "15px",
                      background:
                        "#f5f5f5",
                    }}
                  >

                    <h4>
                      Order Items
                    </h4>

                    {orderItems[
                      order.id
                    ].map(
                      (
                        item
                      ) => (
                        <p
                          key={
                            item.id
                          }
                        >
                          {
                            item.name
                          }
                          {" × "}
                          {
                            item.quantity
                          }
                          {" — ₹"}
                          {
                            item.price
                          }
                        </p>
                      )
                    )}

                  </div>
                )}

              </div>
            )
          )
        )}

      </section>

    </div>
  );
}

export default AdminDashboard;