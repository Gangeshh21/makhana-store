import { useParams } from "react-router-dom";
import products from "../data/products";

function ProductDetails({ setCart }) {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <div className="product-details">
      <div className="product-details-image">🌱</div>

      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <h2>₹{product.price}</h2>
        <p>Weight: {product.weight}</p>

        <button onClick={() => setCart((cart) => [...cart, product])}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;