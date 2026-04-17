import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const usuario = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const res = await api.get(`/facturas/usuario/${usuario.id}`);
        setFacturas(res.data);
      } catch (err) {
        console.error("Error al obtener facturas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacturas();
  }, [usuario.id]);

  if (loading) return <p>Cargando facturas...</p>;

  return (
    <div className="facturas-container">
      <h2>Mis Facturas</h2>

      {facturas.length === 0 ? (
        <p>No tienes facturas registradas.</p>
      ) : (
        facturas.map((f) => (
          <div key={f.id} className="factura-card">
            <h3>Factura #{f.id}</h3>
            <p>Fecha: {new Date(f.fecha).toLocaleString()}</p>
            
            {/* ✅ Conversión segura de total */}
            <p>
              Total: Q
              {f.total ? Number(f.total).toFixed(2) : "0.00"}
            </p>

            <p>Dirección de envío: {f.envio?.direccionEnvio || "No especificada"}</p>

            <h4>Detalles:</h4>
            <ul>
              {f.facturaDetalles?.map((d) => (
                <li key={d.id}>
                  {d.inventario?.producto?.nombre || "Producto desconocido"} ×{" "}
                  {d.cantidad} — Q
                  {Number(d.precioUnitario * d.cantidad).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
