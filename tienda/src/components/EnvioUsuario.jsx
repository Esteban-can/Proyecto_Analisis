import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";
import api from "../api/axios";

export default function MisEnvios() {
  const [envios, setEnvios] = useState([]);
  const usuario = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!usuario?.id) return;

    // 🔹 Función para cargar los envíos del usuario
    const fetchEnvios = () => {
      api
        .get(`/envios/usuario/${usuario.id}`)
        .then((res) => setEnvios(res.data))
        .catch((err) => console.error("❌ Error cargando envíos:", err));
    };

    fetchEnvios(); // 🔸 Llamar una vez al montar el componente

    // 🔹 Repetir cada 5 segundos para mantener actualizado
    const interval = setInterval(fetchEnvios, 5000);

    // 🔹 Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [usuario?.id]);

  // ✅ Colores del chip según estadoId
  const getEstadoColor = (estadoId) => {
    switch (estadoId) {
      case 1:
        return "warning"; // Pendiente
      case 2:
        return "info"; // En tránsito
      case 3:
        return "success"; // Entregado
      default:
        return "default";
    }
  };

  // ✅ Texto del chip según estadoId
  const getEstadoTexto = (estadoId) => {
    switch (estadoId) {
      case 1:
        return "Pendiente";
      case 2:
        return "En tránsito";
      case 3:
        return "Entregado";
      default:
        return "Pendiente";
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mis Envíos
      </Typography>

      {envios.length === 0 ? (
        <Typography>No tienes envíos registrados.</Typography>
      ) : (
        envios.map((e) => (
          <Card
            key={e.id}
            sx={{
              mb: 2,
              borderLeft: `6px solid ${
                e.estadoId === 1
                  ? "#ed6c02" // Pendiente
                  : e.estadoId === 2
                  ? "#0288d1" // En tránsito
                  : "#2e7d32" // Entregado
              }`,
            }}
          >
            <CardContent>
              <Typography variant="h6">Factura #{e.facturaId}</Typography>
              <Typography>Dirección: {e.direccionEnvio}</Typography>
              <Chip
                label={getEstadoTexto(e.estadoId)}
                color={getEstadoColor(e.estadoId)}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
