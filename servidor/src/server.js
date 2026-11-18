import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import parseYAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import activityRoutes from './routes/activityRoutes.js';

dotenv.config();

const app = express();
connectDB();

// 1. Seguridad Middleware
// Se desactiva "upgrade-insecure-requests": si se abre Swagger por HTTP usando una IP
// (ej. http://192.168.x.x:5000/api-docs) el navegador pediría sus archivos por HTTPS
// y la página quedaría en blanco. En Render todo va por HTTPS, no se pierde seguridad.
app.use(helmet({
  contentSecurityPolicy: {
    directives: { upgradeInsecureRequests: null }
  }
}));

// 2. Optimización backend - Compresión GZIP/Brotli de respuestas
app.use(compression({
  level: 6,
  threshold: 1024, // Comprimir respuestas mayores a 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Documentación Swagger
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const swaggerDocument = parseYAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas de API
app.use('/api/activities', activityRoutes);

app.get('/', (req, res) => {
  res.send('Servidor EcoTrack Activo y Optimizado.');
});

// Health check (usado por Render para saber si el servicio está vivo)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
