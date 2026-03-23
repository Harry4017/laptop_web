import { Link } from "react-router-dom";
import { formatUSD } from "../lib/format";

function fallbackImg(url) {
  return url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853";
}

export default function LaptopCard({ item }) {
  return (
    <div className="simpleCard">
      <Link to={`/san-pham/${item._id}`} className="simpleImg">
        <img src={fallbackImg(item.imageUrl)} alt={item.name} loading="lazy" />
      </Link>
      <div className="simpleBody">
        <div className="simpleTitle">{item.name}</div>
        <div className="simpleText">
          <span className="label">Category:</span> {item.category || "Laptop"}
        </div>
        <div className="simpleText">
          <span className="label">Price:</span> <span className="priceGreen">{formatUSD(item.priceUSD)}</span>
        </div>
        <div className="simpleText">
          <span className="label">Stock:</span> {item.stock ?? 0}
        </div>
        <div className="simpleActions">
          <Link to={`/san-pham/${item._id}`} className="btnBlue">
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

