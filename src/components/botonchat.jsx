import { useState, useEffect, useRef } from "react";
import "./boton.css";
import "./panel.css";
import botImg from "../assets/bot-avatar.png";
import botonImg from "../assets/boton-avatar.png";
import api from "../api/axios.js";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Obtener usuario
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id || null;
  };

  // 🔹 Cargar historial por usuario
  useEffect(() => {
    const userId = getUserId();
    const saved = JSON.parse(localStorage.getItem(`chatHistory_${userId}`)) || [];

    if (saved.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "Hola soy Glitch🐺. ¿En qué puedo ayudarte?"
        }
      ]);
    } else {
      setMessages(saved);
    }
  }, []);

  // 🔹 Guardar historial por usuario + scroll
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      localStorage.setItem(`chatHistory_${userId}`, JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Función central para enviar mensaje (reutilizable)
  const sendToBot = async (text) => {
    const userId = getUserId();

    if (!userId) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Debes iniciar sesión para usar el chat 🔐" }
      ]);
      return;
    }

    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await api.post("/Chat/mensaje", {
        mensaje: text,
        usuarioId: userId
      });

      const botMsg = {
        sender: "bot",
        text: response.data.respuesta
      };

      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error del servidor ⚠️" }
      ]);
    }
  };

  // 🔹 Enviar input
  const sendMessage = () => {
    if (!input.trim()) return;
    sendToBot(input);
    setInput("");
  };

  // 🔹 Click en opciones
  const handleOptionClick = (option) => {
    sendToBot(option);
  };

  return (
    <>
      {/* Botón flotante */}
      {!open && (
        <button onClick={() => setOpen(true)} className="chat-button">
          <img src={botonImg} alt="bot" />
        </button>
      )}

      {/* Panel */}
      <div className={`chat-panel ${open ? "open" : ""}`}>

        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <img src={botImg} alt="bot" />
            <div>
              <strong>Glitch</strong>
              <p>En línea</p>
            </div>
          </div>

          <button className="chat-close-btn" onClick={() => setOpen(false)}>
            ✖
          </button>
        </div>

        {/* Mensajes */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-row ${msg.sender}`}>

              {msg.sender === "bot" && i === 0 && (
                <img src={botImg} className="chat-avatar" />
              )}

              <div className={`chat-bubble ${msg.sender}`}>
                <p>{msg.text}</p>

                {msg.options && (
                  <div className="chat-options">
                    {msg.options.map((opt, index) => (
                      <button
                        key={index}
                        className="chat-option-btn"
                        onClick={() => handleOptionClick(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>➤</button>
        </div>

      </div>
    </>
  );
}