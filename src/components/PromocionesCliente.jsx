// src/components/Promociones.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CardMedia,
  CircularProgress,
  Button,
} from "@mui/material";
import api from "../api/axios";

export default function Promociones() {
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarPromociones = async () => {
    try {
      const res = await api.get("/promociones");
      const promoData = res.data.filter((p) => p.activo); // 🔹 Solo las activas
      setPromociones(promoData);
    } catch (error) {
      console.error("Error al cargar promociones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPromociones();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" textAlign="center" mb={4}>
        Promociones Activas 🎉
      </Typography>

      {promociones.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          No hay promociones activas en este momento.
        </Typography>
      ) : (
        promociones.map((promo) => (
          <Box key={promo.id} sx={{ mb: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" color="primary" gutterBottom>
                  {promo.nombre}
                </Typography>
                <Typography variant="body1">{promo.descripcion}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Descuento: <strong>{promo.descuento}%</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vigencia: {promo.fechaInicio?.slice(0, 10)} -{" "}
                  {promo.fechaFin?.slice(0, 10)}
                </Typography>
              </CardContent>
            </Card>

            {/* 🔹 Productos asociados a la promoción */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {promo.productos?.length > 0 ? (
                promo.productos.map((producto) => {
                  const precioConDescuento = (
                    producto.precio *
                    (1 - promo.descuento / 100)
                  ).toFixed(2);

                  return (
                    <Grid item xs={12} sm={6} md={4} key={producto.id}>
                      <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={producto.imagenUrl || "/no-image.jpg"}
                          alt={producto.nombre}
                        />
                        <CardContent>
                          <Typography variant="h6">{producto.nombre}</Typography>
                          <Typography color="text.secondary">
                            Q{producto.precio}
                          </Typography>
                          <Typography color="success.main">
                            Precio con descuento:{" "}
                            <strong>Q{precioConDescuento}</strong>
                          </Typography>

                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() =>
                              (window.location.href = `/producto/${producto.id}?promo=${promo.descuento}`)
                            }
                          >
                            Ver detalles
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })
              ) : (
                <Typography sx={{ mt: 2, ml: 2 }} color="text.secondary">
                  No hay productos asignados a esta promoción.
                </Typography>
              )}
            </Grid>
          </Box>
        ))
      )}
    </Box>
  );
}
