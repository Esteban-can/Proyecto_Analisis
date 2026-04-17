// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Catalogo from './components/Catalogo';
import ProductoDetalle from './components/ProductoDetalle';
import Nosotros from './components/Nosotros';
import Contacto from './components/Contacto';
import Carrito from './components/Carrito';
import RegistroCliente from "./components/RegistroCliente";
import Pago from './components/Pago';
import Login from './components/Login';
import ProductoCrear from "./components/ProductoCrear";
import SucursalCrear from "./components/CrearSucursal";
import ColorCrear from "./components/CrearColor";
import TallaCrear from "./components/CrearTalla";
import ProductoEditar from "./components/EditarComponentes";
import PromocionesAdmin from "./components/PromocionesAdmin";
import PromocionesCliente from "./components/PromocionesCliente";
import Facturas from "./components/Factura";
import EnviosUsuario from "./components/EnvioUsuario";
import EnviosAdmin from "./components/AdminEnvios";

import './App.css';
import ChatWidget from "./components/botonchat";
import Navbar from "./components/Navbar";

function Home({ addToCart }) {
  return (
    <main className="main-content">
     <h2 className="titulo-bienvenida">Bienvenido a ZONA 404 SHOES</h2>
      <p className="texto-bienvenida">
        Tu tienda en línea de zapatos deportivos. Explora nuestro catálogo y encuentra el calzado perfecto para ti.
      </p>
      <Catalogo addToCart={addToCart} />
    </main>
  );
}

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("storage"));
}, [cart]);

  const addToCart = (product) => {
    const exist = cart.find(
      item =>
        item.id === product.id &&
        item.talla === product.talla &&
        item.color === product.color
    );

    if (exist) {
      setCart(
        cart.map(item =>
          item.id === product.id &&
          item.talla === product.talla &&
          item.color === product.color
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      );
    } else {
      setCart([...cart, product]);
    }
  };

  const updateQuantity = (id, talla, color, quantity) => {
    setCart(
      cart.map(item =>
        item.id === id && item.talla === talla && item.color === color
          ? { ...item, quantity: Math.max(quantity, 1) }
          : item
      )
    );
  };

  const removeFromCart = (id, talla, color) => {
    setCart(
      cart.filter(
        item => !(item.id === id && item.talla === talla && item.color === color)
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <div className="App">

      {/* 🔥 NAVBAR NUEVO */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/about" element={<Nosotros />} />
        <Route path="/contact" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegistroCliente />} />

        <Route path="/productos/create" element={<ProductoCrear />} />
        <Route path="/sucursales/create" element={<SucursalCrear />} />
        <Route path="/colores/create" element={<ColorCrear />} />
        <Route path="/tallas/create" element={<TallaCrear />} />
        <Route path="/productos/edit/:id" element={<ProductoEditar />} />

        <Route path="/admin/promociones" element={<PromocionesAdmin />} />
        <Route path="/admin/envios" element={<EnviosAdmin />} />

        <Route path="/promociones" element={<PromocionesCliente />} />
        <Route path="/facturas" element={<Facturas />} />
        <Route path="/envios" element={<EnviosUsuario />} />

        <Route
          path="/producto/:id"
          element={<ProductoDetalle addToCart={addToCart} />}
        />

        <Route
          path="/cart"
          element={
            <Carrito
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
            />
          }
        />

        <Route
          path="/pago"
          element={
            <Pago
              total={cart.reduce(
                (acc, item) => acc + item.precio * item.quantity,
                0
              )}
              clearCart={clearCart}
            />
          }
        />
      </Routes>

      <footer className="footer">
        <p>&copy; 2025 ZONA 404 SHOES. Todos los derechos reservados.</p>
      </footer>

      <ChatWidget />
    </div>
  );
}

export default App;