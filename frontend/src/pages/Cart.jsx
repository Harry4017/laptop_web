import { Link } from "react-router-dom";
import { cartSummary } from "../lib/cart";
import { formatVND } from "../lib/format";

function fallbackImg(url) {
  return url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853";
}

export default function Cart({ cart, onSetQty, onRemove, onClear }) {
  const summary = cartSummary(cart);

  return (
    <div className="container">
      <div className="pageTitle">
        <h2>Giỏ hàng</h2>
        <div className="muted">Kiểm tra sản phẩm trước khi đặt hàng</div>
      </div>

      {cart.items.length === 0 ? (
        <div className="empty">
          <div className="muted">Giỏ hàng đang trống.</div>
          <Link to="/san-pham" className="btnPrimary">
            Đi mua sắm
          </Link>
        </div>
      ) : (
        <>
          <div className="cart">
            {cart.items.map((x) => (
              <div key={x.id} className="cartItem">
                <img className="cartImg" src={fallbackImg(x.hinhAnhUrl)} alt={x.ten} />
                <div className="cartInfo">
                  <div className="cartName">{x.ten}</div>
                  <div className="muted">{x.hang}</div>
                  <div className="price">{formatVND(x.giaVND)}</div>
                </div>
                <div className="cartActions">
                  <input
                    className="input qty"
                    inputMode="numeric"
                    value={String(x.quantity)}
                    onChange={(e) => onSetQty(x.id, Number(e.target.value.replace(/[^\d]/g, "")) || 1)}
                  />
                  <button className="btnGhost" onClick={() => onRemove(x.id)}>
                    Xoá
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cartSummary">
            <div className="muted">Số lượng: {summary.soLuong}</div>
            <div className="priceBig">Tổng: {formatVND(summary.tongTien)}</div>
            <div className="row">
              <button
                className="btnPrimary"
                onClick={() => {
                  alert("Đặt hàng thành công (demo).");
                  onClear();
                }}
              >
                Đặt hàng
              </button>
              <Link to="/san-pham" className="btnGhost">
                Tiếp tục mua
              </Link>
              <button className="btnGhost" onClick={onClear}>
                Xoá giỏ hàng
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

