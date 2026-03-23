import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CartPage from "./pages/Cart";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import { addToCart, clearCart, loadCart, removeFromCart, saveCart, setQuantity } from "./lib/cart";
import { cartSummary } from "./lib/cart";
import "./App.css";

function App() {
  const [cart, setCart] = useState(() => loadCart());

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const summary = useMemo(() => cartSummary(cart), [cart]);

  function handleAddToCart(item, qty) {
    setCart((c) => addToCart(c, item, qty));
  }

  function handleSetQty(id, qty) {
    setCart((c) => setQuantity(c, id, qty));
  }

  function handleRemove(id) {
    setCart((c) => removeFromCart(c, id));
  }

  function handleClear() {
    setCart(clearCart());
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Header cartCount={summary.soLuong} />
        <main className="main">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/san-pham" element={<Products />} />
            <Route path="/san-pham/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
            <Route
              path="/gio-hang"
              element={<CartPage cart={cart} onSetQty={handleSetQty} onRemove={handleRemove} onClear={handleClear} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
