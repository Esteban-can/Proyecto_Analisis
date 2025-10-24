// src/components/PromocionesAdmin.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import api from "../api/axios";

export default function PromocionesAdmin() {
  const [promociones, setPromociones] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    descuento: "",
    fechaInicio: "",
    fechaFin: "",
  });
  const [editando, setEditando] = useState(null);

  // 🔹 Cargar promociones
  const cargarPromociones = async () => {
    try {
      const res = await api.get("/promociones");
      setPromociones(res.data);
    } catch (err) {
      console.error("Error al obtener promociones:", err);
    }
  };

  useEffect(() => {
    cargarPromociones();
  }, []);

  // 🔹 Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Crear o actualizar promoción
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.descuento || !form.fechaInicio || !form.fechaFin) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    try {
      if (editando) {
        await api.put(`/promociones/update/${editando}`, form);
        alert("Promoción actualizada correctamente.");
      } else {
        await api.post("/promociones/create", form);
        alert("Promoción creada correctamente.");
      }

      setForm({ nombre: "", descripcion: "", descuento: "", fechaInicio: "", fechaFin: "" });
      setEditando(null);
      cargarPromociones();
    } catch (err) {
      console.error("Error al guardar promoción:", err);
    }
  };

  // 🔹 Editar
  const handleEdit = (promo) => {
    setForm(promo);
    setEditando(promo.id);
  };

  // 🔹 Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta promoción?")) return;
    try {
      await api.delete(`/promociones/delete/${id}`);
      alert("Promoción eliminada.");
      cargarPromociones();
    } catch (err) {
      console.error("Error al eliminar promoción:", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Gestión de Promociones
      </Typography>

      {/* 🔹 Formulario */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "grid",
          gap: 2,
          maxWidth: 600,
          mx: "auto",
          mb: 4,
          p: 3,
          border: "1px solid #ccc",
          borderRadius: 3,
        }}
      >
        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <TextField
          label="Descripción"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
        />
        <TextField
          label="Descuento (%)"
          name="descuento"
          type="number"
          value={form.descuento}
          onChange={handleChange}
          required
        />
        <TextField
          label="Fecha de Inicio"
          name="fechaInicio"
          type="date"
          value={form.fechaInicio}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Fecha de Fin"
          name="fechaFin"
          type="date"
          value={form.fechaFin}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />

        <Button type="submit" variant="contained" color="primary">
          {editando ? "Actualizar" : "Crear"} Promoción
        </Button>
      </Box>

      {/* 🔹 Lista de promociones */}
      <Grid container spacing={2}>
        {promociones.map((promo) => (
          <Grid item xs={12} sm={6} md={4} key={promo.id}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6">{promo.nombre}</Typography>
                <Typography>{promo.descripcion}</Typography>
                <Typography>Descuento: {promo.descuento}%</Typography>
                <Typography>Inicio: {promo.fechaInicio}</Typography>
                <Typography>Fin: {promo.fechaFin}</Typography>
              </CardContent>
              <CardActions>
                <Button color="warning" onClick={() => handleEdit(promo)}>
                  Editar
                </Button>
                <Button color="error" onClick={() => handleDelete(promo.id)}>
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
