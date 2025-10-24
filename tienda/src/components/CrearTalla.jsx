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

export default function Tallas() {
  const [tallas, setTallas] = useState([]);
  const [nuevaTalla, setNuevaTalla] = useState("");
  const [editando, setEditando] = useState(null);

   const cargarTallas = async () => {
  try {
    const res = await api.get("/tallas");
    setTallas(res.data); // 
  } catch (error) {
    console.error("Error al cargar tallas:", error);
  }
};
  useEffect(() => {
    cargarTallas();
  }, []);



const guardarTalla = async () => {
  try {
    
      await api.post("/tallas/create", { numero: nuevaTalla }); 
      alert(" Talla agregada correctamente");
    
    setNuevaTalla("");
  
    cargarTallas();
  } catch (error) {
    console.error("Error al guardar talla:", error);
  }
};


  

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5" mb={2}>
         Gestión de Tallas
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          label="Nombre o número de talla"
          fullWidth
          value={nuevaTalla}
          onChange={(e) => setNuevaTalla(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={guardarTalla}
        >
             Agregar
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Lista de Tallas
        </Typography>
        <Grid container spacing={1}>
          {tallas.map((t) => (
            <Grid
              item
              xs={12}
              key={t.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
                py: 1,
              }}
            >
              <Typography>{t.numero}</Typography>
              <Box>
                <IconButton
                  color="warning"
                  onClick={() => {
                 
                    setNuevaTalla(t.numero);
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
