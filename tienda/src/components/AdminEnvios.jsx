import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import api from "../api/axios";

export default function AdminEnvios() {
  const [envios, setEnvios] = useState([]);

  // 🔹 Cargar los envíos al montar el componente
  useEffect(() => {
    api
      .get("/Envios") // 👈 mayúscula para coincidir con tu ruta
      .then((res) => setEnvios(res.data))
      .catch((err) => console.error("❌ Error cargando envíos:", err));
  }, []);

  // 🔹 Cambiar estado del envío
  const actualizarEstado = async (envioId, nuevoEstadoId) => {
    try {
      let endpoint = "";

      if (nuevoEstadoId === 2) {
        endpoint = `/Envios/transito/${envioId}`;
      } else if (nuevoEstadoId === 3) {
        endpoint = `/Envios/entregado/${envioId}`;
      } else {
        console.warn("⚠️ Estado no válido:", nuevoEstadoId);
        return;
      }

      console.log("➡️ PUT", endpoint);

      const res = await api.put(endpoint);

      // ✅ Actualizamos el estado localmente
      setEnvios((prevEnvios) =>
        prevEnvios.map((e) =>
          e.id === envioId ? { ...e, estadoEnvioId: nuevoEstadoId } : e
        )
      );

      alert(`✅ ${res.data.mensaje || "Estado actualizado con éxito"}`);
    } catch (err) {
      console.error("❌ Error al actualizar envío:", err);
      alert("Error al actualizar el estado del envío.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Envíos
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Factura</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {envios.map((e) => (
            <TableRow key={e.id}>
              <TableCell>{e.id}</TableCell>
              <TableCell>{e.facturaId}</TableCell>
              <TableCell>{e.direccionEnvio}</TableCell>
              <TableCell>
                <Select
                  value={e.estadoEnvioId || ""}
                  onChange={(ev) => actualizarEstado(e.id, ev.target.value)}
                  displayEmpty
                >
                  <MenuItem value={1}>Pendiente</MenuItem>
                  <MenuItem value={2}>En tránsito</MenuItem>
                  <MenuItem value={3}>Entregado</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
