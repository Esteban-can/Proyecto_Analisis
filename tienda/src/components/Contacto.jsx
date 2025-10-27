import React from "react";
import "./Contacto.css"; // Para estilos
function Contacto() {
    return (
        <main className="contacto">
        <h2>Contacto</h2>
        <p>
            Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos.
        </p>
        <form>
            <label htmlFor="name">Nombre:</label>
            <input type="text" id="name" name="name" required />
            
            <label htmlFor="email">Correo Electrónico:</label>
            <input type="email" id="email" name="email" required />
            
            <label htmlFor="message">Mensaje:</label>
            <textarea id="message" name="message" required></textarea>
            
            <button type="submit">Enviar</button>
        </form>
        </main>
    );
}
export default Contacto;
