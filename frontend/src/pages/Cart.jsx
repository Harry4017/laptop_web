import { Link } from "react-router-dom";
import { cartSummary } from "../lib/cart";
import { formatUSD } from "../lib/format";

function fallbackImg(url) {
  return url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853";
}

export default function Cart({ cart, onSetQty, onRemove, onClear }) {
  const summary = cartSummary(cart);

  return (
    <div className="container">
      <div className="pageTitle">
        <h2>Cart</h2>
        <div className="muted">Review items before checkout</div>
      </div>

      {cart.items.length === 0 ? (
        <div className="empty">
          <div className="muted">Your cart is empty.</div>
          <Link to="/san-pham" className="btnPrimary">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="cart">
            {cart.items.map((x) => (
              <div key={x.id} className="cartItem">
                <img className="cartImg" src={fallbackImg(x.imageUrl)} alt={x.name} />
                <div className="cartInfo">
                  <div className="cartName">{x.name}</div>
                  <div className="muted">{x.category}</div>
                  <div className="price">{formatUSD(x.priceUSD)}</div>
                </div>
                <div className="cartActions">
                  <input
                    className="input qty"
                    inputMode="numeric"
                    value={String(x.quantity)}
                    onChange={(e) => onSetQty(x.id, Number(e.target.value.replace(/[^\d]/g, "")) || 1)}
                  />
                  <button className="btnGhost" onClick={() => onRemove(x.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cartSummary">
            <div className="muted">Items: {summary.soLuong}</div>
            <div className="priceBig">Total: {formatUSD(summary.tongTien)}</div>
            <div className="row">
              <button
                className="btnPrimary"
                onClick={() => {
                  alert("Checkout success (demo).");
                  onClear();
                }}
              >
                Checkout
              </button>
              <Link to="/san-pham" className="btnGhost">
                Continue shopping
              </Link>
              <button className="btnGhost" onClick={onClear}>
                Clear cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

