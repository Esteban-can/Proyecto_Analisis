import { useState, useEffect, useRef } from "react";
import "./boton.css";
import "./panel.css";
import botImg from "../assets/bot-avatar.png";
import botonImg from "../assets/avatar-bot.png";
import messImg from "../assets/mensaje-avatar.png";
import api from "../api/axios.js";
import {motion} from 'framer-motion' ;
import ReactMarkdown from "react-markdown";
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
        { sender: "bot", text: "Debes iniciar sesión o crear un usuario para poder usar el chat " }
      ]);
      return;
    }

   const userMsg = { sender: "user", text };
const loadingMsg = { sender: "bot", loading: true };

setMessages((prev) => [...prev, userMsg, loadingMsg]);


    try {
      const response = await api.post("/Chat/mensaje", {
        mensaje: text,
        usuarioId: userId
      });

      const botMessages = response.data.respuestas.map((txt) => ({
        sender: "bot",
        text: txt
        
      }));

    setMessages((prev) => {
    const filtered = prev.filter(msg => !msg.loading);
      return [...filtered, ...botMessages];
    });

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

  return (
    <>
      {/* Botón flotante */}
      {!open && (
        <button onClick={() => setOpen(true)} className="chat-button">
          <img src={botonImg} alt="bot" />
        </button>
      )}

      {/* Panel */}
      <div className={`chat-panel ${open ? "open" : ""}`} >
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
                <img src={messImg} className="chat-avatar" />
              )}

             <div className={`chat-bubble ${msg.sender} ${msg.text?.includes("Precio") ? "product-card" : ""}`}>
               {msg.loading ? (
  <div className="typing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
) : (
  <ReactMarkdown>{msg.text}</ReactMarkdown>
)}

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