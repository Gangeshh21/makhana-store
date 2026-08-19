import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";

function Home({ setCart }) {
  return (
    <>
      <Hero />
      <ProductSection setCart={setCart} />
    </>
  );
}

export default Home;