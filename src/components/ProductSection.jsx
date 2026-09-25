import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function ProductSection({ setCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("${import.meta.env.VITE_API_URL}/api/products")
      .then((response) => response.json())
      .then((data) => {
        console.log("Products received:", data);
        setProducts(data);
      })
      .catch((error) => {
        console.error("Product API error:", error);
      });
  }, []);

  return (
    <section className="products-section">
      <div className="section-heading">
        <p>OUR COLLECTION</p>
        <h2>Choose Your Favourite Makhana</h2>
      </div>

      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              setCart={setCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductSection;