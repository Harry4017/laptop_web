import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container">
      <div className="empty">
        <h2>Page not found</h2>
        <Link to="/" className="btnPrimary">
          Go home
        </Link>
      </div>
    </div>
  );
}

