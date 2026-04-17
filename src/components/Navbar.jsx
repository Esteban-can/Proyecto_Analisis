import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [mostrarLogout, setMostrarLogout] = useState(false);

  const navigate = useNavigate();

  // 🔹 Cargar usuario y carrito
  const cargarDatos = () => {
    const storedUser = localStorage.getItem("user");
    const storedCart = localStorage.getItem("cart");

    setUser(storedUser ? JSON.parse(storedUser) : null);

    if (storedCart) {
      const cart = JSON.parse(storedCart);
      const total = cart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(total);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    cargarDatos();

    window.addEventListener("storage", cargarDatos);

    return () => {
      window.removeEventListener("storage", cargarDatos);
    };
  }, []);

  // 🔴 LOGOUT
  const handleLogout = () => {
    setMostrarLogout(true);

    setTimeout(() => {
      localStorage.removeItem("user");

      // 🔥 avisar a toda la app
      window.dispatchEvent(new Event("storage"));

      setUser(null);
      setMostrarLogout(false);
      navigate("/login");
    }, 1500);
  };

  return (
    <>
      <nav className="navbar">
        {/* LOGO */}
        <h2 className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" className="logo-image" />
        </h2>

        {/* LINKS */}
        <div className="nav-links">
          <Link to="/">Catálogo</Link>
          <Link to="/promociones">Promociones</Link>
          <Link to="/about">Nosotros</Link>
          <Link to="/contact">Contacto</Link>
          <Link to="/facturas">Facturas</Link>
          <Link to="/envios">Envíos</Link>

          {/* 🛒 CARRITO */}
          <Link to="/cart" className="cart-link">
            Carrito ({cartCount})
          </Link>

          {/* 🔧 ADMIN */}
          {user && user.rol === "admin" && (
            <Link to="/admin/envios">Admin</Link>
          )}
        </div>

        {/* ACCIONES */}
        <div className="nav-actions">
          {!user ? (
            <button className="btn-login" onClick={() => navigate("/login")}>
              Login
            </button>
          ) : (
            <>
              <span className="user-info">{user.nombre}</span>

              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 🔴 MODAL LOGOUT */}
      {mostrarLogout && (
        <div className="modal-overlay">
          <div className="modal-exito">
            <svg viewBox="0 0 52 52" className="crossmark">
              <line x1="16" y1="16" x2="36" y2="36" className="cross-line"/>
              <line x1="36" y1="16" x2="16" y2="36" className="cross-line"/>
            </svg>
            <h2>Sesión cerrada</h2>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;