import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Usar el puerto que Fly.io inyecta, si no 8080
const PORT = process.env.PORT || 8080;

// Servir archivos estáticos del frontend Vite
app.use(express.static(path.join(__dirname, "dist")));

// Fallback para SPA (React)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Escuchar en todas las interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
