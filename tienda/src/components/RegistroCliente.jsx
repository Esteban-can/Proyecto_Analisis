// src/components/Registro.jsx
import "./Login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // 👈 misma configuración del login

function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      // 👇 Creamos el usuario con rol fijo "cliente"
      const res = await api.post("/usuarios/create", {
        nombre,
        email,
        contrasena,
        Rol: "cliente",
      });

      if (res.status === 201) {
        alert("Cuenta creada correctamente ✅");
        navigate("/login"); // Redirige al login después de crear la cuenta
      }
    } catch (err) {
      console.error(err);
      alert("Error al crear el usuario ❌");
    }
  };

  return (
    <div className="registro-container">
      <h2>Crear cuenta</h2>
      <form onSubmit={handleRegistro}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
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

        <button type="submit">Registrarme</button>
      </form>

      <button
        onClick={() => navigate("/login")}
        style={{
          marginTop: "1rem",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Volver al login
      </button>
    </div>
  );
}

export default Registro;
