import { NavLink } from "react-router-dom";

export default function Header({ cartCount }) {
  return (
    <header className="header">
      <div className="container headerInner">
        <NavLink to="/" className="brand">
          LaptopWeb
        </NavLink>
        <nav className="nav">
          <NavLink to="/" className="navLink">
            Sản phẩm
          </NavLink>
          <NavLink to="/gio-hang" className="navLink">
            Giỏ hàng ({cartCount})
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

