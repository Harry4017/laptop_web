import { Link } from "react-router-dom";
import { formatVND } from "../lib/format";

function fallbackImg(url) {
  return url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853";
}

export default function LaptopCard({ item, onEdit, onDelete }) {
  return (
    <div className="simpleCard">
      <Link to={`/san-pham/${item._id}`} className="simpleImg">
        <img src={fallbackImg(item.hinhAnhUrl)} alt={item.ten} loading="lazy" />
      </Link>
      <div className="simpleBody">
        <div className="simpleTitle">{item.ten}</div>
        <div className="simpleText">
          <span className="label">Danh mục:</span> {item.danhMuc || "Laptop"}
        </div>
        <div className="simpleText">
          <span className="label">Giá:</span> <span className="priceGreen">{formatVND(item.giaVND)}</span>
        </div>
        <div className="simpleText">
          <span className="label">Tồn kho:</span> {item.tonKho ?? 0}
        </div>
        <div className="simpleActions">
          <Link to={`/san-pham/${item._id}`} className="btnBlue">
            Xem
          </Link>
          <button className="btnYellow" onClick={() => onEdit(item)}>
            Sửa
          </button>
          <button className="btnRed" onClick={() => onDelete(item)}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

