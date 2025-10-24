import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../api/axios";
import "./Pago.css";

// Clave pública de Stripe (quemada)
const stripePromise = loadStripe(
  "pk_test_key"
);

function PagoForm({ clearCart, direccionEnvio, promocionId, cartItems, total }) {
  const stripe = useStripe();
  const elements = useElements();
  const [formData, setFormData] = useState({ nombre: "" });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    const usuario = JSON.parse(localStorage.getItem("user"));
    const usuarioId = usuario?.id;
    const carritoId = localStorage.getItem("carritoId"); // 🔹 leer carritoId

    if (!usuarioId) {
      setMensaje("⚠ No se encontró el usuario logueado.");
      setLoading(false);
      return;
    }

    if (!carritoId) {
      setMensaje("⚠ No se encontró el carrito para procesar el pago.");
      setLoading(false);
      return;
    }

    if (!stripe || !elements) {
      setMensaje("Stripe no está listo aún.");
      setLoading(false);
      return;
    }

    if (!formData.nombre) {
      setMensaje("⚠ Por favor ingresa el nombre en la tarjeta.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: { name: formData.nombre },
    });

    if (error) {
      setMensaje("❌ Error al generar PaymentMethod: " + error.message);
      setLoading(false);
      return;
    }

    try {
      // 🔹 Transformar cartItems a detalles que espera el backend
      const detalles = cartItems.map((item) => ({
        inventarioId: item.inventarioId, // ✅ ID correcto del inventario
        cantidad: item.quantity,
      }));

      const facturaData = {
        usuarioId,
        carritoId, // 🔹 agregado
        detalles,
        paymentMethodId: paymentMethod.id,
        total: Number(total),
        ...(direccionEnvio && { direccionEnvio }),
        ...(promocionId && { promocionId }),
      };

      console.log("Enviando al backend:", JSON.stringify(facturaData, null, 2));

      const response = await api.post("/facturas", facturaData);

      if (response.status === 201) {
        setMensaje("✅ Pago realizado y factura creada con éxito.");
        clearCart();
        setFormData({ nombre: "" });
        cardElement.clear();
      }
    } catch (err) {
      console.error("Error backend /facturas:", err.response?.data || err.message);
      setMensaje(
        "❌ Error al procesar el pago: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre en la tarjeta"
        value={formData.nombre}
        onChange={handleChange}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <label>Datos de la tarjeta:</label>
      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
        <CardElement
          options={{
            style: {
              base: { fontSize: "16px", color: "#32325d", "::placeholder": { color: "#a0a0a0" } },
              invalid: { color: "#fa755a" },
            },
          }}
        />
      </div>
      <button type="submit" disabled={loading} style={{ display: "block", marginBottom: "10px" }}>
        {loading ? "Procesando..." : "Pagar"}
      </button>
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </form>
  );
}

export default function Pago({ clearCart, direccionEnvio, promocionId }) {
  const location = useLocation();
  const { cartItems = [], total = 0 } = location.state || {};

  return (
    <div className="pago-container">
      <h2>Pago con tarjeta</h2>
      <p>Total a pagar: <strong>Q{total.toFixed(2)}</strong></p>
      <Elements stripe={stripePromise}>
        <PagoForm
          clearCart={clearCart}
          direccionEnvio={direccionEnvio}
          promocionId={promocionId}
          cartItems={cartItems}
          total={total}
        />
      </Elements>
    </div>
  );
}

