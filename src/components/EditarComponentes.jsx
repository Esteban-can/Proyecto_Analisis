import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import { AddCircle, Delete } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombre: "",
    marca: "",
    modelo: "",
    precio: "",
    descripcion: "",
    imagenUrl: "",
  });

  const [inventarios, setInventarios] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [colores, setColores] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  // 🔹 Cargar datos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [prodRes, tallasRes, coloresRes, sucRes, invRes] = await Promise.all([
          api.get(`/productos/${id}`),
          api.get("/tallas"),
          api.get("/colores"),
          api.get("/sucursales"),
          api.get(`/inventarios?productoId=${id}`),
        ]);

        setProducto(prodRes.data?.data || prodRes.data);
        setTallas(tallasRes.data);
        setColores(coloresRes.data);
        setSucursales(sucRes.data);
        setInventarios(invRes.data || []);
      } catch (error) {
        console.error(" Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, [id]);

  // 🔹 Manejar cambios en el producto
  const handleProductoChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  // 🔹 Manejar cambios en un inventario específico
  const handleInventarioChange = (index, field, value) => {
    const nuevos = [...inventarios];
    nuevos[index][field] = value;
    setInventarios(nuevos);
  };

  // 🔹 Agregar una nueva línea de inventario
  const agregarInventario = () => {
    setInventarios([
      ...inventarios,
      {
        tallaId: "",
        colorId: "",
        sucursalId: "",
        cantidad: "",
      },
    ]);
  };

  // 🔹 Eliminar una línea de inventario
  const eliminarInventario = async (index) => {
    const inv = inventarios[index];
    if (inv.id) {
      if (!window.confirm("¿Seguro que deseas eliminar esta combinación de inventario?")) return;
      try {
        await api.delete(`/inventarios/delete/${inv.id}`);
      } catch (error) {
        console.error(" Error al eliminar inventario:", error);
      }
    }
    setInventarios(inventarios.filter((_, i) => i !== index));
  };

  // 🔹 Guardar todos los cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Actualizar producto
      await api.put(`/productos/update/${id}`, producto);

      // 2️⃣ Actualizar o crear inventarios
      for (const inv of inventarios) {
        if (inv.id) {
          await api.put(`/inventarios/update/${inv.id}`, inv);
        } else {
          await api.post("/inventarios/create", { ...inv, productoId: id });
        }
      }

      alert(" Producto actualizado correctamente");
      navigate("/");
    } catch (error) {
      console.error(" Error al guardar:", error);
      alert("Error al guardar los cambios");
    }
  };

  if (!producto?.nombre) return <Typography>Cargando...</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5 }}>
      <Typography variant="h5" mb={2}>
     Editar Producto
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* 🔹 DATOS DEL PRODUCTO */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" mb={2}>
            Información general
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={producto.nombre}
                onChange={handleProductoChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Marca"
                name="marca"
                value={producto.marca}
                onChange={handleProductoChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Modelo"
                name="modelo"
                value={producto.modelo}
                onChange={handleProductoChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Precio"
                name="precio"
                type="number"
                value={producto.precio}
                onChange={handleProductoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción"
                name="descripcion"
                value={producto.descripcion}
                onChange={handleProductoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL de imagen"
                name="imagenUrl"
                value={producto.imagenUrl}
                onChange={handleProductoChange}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* 🔹 INVENTARIOS */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Inventario por talla, color y sucursal</Typography>
            <IconButton color="primary" onClick={agregarInventario}>
              <AddCircle />
            </IconButton>
          </Box>

          {inventarios.map((inv, index) => (
            <Box key={index} sx={{ mb: 2, borderBottom: "1px solid #ddd", pb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    select
                    fullWidth
                    label="Talla"
                    value={inv.tallaId || ""}
                    onChange={(e) =>
                      handleInventarioChange(index, "tallaId", e.target.value)
                    }
                  >
                    {tallas.map((t) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.nombre || t.numero}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    select
                    fullWidth
                    label="Color"
                    value={inv.colorId || ""}
                    onChange={(e) =>
                      handleInventarioChange(index, "colorId", e.target.value)
                    }
                  >
                    {colores.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    select
                    fullWidth
                    label="Sucursal"
                    value={inv.sucursalId || ""}
                    onChange={(e) =>
                      handleInventarioChange(index, "sucursalId", e.target.value)
                    }
                  >
                    {sucursales.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Cantidad"
                    value={inv.cantidad || ""}
                    onChange={(e) =>
                      handleInventarioChange(index, "cantidad", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={1}>
                  <IconButton color="error" onClick={() => eliminarInventario(index)}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Button variant="contained" color="primary" type="submit" fullWidth
         onClick={() => navigate("/")}>
          Guardar Cambios
        </Button>

      </form>
    </Box>
  );
}
