import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchLaptopById } from "../lib/api";
import { formatVND } from "../lib/format";

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
        <Link to="/san-pham">Sản phẩm</Link>
        <span className="muted">/</span>
        <span>{item?.ten || "Chi tiết"}</span>
      </div>

      {error ? <div className="alert">{error}</div> : null}
      {loading ? <div className="muted">Đang tải dữ liệu...</div> : null}

      {item ? (
        <div className="detail">
          <div className="detailMedia">
            <img src={fallbackImg(item.hinhAnhUrl)} alt={item.ten} />
          </div>
          <div className="detailBody">
            <h2 className="detailTitle">{item.ten}</h2>
            <div className="rowWrap">
              <span className="pill">{item.hang}</span>
              <span className="pillMuted">Tồn kho: {item.tonKho}</span>
            </div>

            <div className="priceBig">{formatVND(item.giaVND)}</div>

            {item.moTa ? <p className="muted">{item.moTa}</p> : null}

            <div className="specs">
              <div className="spec">
                <div className="muted">CPU</div>
                <div>{item.cpu}</div>
              </div>
              <div className="spec">
                <div className="muted">RAM</div>
                <div>{item.ramGB}GB</div>
              </div>
              <div className="spec">
                <div className="muted">Ổ cứng</div>
                <div>{item.oCung}</div>
              </div>
              <div className="spec">
                <div className="muted">Màn hình</div>
                <div>{item.manHinh}</div>
              </div>
              <div className="spec">
                <div className="muted">Card đồ hoạ</div>
                <div>{item.cardDoHoa}</div>
              </div>
            </div>

            <div className="row">
              <input
                className="input qty"
                inputMode="numeric"
                value={String(qty)}
                onChange={(e) => setQty(Number(e.target.value.replace(/[^\d]/g, "")) || 1)}
              />
              <button className="btnPrimary" onClick={() => onAddToCart(item, qty)} disabled={item.tonKho === 0}>
                {item.tonKho === 0 ? "Hết hàng" : "Thêm vào giỏ"}
              </button>
              <Link to="/gio-hang" className="btnGhost">
                Xem giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

