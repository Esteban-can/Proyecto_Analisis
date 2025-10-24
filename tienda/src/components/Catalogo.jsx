import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Catalogo() {
  const navigate = useNavigate();
  const [catalogo, setCatalogo] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔹 Cargar catálogo
  const cargarCatalogo = async () => {
    try {
      const res = await api.get("/catalogo");
      setCatalogo(res.data.data);
    } catch (error) {
      console.error(" Error al cargar catálogo:", error);
    }
  };

  useEffect(() => {
    cargarCatalogo();
  }, []);

  
  // 🔹 Eliminar producto (solo admin)
  const eliminarProducto = async (productoId) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este producto?");
    if (!confirmar) return;

    try {
      // 🧩 Usamos la ruta DELETE /api/productos/delete/:id
      await api.delete(`/productos/delete/${productoId}`);
      alert(" Producto eliminado correctamente");
      cargarCatalogo(); // recargar lista
    } catch (error) {
      console.error(" Error al eliminar producto:", error);
      alert("Error al eliminar el producto");
    }
  };

  // 🔹 Editar producto (redirige al formulario)
  const editarProducto = (id) => {
    navigate(`/productos/edit/${id}`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Catálogo de Productos
      </Typography>

      {/* 🔹 Botón para crear producto (solo admin) */}
      {user?.Rol === "admin" && (
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/productos/create")}
          >
             Agregar nuevo producto
          </Button>
          <Button variant = "contained" color="success" onClick={()=>navigate("/colores/create")}>
            Agregar nuevo color
          </Button>
          <Button variant="contained" color="success" onClick={()=>navigate("/tallas/create")}>
            Agregar nueva talla
          </Button>
          <Button variant="contained" color="success" onClick={()=>navigate("/sucursales/create")}>
            Agregar nueva sucursal
          </Button>
          <Button
  variant="contained"
  color="secondary"
  onClick={() => navigate("/admin/promociones")}
>
  Gestionar Promociones
</Button>
         
        </Box>
      )}

      <Grid container spacing={3}>
        {catalogo.map((producto) => (
          <Grid item xs={12} sm={6} md={4} key={producto.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="220"
                image={producto.imagenUrl || "/no-image.jpg"}
                alt={producto.nombre}
              />
              <CardContent>
                <Typography variant="h6">{producto.nombre}</Typography>
                <Typography color="text.secondary">
                  {producto.marca} - {producto.modelo}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  <strong>Q{producto.precio}</strong>
                </Typography>

                {/* 🔹 Botones de acción */}
                {user?.Rol === "admin" ? (
                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => editarProducto(producto.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/producto/${producto.id}`)}
                    >
                      Ver Detalles
                    </Button>
                    
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
