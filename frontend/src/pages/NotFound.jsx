import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container">
      <div className="empty">
        <h2>Không tìm thấy trang</h2>
        <Link to="/" className="btnPrimary">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

