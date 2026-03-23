import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <section className="hero">
        <div className="heroText">
          <h1>Mua laptop nhanh, gọn, rõ cấu hình</h1>
          <p className="muted">
            Tìm theo hãng, tìm kiếm theo từ khoá, xem chi tiết cấu hình và thêm vào giỏ hàng.
          </p>
          <div className="row">
            <Link to="/san-pham" className="btnPrimary">
              Xem sản phẩm
            </Link>
            <a href="/api/health" className="btnGhost" target="_blank" rel="noreferrer">
              Kiểm tra API
            </a>
          </div>
        </div>
        <div className="heroBox">
          <div className="kpi">
            <div className="kpiNumber">VN</div>
            <div className="muted">Giao diện tiếng Việt</div>
          </div>
          <div className="kpi">
            <div className="kpiNumber">DB</div>
            <div className="muted">MongoDB lưu sản phẩm</div>
          </div>
          <div className="kpi">
            <div className="kpiNumber">API</div>
            <div className="muted">Tìm kiếm + lọc + phân trang</div>
          </div>
        </div>
      </section>
    </div>
  );
}

