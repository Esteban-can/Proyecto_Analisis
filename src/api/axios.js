// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://proyecto-analisis-2.onrender.com/api", // 👈 importante: incluye /api
});

export default api;
