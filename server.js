// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import { router as chatRoutes } from './routes/chatRoutes.js';
import { router as triviaRoutes } from './routes/trivia.js'; // 🔥 NUEVO

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

// Verificar configuración de OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.warn('\x1b[33m%s\x1b[0m', '⚠️  ADVERTENCIA: No se encontró la variable OPENAI_API_KEY');
  console.log('\x1b[36m%s\x1b[0m', 'Para configurar la API key de OpenAI:');
  console.log('1. Crea un archivo .env en la carpeta del backend');
  console.log('2. Añade la línea: OPENAI_API_KEY=tu-api-key-de-openai');
  console.log('3. Reinicia el servidor\n');

  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('\x1b[31m%s\x1b[0m', 'No se encontró el archivo .env');
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-gpt-app';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Rutas
app.use('/api/chat', chatRoutes);
app.use('/api/trivia', triviaRoutes); // 🔥 NUEVA RUTA

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API funcionando correctamente 🚀',
    status: 'Chat y Trivia activos'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
