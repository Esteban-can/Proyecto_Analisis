// src/components/Carrito.jsx
import React from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Card,
  CardMedia,
  CardContent,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

export default function Carrito({
  cart,
  updateQuantity,
  removeFromCart,
  clearCart,
}) {
  const navigate = useNavigate();
  const total = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        🛒 Tu carrito
      </Typography>

      {cart.length === 0 ? (
        <Typography variant="h6">Tu carrito está vacío.</Typography>
      ) : (
        <>
          {cart.map((item) => (
            <Card
              key={`${item.id}-${item.talla}-${item.color}`}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                borderRadius: 2,
                boxShadow: 2,
                p: 2,
              }}
            >
              <CardMedia
                component="img"
                image={item.imagenUrl}
                alt={item.nombre}
                sx={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 2,
                  mr: 2,
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{item.nombre}</Typography>
                <Typography color="text.secondary">
                  Color: {item.color} | Talla: {item.talla}
                </Typography>
                <Typography color="primary">Q{item.precio}</Typography>

                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.id,
                        item.talla,
                        item.color,
                        parseInt(e.target.value)
                      )
                    }
                    inputProps={{ min: 1 }}
                    sx={{ width: "80px", mr: 2 }}
                  />
                  <Typography>
                    Subtotal: Q{(item.precio * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>

              <IconButton
                color="error"
                onClick={() =>
                  removeFromCart(item.id, item.talla, item.color)
                }
              >
                <DeleteIcon />
              </IconButton>
            </Card>
          ))}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" align="right">
            Total: Q{total.toFixed(2)}
          </Typography>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              color="error"
              onClick={clearCart}
            >
              Vaciar carrito
            </Button>

            <Button
  variant="contained"
  color="primary"
  onClick={() =>
    navigate("/pago", {
      state: {
        cartItems: cart,
        total,
      },
    })
  }
>
  Ir a pagar 💳
</Button>

          </Box>
        </>
      )}
    </Box>
  );
}
