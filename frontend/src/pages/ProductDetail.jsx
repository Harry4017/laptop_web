import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchLaptopById } from "../lib/api";
import { formatUSD } from "../lib/format";

function fallbackImg(url) {
  return url || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8";
}

export default function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [item, setItem] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    fetchLaptopById(id)
      .then((res) => {
        if (!alive) return;
        setItem(res);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Có lỗi xảy ra");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/san-pham">Products</Link>
        <span className="muted">/</span>
        <span>{item?.name || "Detail"}</span>
      </div>

      {error ? <div className="alert">{error}</div> : null}
      {loading ? <div className="muted">Đang tải dữ liệu...</div> : null}

      {item ? (
        <div className="detail">
          <div className="detailMedia">
            <img src={fallbackImg(item.imageUrl)} alt={item.name} />
          </div>
          <div className="detailBody">
            <h2 className="detailTitle">{item.name}</h2>
            <div className="rowWrap">
              <span className="pill">{item.category}</span>
              <span className="pillMuted">Stock: {item.stock}</span>
            </div>

            <div className="priceBig">{formatUSD(item.priceUSD)}</div>

            <div className="row">
              <input
                className="input qty"
                inputMode="numeric"
                value={String(qty)}
                onChange={(e) => setQty(Number(e.target.value.replace(/[^\d]/g, "")) || 1)}
              />
              <button className="btnPrimary" onClick={() => onAddToCart(item, qty)} disabled={item.stock === 0}>
                {item.stock === 0 ? "Out of stock" : "Add to cart"}
              </button>
              <Link to="/gio-hang" className="btnGhost">
                View cart
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

