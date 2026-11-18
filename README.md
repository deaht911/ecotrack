# EcoTrack - Aplicación Full Stack Optimizada

## Estructura
- `/cliente`: React + Vite + Tailwind CSS + Terser + compresión Gzip/Brotli + code splitting + Nginx
- `/servidor`: Node.js + Express + Mongoose + Swagger + compression + Helmet
- `docker-compose.yml`: MongoDB + backend + frontend (Nginx)

## Ejecución local con Docker
```bash
docker compose up --build -d      # levantar
docker ps                         # verificar
docker compose down               # detener
```
- Frontend: http://localhost
- Backend: http://localhost:5000
- Swagger: http://localhost:5000/api-docs

Para usar MongoDB Atlas en vez del Mongo local:
```bash
MONGO_URI="mongodb+srv://usuario:password@cluster.mongodb.net/ecotrack" docker compose up --build -d
```

## Despliegue
| Servicio | Root Directory | Build | Start / Output | Variables |
|---|---|---|---|---|
| Render (backend) | `servidor` | `npm install` | `node src/server.js` | `MONGO_URI`, `NODE_ENV=production` |
| Vercel (frontend) | `cliente` | `npm run build` | `dist` (preset Vite) | `VITE_API_URL=https://<tu-api>.onrender.com/api/activities` |

> `.env` está en `.gitignore`. Copia `servidor/.env.example` a `servidor/.env` y pon tu cadena de Atlas.
