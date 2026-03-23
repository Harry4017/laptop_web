import { NavLink } from "react-router-dom";

export default function Header({ cartCount }) {
  return (
    <header className="header">
      <div className="container headerInner">
        <NavLink to="/" className="brand">
          SimpleShop
        </NavLink>
        <nav className="nav">
          <NavLink to="/" className="navLink">
            Products
          </NavLink>
          <NavLink to="/gio-hang" className="navLink">
            Cart ({cartCount})
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

