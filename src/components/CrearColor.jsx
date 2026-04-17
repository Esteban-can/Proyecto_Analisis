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

export default function Colores() {
  const [colores, setColores] = useState([]);
  const [nuevoColor, setNuevoColor] = useState("");
  const [editando, setEditando] = useState(null);

  const cargarColores = async () => {
    try {
      const res = await api.get("/colores");
      setColores(res.data);
    } catch (error) {
      console.error("Error al cargar colores:", error);
    }
  };

  useEffect(() => {
    cargarColores();
  }, []);

  const guardarColor = async () => {
    try {
      
        await api.post("/colores/create", { nombre: nuevoColor });
        alert(" Color agregado correctamente");
      
      setNuevoColor("");
      
      cargarColores();
    } catch (error) {
      console.error("Error al guardar color:", error);
    }
  };

  

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5" mb={2}>
         Gestión de Colores
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          label="Nombre del color"
          fullWidth
          value={nuevoColor}
          onChange={(e) => setNuevoColor(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={guardarColor}
        >
          {editando ? " Actualizar" : " Agregar"}
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Lista de Colores
        </Typography>
        <Grid container spacing={1}>
          {colores.map((c) => (
            <Grid
              item
              xs={12}
              key={c.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
                py: 1,
              }}
            >
              <Typography>{c.nombre}</Typography>
              <Box>
                <IconButton
                  color="warning"
                  onClick={() => {
                    
                    setNuevoColor(c.nombre);
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
