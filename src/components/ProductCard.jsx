function ProductCard({ product, setCart }) {

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add products to cart.");
      return;
    }

    try {
      const response = await fetch(
        "${import.meta.env.VITE_API_URL}/api/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Added to cart!");

      // Reload complete cart from database
      const cartResponse = await fetch(
        "${import.meta.env.VITE_API_URL}/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const cartData = await cartResponse.json();

      if (cartResponse.ok) {
        setCart(cartData);
      }

    } catch (error) {
      console.error(error);
      alert("Failed to add product to cart");
    }
  };

  return (
    <div className="product-card">

      <h3>{product.name}</h3>

      <p>
        {product.description}
      </p>

      <p>
        <strong>
          ₹{product.price}
        </strong>
      </p>

      <p>
        {product.weight}
      </p>

      <button onClick={handleAddToCart}>
        🛒 Add to Cart
      </button>

    </div>
  );
}

export default ProductCard;