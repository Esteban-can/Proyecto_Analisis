import "./Login.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Al cargar el componente, verificamos si hay usuario en localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ LOGIN
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/usuarios/login", { email, contrasena });

    if (res.status === 200 && res.data.usuario && res.data.carrito) {
      const loggedUser = res.data.usuario;
      const carritoId = res.data.carrito.id;

      // 🔹 Guardamos usuario y carrito en localStorage
      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("carritoId", carritoId);

      // 🔹 Actualizamos estado
      setUser(loggedUser);

      // 🔹 Redirigimos al inicio
      navigate("/");
    } else {
      alert("No se pudo obtener la información del usuario o del carrito ❌");
    }
  } catch (err) {
    console.error("Error en login:", err);
    alert("Error al conectar con el servidor o credenciales inválidas ❌");
  }
};




  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    alert("Sesión cerrada correctamente 👋");
    navigate("/login");
  };

  // ✅ Si hay usuario logueado, muestra el mensaje y el botón de logout
  if (user) {
    return (
      <div className="login-container">
        <h2>Sesión activa</h2>
        <p>
          Has iniciado sesión como: <strong>{user.email}</strong> <br />
          Rol: <strong>{user.Rol}</strong>
        </p>
        <button
          onClick={handleLogout}
          style={{
            marginTop: "1rem",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  // ✅ Si NO hay usuario, muestra el formulario de login
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

      <button
        onClick={() => navigate("/registro")}
        style={{
          marginTop: "1rem",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Crear cuenta como cliente
      </button>
    </div>
  );
}

export default Login;
