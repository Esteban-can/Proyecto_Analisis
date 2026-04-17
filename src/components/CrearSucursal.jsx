import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  IconButton,
  Paper,
} from "@mui/material";

import api from "../api/axios";

export default function Sucursales() {
  const [sucursales, setSucursales] = useState([]);
  const [form, setForm] = useState({ nombre: "", direccion: "", telefono: "" });
  const [editando, setEditando] = useState(null);

  const cargarSucursales = async () => {
    try {
      const res = await api.get("/sucursales");
      setSucursales(res.data);
    } catch (error) {
      console.error("Error al cargar sucursales:", error);
    }
  };

  useEffect(() => {
    cargarSucursales();
  }, []);

  const guardarSucursal = async () => {
    try {
      
        await api.post("/sucursales/create", form);
        alert("✅ Sucursal agregada correctamente");
      
      setForm({ nombre: "", direccion: "", telefono: "" });
      
      cargarSucursales();
    } catch (error) {
      console.error("Error al guardar sucursal:", error);
    }
  };

 
  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 5 }}>
      <Typography variant="h5" mb={2}>
         Gestión de Sucursales
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          label="Nombre de la sucursal"
          fullWidth
          sx={{ mb: 2 }}
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
        <TextField
          label="Dirección"
          fullWidth
          sx={{ mb: 2 }}
          value={form.direccion}
          onChange={(e) => setForm({ ...form, direccion: e.target.value })}
        />
        <TextField
          label="Teléfono"
          fullWidth
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={guardarSucursal}
        >
          {editando ? " Actualizar" : " Agregar"}
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Lista de Sucursales
        </Typography>
        <Grid container spacing={1}>
          {sucursales.map((s) => (
            <Grid
              item
              xs={12}
              key={s.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
                py: 1,
              }}
            >
              <Box>
                <Typography variant="subtitle1">{s.nombre}</Typography>
                <Typography variant="body2">{s.direccion}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.telefono}
                </Typography>
              </Box>
              <Box>
                <IconButton
                  color="warning"
                  onClick={() => {
                    
                    setForm({
                      nombre: s.nombre,
                      direccion: s.direccion,
                      telefono: s.telefono,
                    });
                  }}
                >
                
                </IconButton>
               
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
