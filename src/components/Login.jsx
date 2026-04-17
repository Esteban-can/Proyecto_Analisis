import "./Login.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");

  const [mostrarExito, setMostrarExito] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);

  const navigate = useNavigate();

  // 🔹 Redirección después del login
  useEffect(() => {
    if (mostrarExito) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mostrarExito, navigate]);

  // 🔹 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/usuarios/login", { email, contrasena });

      if (res.status === 200 && res.data.usuario && res.data.carrito) {
        const loggedUser = res.data.usuario;
        const carritoId = res.data.carrito.id;

        localStorage.setItem("user", JSON.stringify(loggedUser));
        localStorage.setItem("carritoId", carritoId);

        // 🔥 ACTUALIZA NAVBAR
        window.dispatchEvent(new Event("storage"));

        setMostrarExito(true);

      } else {
        setMostrarError(true);
      }

    } catch (err) {
      console.error("Error en login:", err);
      setMostrarError(true);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>

      <button onClick={() => navigate("/registro")}>
        Crear cuenta
      </button>

      {/* ✅ ÉXITO */}
      {mostrarExito && (
        <div className="modal-overlay">
          <div className="modal-exito">
            <svg viewBox="0 0 52 52" className="checkmark">
              <circle cx="26" cy="26" r="25" className="checkmark-circle"/>
              <path d="M14 27l7 7 16-16" className="checkmark-check"/>
            </svg>
            <h2>Login exitoso</h2>
          </div>
        </div>
      )}

      {/* ❌ ERROR */}
      {mostrarError && (
        <div className="modal-overlay" onClick={() => setMostrarError(false)}>
          <div className="modal-exito">
            <svg viewBox="0 0 52 52" className="crossmark">
              <line x1="16" y1="16" x2="36" y2="36" className="cross-line"/>
              <line x1="36" y1="16" x2="16" y2="36" className="cross-line"/>
            </svg>
            <h2>Error</h2>
            <p>Credenciales inválidas</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;