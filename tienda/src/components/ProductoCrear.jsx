import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Grid,
  MenuItem,
  IconButton,
} from "@mui/material";
import { AddCircle, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ProductoCrear() {
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    marca: "",
    modelo: "",
    imagenUrl: "",
  });

  const [inventarios, setInventarios] = useState([
    { colorId: "", tallaId: "", sucursalId: "", cantidad: "" },
  ]);

  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  const [openSnack, setOpenSnack] = useState(false);
  const [mensajeSnack, setMensajeSnack] = useState("");
  const [tipoSnack, setTipoSnack] = useState("success");

  // 🔹 Cargar opciones de color, talla y sucursal
  const cargarOpciones = async () => {
  try {
    const [coloresRes, tallasRes, sucursalesRes] = await Promise.all([
      api.get("/colores"),
      api.get("/tallas"),
      api.get("/sucursales"),
    ]);

    console.log(" Colores:", coloresRes.data);
    console.log(" Tallas:", tallasRes.data);
    console.log(" Sucursales:", sucursalesRes.data);

    setColores(coloresRes.data);
    setTallas(tallasRes.data);
    setSucursales(sucursalesRes.data);
  } catch (error) {
    console.error("Error al cargar opciones:", error);
  }
};

  useEffect(() => {
    cargarOpciones();
  }, []);

  // 🔹 Manejar cambios en los inputs de producto
  const handleProductoChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  // 🔹 Manejar cambios en los inventarios
  const handleInventarioChange = (index, e) => {
    const { name, value } = e.target;
    const nuevos = [...inventarios];
    nuevos[index][name] = value;
    setInventarios(nuevos);
  };

  // 🔹 Agregar nueva línea de inventario
  const agregarInventario = () => {
    setInventarios([
      ...inventarios,
      { colorId: "", tallaId: "", sucursalId: "", cantidad: "" },
    ]);
  };

  // 🔹 Eliminar línea de inventario
  const eliminarInventario = (index) => {
    const nuevos = inventarios.filter((_, i) => i !== index);
    setInventarios(nuevos);
  };

  // 🔹 Enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Crear el producto
      const resProducto = await api.post("/productos/create", producto);
      const productoId = resProducto.data.producto.id;

      // 2️⃣ Crear inventarios asociados
      for (const inv of inventarios) {
        await api.post("/inventarios/create", { ...inv, productoId });
      }

      setMensajeSnack(" Producto e inventarios creados correctamente");
      setTipoSnack("success");
      setOpenSnack(true);

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error(" Error al crear producto:", error);
      setMensajeSnack(
        error.response?.data?.message || "Error al crear producto"
      );
      setTipoSnack("error");
      setOpenSnack(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
           Crear Nuevo Producto
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                name="nombre"
                value={producto.nombre}
                onChange={handleProductoChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="descripcion"
                value={producto.descripcion}
                onChange={handleProductoChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Precio"
                name="precio"
                type="number"
                value={producto.precio}
                onChange={handleProductoChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Marca"
                name="marca"
                value={producto.marca}
                onChange={handleProductoChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Modelo"
                name="modelo"
                value={producto.modelo}
                onChange={handleProductoChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="URL de Imagen"
                name="imagenUrl"
                value={producto.imagenUrl}
                onChange={handleProductoChange}
                fullWidth
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
             Inventario del producto
          </Typography>

          {inventarios.map((inv, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              sx={{ mb: 2, borderBottom: "1px solid #ddd", pb: 2 }}
            >
              <Grid item xs={3}>
                <TextField
                  select
                  label="Color"
                  name="colorId"
                  value={inv.colorId}
                  onChange={(e) => handleInventarioChange(index, e)}
                  fullWidth
                >
                  {colores.map((color) => (
                    <MenuItem key={color.id} value={color.id}>
                      {color.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  select
                  label="Talla"
                  name="tallaId"
                  value={inv.tallaId}
                  onChange={(e) => handleInventarioChange(index, e)}
                  fullWidth
                >
                  {tallas.map((talla) => (
                    <MenuItem key={talla.id} value={talla.id}>
                      {talla.numero}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  select
                  label="Sucursal"
                  name="sucursalId"
                  value={inv.sucursalId}
                  onChange={(e) => handleInventarioChange(index, e)}
                  fullWidth
                >
                  {sucursales.map((suc) => (
                    <MenuItem key={suc.id} value={suc.id}>
                      {suc.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Cantidad"
                  name="cantidad"
                  type="number"
                  value={inv.cantidad}
                  onChange={(e) => handleInventarioChange(index, e)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
                <IconButton color="error" onClick={() => eliminarInventario(index)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<AddCircle />}
            onClick={agregarInventario}
            sx={{ mb: 3 }}
          >
            Agregar otra combinación
          </Button>

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Guardar Producto
          </Button>

          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            fullWidth
            onClick={() => navigate("/")}
          >
            ← Volver al catálogo
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={openSnack}
        autoHideDuration={4000}
        onClose={() => setOpenSnack(false)}
      >
        <Alert severity={tipoSnack}>{mensajeSnack}</Alert>
      </Snackbar>
    </Box>
  );
}
