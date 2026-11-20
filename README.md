# S.O.S. Ayuda

Marketplace de asistencia de emergencia (coche, hogar, salud, tecnología): triage de síntomas,
búsqueda de profesionales cercanos, chat en tiempo real, pago simulado y reseñas.

## Estructura

- `delightful-hawking/` — frontend (React + Vite + Tailwind)
- `sos-ayuda-backend/` — API (Node + Express + TypeScript + PostgreSQL + Socket.IO)
- `docker-compose.yml` — levanta db + seed + backend + frontend

## Correr con Docker

```bash
cp .env.example .env   # y completa JWT_SECRET y las llaves VAPID
docker compose up --build
```

Frontend en http://localhost:3000, API en http://localhost:3001.

## Correr en desarrollo

Backend y frontend: copia cada `.env.example` a `.env`, levanta Postgres y ejecuta `npm install && npm run dev` en cada carpeta
(`npm run db:seed` en el backend para cargar los datos iniciales).
