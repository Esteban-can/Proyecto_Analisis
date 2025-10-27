import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import api from "../api/axios";

export default function ProductoDetalle({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [colorSeleccionado, setColorSeleccionado] = useState("");
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [stockDisponible, setStockDisponible] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);
  const [mensajeSnack, setMensajeSnack] = useState("");
  const [tipoSnack, setTipoSnack] = useState("success");

  const user = JSON.parse(localStorage.getItem("user"));
  const carritoId = localStorage.getItem("carritoId");

  const cargarProducto = async () => {
    try {
      const res = await api.get(`/catalogo/${id}`);
      setProducto(res.data.data);
    } catch (error) {
      console.error("❌ Error al cargar producto:", error);
      alert("No se pudo obtener el producto.");
    }
  };

  useEffect(() => {
    cargarProducto();
  }, [id]);

  useEffect(() => {
    if (!producto) return;

    const inv = producto.inventarios.find(
      (i) =>
        i.color?.nombre === colorSeleccionado &&
        i.talla?.numero === tallaSeleccionada
    );

    setStockDisponible(inv ? inv.cantidad : null);
  }, [colorSeleccionado, tallaSeleccionada, producto]);

  if (!producto) return <Typography>Cargando producto...</Typography>;

  const coloresDisponibles = [
    ...new Set(producto.inventarios.map((inv) => inv.color?.nombre)),
  ];

  const tallasDisponibles = [
    ...new Set(producto.inventarios.map((inv) => inv.talla?.numero)),
  ];

 const handleAgregarCarrito = () => {
  if (!colorSeleccionado || !tallaSeleccionada) {
    setMensajeSnack("Selecciona color y talla antes de continuar.");
    setTipoSnack("warning");
    setOpenSnack(true);
    return;
  }

  if (stockDisponible <= 0) {
    setMensajeSnack("Producto sin stock disponible.");
    setTipoSnack("error");
    setOpenSnack(true);
    return;
  }

  // Buscar inventario exacto
  const inventario = producto.inventarios.find(
    (i) =>
      i.color?.nombre === colorSeleccionado &&
      i.talla?.numero === tallaSeleccionada
  );

  if (!inventario) {
    setMensajeSnack("Inventario no encontrado para esa combinación 😕");
    setTipoSnack("error");
    setOpenSnack(true);
    return;
  }

  // Obtener carritoId desde localStorage
  const carritoIdStr = localStorage.getItem("carritoId");
  if (!carritoIdStr) {
    setMensajeSnack("No se encontró el carrito del usuario. Inicia sesión nuevamente.");
    setTipoSnack("error");
    setOpenSnack(true);
    return;
  }

  const carritoId = parseInt(carritoIdStr, 10);

  // Construir body correcto
  const item = {
    carritoId,
    inventarioId: inventario.id,
    cantidad: parseInt(cantidad, 10),
  };

  console.log("Enviando al backend:", item);

  // Llamar al backend
  api.post("/carritodetalles/create", item)
    .then(() => {
      setMensajeSnack("Producto agregado al carrito 🛒");
      setTipoSnack("success");
      setOpenSnack(true);
      // Opcional: actualizar carrito en el front si tienes estado global
      addToCart({
  id: producto.id,
  inventarioId: inventario.id, // ✅ este es el que necesitas
  nombre: producto.nombre,
  precio: producto.precio,
  talla: tallaSeleccionada,
  color: colorSeleccionado,
  quantity: cantidad,
  imagenUrl: producto.imagenUrl || "/no-image.jpg",
});
    })
    .catch((err) => {
      console.error("Error al agregar al carrito:", err.response?.data || err.message);
      setMensajeSnack("Error al agregar al carrito ❌");
      setTipoSnack("error");
      setOpenSnack(true);
    });
};


  





  return (
    <Box sx={{ p: 4 }}>
      <Button variant="outlined" onClick={() => navigate(-1)}>
        ← Volver
      </Button>

      <Card
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: { xs: "100%", md: 400 }, objectFit: "cover" }}
          image={producto.imagenUrl || "/no-image.jpg"}
          alt={producto.nombre}
        />

        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {producto.nombre}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {producto.descripcion}
          </Typography>
          <Typography variant="h6" color="primary">
            Q{producto.precio}
          </Typography>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Color</InputLabel>
            <Select
              value={colorSeleccionado}
              label="Color"
              onChange={(e) => setColorSeleccionado(e.target.value)}
            >
              {coloresDisponibles.map((color, i) => (
                <MenuItem key={i} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Talla</InputLabel>
            <Select
              value={tallaSeleccionada}
              label="Talla"
              onChange={(e) => setTallaSeleccionada(e.target.value)}
            >
              {tallasDisponibles.map((talla, i) => (
                <MenuItem key={i} value={talla}>
                  {talla}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {colorSeleccionado && tallaSeleccionada && (
            <Typography sx={{ mt: 3 }} color="#000000 ">
              Stock disponible:{" "}
              {stockDisponible !== null ? stockDisponible : "No disponible"}
            </Typography>
          )}

          <TextField
            label="Cantidad"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value)))}
            sx={{ mt: 3, width: "100px" }}
            inputProps={{ min: 1 }}
          />

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleAgregarCarrito}
            >
              Agregar al carrito 🛒
            </Button>
          </Box>
        </CardContent>
      </Card>

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
